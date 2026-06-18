import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

// GET /api/email-subscription - 获取当前用户的订阅信息
export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: '请先登录' },
        { status: 401 }
      );
    }

    const subscription = await prisma.emailSubscription.findUnique({
      where: { userId: session?.user?.id },
    });

    return NextResponse.json({ subscription });
  } catch (error) {
    console.error('获取邮件订阅失败:', error);
    return NextResponse.json(
      { error: '获取邮件订阅失败' },
      { status: 500 }
    );
  }
}

// POST /api/email-subscription - 创建或更新邮件订阅
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: '请先登录' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { categories, frequency, emailFormat } = body;

    // 验证频率
    const validFrequencies = ['daily', 'weekly', 'monthly'];
    if (frequency && !validFrequencies.includes(frequency)) {
      return NextResponse.json(
        { error: '无效的订阅频率' },
        { status: 400 }
      );
    }

    // 验证格式
    const validFormats = ['html', 'text'];
    if (emailFormat && !validFormats.includes(emailFormat)) {
      return NextResponse.json(
        { error: '无效的邮件格式' },
        { status: 400 }
      );
    }

    // 创建或更新订阅
    const subscription = await prisma.emailSubscription.upsert({
      where: { userId: session?.user?.id },
      create: {
        userId: session?.user?.id,
        categories: JSON.stringify(categories || []),
        frequency: frequency || 'weekly',
        emailFormat: emailFormat || 'html',
        isActive: true,
      },
      update: {
        categories: JSON.stringify(categories || []),
        frequency: frequency || 'weekly',
        emailFormat: emailFormat || 'html',
        isActive: true,
      },
    });

    return NextResponse.json({ subscription });
  } catch (error) {
    console.error('创建邮件订阅失败:', error);
    return NextResponse.json(
      { error: '创建邮件订阅失败' },
      { status: 500 }
    );
  }
}

// PUT /api/email-subscription - 更新订阅偏好
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: '请先登录' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { categories, frequency, emailFormat } = body;

    const subscription = await prisma.emailSubscription.update({
      where: { userId: session?.user?.id },
      data: {
        categories: categories ? JSON.stringify(categories) : undefined,
        frequency,
        emailFormat,
      },
    });

    return NextResponse.json({ subscription });
  } catch (error) {
    console.error('更新邮件订阅失败:', error);
    return NextResponse.json(
      { error: '更新邮件订阅失败' },
      { status: 500 }
    );
  }
}

// DELETE /api/email-subscription - 取消订阅
export async function DELETE() {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: '请先登录' },
        { status: 401 }
      );
    }

    await prisma.emailSubscription.update({
      where: { userId: session?.user?.id },
      data: { isActive: false },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('取消邮件订阅失败:', error);
    return NextResponse.json(
      { error: '取消邮件订阅失败' },
      { status: 500 }
    );
  }
}
