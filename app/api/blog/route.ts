import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

// GET /api/blog - 获取博客列表
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const tag = searchParams.get('tag');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const featured = searchParams.get('featured') === 'true';

    const where: any = {
      isPublished: true,
    };

    if (category) {
      where.category = {
        slug: category,
      };
    }

    if (tag) {
      where.tags = {
        contains: tag,
      };
    }

    if (featured) {
      where.isFeatured = true;
    }

    const total = await prisma.blogPost.count({ where });

    const posts = await prisma.blogPost.findMany({
      where,
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
      orderBy: {
        publishedAt: 'desc',
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    return NextResponse.json({
      posts: posts.map(post => ({
        ...post,
        tags: post.tags ? JSON.parse(post.tags) : [],
      })),
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

// POST /api/blog - 创建新博客文章（需要管理员权限）
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: '请先登录' },
        { status: 401 }
      );
    }

    // 检查是否是管理员
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (user?.role !== 'admin') {
      return NextResponse.json(
        { error: '需要管理员权限' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      title,
      slug,
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

    if (!title || !slug || !excerpt || !content || !categoryId) {
      return NextResponse.json(
        { error: '缺少必填字段' },
        { status: 400 }
      );
    }

    // 检查 slug 是否已存在
    const existingPost = await prisma.blogPost.findUnique({
      where: { slug },
    });

    if (existingPost) {
      return NextResponse.json(
        { error: '文章 slug 已存在' },
        { status: 400 }
      );
    }

    const post = await prisma.blogPost.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        metaTitle,
        metaDescription,
        coverImage,
        coverImageAlt,
        categoryId,
        tags: tags ? JSON.stringify(tags) : null,
        relatedToolIds: relatedToolIds ? JSON.stringify(relatedToolIds) : null,
        isPublished: isPublished || false,
        isFeatured: isFeatured || false,
        publishedAt: isPublished ? new Date() : null,
        authorId: session.user.id,
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

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error('创建博客文章失败:', error);
    return NextResponse.json(
      { error: '创建博客文章失败' },
      { status: 500 }
    );
  }
}
