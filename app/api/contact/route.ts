import { NextResponse } from 'next/server';

// 简单的速率限制：使用内存存储（生产环境应该使用 Redis 或数据库）
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1分钟
const RATE_LIMIT_MAX = 3; // 每分钟最多3次

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const requests = rateLimitMap.get(ip) || [];
  
  // 清理过期的记录
  const recentRequests = requests.filter(timestamp => now - timestamp < RATE_LIMIT_WINDOW);
  
  if (recentRequests.length >= RATE_LIMIT_MAX) {
    return false;
  }
  
  recentRequests.push(now);
  rateLimitMap.set(ip, recentRequests);
  return true;
}

export async function POST(request: Request) {
  try {
    // 获取客户端IP（用于速率限制）
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : 'unknown';
    
    // 检查速率限制
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { success: false, message: '请求过于频繁，请稍后再试' },
        { status: 429 }
      );
    }

    const { name, email, message, honeypot } = await request.json();

    // 蜜罐检查：如果 honeypot 字段有值，说明是机器人
    if (honeypot) {
      // 静默拒绝，返回成功但实际不处理
      return NextResponse.json({ success: true, message: '消息已发送' });
    }

    // 验证必填字段
    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, message: '所有字段都是必填的' },
        { status: 400 }
      );
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: '请输入有效的邮箱地址' },
        { status: 400 }
      );
    }

    // 验证消息长度
    if (message.length > 2000) {
      return NextResponse.json(
        { success: false, message: '消息内容过长，请限制在2000字以内' },
        { status: 400 }
      );
    }

    // 生产环境：集成真实的邮件发送服务
    // 开发环境：仅记录日志
    if (process.env.NODE_ENV === 'development') {
      console.log('📧 新的联系表单提交:', {
        name,
        email,
        message,
        timestamp: new Date().toISOString()
      });
    }

    // TODO: 集成真实的邮件发送服务
    // 示例：使用 Resend
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({
    //   from: 'contact@useaitools.me',
    //   to: 'affiliate@useaitools.me',
    //   subject: `新的联系表单提交来自 ${name}`,
    //   text: `姓名: ${name}\n邮箱: ${email}\n消息: ${message}`
    // });

    return NextResponse.json({
      success: true,
      message: '消息已发送，我们会尽快回复您'
    });

  } catch (error) {
    // 生产环境：发送到错误追踪服务（如 Sentry）
    if (process.env.NODE_ENV === 'development') {
      console.error('联系表单提交错误:', error);
    }
    return NextResponse.json(
      { success: false, message: '发送失败，请稍后重试' },
      { status: 500 }
    );
  }
}
