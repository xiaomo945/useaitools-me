import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

// GET /api/tool-reviews - 获取工具评测列表
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const toolId = searchParams.get('toolId');
    const toolSlug = searchParams.get('toolSlug');
    const recommendation = searchParams.get('recommendation');
    const minRating = searchParams.get('minRating');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const where: any = {
      blogPost: {
        isPublished: true,
      },
    };

    if (toolId) {
      where.toolId = toolId;
    }

    if (toolSlug) {
      where.tool = {
        slug: toolSlug,
      };
    }

    if (recommendation) {
      where.recommendation = recommendation;
    }

    if (minRating) {
      where.overallRating = {
        gte: parseFloat(minRating),
      };
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
            excerpt: true,
            coverImage: true,
            publishedAt: true,
            viewCount: true,
            author: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
            category: {
              select: {
                name: true,
                slug: true,
              },
            },
          },
        },
        tool: {
          select: {
            id: true,
            name: true,
            slug: true,
            iconUrl: true,
            category: true,
            pricing: true,
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
        blogPost: {
          publishedAt: 'desc',
        },
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    return NextResponse.json({
      reviews: reviews.map(review => ({
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
    });
  } catch (error) {
    console.error('获取工具评测列表失败:', error);
    return NextResponse.json(
      { error: '获取工具评测列表失败' },
      { status: 500 }
    );
  }
}

// POST /api/tool-reviews - 创建工具评测（需要管理员权限）
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
    const {
      blogPostId,
      toolId,
      templateId,
      overview,
      features,
      pros,
      cons,
      overallRating,
      ratings,
      recommendation,
      bestFor,
    } = body;

    if (!blogPostId || !toolId || !overview) {
      return NextResponse.json(
        { error: '缺少必填字段' },
        { status: 400 }
      );
    }

    // 检查博客文章是否存在
    const blogPost = await prisma.blogPost.findUnique({
      where: { id: blogPostId },
    });

    if (!blogPost) {
      return NextResponse.json(
        { error: '博客文章不存在' },
        { status: 404 }
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
    const existingReview = await prisma.toolReview.findUnique({
      where: { blogPostId },
    });

    if (existingReview) {
      return NextResponse.json(
        { error: '该博客文章已有评测' },
        { status: 400 }
      );
    }

    const review = await prisma.toolReview.create({
      data: {
        blogPostId,
        toolId,
        templateId,
        overview,
        features: features ? JSON.stringify(features) : null,
        pros: pros ? JSON.stringify(pros) : null,
        cons: cons ? JSON.stringify(cons) : null,
        overallRating,
        ratings: ratings ? JSON.stringify(ratings) : null,
        recommendation,
        bestFor: bestFor ? JSON.stringify(bestFor) : null,
      },
      include: {
        blogPost: {
          select: {
            title: true,
            slug: true,
          },
        },
        tool: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
    });

    return NextResponse.json({
      ...review,
      features: review.features ? JSON.parse(review.features) : [],
      pros: review.pros ? JSON.parse(review.pros) : [],
      cons: review.cons ? JSON.parse(review.cons) : [],
      ratings: review.ratings ? JSON.parse(review.ratings) : {},
      bestFor: review.bestFor ? JSON.parse(review.bestFor) : [],
    }, { status: 201 });
  } catch (error) {
    console.error('创建工具评测失败:', error);
    return NextResponse.json(
      { error: '创建工具评测失败' },
      { status: 500 }
    );
  }
}
