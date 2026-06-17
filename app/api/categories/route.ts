import { NextRequest, NextResponse } from 'next/server';
import toolsData from '@/data/tools.json';

interface Tool {
  id: number;
  name: string;
  category: string;
  description: string;
  url: string;
  affiliate_link?: string;
  icon_url?: string;
  pricing?: string;
  rating?: number;
  rating_count?: number;
  [key: string]: any;
}

// GET /api/categories - 获取分类列表
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const includeChildren = searchParams.get('includeChildren') === 'true';

    // 从工具数据中提取分类
    const tools = toolsData as Tool[];
    const categoryMap = new Map<string, { name: string; count: number }>();

    tools.forEach(tool => {
      const category = tool.category;
      if (category) {
        const existing = categoryMap.get(category);
        if (existing) {
          existing.count++;
        } else {
          categoryMap.set(category, { name: category, count: 1 });
        }
      }
    });

    const categories = Array.from(categoryMap.entries()).map(([slug, data]) => ({
      id: slug.toLowerCase(),
      name: data.name,
      slug: slug.toLowerCase(),
      description: `${data.name} AI tools`,
      icon: getCategoryIcon(data.name),
      toolCount: data.count,
      parentId: null,
      sortOrder: 0,
      isActive: true,
      children: includeChildren ? [] : undefined
    }));

    const response = NextResponse.json({ categories });
    response.headers.set('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=7200');
    return response;
  } catch (error) {
    console.error('获取分类失败:', error);
    return NextResponse.json(
      { error: '获取分类失败' },
      { status: 500 }
    );
  }
}

function getCategoryIcon(category: string): string {
  const iconMap: Record<string, string> = {
    'Writing': '✍️',
    'Image': '🖼️',
    'Video': '🎥',
    'Audio': '🎵',
    'Productivity': '⚡',
    'Code': '💻'
  };
  return iconMap[category] || '🔧';
}
