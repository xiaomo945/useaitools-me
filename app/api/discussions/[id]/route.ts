import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

// GET /api/discussions/[id] - 获取单个讨论详情
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const discussion = await prisma.discussion.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, name: true, image: true },
        },
        tool: {
          select: { id: true, name: true, slug: true },
        },
        comments: {
          include: {
            user: {
              select: { id: true, name: true, image: true },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!discussion) {
      return NextResponse.json(
        { error: '讨论不存在' },
        { status: 404 }
      );
    }

    // 增加浏览次数
    await prisma.discussion.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });

    return NextResponse.json({
      id: discussion.id,
      title: discussion.title,
      content: discussion.content,
      category: discussion.category,
      viewCount: discussion.viewCount + 1,
      commentCount: discussion.commentCount,
      likeCount: discussion.likeCount,
      isPinned: discussion.isPinned,
      isLocked: discussion.isLocked,
      createdAt: discussion.createdAt,
      updatedAt: discussion.updatedAt,
      user: {
        id: discussion.user.id,
        name: discussion.user.name,
        image: discussion.user.image,
      },
      tool: discussion.tool ? {
        id: discussion.tool.id,
        name: discussion.tool.name,
        slug: discussion.tool.slug,
      } : null,
      comments: discussion.comments.map((c: any) => ({
        id: c.id,
        content: c.content,
        createdAt: c.createdAt,
        user: {
          id: c.user.id,
          name: c.user.name,
          image: c.user.image,
        },
      })),
    });
  } catch (error) {
    console.error('获取讨论详情失败:', error);
    return NextResponse.json(
      { error: '获取讨论详情失败' },
      { status: 500 }
    );
  }
}

// PUT /api/discussions/[id] - 更新讨论
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: '请先登录' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { title, content, category } = body;

    // 检查讨论是否存在且属于当前用户
    const existing = await prisma.discussion.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: '讨论不存在' },
        { status: 404 }
      );
    }

    if (existing.userId !== session.user.id) {
      return NextResponse.json(
        { error: '无权修改此讨论' },
        { status: 403 }
      );
    }

    const discussion = await prisma.discussion.update({
      where: { id },
      data: {
        title: title?.trim() || existing.title,
        content: content?.trim() || existing.content,
        category: category || existing.category,
      },
    });

    return NextResponse.json({ discussion });
  } catch (error) {
    console.error('更新讨论失败:', error);
    return NextResponse.json(
      { error: '更新讨论失败' },
      { status: 500 }
    );
  }
}

// DELETE /api/discussions/[id] - 删除讨论
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: '请先登录' },
        { status: 401 }
      );
    }

    const { id } = await params;

    // 检查讨论是否存在且属于当前用户
    const existing = await prisma.discussion.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: '讨论不存在' },
        { status: 404 }
      );
    }

    if (existing.userId !== session.user.id) {
      return NextResponse.json(
        { error: '无权删除此讨论' },
        { status: 403 }
      );
    }

    await prisma.discussion.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('删除讨论失败:', error);
    return NextResponse.json(
      { error: '删除讨论失败' },
      { status: 500 }
    );
  }
}
