// supabase/functions/shift-posted/index.ts
//
// Triggered by a database webhook when shifts are inserted.
// Debounces per group_id (so a single multi-shift request = one email).
// Emails managers about the new coverage need.

import { sendEmail } from '../_shared/send-email.ts';
import { emailTemplate, buttonHtml } from '../_shared/template.ts';

const APP_URL = Deno.env.get('APP_URL') || 'https://example.com';
const MANAGER_EMAILS = (Deno.env.get('MANAGER_EMAILS') || '').split(',').map((s) => s.trim()).filter(Boolean);

const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

interface WebhookPayload {
    type: 'INSERT';
    table: 'shifts';
    record: {
        id: string;
        group_id: string;
        posted_by: string;
        date: string;
        time: string;
        class_name: string;
        location: string;
        reason: string | null;
    };
}

// Simple in-memory debounce. Each function instance keeps a Set of group_ids
// it's already processed in the last 60 seconds. Since instances are short-lived,
// this works for the common case (one form submission = N quick INSERTs from
// the same client). For absolute correctness across instances, we'd add a
// table-based lock — overkill at our scale.
const recentGroupIds = new Set<string>();

async function getCoachName(coachId: string): Promise<string> {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/coaches?id=eq.${coachId}&select=name`, {
        headers: {
            apikey: SUPABASE_SERVICE_ROLE_KEY!,
            Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        },
    });
    const data = await res.json();
    return data?.[0]?.name || 'A coach';
}

async function getGroupShifts(groupId: string): Promise<Array<any>> {
    const res = await fetch(
        `${SUPABASE_URL}/rest/v1/shifts?group_id=eq.${groupId}&select=date,time,class_name,location&order=date,time`,
        {
            headers: {
                apikey: SUPABASE_SERVICE_ROLE_KEY!,
                Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
            },
        },
    );
    return res.json();
}

function formatDay(iso: string): string {
    const d = new Date(iso + 'T00:00:00');
    return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
}

function buildBody(coachName: string, shifts: any[], reason: string | null): string {
    const isGroup = shifts.length > 1;
    const datesUnique = [...new Set(shifts.map((s) => s.date))];
    const locationsUnique = [...new Set(shifts.map((s) => s.location))];
    const classesUnique = [...new Set(shifts.map((s) => s.class_name))];

    const heading = isGroup
        ? `${shifts.length} classes · ${classesUnique.join(', ')} · ${locationsUnique.join(', ')}`
        : `${shifts[0].class_name} at ${shifts[0].location}`;

    const dateLine = datesUnique.length === 1
        ? `🗓️ ${formatDay(datesUnique[0])}`
        : `🗓️ ${formatDay(datesUnique[0])} → ${formatDay(datesUnique[datesUnique.length - 1])}`;

    const timesByDay = shifts.reduce((acc, s) => {
        if (!acc[s.date]) acc[s.date] = [];
        acc[s.date].push(s.time.slice(0, 5));
        return acc;
    }, {} as Record<string, string[]>);

    const timeListHtml = Object.entries(timesByDay)
        .map(([date, times]) => `
      <div style="margin-top:8px;">
        <strong>${formatDay(date)}</strong>: ${(times as string[]).join(', ')}
      </div>
    `)
        .join('');

    const reasonHtml = reason
        ? `<p style="margin: 16px 0 0; color:#3a3a3a; font-style:italic;"><strong>Reason:</strong> ${reason}</p>`
        : '';

    return `
<p>Hi managers,</p>
<p><strong>${coachName}</strong> just posted a new coverage request:</p>
<div style="background:#faf7ed; border:1px solid #d9d2bf; border-radius:4px; padding:16px; margin:16px 0;">
  <div style="font-weight:700; font-size:16px; margin-bottom:6px;">${heading}</div>
  <div style="color:#3a3a3a;">${dateLine}</div>
  ${timeListHtml}
  ${reasonHtml}
</div>
<p>The team has been notified — coaches will see it on their dashboard. You'll get the next nudge tomorrow evening if it's still uncovered.</p>
${buttonHtml('Open COVER', APP_URL)}
`;
}

Deno.serve(async (req) => {
    try {
        const payload: WebhookPayload = await req.json();

        if (payload.type !== 'INSERT' || payload.table !== 'shifts') {
            return new Response('not interested', { status: 200 });
        }

        const groupId = payload.record.group_id;

        // Debounce: don't email twice for the same group within the function instance's lifetime
        if (recentGroupIds.has(groupId)) {
            return new Response('already handled', { status: 200 });
        }
        recentGroupIds.add(groupId);

        // Wait 60 seconds to give all shifts in a multi-row submission time to arrive
        await new Promise((r) => setTimeout(r, 15_000));

        const [shifts, coachName] = await Promise.all([
            getGroupShifts(groupId),
            getCoachName(payload.record.posted_by),
        ]);

        if (shifts.length === 0) {
            return new Response('no shifts found', { status: 200 });
        }

        const reason = shifts[0]?.reason ?? null;
        const subject = `${coachName} needs coverage — ${shifts.length} ${shifts.length === 1 ? 'class' : 'classes'}`;
        const html = emailTemplate({
            preheader: `New shift posted by ${coachName}`,
            bodyHtml: buildBody(coachName, shifts, reason),
        });

        if (MANAGER_EMAILS.length > 0) {
            await sendEmail({
                to: MANAGER_EMAILS,
                subject,
                html,
            });
        }

        return new Response(JSON.stringify({ ok: true, sent_to: MANAGER_EMAILS }), { status: 200 });
    } catch (err) {
        console.error('shift-posted error:', err);
        return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
    }
});