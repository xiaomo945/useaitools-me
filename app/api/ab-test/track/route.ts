import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST /api/ab-test/track - Track CTA click for A/B test analysis
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { toolId, toolName, variant, color, position } = body;

    if (!toolId || !variant) {
      return NextResponse.json(
        { error: 'Missing required fields: toolId, variant' },
        { status: 400 }
      );
    }

    // Record click in database
    await prisma.cTAClick.create({
      data: {
        toolId,
        toolName,
        variant,
        color,
        position,
        clickedAt: new Date(),
      },
    });

    // Get current variant statistics
    const totalClicks = await prisma.cTAClick.count();
    const variantClicks = await prisma.cTAClick.count({
      where: { variant },
    });

    const allVariants = await prisma.cTAClick.groupBy({
      by: ['variant'],
      _count: {
        variant: true,
      },
    });

    const variantStats = allVariants.reduce((acc, curr) => {
      acc[curr.variant] = curr._count.variant;
      return acc;
    }, {} as Record<string, number>);

    return NextResponse.json({
      success: true,
      stats: {
        totalClicks,
        variantClicks,
        variantStats,
      },
    });
  } catch (error) {
    console.error('Failed to track CTA click:', error);
    return NextResponse.json(
      { error: 'Failed to track CTA click' },
      { status: 500 }
    );
  }
}

// GET /api/ab-test/track - Get A/B test statistics
export async function GET() {
  try {
    const totalClicks = await prisma.cTAClick.count();

    const variantStats = await prisma.cTAClick.groupBy({
      by: ['variant'],
      _count: {
        variant: true,
      },
    });

    const colorStats = await prisma.cTAClick.groupBy({
      by: ['color'],
      _count: {
        color: true,
      },
    });

    const positionStats = await prisma.cTAClick.groupBy({
      by: ['position'],
      _count: {
        position: true,
      },
    });

    // Get top performing tools per variant
    const topTools = await prisma.cTAClick.groupBy({
      by: ['toolId', 'toolName', 'variant'],
      _count: {
        toolId: true,
      },
      orderBy: {
        _count: {
          toolId: 'desc',
        },
      },
      take: 10,
    });

    // Get recent clicks (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentClicks = await prisma.cTAClick.count({
      where: {
        clickedAt: {
          gte: sevenDaysAgo,
        },
      },
    });

    // Calculate conversion rates per variant
    const variantData = variantStats.map((v) => ({
      variant: v.variant,
      clicks: v._count.variant,
      percentage: totalClicks > 0 ? (v._count.variant / totalClicks) * 100 : 0,
    }));

    return NextResponse.json({
      totalClicks,
      recentClicks,
      variantStats: variantData,
      colorStats: colorStats.map((c) => ({
        color: c.color,
        clicks: c._count.color,
        percentage: totalClicks > 0 ? (c._count.color / totalClicks) * 100 : 0,
      })),
      positionStats: positionStats.map((p) => ({
        position: p.position,
        clicks: p._count.position,
        percentage: totalClicks > 0 ? (p._count.position / totalClicks) * 100 : 0,
      })),
      topTools,
    });
  } catch (error) {
    console.error('Failed to fetch A/B test stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch A/B test stats' },
      { status: 500 }
    );
  }
}
