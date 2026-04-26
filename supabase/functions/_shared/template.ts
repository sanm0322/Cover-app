// supabase/functions/_shared/template.ts
//
// Wraps email body content in the shared visual chrome.
// Email-safe HTML — table-based layouts, inline styles, no external CSS.

export function emailTemplate(opts: {
    preheader?: string;  // shown in inbox preview, hidden from body
    bodyHtml: string;    // the actual email content
}): string {
    const { preheader = '', bodyHtml } = opts;

    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>COVER</title>
</head>
<body style="margin:0; padding:0; background:#ece7da; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color:#141414; line-height:1.5;">

  <!-- Hidden preheader (shown in inbox preview) -->
  <div style="display:none; max-height:0; overflow:hidden;">${preheader}</div>

  <!-- Container table for email-client compatibility -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#ece7da; padding: 24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px; background:#f5f1e6; border:1px solid #d9d2bf; border-radius:6px;">

          <!-- Header -->
          <tr>
            <td style="padding: 24px 32px 0 32px; text-align: left;">
              <div style="font-family:'Bebas Neue', Helvetica, sans-serif; font-size:32px; letter-spacing:0.05em; color:#141414;">COVER</div>
              <div style="font-size:11px; letter-spacing:0.2em; color:#87837b; text-transform:uppercase; margin-top:2px;">Shift coverage · Crossfit Dom City</div>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding: 16px 32px 0 32px;">
              <div style="height:2px; background:#c03434;"></div>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 24px 32px 32px 32px; font-size: 15px;">
              ${bodyHtml}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 16px 32px 24px 32px; border-top:1px solid #e5e0cf; font-size:11px; color:#87837b; text-align:center;">
              You're receiving this as a coach at Crossfit Dom City. Talk to Santi if anything's off.
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`;
}

// Helper: render a primary button with consistent styling
export function buttonHtml(label: string, url: string): string {
    return `
<table role="presentation" cellpadding="0" cellspacing="0" style="margin: 16px 0;">
  <tr>
    <td style="background:#141414; border-radius:4px;">
      <a href="${url}" style="display:inline-block; padding:12px 22px; color:#ece7da; text-decoration:none; font-weight:700; font-size:13px; letter-spacing:0.05em;">
        ${label}
      </a>
    </td>
  </tr>
</table>`;
}

// Helper: render a WhatsApp share button (manager-only)
export function whatsappButtonHtml(text: string): string {
    const encoded = encodeURIComponent(text);
    const url = `https://wa.me/?text=${encoded}`;
    return `
<table role="presentation" cellpadding="0" cellspacing="0" style="margin: 16px 0;">
  <tr>
    <td style="background:#25d366; border-radius:4px;">
      <a href="${url}" style="display:inline-block; padding:12px 22px; color:#ffffff; text-decoration:none; font-weight:700; font-size:13px; letter-spacing:0.05em;">
        📱 Share to WhatsApp
      </a>
    </td>
  </tr>
</table>`;
}