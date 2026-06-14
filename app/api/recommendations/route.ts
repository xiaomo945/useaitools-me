import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

// GET /api/recommendations - 获取用户推荐数据
export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: '请先登录' },
        { status: 401 }
      );
    }

    // 获取用户最近浏览的工具
    const recentViews = await prisma.tool.findMany({
      where: {
        isActive: true,
        id: {
          in: await getRecentlyViewedToolIds(session.user.id)
        }
      },
      take: 20,
      orderBy: {
        viewCount: 'desc'
      }
    });

    // 获取用户收藏的工具
    const bookmarkedTools = await prisma.bookmark.findMany({
      where: {
        userId: session.user.id
      },
      include: {
        tool: true
      },
      take: 10,
      orderBy: {
        createdAt: 'desc'
      }
    });

    // 统计用户偏好的分类
    const categoryPreferences: Record<string, number> = {};
    
    recentViews.forEach(tool => {
      categoryPreferences[tool.categoryName] = (categoryPreferences[tool.categoryName] || 0) + 1;
    });

    bookmarkedTools.forEach(bookmark => {
      const category = bookmark.tool.categoryName;
      categoryPreferences[category] = (categoryPreferences[category] || 0) + 2; // 收藏权重更高
    });

    // 获取推荐工具（基于用户偏好）
    const topCategories = Object.entries(categoryPreferences)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([category]) => category);

    const recommendedTools = await prisma.tool.findMany({
      where: {
        isActive: true,
        categoryName: {
          in: topCategories
        },
        id: {
          notIn: [
            ...recentViews.map(t => t.id),
            ...bookmarkedTools.map(b => b.tool.id)
          ]
        }
      },
      orderBy: {
        rating: 'desc'
      },
      take: 10
    });

    return NextResponse.json({
      recentViews: recentViews.map(tool => ({
        id: parseInt(tool.id),
        name: tool.name,
        category: tool.categoryName,
        rating: tool.rating,
        rating_count: tool.reviewCount
      })),
      bookmarkedTools: bookmarkedTools.map(b => ({
        id: parseInt(b.tool.id),
        name: b.tool.name,
        category: b.tool.categoryName,
        rating: b.tool.rating,
        rating_count: b.tool.reviewCount
      })),
      recommendedTools: recommendedTools.map(tool => ({
        id: parseInt(tool.id),
        name: tool.name,
        category: tool.categoryName,
        rating: tool.rating,
        rating_count: tool.reviewCount
      })),
      categoryPreferences
    });
  } catch (error) {
    console.error('获取推荐数据失败:', error);
    return NextResponse.json(
      { error: '获取推荐数据失败' },
      { status: 500 }
    );
  }
}

// POST /api/recommendations - 记录用户浏览行为
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
    const { toolId } = body;

    if (!toolId) {
      return NextResponse.json(
        { error: '缺少工具 ID' },
        { status: 400 }
      );
    }

    // 增加工具浏览次数
    await prisma.tool.update({
      where: { id: toolId.toString() },
      data: {
        viewCount: {
          increment: 1
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: '浏览行为已记录'
    });
  } catch (error) {
    console.error('记录浏览行为失败:', error);
    return NextResponse.json(
      { error: '记录浏览行为失败' },
      { status: 500 }
    );
  }
}

// 辅助函数：获取用户最近浏览的工具 ID
async function getRecentlyViewedToolIds(userId: string): Promise<string[]> {
  // 这里简化处理，实际应该有一个浏览历史表
  // 暂时返回用户收藏的工具 ID
  const bookmarks = await prisma.bookmark.findMany({
    where: { userId },
    select: { toolId: true },
    take: 20,
    orderBy: { createdAt: 'desc' }
  });
  
  return bookmarks.map(b => b.toolId);
}
