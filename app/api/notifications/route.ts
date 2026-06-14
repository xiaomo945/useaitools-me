import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

// GET /api/notifications - 获取用户通知列表
export async function GET(request: Request) {
  const session = await auth();
  
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: '未授权访问' },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '50');
  const unreadOnly = searchParams.get('unreadOnly') === 'true';

  try {
    const where: any = { userId: session.user.id };
    
    if (unreadOnly) {
      where.isRead = false;
    }

    const notifications = await prisma.notification.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    const unreadCount = await prisma.notification.count({
      where: {
        userId: session.user.id,
        isRead: false,
      },
    });

    return NextResponse.json({ notifications, unreadCount });
  } catch (error) {
    console.error('获取通知列表失败:', error);
    return NextResponse.json(
      { error: '获取通知失败' },
      { status: 500 }
    );
  }
}

// PATCH /api/notifications - 标记通知为已读
export async function PATCH(request: Request) {
  const session = await auth();
  
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: '未授权访问' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { notificationIds, markAllRead } = body;

    if (markAllRead) {
      // 标记所有通知为已读
      await prisma.notification.updateMany({
        where: {
          userId: session.user.id,
          isRead: false,
        },
        data: {
          isRead: true,
        },
      });
    } else if (notificationIds && Array.isArray(notificationIds)) {
      // 标记指定通知为已读
      await prisma.notification.updateMany({
        where: {
          id: { in: notificationIds },
          userId: session.user.id,
        },
        data: {
          isRead: true,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('标记通知失败:', error);
    return NextResponse.json(
      { error: '标记通知失败' },
      { status: 500 }
    );
  }
}

// DELETE /api/notifications - 删除通知
export async function DELETE(request: Request) {
  const session = await auth();
  
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: '未授权访问' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { notificationIds, deleteAllRead } = body;

    if (deleteAllRead) {
      // 删除所有已读通知
      await prisma.notification.deleteMany({
        where: {
          userId: session.user.id,
          isRead: true,
        },
      });
    } else if (notificationIds && Array.isArray(notificationIds)) {
      // 删除指定通知
      await prisma.notification.deleteMany({
        where: {
          id: { in: notificationIds },
          userId: session.user.id,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('删除通知失败:', error);
    return NextResponse.json(
      { error: '删除通知失败' },
      { status: 500 }
    );
  }
}
