import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

// GET /api/history - 获取用户浏览历史
export async function GET() {
  try {
    const session = await auth();
    
    if (!(session?.user as any)?.id) {
      return NextResponse.json(
        { error: '请先登录' },
        { status: 401 }
      );
    }

    // 获取用户最近浏览的工具（通过 viewCount 和书签推断）
    const bookmarkedTools = await prisma.bookmark.findMany({
      where: { userId: (session as any).user.id },
      include: { tool: true },
      orderBy: { createdAt: 'desc' },
      take: 50
    });

    // 获取用户评价过的工具
    const reviewedTools = await prisma.review.findMany({
      where: { userId: (session as any).user.id },
      include: { tool: true },
      orderBy: { createdAt: 'desc' },
      take: 50
    });

    // 合并并去重
    const historyMap = new Map<string, {
      tool: any;
      lastAccessed: Date;
      accessType: string;
    }>();

    bookmarkedTools.forEach((b: any) => {
      historyMap.set(b.tool.id, {
        tool: b.tool,
        lastAccessed: b.createdAt,
        accessType: 'bookmarked'
      });
    });

    reviewedTools.forEach((r: any) => {
      const existing = historyMap.get(r.tool.id);
      if (!existing || r.createdAt > existing.lastAccessed) {
        historyMap.set(r.tool.id, {
          tool: r.tool,
          lastAccessed: r.createdAt,
          accessType: 'reviewed'
        });
      }
    });

    // 转换为数组并排序
    const history = Array.from(historyMap.values())
      .sort((a, b) => b.lastAccessed.getTime() - a.lastAccessed.getTime())
      .map((item: any) => ({
        id: parseInt(item.tool.id),
        name: item.tool.name,
        category: item.tool.category,
        description: item.tool.description,
        url: item.tool.url,
        affiliate_link: item.tool.affiliateUrl || '',
        icon_url: item.tool.iconUrl || '',
        rating: item.tool.rating,
        rating_count: item.tool.reviewCount,
        lastAccessed: item.lastAccessed,
        accessType: item.accessType
      }));

    return NextResponse.json({ history });
  } catch (error) {
    console.error('获取浏览历史失败:', error);
    return NextResponse.json(
      { error: '获取浏览历史失败' },
      { status: 500 }
    );
  }
}

// POST /api/history - 记录浏览历史
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
      data: { viewCount: { increment: 1 } }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('记录浏览历史失败:', error);
    return NextResponse.json(
      { error: '记录浏览历史失败' },
      { status: 500 }
    );
  }
}
