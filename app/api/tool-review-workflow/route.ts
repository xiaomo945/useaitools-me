import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

// GET /api/tool-review-workflow - 获取评测工作流状态
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: '请先登录' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (user?.role !== 'admin') {
      return NextResponse.json(
        { error: '需要管理员权限' },
        { status: 403 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status'); // draft, published, all
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const where: any = {};

    if (status === 'draft') {
      where.blogPost = { isPublished: false };
    } else if (status === 'published') {
      where.blogPost = { isPublished: true };
    }

    const total = await prisma.toolReview.count({ where });

    const reviews = await prisma.toolReview.findMany({
      where,
      include: {
        blogPost: {
          select: {
            id: true,
            title: true,
            slug: true,
            isPublished: true,
            publishedAt: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        tool: {
          select: {
            id: true,
            name: true,
            slug: true,
            category: true,
            iconUrl: true,
          },
        },
        template: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    return NextResponse.json({
      reviews: reviews.map((review: any) => ({
        ...review,
        features: review.features ? JSON.parse(review.features) : [],
        pros: review.pros ? JSON.parse(review.pros) : [],
        cons: review.cons ? JSON.parse(review.cons) : [],
        ratings: review.ratings ? JSON.parse(review.ratings) : {},
        bestFor: review.bestFor ? JSON.parse(review.bestFor) : [],
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      stats: {
        total: await prisma.toolReview.count(),
        draft: await prisma.toolReview.count({ where: { blogPost: { isPublished: false } } }),
        published: await prisma.toolReview.count({ where: { blogPost: { isPublished: true } } }),
      },
    });
  } catch (error) {
    console.error('获取评测工作流失败:', error);
    return NextResponse.json(
      { error: '获取评测工作流失败' },
      { status: 500 }
    );
  }
}

// POST /api/tool-review-workflow - 创建新评测（工作流起点）
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: '请先登录' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (user?.role !== 'admin') {
      return NextResponse.json(
        { error: '需要管理员权限' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { toolId, templateId } = body;

    if (!toolId) {
      return NextResponse.json(
        { error: '缺少工具 ID' },
        { status: 400 }
      );
    }

    // 检查工具是否存在
    const tool = await prisma.tool.findUnique({
      where: { id: toolId },
    });

    if (!tool) {
      return NextResponse.json(
        { error: '工具不存在' },
        { status: 404 }
      );
    }

    // 检查是否已有评测
    const existingReview = await prisma.toolReview.findFirst({
      where: { toolId },
      include: { blogPost: true },
    });

    if (existingReview) {
      return NextResponse.json(
        { 
          error: '该工具已有评测',
          reviewId: existingReview.id,
          blogPostId: existingReview.blogPostId,
        },
        { status: 400 }
      );
    }

    // 获取默认模板
    let template = null;
    if (templateId) {
      template = await prisma.toolReviewTemplate.findUnique({
        where: { id: templateId },
      });
    } else {
      template = await prisma.toolReviewTemplate.findFirst({
        where: { isDefault: true },
      });
    }

    // 创建博客文章（草稿状态）
    const blogPost = await prisma.blogPost.create({
      data: {
        title: `${tool.name} 评测`,
        slug: `review-${tool.slug}-${Date.now()}`,
        excerpt: tool.description || `${tool.name} 的详细评测`,
        content: '',
        categoryId: 'review', // 需要确保这个分类存在
        authorId: session.user.id,
        isPublished: false,
        relatedToolIds: JSON.stringify([toolId]),
      },
    });

    // 创建工具评测
    const review = await prisma.toolReview.create({
      data: {
        blogPostId: blogPost.id,
        toolId,
        templateId: template?.id || null,
        overview: '',
        features: JSON.stringify([]),
        pros: JSON.stringify([]),
        cons: JSON.stringify([]),
        ratings: JSON.stringify({}),
        bestFor: JSON.stringify([]),
      },
      include: {
        blogPost: true,
        tool: true,
        template: true,
      },
    });

    return NextResponse.json({
      ...review,
      features: [],
      pros: [],
      cons: [],
      ratings: {},
      bestFor: [],
    }, { status: 201 });
  } catch (error) {
    console.error('创建评测失败:', error);
    return NextResponse.json(
      { error: '创建评测失败' },
      { status: 500 }
    );
  }
}
