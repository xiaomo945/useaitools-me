import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

// GET /api/blog/[slug] - 获取单个博客文章
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const post = await prisma.blogPost.findUnique({
      where: { slug },
      include: {
        category: true,
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    if (!post) {
      return NextResponse.json(
        { error: '文章不存在' },
        { status: 404 }
      );
    }

    // 增加浏览次数
    await prisma.blogPost.update({
      where: { id: post.id },
      data: { viewCount: { increment: 1 } },
    });

    return NextResponse.json({
      ...post,
      tags: post.tags ? JSON.parse(post.tags) : [],
      relatedToolIds: post.relatedToolIds ? JSON.parse(post.relatedToolIds) : [],
    });
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
  try {
    const session = await auth();

    if (!(session?.user as any)?.id) {
      return NextResponse.json(
        { error: '请先登录' },
        { status: 401 }
      );
    }

    // 检查是否是管理员
    const user = await prisma.user.findUnique({
      where: { id: (session as any).user.id },
    });

    if (user?.role !== 'admin') {
      return NextResponse.json(
        { error: '需要管理员权限' },
        { status: 403 }
      );
    }

    const { slug } = await params;
    const body = await request.json();

    const existingPost = await prisma.blogPost.findUnique({
      where: { slug },
    });

    if (!existingPost) {
      return NextResponse.json(
        { error: '文章不存在' },
        { status: 404 }
      );
    }

    const {
      title,
      excerpt,
      content,
      metaTitle,
      metaDescription,
      coverImage,
      coverImageAlt,
      categoryId,
      tags,
      relatedToolIds,
      isPublished,
      isFeatured,
    } = body;

    const post = await prisma.blogPost.update({
      where: { slug },
      data: {
        title,
        excerpt,
        content,
        metaTitle,
        metaDescription,
        coverImage,
        coverImageAlt,
        categoryId,
        tags: tags ? JSON.stringify(tags) : undefined,
        relatedToolIds: relatedToolIds ? JSON.stringify(relatedToolIds) : undefined,
        isPublished,
        isFeatured,
        publishedAt: isPublished && !existingPost.publishedAt ? new Date() : undefined,
      },
      include: {
        category: true,
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error('更新博客文章失败:', error);
    return NextResponse.json(
      { error: '更新博客文章失败' },
      { status: 500 }
    );
  }
}

// DELETE /api/blog/[slug] - 删除博客文章（需要管理员权限）
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await auth();

    if (!(session?.user as any)?.id) {
      return NextResponse.json(
        { error: '请先登录' },
        { status: 401 }
      );
    }

    // 检查是否是管理员
    const user = await prisma.user.findUnique({
      where: { id: (session as any).user.id },
    });

    if (user?.role !== 'admin') {
      return NextResponse.json(
        { error: '需要管理员权限' },
        { status: 403 }
      );
    }

    const { slug } = await params;

    await prisma.blogPost.delete({
      where: { slug },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('删除博客文章失败:', error);
    return NextResponse.json(
      { error: '删除博客文章失败' },
      { status: 500 }
    );
  }
}
