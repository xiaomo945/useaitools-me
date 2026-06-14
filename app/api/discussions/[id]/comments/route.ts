import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

// POST /api/discussions/[id]/comments - 添加评论
export async function POST(
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
    const { content } = body;

    if (!content?.trim()) {
      return NextResponse.json(
        { error: '评论内容不能为空' },
        { status: 400 }
      );
    }

    // 检查讨论是否存在
    const discussion = await prisma.discussion.findUnique({
      where: { id },
    });

    if (!discussion) {
      return NextResponse.json(
        { error: '讨论不存在' },
        { status: 404 }
      );
    }

    // 检查讨论是否被锁定
    if (discussion.isLocked) {
      return NextResponse.json(
        { error: '此讨论已被锁定，无法评论' },
        { status: 403 }
      );
    }

    // 创建评论
    const comment = await prisma.discussionComment.create({
      data: {
        content: content.trim(),
        userId: session.user.id,
        discussionId: id,
      },
      include: {
        user: {
          select: { id: true, name: true, image: true },
        },
      },
    });

    // 更新讨论的评论数
    await prisma.discussion.update({
      where: { id },
      data: { commentCount: { increment: 1 } },
    });

    return NextResponse.json(
      {
        id: comment.id,
        content: comment.content,
        createdAt: comment.createdAt,
        user: {
          id: comment.user.id,
          name: comment.user.name,
          image: comment.user.image,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('添加评论失败:', error);
    return NextResponse.json(
      { error: '添加评论失败' },
      { status: 500 }
    );
  }
}

// DELETE 已移至 /api/discussions/[id]/comments/[commentId]/route.ts
