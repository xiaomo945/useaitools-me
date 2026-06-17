import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/tools/traffic - 获取所有工具的流量数据
export async function GET() {
  try {
    const tools = await prisma.tool.findMany({
      where: {
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        monthlyVisits: true,
        trafficRank: true,
        lastTrafficUpdate: true,
      },
      orderBy: {
        monthlyVisits: 'desc',
      },
    });

    return NextResponse.json({ tools });
  } catch (error) {
    console.error('Failed to fetch traffic data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch traffic data' },
      { status: 500 }
    );
  }
}

// POST /api/tools/traffic - 更新单个工具的流量数据
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { toolId, monthlyVisits, trafficRank } = body;

    if (!toolId) {
      return NextResponse.json(
        { error: 'toolId is required' },
        { status: 400 }
      );
    }

    const tool = await prisma.tool.update({
      where: { id: toolId },
      data: {
        monthlyVisits: monthlyVisits ?? null,
        trafficRank: trafficRank ?? null,
        lastTrafficUpdate: new Date(),
      },
    });

    return NextResponse.json({ tool });
  } catch (error) {
    console.error('Failed to update traffic data:', error);
    return NextResponse.json(
      { error: 'Failed to update traffic data' },
      { status: 500 }
    );
  }
}

// PUT /api/tools/traffic - 批量更新流量数据
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { updates } = body;

    if (!Array.isArray(updates)) {
      return NextResponse.json(
        { error: 'updates must be an array' },
        { status: 400 }
      );
    }

    const results = [];
    for (const update of updates) {
      const { toolId, monthlyVisits, trafficRank } = update;
      if (!toolId) continue;

      try {
        const tool = await prisma.tool.update({
          where: { id: toolId },
          data: {
            monthlyVisits: monthlyVisits ?? null,
            trafficRank: trafficRank ?? null,
            lastTrafficUpdate: new Date(),
          },
        });
        results.push({ toolId, success: true, tool });
      } catch (e) {
        results.push({ toolId, success: false, error: (e as Error).message });
      }
    }

    return NextResponse.json({ results, updated: results.filter(r => r.success).length });
  } catch (error) {
    console.error('Failed to batch update traffic data:', error);
    return NextResponse.json(
      { error: 'Failed to batch update traffic data' },
      { status: 500 }
    );
  }
}