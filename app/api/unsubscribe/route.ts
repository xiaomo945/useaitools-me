import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function renderPage(
  state: 'missing' | 'invalid' | 'notfound' | 'success' | 'error',
  email: string,
  message: string
): string {
  const config = {
    missing: {
      title: '取消订阅',
      icon: '✉',
      heading: '取消订阅',
      body: '请在 URL 中提供 email 参数，例如：<br/><code>/api/unsubscribe?email=your@email.com</code>',
      iconBg: 'linear-gradient(135deg, #10b981, #14b8a6)',
    },
    invalid: {
      title: '邮箱格式错误',
      icon: '!',
      heading: '邮箱地址格式不正确',
      body: `请检查您输入的邮箱地址：<span style="display:inline-block;background:#f1f5f9;padding:4px 10px;border-radius:999px;font-size:13px;margin:12px 4px;word-break:break-all;">${escapeHtml(email)}</span>`,
      iconBg: 'linear-gradient(135deg, #f87171, #ef4444)',
    },
    notfound: {
      title: '未找到订阅记录',
      icon: '?',
      heading: '未找到此邮箱的订阅记录',
      body: `邮箱 <span style="display:inline-block;background:#f1f5f9;padding:4px 10px;border-radius:999px;font-size:13px;margin:12px 4px;word-break:break-all;">${escapeHtml(email)}</span> 不在我们的订阅列表中。`,
      iconBg: 'linear-gradient(135deg, #f59e0b, #d97706)',
    },
    success: {
      title: '已取消订阅',
      icon: '✓',
      heading: '已成功取消订阅',
      body: `我们已将邮箱 <span style="display:inline-block;background:#ecfdf5;padding:4px 10px;border-radius:999px;font-size:13px;margin:12px 4px;word-break:break-all;color:#065f46;">${escapeHtml(email)}</span> 从订阅列表中移除。<br/><br/>感谢您过去的关注，期待再次与您相遇！`,
      iconBg: 'linear-gradient(135deg, #10b981, #14b8a6)',
    },
    error: {
      title: '服务器错误',
      icon: '!',
      heading: '处理失败',
      body: message || '服务器错误，请稍后再试。',
      iconBg: 'linear-gradient(135deg, #f87171, #ef4444)',
    },
  }[state];

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${config.title} – Use AI Tools</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #10b981 0%, #14b8a6 50%, #06b6d4 100%);
      padding: 20px;
      color: #0f172a;
    }
    .card {
      background: #ffffff;
      border-radius: 24px;
      padding: 48px 40px;
      max-width: 480px;
      width: 100%;
      box-shadow: 0 20px 50px -12px rgba(0,0,0,0.25);
      text-align: center;
    }
    .icon {
      width: 72px;
      height: 72px;
      border-radius: 20px;
      margin: 0 auto 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: ${config.iconBg};
      color: #fff;
      font-size: 32px;
      font-weight: 700;
    }
    h1 { font-size: 28px; font-weight: 700; margin-bottom: 16px; }
    p { font-size: 16px; line-height: 1.7; color: #475569; }
    code {
      display: inline-block;
      background: #f8fafc;
      padding: 4px 10px;
      border-radius: 8px;
      font-size: 13px;
      color: #334155;
      margin-top: 12px;
      word-break: break-all;
    }
    a.btn {
      display: inline-block;
      margin-top: 28px;
      padding: 12px 24px;
      border-radius: 12px;
      background: linear-gradient(135deg, #10b981, #14b8a6);
      color: #fff;
      text-decoration: none;
      font-size: 15px;
      font-weight: 600;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    a.btn:hover { transform: translateY(-1px); box-shadow: 0 10px 20px -5px rgba(16, 185, 129, 0.4); }
    .footer { margin-top: 28px; font-size: 13px; color: #64748b; }
    .footer a { color: #0891b2; text-decoration: none; }
    .footer a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">${config.icon}</div>
    <h1>${config.heading}</h1>
    <p>${config.body}</p>
    <a class="btn" href="https://useaitools.me">返回首页</a>
    <div class="footer">
      如有疑问，请访问 <a href="https://useaitools.me">useaitools.me</a>
    </div>
  </div>
</body>
</html>`;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const email = (url.searchParams.get('email') || '').trim().toLowerCase();

    if (!email) {
      return new Response(renderPage('missing', '', ''), {
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
        status: 400,
      });
    }

    if (!emailRegex.test(email)) {
      return new Response(renderPage('invalid', email, ''), {
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
        status: 400,
      });
    }

    const existing = await prisma.siteSubscription
      .findUnique({ where: { email } })
      .catch(() => null);

    if (!existing) {
      return new Response(renderPage('notfound', email, ''), {
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      });
    }

    await prisma.siteSubscription.update({
      where: { email },
      data: { status: 'unsubscribed' },
    });

    return new Response(renderPage('success', email, ''), {
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  } catch (error) {
    console.error('取消订阅失败:', error);
    return new Response(
      renderPage('error', '', '服务器错误，请稍后再试。'),
      {
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
        status: 500,
      }
    );
  }
}
