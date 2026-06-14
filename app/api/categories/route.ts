import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/categories - 获取分类列表
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const parentId = searchParams.get('parentId');
    const includeChildren = searchParams.get('includeChildren') === 'true';
    const isActive = searchParams.get('isActive');

    const where: any = {};

    if (parentId !== null) {
      where.parentId = parentId;
    }

    if (isActive !== null) {
      where.isActive = isActive === 'true';
    }

    const categories = includeChildren
      ? await prisma.category.findMany({
          where,
          include: {
            children: {
              where: { isActive: true },
              orderBy: { sortOrder: 'asc' },
            },
          },
          orderBy: { sortOrder: 'asc' },
        })
      : await prisma.category.findMany({
          where,
          orderBy: { sortOrder: 'asc' },
        });

    return NextResponse.json({ categories });
  } catch (error) {
    console.error('获取分类失败:', error);
    return NextResponse.json(
      { error: '获取分类失败' },
      { status: 500 }
    );
  }
}
