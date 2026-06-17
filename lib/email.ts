/**
 * Email service abstraction.
 *
 * Supports Resend (preferred) when RESEND_API_KEY is set. Falls back to a
 * no-op logger in development so the app never crashes for missing credentials.
 *
 * All transactional emails (welcome, unsubscribe confirmation, etc.) should
 * route through `sendEmail()` so we keep a single integration point.
 */

const FROM_ADDRESS = process.env.EMAIL_FROM || 'Use AI Tools <newsletter@useaitools.me>';
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_ENDPOINT = 'https://api.resend.com/emails';

export type EmailPayload = {
  to: string;
  subject: string;
  html: string;
  text?: string;
  from?: string;
};

export type EmailResult =
  | { success: true; messageId?: string }
  | { success: false; error: string };

/**
 * Send an email via Resend. Returns a no-op success when no API key is
 * configured (development mode) so callers can treat email as best-effort.
 */
export async function sendEmail(payload: EmailPayload): Promise<EmailResult> {
  if (!RESEND_API_KEY) {
    if (process.env.NODE_ENV === 'development') {
      console.log('[email:dev] Would send:', {
        to: payload.to,
        subject: payload.subject,
        from: payload.from || FROM_ADDRESS,
      });
    }
    return { success: true };
  }

  try {
    const response = await fetch(RESEND_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: payload.from || FROM_ADDRESS,
        to: payload.to,
        subject: payload.subject,
        html: payload.html,
        text: payload.text,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      return { success: false, error: `Resend API ${response.status}: ${errorText}` };
    }

    const data = await response.json().catch(() => ({}));
    return { success: true, messageId: data.id };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Network error';
    return { success: false, error: message };
  }
}

/**
 * Welcome email sent immediately after a successful subscription.
 * Delayed-send pattern from rule 11-email.md is intentionally NOT used here
 * because the subscription itself is the trigger.
 */
export function renderWelcomeEmail(email: string, name?: string): EmailPayload {
  const greeting = name ? `Hi ${name},` : 'Hi there,';
  const unsubscribeUrl = `https://useaitools.me/api/unsubscribe?email=${encodeURIComponent(email)}`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Use AI Tools Weekly</title>
</head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#0f172a;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.05);">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#10b981,#14b8a6);padding:40px 32px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:800;letter-spacing:-0.02em;">Use AI Tools</h1>
              <p style="margin:8px 0 0;color:rgba(255,255,255,0.9);font-size:15px;">Your weekly AI tools digest</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:40px 32px;">
              <h2 style="margin:0 0 16px;font-size:22px;color:#0f172a;">Welcome aboard! 🎉</h2>
              <p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:#475569;">${greeting}</p>
              <p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:#475569;">
                You're now part of a community of creators, developers, and makers who get the best AI tools delivered to their inbox every week.
              </p>
              <p style="margin:0 0 24px;font-size:16px;line-height:1.6;color:#475569;">
                Here's what to expect:
              </p>
              <ul style="margin:0 0 24px;padding-left:20px;font-size:16px;line-height:1.8;color:#475569;">
                <li>🔍 <strong>Weekly Picks</strong> — 5 hand-curated AI tools every Friday</li>
                <li>📊 <strong>Deep Dives</strong> — In-depth reviews of standout tools</li>
                <li>💡 <strong>Use Cases</strong> — Real workflows you can copy</li>
                <li>🎁 <strong>Exclusive Deals</strong> — Subscriber-only discounts</li>
              </ul>
              <div style="text-align:center;margin:32px 0;">
                <a href="https://useaitools.me" style="display:inline-block;padding:14px 32px;background:linear-gradient(135deg,#10b981,#14b8a6);color:#ffffff;text-decoration:none;font-weight:600;border-radius:12px;font-size:15px;">Explore AI Tools</a>
              </div>
              <p style="margin:24px 0 0;font-size:14px;line-height:1.6;color:#64748b;">
                Reply to this email anytime — I read every response.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:24px 32px;background:#f1f5f9;border-top:1px solid #e2e8f0;">
              <p style="margin:0 0 8px;font-size:13px;color:#64748b;">
                You're receiving this because you subscribed at <a href="https://useaitools.me" style="color:#0891b2;text-decoration:none;">useaitools.me</a>.
              </p>
              <p style="margin:0;font-size:13px;color:#64748b;">
                <a href="${unsubscribeUrl}" style="color:#64748b;text-decoration:underline;">Unsubscribe</a> · <a href="https://useaitools.me/privacy" style="color:#64748b;text-decoration:underline;">Privacy Policy</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`.trim();

  const text = `${greeting}

Welcome to Use AI Tools Weekly! You're now part of a community of creators, developers, and makers who get the best AI tools delivered to their inbox every week.

Here's what to expect:
- Weekly Picks: 5 hand-curated AI tools every Friday
- Deep Dives: In-depth reviews of standout tools
- Use Cases: Real workflows you can copy
- Exclusive Deals: Subscriber-only discounts

Explore AI Tools: https://useaitools.me

Reply to this email anytime — I read every response.

---
You're receiving this because you subscribed at useaitools.me.
Unsubscribe: ${unsubscribeUrl}`;

  return {
    to: email,
    subject: 'Welcome to Use AI Tools Weekly 🎉',
    html,
    text,
  };
}
