import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/tool-updates?toolId=xxx - 获取工具更新记录
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const toolId = searchParams.get('toolId');
  const limit = parseInt(searchParams.get('limit') || '20');

  try {
    if (!toolId) {
      return NextResponse.json(
        { error: '缺少工具 ID' },
        { status: 400 }
      );
    }

    const updates = await prisma.toolUpdate.findMany({
      where: { toolId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return NextResponse.json({ updates });
  } catch (error) {
    console.error('获取工具更新记录失败:', error);
    return NextResponse.json(
      { error: '获取更新记录失败' },
      { status: 500 }
    );
  }
}

// POST /api/tool-updates - 创建工具更新记录（管理员）
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { toolId, title, content, type } = body;

    if (!toolId || !title || !content) {
      return NextResponse.json(
        { error: '缺少必填字段' },
        { status: 400 }
      );
    }

    const update = await prisma.toolUpdate.create({
      data: {
        toolId,
        title,
        content,
        type: type || 'feature',
      },
    });

    // TODO: 为订阅了该工具的用户创建通知
    // 这部分需要在用户订阅功能完成后实现

    return NextResponse.json({ update }, { status: 201 });
  } catch (error) {
    console.error('创建工具更新记录失败:', error);
    return NextResponse.json(
      { error: '创建更新记录失败' },
      { status: 500 }
    );
  }
}
