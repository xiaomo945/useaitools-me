import { NextRequest, NextResponse } from 'next/server';
import { blogPosts } from '@/data/blog-posts';

// GET /api/blog - 获取博客列表
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const tag = searchParams.get('tag');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const featured = searchParams.get('featured') === 'true';

    let posts = [...blogPosts];

    // 按分类过滤
    if (category) {
      posts = posts.filter(post =>
        post.category?.toLowerCase() === category.toLowerCase()
      );
    }

    // 按标签过滤
    if (tag) {
      posts = posts.filter(post =>
        post.tags?.some(t => t.toLowerCase() === tag.toLowerCase())
      );
    }

    // 精选文章
    if (featured) {
      posts = posts.filter(post => post.featured === true);
    }

    // 按发布日期排序
    posts.sort((a, b) => {
      const dateA = a.date ? new Date(a.date).getTime() : 0;
      const dateB = b.date ? new Date(b.date).getTime() : 0;
      return dateB - dateA;
    });

    // 分页
    const total = posts.length;
    const startIndex = (page - 1) * limit;
    const paginatedPosts = posts.slice(startIndex, startIndex + limit);

    return NextResponse.json({
      posts: paginatedPosts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('获取博客列表失败:', error);
    return NextResponse.json(
      { error: '获取博客列表失败' },
      { status: 500 }
    );
  }
}
