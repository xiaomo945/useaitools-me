import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

// GET /api/profile - 获取用户画像数据
export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: '请先登录' },
        { status: 401 }
      );
    }

    // 获取用户信息
    const user = await prisma.user.findUnique({
      where: { id: session?.user?.id },
      include: {
        reviews: {
          include: {
            tool: true
          },
          orderBy: { createdAt: 'desc' },
          take: 10
        },
        bookmarks: {
          include: {
            tool: true
          },
          orderBy: { createdAt: 'desc' },
          take: 20
        },
        submissions: {
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: '用户不存在' },
        { status: 404 }
      );
    }

    // 统计用户偏好分类
    const categoryStats: Record<string, number> = {};
    
    // 从收藏中统计
    user.bookmarks.forEach((bookmark: any) => {
      const category = bookmark.tool.category;
      categoryStats[category] = (categoryStats[category] || 0) + 2; // 收藏权重更高
    });

    // 从评价中统计
    user.reviews.forEach((review: any) => {
      const category = review.tool.category;
      categoryStats[category] = (categoryStats[category] || 0) + 1;
    });

    // 计算用户等级和积分
    const totalReviews = user.reviews.length;
    const totalBookmarks = user.bookmarks.length;
    const totalSubmissions = user.submissions.length;
    
    const points = totalReviews * 10 + totalBookmarks * 5 + totalSubmissions * 20;
    const level = Math.floor(points / 100) + 1;

    // 获取用户最喜欢的工具（基于评分）
    const favoriteTools = user.reviews
      .filter((r: any) => r.rating >= 4)
      .map((r: any) => ({
        id: parseInt(r.tool.id),
        name: r.tool.name,
        category: r.tool.category,
        rating: r.rating,
        review: r.content
      }))
      .slice(0, 5);

    // 获取用户最近的活动
    const recentActivity = [
      ...user.reviews.map((r: any) => ({
        type: 'review' as const,
        toolName: r.tool.name,
        toolId: parseInt(r.tool.id),
        date: r.createdAt,
        rating: r.rating
      })),
      ...user.bookmarks.map((b: any) => ({
        type: 'bookmark' as const,
        toolName: b.tool.name,
        toolId: parseInt(b.tool.id),
        date: b.createdAt
      })),
      ...user.submissions.map((s: any) => ({
        type: 'submission' as const,
        toolName: s.name,
        toolId: null,
        date: s.createdAt,
        status: s.status
      }))
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
     .slice(0, 10);

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        role: user.role,
        createdAt: user.createdAt
      },
      stats: {
        totalReviews,
        totalBookmarks,
        totalSubmissions,
        points,
        level
      },
      categoryPreferences: categoryStats,
      favoriteTools,
      recentActivity,
      bookmarkedTools: user.bookmarks.map((b: any) => ({
        id: parseInt(b.tool.id),
        name: b.tool.name,
        category: b.tool.category,
        rating: b.tool.rating,
        bookmarkedAt: b.createdAt
      })),
      reviewedTools: user.reviews.map((r: any) => ({
        id: parseInt(r.tool.id),
        name: r.tool.name,
        category: r.tool.category,
        rating: r.rating,
        review: r.content,
        reviewedAt: r.createdAt
      }))
    });
  } catch (error) {
    console.error('获取用户画像失败:', error);
    return NextResponse.json(
      { error: '获取用户画像失败' },
      { status: 500 }
    );
  }
}
