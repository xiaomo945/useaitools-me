import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

// GET /api/tool-review-templates - 获取所有评测模板
export async function GET() {
  try {
    const templates = await prisma.toolReviewTemplate.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      templates: templates.map(template => ({
        ...template,
        sections: JSON.parse(template.sections),
        ratingDimensions: template.ratingDimensions ? JSON.parse(template.ratingDimensions) : [],
      })),
    });
  } catch (error) {
    console.error('获取评测模板失败:', error);
    return NextResponse.json(
      { error: '获取评测模板失败' },
      { status: 500 }
    );
  }
}

// POST /api/tool-review-templates - 创建新评测模板（需要管理员权限）
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
    const { name, description, sections, ratingDimensions, isActive, isDefault } = body;

    if (!name || !sections) {
      return NextResponse.json(
        { error: '缺少必填字段' },
        { status: 400 }
      );
    }

    // 如果设置为默认模板，先取消其他默认模板
    if (isDefault) {
      await prisma.toolReviewTemplate.updateMany({
        where: { isDefault: true },
        data: { isDefault: false },
      });
    }

    const template = await prisma.toolReviewTemplate.create({
      data: {
        name,
        description,
        sections: JSON.stringify(sections),
        ratingDimensions: ratingDimensions ? JSON.stringify(ratingDimensions) : null,
        isActive: isActive ?? true,
        isDefault: isDefault ?? false,
      },
    });

    return NextResponse.json({
      ...template,
      sections: JSON.parse(template.sections),
      ratingDimensions: template.ratingDimensions ? JSON.parse(template.ratingDimensions) : [],
    }, { status: 201 });
  } catch (error) {
    console.error('创建评测模板失败:', error);
    return NextResponse.json(
      { error: '创建评测模板失败' },
      { status: 500 }
    );
  }
}
