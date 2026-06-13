import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json();

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

    // 在实际生产环境中，这里应该：
    // 1. 发送邮件通知（使用 Resend、SendGrid 等服务）
    // 2. 或者保存到数据库/文件
    // 3. 或者集成第三方服务（如 Formspree、Getform）

    // 临时方案：记录到控制台（生产环境应该替换为真实的邮件发送）
    console.log('📧 新的联系表单提交:', {
      name,
      email,
      message,
      timestamp: new Date().toISOString()
    });

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
    console.error('联系表单提交错误:', error);
    return NextResponse.json(
      { success: false, message: '发送失败，请稍后重试' },
      { status: 500 }
    );
  }
}
