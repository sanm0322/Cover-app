// supabase/functions/weekly-digest/index.ts
//
// Runs Sunday at 19:00. Sends a digest of next week's open shifts to all
// coaches. Only sends if there's at least one open shift — empty weeks
// don't email.
//
// Manager recipients see an additional "Share to WhatsApp" button at the
// bottom; coaches don't (we filter the html based on recipient).

import { sendEmail } from '../_shared/send-email.ts';
import { emailTemplate, buttonHtml, whatsappButtonHtml } from '../_shared/template.ts';

const APP_URL = Deno.env.get('APP_URL') || 'https://example.com';
const MANAGER_EMAILS = (Deno.env.get('MANAGER_EMAILS') || '').split(',').map((s) => s.trim()).filter(Boolean);
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

function nextWeekRange(): { start: string; end: string } {
    // Monday of the upcoming week through Sunday
    const today = new Date();
    const daysUntilMonday = (8 - today.getDay()) % 7 || 7;
    const monday = new Date(today);
    monday.setDate(today.getDate() + daysUntilMonday);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    return {
        start: monday.toISOString().slice(0, 10),
        end: sunday.toISOString().slice(0, 10),
    };
}

function formatDay(iso: string): string {
    const d = new Date(iso + 'T00:00:00');
    return d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
}

async function fetchOpenShiftsThisWeek(): Promise<any[]> {
    const { start, end } = nextWeekRange();
    const url = `${SUPABASE_URL}/rest/v1/shifts?date=gte.${start}&date=lte.${end}&status=eq.open&select=id,date,time,class_name,location,reason,posted_by`;
    const res = await fetch(url, {
        headers: {
            apikey: SUPABASE_SERVICE_ROLE_KEY!,
            Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        },
    });
    return res.json();
}

async function fetchAllCoaches(): Promise<any[]> {
    const res = await fetch(
        `${SUPABASE_URL}/rest/v1/coaches?select=id,name,email,roles`,
        {
            headers: {
                apikey: SUPABASE_SERVICE_ROLE_KEY!,
                Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
            },
        },
    );
    return res.json();
}

function groupByDate(shifts: any[]): Record<string, any[]> {
    const sorted = [...shifts].sort(
        (a, b) => (a.date + a.time).localeCompare(b.date + b.time),
    );
    return sorted.reduce((acc, s) => {
        if (!acc[s.date]) acc[s.date] = [];
        acc[s.date].push(s);
        return acc;
    }, {} as Record<string, any[]>);
}

function buildEmailContent(shiftsByDate: Record<string, any[]>, coachesById: Map<string, any>, isManager: boolean) {
    const totalShifts = Object.values(shiftsByDate).reduce((acc, arr) => acc + (arr as any[]).length, 0);

    const subject = `This week at Crossfit Dom City — ${totalShifts} ${totalShifts === 1 ? 'class needs' : 'classes need'} coverage`;

    const dayBlocks = Object.entries(shiftsByDate)
        .map(([date, shifts]) => {
            const rows = (shifts as any[])
                .map((s) => {
                    const poster = coachesById.get(s.posted_by)?.name || 'Unknown';
                    return `
            <div style="margin: 4px 0; font-size: 14px;">
              🕐 <strong>${s.time.slice(0, 5)}</strong> — ${s.class_name} at <strong>${s.location}</strong>
              <span style="color:#87837b;"> · ${poster}</span>
            </div>
          `;
                })
                .join('');
            return `
        <div style="margin-bottom:18px;">
          <div style="font-weight:700; font-size:14px; color:#141414;">${formatDay(date)}</div>
          ${rows}
        </div>
      `;
        })
        .join('');

    // Build WhatsApp message for managers
    const whatsappLines: string[] = ['🔴 OPEN COVERAGE THIS WEEK at Dom City:'];
    for (const [date, shifts] of Object.entries(shiftsByDate)) {
        whatsappLines.push('');
        whatsappLines.push(formatDay(date));
        for (const s of shifts as any[]) {
            const poster = coachesById.get(s.posted_by)?.name || 'Unknown';
            whatsappLines.push(`• ${s.time.slice(0, 5)} ${s.class_name} @ ${s.location} (${poster})`);
        }
    }
    whatsappLines.push('');
    whatsappLines.push(`Open the app to claim → ${APP_URL}`);
    const whatsappText = whatsappLines.join('\n');

    const whatsappSection = isManager
        ? `
<div style="margin-top: 24px; padding-top: 16px; border-top:1px dashed #d9d2bf;">
  <p style="margin: 0 0 8px; color:#3a3a3a; font-size:13px;">
    <strong>Manager only —</strong> tap to share with the team chat:
  </p>
  ${whatsappButtonHtml(whatsappText)}
</div>`
        : '';

    const bodyHtml = `
<p>Hi team,</p>
<p>Here's what's open for this week:</p>
${dayBlocks}
${buttonHtml('Open COVER to claim', APP_URL)}
${whatsappSection}
`;

    return {
        subject,
        html: emailTemplate({
            preheader: `${totalShifts} open ${totalShifts === 1 ? 'class' : 'classes'} this week`,
            bodyHtml,
        }),
    };
}

Deno.serve(async (_req) => {
    try {
        const [openShifts, coaches] = await Promise.all([fetchOpenShiftsThisWeek(), fetchAllCoaches()]);

        if (openShifts.length === 0) {
            return new Response(JSON.stringify({ ok: true, sent: 0, reason: 'no open shifts this week' }), { status: 200 });
        }

        const shiftsByDate = groupByDate(openShifts);
        const coachesById = new Map<string, any>();
        for (const c of coaches) coachesById.set(c.id, c);

        const sentEmails: string[] = [];

        for (const coach of coaches) {
            if (!coach.email) continue;
            const isManager = coach.roles?.includes('manager') ?? false;
            const { subject, html } = buildEmailContent(shiftsByDate, coachesById, isManager);
            await sendEmail({ to: coach.email, subject, html });
            sentEmails.push(coach.email);
        }

        return new Response(JSON.stringify({ ok: true, sent: sentEmails.length, recipients: sentEmails }), { status: 200 });
    } catch (err) {
        console.error('weekly-digest error:', err);
        return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
    }
});