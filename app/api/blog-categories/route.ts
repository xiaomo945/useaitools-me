import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/blog-categories - 获取所有博客分类
export async function GET() {
  try {
    const categories = await prisma.blogCategory.findMany({
      include: {
        _count: {
          select: {
            posts: {
              where: {
                isPublished: true,
              },
            },
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json({
      categories: categories.map((cat: any) => ({
        ...cat,
        postCount: cat._count.posts,
      })),
    });
  } catch (error) {
    console.error('获取博客分类失败:', error);
    return NextResponse.json(
      { error: '获取博客分类失败' },
      { status: 500 }
    );
  }
}
