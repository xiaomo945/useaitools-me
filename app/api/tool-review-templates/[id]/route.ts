import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

// GET /api/tool-review-templates/[id] - 获取单个评测模板
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const template = await prisma.toolReviewTemplate.findUnique({
      where: { id },
    });

    if (!template) {
      return NextResponse.json(
        { error: '模板不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ...template,
      sections: JSON.parse(template.sections),
      ratingDimensions: template.ratingDimensions ? JSON.parse(template.ratingDimensions) : [],
    });
  } catch (error) {
    console.error('获取评测模板失败:', error);
    return NextResponse.json(
      { error: '获取评测模板失败' },
      { status: 500 }
    );
  }
}

// PUT /api/tool-review-templates/[id] - 更新评测模板（需要管理员权限）
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: '请先登录' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (user?.role !== 'admin') {
      return NextResponse.json(
        { error: '需要管理员权限' },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { name, description, sections, ratingDimensions, isActive, isDefault } = body;

    // 检查模板是否存在
    const existingTemplate = await prisma.toolReviewTemplate.findUnique({
      where: { id },
    });

    if (!existingTemplate) {
      return NextResponse.json(
        { error: '模板不存在' },
        { status: 404 }
      );
    }

    // 如果设置为默认模板，先取消其他默认模板
    if (isDefault && !existingTemplate.isDefault) {
      await prisma.toolReviewTemplate.updateMany({
        where: { 
          isDefault: true,
          id: { not: id }
        },
        data: { isDefault: false },
      });
    }

    const template = await prisma.toolReviewTemplate.update({
      where: { id },
      data: {
        name,
        description,
        sections: sections ? JSON.stringify(sections) : undefined,
        ratingDimensions: ratingDimensions ? JSON.stringify(ratingDimensions) : undefined,
        isActive,
        isDefault,
      },
    });

    return NextResponse.json({
      ...template,
      sections: JSON.parse(template.sections),
      ratingDimensions: template.ratingDimensions ? JSON.parse(template.ratingDimensions) : [],
    });
  } catch (error) {
    console.error('更新评测模板失败:', error);
    return NextResponse.json(
      { error: '更新评测模板失败' },
      { status: 500 }
    );
  }
}

// DELETE /api/tool-review-templates/[id] - 删除评测模板（需要管理员权限）
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: '请先登录' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (user?.role !== 'admin') {
      return NextResponse.json(
        { error: '需要管理员权限' },
        { status: 403 }
      );
    }

    const { id } = await params;

    // 检查模板是否存在
    const template = await prisma.toolReviewTemplate.findUnique({
      where: { id },
    });

    if (!template) {
      return NextResponse.json(
        { error: '模板不存在' },
        { status: 404 }
      );
    }

    // 检查是否有评测使用该模板
    const reviewCount = await prisma.toolReview.count({
      where: { templateId: id },
    });

    if (reviewCount > 0) {
      return NextResponse.json(
        { error: `该模板正在被 ${reviewCount} 个评测使用，无法删除` },
        { status: 400 }
      );
    }

    await prisma.toolReviewTemplate.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('删除评测模板失败:', error);
    return NextResponse.json(
      { error: '删除评测模板失败' },
      { status: 500 }
    );
  }
}
