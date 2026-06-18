import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

// DELETE /api/discussions/[id]/comments/[commentId] - 删除评论
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; commentId: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: '请先登录' },
        { status: 401 }
      );
    }

    const { id, commentId } = await params;

    // 检查评论是否存在且属于当前用户
    const comment = await prisma.discussionComment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      return NextResponse.json(
        { error: '评论不存在' },
        { status: 404 }
      );
    }

    if (comment.userId !== session?.user?.id) {
      return NextResponse.json(
        { error: '无权删除此评论' },
        { status: 403 }
      );
    }

    await prisma.discussionComment.delete({
      where: { id: commentId },
    });

    // 更新讨论的评论数
    await prisma.discussion.update({
      where: { id },
      data: { commentCount: { decrement: 1 } },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('删除评论失败:', error);
    return NextResponse.json(
      { error: '删除评论失败' },
      { status: 500 }
    );
  }
}
