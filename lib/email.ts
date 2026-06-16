import { Resend } from 'resend';

export interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
}

export async function sendEmail(options: EmailOptions) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('[Email] RESEND_API_KEY not set, skipping email send');
    return { success: false, error: 'API key not configured' };
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const data = await resend.emails.send({
      from: options.from || 'Use AI Tools <newsletter@useaitools.me>',
      to: options.to,
      subject: options.subject,
      html: options.html,
    });

    return { success: true, data };
  } catch (error) {
    console.error('[Email] Send failed:', error);
    return { success: false, error: String(error) };
  }
}

export async function sendWelcomeEmail(email: string) {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Use AI Tools</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #059669 0%, #0d9488 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">Welcome to Use AI Tools!</h1>
              <p style="margin: 10px 0 0; color: #d1fae5; font-size: 16px;">Your AI tools discovery journey starts here</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px; color: #1e293b; font-size: 16px; line-height: 1.6;">
                Hi there! 👋
              </p>
              <p style="margin: 0 0 20px; color: #1e293b; font-size: 16px; line-height: 1.6;">
                Thanks for subscribing to <strong>Use AI Tools</strong> — the independent directory of 1,300+ AI tools, built from an internet café in China.
              </p>
              <p style="margin: 0 0 30px; color: #1e293b; font-size: 16px; line-height: 1.6;">
                Here's what you can expect from us:
              </p>
              
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
                <tr>
                  <td style="padding: 15px; background-color: #f0fdf4; border-radius: 8px; margin-bottom: 10px;">
                    <strong style="color: #059669;">📬 Weekly Picks</strong>
                    <p style="margin: 5px 0 0; color: #475569; font-size: 14px;">Every Friday, get 5 handpicked AI tools delivered to your inbox</p>
                  </td>
                </tr>
                <tr><td height="10"></td></tr>
                <tr>
                  <td style="padding: 15px; background-color: #f0fdf4; border-radius: 8px;">
                    <strong style="color: #059669;">🔍 Smart Recommendations</strong>
                    <p style="margin: 5px 0 0; color: #475569; font-size: 14px;">Personalized tool suggestions based on your interests</p>
                  </td>
                </tr>
                <tr><td height="10"></td></tr>
                <tr>
                  <td style="padding: 15px; background-color: #f0fdf4; border-radius: 8px;">
                    <strong style="color: #059669;">💡 Exclusive Content</strong>
                    <p style="margin: 5px 0 0; color: #475569; font-size: 14px;">AI tool guides, comparisons, and tips you won't find elsewhere</p>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 0 0 30px; color: #1e293b; font-size: 16px; line-height: 1.6;">
                In the meantime, why not explore our directory?
              </p>
              
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="https://useaitools.me" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #059669 0%, #0d9488 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                      Explore AI Tools →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0 0 10px; color: #64748b; font-size: 14px;">
                Built with ❤️ from an internet café in China
              </p>
              <p style="margin: 0; color: #94a3b8; font-size: 12px;">
                © 2026 Use AI Tools. All rights reserved.<br>
                <a href="https://useaitools.me/email-preferences" style="color: #94a3b8; text-decoration: underline;">Email Preferences</a> · 
                <a href="https://useaitools.me/unsubscribe" style="color: #94a3b8; text-decoration: underline;">Unsubscribe</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  return sendEmail({
    to: email,
    subject: 'Welcome to Use AI Tools! 🚀',
    html,
  });
}

export async function sendWeeklyPicks(email: string, picks: Array<{
  name: string;
  description: string;
  category: string;
  url: string;
}>) {
  const picksHtml = picks.map((tool, i) => `
    <tr>
      <td style="padding: 20px; background-color: ${i % 2 === 0 ? '#f8fafc' : '#ffffff'}; border-radius: 8px;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td>
              <h3 style="margin: 0 0 8px; color: #1e293b; font-size: 18px; font-weight: 600;">
                ${tool.name}
                <span style="display: inline-block; padding: 2px 8px; background-color: #e0f2fe; color: #0369a1; font-size: 12px; border-radius: 4px; margin-left: 8px;">${tool.category}</span>
              </h3>
              <p style="margin: 0 0 12px; color: #64748b; font-size: 14px; line-height: 1.5;">
                ${tool.description}
              </p>
              <a href="${tool.url}" style="color: #059669; text-decoration: none; font-weight: 500; font-size: 14px;">
                Try ${tool.name} →
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr><td height="10"></td></tr>
  `).join('');

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Weekly Picks - Use AI Tools</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #059669 0%, #0d9488 100%); padding: 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 700;">📬 Weekly Picks</h1>
              <p style="margin: 8px 0 0; color: #d1fae5; font-size: 14px;">${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
            </td>
          </tr>
          
          <!-- Intro -->
          <tr>
            <td style="padding: 30px 30px 20px;">
              <p style="margin: 0; color: #1e293b; font-size: 16px; line-height: 1.6;">
                This week's handpicked AI tools, curated just for you:
              </p>
            </td>
          </tr>
          
          <!-- Picks -->
          <tr>
            <td style="padding: 0 30px 30px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                ${picksHtml}
              </table>
            </td>
          </tr>
          
          <!-- CTA -->
          <tr>
            <td style="padding: 0 30px 40px; text-align: center;">
              <a href="https://useaitools.me" style="display: inline-block; padding: 12px 28px; background: linear-gradient(135deg, #059669 0%, #0d9488 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px;">
                Explore All 1,300+ Tools →
              </a>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0 0 10px; color: #64748b; font-size: 14px;">
                You received this because you subscribed to Use AI Tools Weekly Picks.
              </p>
              <p style="margin: 0; color: #94a3b8; font-size: 12px;">
                © 2026 Use AI Tools. All rights reserved.<br>
                <a href="https://useaitools.me/email-preferences" style="color: #94a3b8; text-decoration: underline;">Email Preferences</a> · 
                <a href="https://useaitools.me/unsubscribe" style="color: #94a3b8; text-decoration: underline;">Unsubscribe</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  return sendEmail({
    to: email,
    subject: `Weekly Picks: ${picks.map(p => p.name).join(', ')} & more`,
    html,
  });
}
