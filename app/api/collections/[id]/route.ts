import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

// PUT /api/collections/[id] - 更新收藏集合
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    
    if (!(session?.user as any)?.id) {
      return NextResponse.json(
        { error: '请先登录' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { name, description, isPublic } = body;

    // 检查集合是否存在且属于当前用户
    const existingCollection = await prisma.collection.findFirst({
      where: { id, userId: (session as any).user.id }
    });

    if (!existingCollection) {
      return NextResponse.json(
        { error: '集合不存在或无权访问' },
        { status: 404 }
      );
    }

    const collection = await prisma.collection.update({
      where: { id },
      data: {
        name,
        description,
        isPublic
      }
    });

    return NextResponse.json({ collection });
  } catch (error) {
    console.error('更新收藏集合失败:', error);
    return NextResponse.json(
      { error: '更新收藏集合失败' },
      { status: 500 }
    );
  }
}

// DELETE /api/collections/[id] - 删除收藏集合
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    
    if (!(session?.user as any)?.id) {
      return NextResponse.json(
        { error: '请先登录' },
        { status: 401 }
      );
    }

    const { id } = await params;

    // 检查集合是否存在且属于当前用户
    const existingCollection = await prisma.collection.findFirst({
      where: { id, userId: (session as any).user.id }
    });

    if (!existingCollection) {
      return NextResponse.json(
        { error: '集合不存在或无权访问' },
        { status: 404 }
      );
    }

    await prisma.collection.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('删除收藏集合失败:', error);
    return NextResponse.json(
      { error: '删除收藏集合失败' },
      { status: 500 }
    );
  }
}
