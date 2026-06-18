import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

// GET /api/discussions - 获取讨论列表
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const toolId = searchParams.get('toolId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const sortBy = searchParams.get('sortBy') || 'latest'; // latest, popular, pinned

    const where: any = {};

    if (category && category !== 'all') {
      where.category = category;
    }

    if (toolId) {
      where.toolId = toolId;
    }

    // 排序
    let orderBy: any;
    switch (sortBy) {
      case 'popular':
        orderBy = [{ isPinned: 'desc' }, { commentCount: 'desc' }, { createdAt: 'desc' }];
        break;
      case 'pinned':
        orderBy = [{ isPinned: 'desc' }, { createdAt: 'desc' }];
        break;
      default:
        orderBy = { createdAt: 'desc' };
    }

    const total = await prisma.discussion.count({ where });

    const discussions = await prisma.discussion.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        tool: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    return NextResponse.json({
      discussions: discussions.map((d: any) => ({
        id: d.id,
        title: d.title,
        content: d.content,
        category: d.category,
        viewCount: d.viewCount,
        commentCount: d.commentCount,
        likeCount: d.likeCount,
        isPinned: d.isPinned,
        isLocked: d.isLocked,
        createdAt: d.createdAt,
        updatedAt: d.updatedAt,
        user: {
          id: d.user.id,
          name: d.user.name,
          image: d.user.image,
        },
        tool: d.tool ? {
          id: d.tool.id,
          name: d.tool.name,
          slug: d.tool.slug,
        } : null,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('获取讨论列表失败:', error);
    return NextResponse.json(
      { error: '获取讨论列表失败' },
      { status: 500 }
    );
  }
}

// POST /api/discussions - 创建新讨论
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
    const { title, content, category, toolId } = body;

    if (!title?.trim() || !content?.trim()) {
      return NextResponse.json(
        { error: '标题和内容不能为空' },
        { status: 400 }
      );
    }

    const validCategories = ['general', 'tool-review', 'feature-request', 'help'];
    if (category && !validCategories.includes(category)) {
      return NextResponse.json(
        { error: '无效的分类' },
        { status: 400 }
      );
    }

    const discussion = await prisma.discussion.create({
      data: {
        title: title.trim(),
        content: content.trim(),
        category: category || 'general',
        toolId: toolId || null,
        userId: session?.user?.id,
      },
      include: {
        user: {
          select: { id: true, name: true, image: true },
        },
      },
    });

    return NextResponse.json(
      {
        id: discussion.id,
        title: discussion.title,
        content: discussion.content,
        category: discussion.category,
        createdAt: discussion.createdAt,
        user: {
          id: discussion.user.id,
          name: discussion.user.name,
          image: discussion.user.image,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('创建讨论失败:', error);
    return NextResponse.json(
      { error: '创建讨论失败' },
      { status: 500 }
    );
  }
}
