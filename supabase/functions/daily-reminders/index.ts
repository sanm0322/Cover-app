// supabase/functions/daily-reminders/index.ts
//
// Runs daily at 20:00. Two distinct emails:
//   1. To coaches covering tomorrow: "You're teaching X tomorrow"
//   2. To managers, if any shifts still open for tomorrow: "Urgent — N classes still open"
//
// One coach/manager covering multiple shifts tomorrow = ONE email per recipient,
// listing all of them.

import { sendEmail } from '../_shared/send-email.ts';
import { emailTemplate, buttonHtml, whatsappButtonHtml } from '../_shared/template.ts';

const APP_URL = Deno.env.get('APP_URL') || 'https://example.com';
const MANAGER_EMAILS = (Deno.env.get('MANAGER_EMAILS') || '').split(',').map((s) => s.trim()).filter(Boolean);
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

function tomorrowISO(): string {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().slice(0, 10);
}

function formatDay(iso: string): string {
    const d = new Date(iso + 'T00:00:00');
    return d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
}

async function fetchTomorrowShifts(): Promise<any[]> {
    const tomorrow = tomorrowISO();
    const res = await fetch(
        `${SUPABASE_URL}/rest/v1/shifts?date=eq.${tomorrow}&status=in.(open,claimed)&select=id,date,time,class_name,location,reason,status,posted_by,claimed_by`,
        {
            headers: {
                apikey: SUPABASE_SERVICE_ROLE_KEY!,
                Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
            },
        },
    );
    return res.json();
}

async function fetchCoaches(): Promise<Map<string, { name: string; email: string }>> {
    const res = await fetch(
        `${SUPABASE_URL}/rest/v1/coaches?select=id,name,email`,
        {
            headers: {
                apikey: SUPABASE_SERVICE_ROLE_KEY!,
                Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
            },
        },
    );
    const coaches = await res.json();
    const map = new Map();
    for (const c of coaches) map.set(c.id, { name: c.name, email: c.email });
    return map;
}

function buildClaimerEmail(coachName: string, shifts: any[]): { subject: string; html: string } {
    const sortedShifts = [...shifts].sort((a, b) => a.time.localeCompare(b.time));
    const dayLabel = formatDay(sortedShifts[0].date);
    const isMultiple = sortedShifts.length > 1;

    const subject = isMultiple
        ? `Reminder — you're covering ${sortedShifts.length} classes tomorrow`
        : `Reminder — you're covering ${sortedShifts[0].class_name} tomorrow`;

    const shiftRowsHtml = sortedShifts.map((s) => `
    <div style="display: block; margin: 6px 0;">
      🕐 <strong>${s.time.slice(0, 5)}</strong> — ${s.class_name} at <strong>${s.location}</strong>
    </div>
  `).join('');

    const reason = sortedShifts.find((s) => s.reason)?.reason;
    const reasonHtml = reason
        ? `<p style="margin: 16px 0 0; color:#3a3a3a; font-style: italic;">Originally posted because: ${reason}</p>`
        : '';

    const bodyHtml = `
<p>Hey ${coachName.split(' ')[0]},</p>
<p>Quick reminder — you're covering tomorrow:</p>
<div style="background:#faf7ed; border:1px solid #d9d2bf; border-radius:4px; padding:16px; margin:16px 0;">
  <div style="font-weight:700; font-size:16px; margin-bottom:10px;">${dayLabel}</div>
  ${shiftRowsHtml}
  ${reasonHtml}
</div>
<p>If something's changed and you can't cover any of these, please release them in the app so the team can pick them up.</p>
${buttonHtml('Open COVER', APP_URL)}
<p style="margin-top:20px;">Thanks for keeping Dom City running 💪</p>
`;

    return {
        subject,
        html: emailTemplate({
            preheader: `${sortedShifts.length} ${isMultiple ? 'classes' : 'class'} tomorrow at the box`,
            bodyHtml,
        }),
    };
}

function buildManagerUrgentEmail(openShifts: any[], coachesById: Map<string, any>): { subject: string; html: string; whatsappText: string } {
    const sorted = [...openShifts].sort((a, b) => a.time.localeCompare(b.time));
    const dayLabel = formatDay(sorted[0].date);

    const shiftRowsHtml = sorted.map((s) => {
        const poster = coachesById.get(s.posted_by)?.name || 'Unknown';
        return `
    <div style="display: block; margin: 6px 0;">
      🔴 <strong>${s.time.slice(0, 5)}</strong> — ${s.class_name} at <strong>${s.location}</strong>
      <span style="color:#87837b; font-size: 13px;"> · ${poster}</span>
    </div>
  `;
    }).join('');

    const subject = `Urgent — ${sorted.length} ${sorted.length === 1 ? 'shift' : 'shifts'} still open for tomorrow`;

    // Build the pre-filled WhatsApp message
    const whatsappLines = sorted.map((s) => {
        const poster = coachesById.get(s.posted_by)?.name || 'Unknown';
        return `🔴 ${s.time.slice(0, 5)} ${s.class_name} @ ${s.location} (${poster})`;
    });
    const whatsappText = `⚠️ Still need coverage tomorrow:\n\n${whatsappLines.join('\n')}\n\nIf you can take any of these, please claim in the app:\n${APP_URL}`;

    const bodyHtml = `
<p>Hi managers,</p>
<p>These are still uncovered for tomorrow:</p>
<div style="background:#faf7ed; border:1px solid #d9d2bf; border-radius:4px; padding:16px; margin:16px 0;">
  <div style="font-weight:700; font-size:16px; margin-bottom:10px;">${dayLabel}</div>
  ${shiftRowsHtml}
</div>
<p>Worth a nudge in the team chat?</p>
${whatsappButtonHtml(whatsappText)}
${buttonHtml('Open COVER', APP_URL)}
`;

    return {
        subject,
        html: emailTemplate({
            preheader: `${sorted.length} shifts uncovered for tomorrow`,
            bodyHtml,
        }),
        whatsappText,
    };
}

Deno.serve(async (_req) => {
    try {
        const [tomorrowShifts, coachesById] = await Promise.all([fetchTomorrowShifts(), fetchCoaches()]);

        const claimedShifts = tomorrowShifts.filter((s) => s.status === 'claimed');
        const openShifts = tomorrowShifts.filter((s) => s.status === 'open');

        const sentEmails: { to: string; type: string }[] = [];

        // Email 1: per-claimer reminders, grouped by claimer
        const byClaimer = claimedShifts.reduce((acc, s) => {
            if (!acc[s.claimed_by]) acc[s.claimed_by] = [];
            acc[s.claimed_by].push(s);
            return acc;
        }, {} as Record<string, any[]>);

        for (const [claimerId, shifts] of Object.entries(byClaimer)) {
            const claimer = coachesById.get(claimerId);
            if (!claimer?.email) continue;
            const { subject, html } = buildClaimerEmail(claimer.name, shifts as any[]);
            await sendEmail({ to: claimer.email, subject, html });
            sentEmails.push({ to: claimer.email, type: 'claimer-reminder' });
        }

        // Email 2: manager urgent, only if there are open shifts
        if (openShifts.length > 0 && MANAGER_EMAILS.length > 0) {
            const { subject, html } = buildManagerUrgentEmail(openShifts, coachesById);
            await sendEmail({ to: MANAGER_EMAILS, subject, html });
            sentEmails.push({ to: MANAGER_EMAILS.join(','), type: 'manager-urgent' });
        }

        return new Response(JSON.stringify({ ok: true, sent: sentEmails }), { status: 200 });
    } catch (err) {
        console.error('daily-reminders error:', err);
        return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
    }
});