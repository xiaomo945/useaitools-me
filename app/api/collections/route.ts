import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

// GET /api/collections - 获取用户的收藏集合
export async function GET() {
  try {
    const session = await auth();
    
    if (!(session?.user as any)?.id) {
      return NextResponse.json(
        { error: '请先登录' },
        { status: 401 }
      );
    }

    const collections = await prisma.collection.findMany({
      where: { userId: (session as any).user.id },
      orderBy: { updatedAt: 'desc' }
    });

    return NextResponse.json({ collections });
  } catch (error) {
    console.error('获取收藏集合失败:', error);
    return NextResponse.json(
      { error: '获取收藏集合失败' },
      { status: 500 }
    );
  }
}

// POST /api/collections - 创建新的收藏集合
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!(session?.user as any)?.id) {
      return NextResponse.json(
        { error: '请先登录' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, description, isPublic } = body;

    if (!name) {
      return NextResponse.json(
        { error: '缺少集合名称' },
        { status: 400 }
      );
    }

    // 生成 slug
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    // 检查 slug 是否已存在
    const existingCollection = await prisma.collection.findFirst({
      where: { slug, userId: (session as any).user.id }
    });

    if (existingCollection) {
      return NextResponse.json(
        { error: '集合名称已存在' },
        { status: 400 }
      );
    }

    const collection = await prisma.collection.create({
      data: {
        name,
        description,
        isPublic: isPublic || false,
        slug,
        userId: (session as any).user.id
      }
    });

    return NextResponse.json({ collection }, { status: 201 });
  } catch (error) {
    console.error('创建收藏集合失败:', error);
    return NextResponse.json(
      { error: '创建收藏集合失败' },
      { status: 500 }
    );
  }
}

// PUT 和 DELETE 方法已移到 /api/collections/[id]/route.ts
