import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q') || '';
    const category = searchParams.get('category');
    const pricing = searchParams.get('pricing');
    const minRating = parseFloat(searchParams.get('minRating') || '0');
    const sortBy = searchParams.get('sortBy') || 'rating';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');

    // 构建查询条件
    const where: any = {
      isActive: true
    };

    // 文本搜索
    if (query.trim()) {
      where.OR = [
        { name: { contains: query } },
        { description: { contains: query } },
        { category: { contains: query } },
      ];
    }

    // 分类过滤
    if (category) {
      where.category = category;
    }

    // 定价过滤
    if (pricing) {
      where.pricing = pricing;
    }

    // 最低评分
    if (minRating > 0) {
      where.rating = { gte: minRating };
    }

    // 排序
    let orderBy: any = { rating: 'desc' };
    if (sortBy === 'name') {
      orderBy = { name: 'asc' };
    } else if (sortBy === 'reviews') {
      orderBy = { reviewCount: 'desc' };
    }

    // 获取总数
    const total = await prisma.tool.count({ where });

    // 获取工具列表
    const tools = await prisma.tool.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit
    });

    // 转换为前端需要的格式
    const formattedTools = tools.map(tool => ({
      id: parseInt(tool.id),
      name: tool.name,
      description: tool.description,
      category: tool.categoryName,
      pricing: tool.pricing,
      url: tool.url,
      affiliate_link: tool.affiliateUrl || '',
      icon_url: tool.iconUrl || '',
      rating: tool.rating,
      rating_count: tool.reviewCount,
      best_for: tool.features ? JSON.parse(tool.features) : []
    }));

    return NextResponse.json({
      tools: formattedTools,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('搜索工具失败:', error);
    return NextResponse.json(
      { error: '搜索失败' },
      { status: 500 }
    );
  }
}
