import { NextRequest, NextResponse } from 'next/server';
import toolsData from '@/data/tools.json';

interface Tool {
  id: number;
  name: string;
  description: string;
  category: string;
  pricing?: string;
  url: string;
  affiliate_link?: string;
  icon_url?: string;
  rating?: number;
  rating_count?: number;
  best_for?: string[];
  [key: string]: any;
}

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

    const tools = toolsData as Tool[];

    // 过滤
    let filtered = tools.filter(tool => {
      // 文本搜索
      if (query.trim()) {
        const q = query.toLowerCase();
        const matchesQuery =
          tool.name.toLowerCase().includes(q) ||
          tool.description.toLowerCase().includes(q) ||
          tool.category.toLowerCase().includes(q);
        if (!matchesQuery) return false;
      }

      // 分类过滤
      if (category && tool.category !== category) return false;

      // 定价过滤
      if (pricing && tool.pricing !== pricing) return false;

      // 最低评分
      if (minRating > 0 && (!tool.rating || tool.rating < minRating)) return false;

      return true;
    });

    // 排序
    if (sortBy === 'name') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'reviews') {
      filtered.sort((a, b) => (b.rating_count || 0) - (a.rating_count || 0));
    } else {
      filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    // 分页
    const total = filtered.length;
    const startIndex = (page - 1) * limit;
    const paginatedTools = filtered.slice(startIndex, startIndex + limit);

    return NextResponse.json({
      tools: paginatedTools,
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
