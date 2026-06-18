import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

// GET /api/tool-reviews/[id] - 获取单个工具评测
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const review = await prisma.toolReview.findUnique({
      where: { id },
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
            description: true,
            iconUrl: true,
            url: true,
            affiliateUrl: true,
            category: true,
            pricing: true,
            priceMonthly: true,
            priceYearly: true,
            rating: true,
            reviewCount: true,
          },
        },
        template: {
          select: {
            id: true,
            name: true,
            sections: true,
            ratingDimensions: true,
          },
        },
      },
    });

    if (!review) {
      return NextResponse.json(
        { error: '评测不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ...review,
      features: review.features ? JSON.parse(review.features) : [],
      pros: review.pros ? JSON.parse(review.pros) : [],
      cons: review.cons ? JSON.parse(review.cons) : [],
      ratings: review.ratings ? JSON.parse(review.ratings) : {},
      bestFor: review.bestFor ? JSON.parse(review.bestFor) : [],
      template: review.template ? {
        ...review.template,
        sections: JSON.parse(review.template.sections),
        ratingDimensions: review.template.ratingDimensions ? JSON.parse(review.template.ratingDimensions) : [],
      } : null,
    });
  } catch (error) {
    console.error('获取工具评测失败:', error);
    return NextResponse.json(
      { error: '获取工具评测失败' },
      { status: 500 }
    );
  }
}

// PUT /api/tool-reviews/[id] - 更新工具评测（需要管理员权限）
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

    const user = await prisma.user.findUnique({
      where: { id: session?.user?.id },
    });

    if (user?.role !== 'admin') {
      return NextResponse.json(
        { error: '需要管理员权限' },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const {
      overview,
      features,
      pros,
      cons,
      overallRating,
      ratings,
      recommendation,
      bestFor,
    } = body;

    const existingReview = await prisma.toolReview.findUnique({
      where: { id },
    });

    if (!existingReview) {
      return NextResponse.json(
        { error: '评测不存在' },
        { status: 404 }
      );
    }

    const review = await prisma.toolReview.update({
      where: { id },
      data: {
        overview,
        features: features ? JSON.stringify(features) : undefined,
        pros: pros ? JSON.stringify(pros) : undefined,
        cons: cons ? JSON.stringify(cons) : undefined,
        overallRating,
        ratings: ratings ? JSON.stringify(ratings) : undefined,
        recommendation,
        bestFor: bestFor ? JSON.stringify(bestFor) : undefined,
      },
    });

    return NextResponse.json({
      ...review,
      features: review.features ? JSON.parse(review.features) : [],
      pros: review.pros ? JSON.parse(review.pros) : [],
      cons: review.cons ? JSON.parse(review.cons) : [],
      ratings: review.ratings ? JSON.parse(review.ratings) : {},
      bestFor: review.bestFor ? JSON.parse(review.bestFor) : [],
    });
  } catch (error) {
    console.error('更新工具评测失败:', error);
    return NextResponse.json(
      { error: '更新工具评测失败' },
      { status: 500 }
    );
  }
}

// DELETE /api/tool-reviews/[id] - 删除工具评测（需要管理员权限）
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

    const user = await prisma.user.findUnique({
      where: { id: session?.user?.id },
    });

    if (user?.role !== 'admin') {
      return NextResponse.json(
        { error: '需要管理员权限' },
        { status: 403 }
      );
    }

    const { id } = await params;

    const existingReview = await prisma.toolReview.findUnique({
      where: { id },
    });

    if (!existingReview) {
      return NextResponse.json(
        { error: '评测不存在' },
        { status: 404 }
      );
    }

    await prisma.toolReview.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('删除工具评测失败:', error);
    return NextResponse.json(
      { error: '删除工具评测失败' },
      { status: 500 }
    );
  }
}
