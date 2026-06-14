import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(request: NextRequest) {
  try {
    let body: any = {};

    const contentType = request.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      body = await request.json().catch(() => ({}));
    } else {
      const formData = await request.formData().catch(() => null);
      if (formData) {
        body = {
          email: formData.get('email')?.toString() || '',
          name: formData.get('name')?.toString() || '',
          source: formData.get('source')?.toString() || '',
          interests: formData.get('interests')?.toString() || '',
        };
      }
    }

    const email = (body.email as string)?.trim().toLowerCase() || '';
    const name = (body.name as string)?.trim() || undefined;
    const source = (body.source as string)?.trim() || 'website';
    const interests = body.interests;

    if (!email) {
      return NextResponse.json(
        { success: false, message: '请输入邮箱地址。' },
        { status: 400 }
      );
    }

    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: '请提供有效的邮箱地址。' },
        { status: 400 }
      );
    }

    let interestsStr: string | undefined;
    if (interests) {
      if (typeof interests === 'string') {
        interestsStr = interests;
      } else {
        interestsStr = JSON.stringify(interests);
      }
    }

    let ipAddress: string | undefined;
    let userAgent: string | undefined;
    try {
      ipAddress =
        request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
        request.headers.get('x-real-ip') ||
        undefined;
      userAgent = request.headers.get('user-agent') || undefined;
    } catch {
      // 忽略 IP/UA 解析错误
    }

    const existing = await prisma.siteSubscription
      .findUnique({ where: { email } })
      .catch(() => null);

    const subscription = await prisma.siteSubscription.upsert({
      where: { email },
      create: {
        email,
        name,
        source,
        status: 'active',
        interests: interestsStr,
        ipAddress,
        userAgent,
      },
      update: {
        name: name || undefined,
        source,
        status: 'active',
        interests: interestsStr,
        userAgent,
      },
    });

    const isNew =
      !existing ||
      existing.createdAt.getTime() === subscription.createdAt.getTime();

    return NextResponse.json({
      success: true,
      status: isNew ? 'new' : 'existing',
      message: isNew
        ? '感谢订阅！我们会定期向您发送精选内容。'
        : '您已在订阅列表中，欢迎继续关注我们！',
    });
  } catch (error) {
    console.error('订阅失败:', error);
    return NextResponse.json(
      { success: false, message: '服务器错误，请稍后再试。' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { success: false, message: '仅支持 POST 请求。' },
    { status: 405 }
  );
}
