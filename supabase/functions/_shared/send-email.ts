// supabase/functions/_shared/send-email.ts
//
// Wrapper around Resend's HTTP API. Each Edge Function imports this
// rather than calling fetch() directly, so we have one place to
// adjust headers, error handling, retry logic if we ever need to.

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
const FROM_ADDRESS = 'COVER <onboarding@resend.dev>';
// ^ Default Resend sandbox sender. Change once you set up cover.thebox.nl.

export interface EmailMessage {
    to: string | string[];
    subject: string;
    html: string;
}

export async function sendEmail(msg: EmailMessage): Promise<void> {
    if (!RESEND_API_KEY) {
        throw new Error('RESEND_API_KEY environment variable not set');
    }

    const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
            from: FROM_ADDRESS,
            to: msg.to,
            subject: msg.subject,
            html: msg.html,
        }),
    });

    if (!res.ok) {
        const body = await res.text();
        throw new Error(`Resend API error ${res.status}: ${body}`);
    }
}