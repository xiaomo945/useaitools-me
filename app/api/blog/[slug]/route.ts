import { NextRequest, NextResponse } from 'next/server';
import { blogPosts } from '@/data/blog-posts';

// GET /api/blog/[slug] - 获取单个博客文章
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const post = blogPosts.find(p => p.slug === slug);

    if (!post) {
      return NextResponse.json(
        { error: '文章不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error('获取博客文章失败:', error);
    return NextResponse.json(
      { error: '获取博客文章失败' },
      { status: 500 }
    );
  }
}

// PUT /api/blog/[slug] - 更新博客文章（需要管理员权限）
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  return NextResponse.json(
    { error: '静态博客系统不支持在线编辑' },
    { status: 403 }
  );
}

// DELETE /api/blog/[slug] - 删除博客文章（需要管理员权限）
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  return NextResponse.json(
    { error: '静态博客系统不支持在线删除' },
    { status: 403 }
  );
}
