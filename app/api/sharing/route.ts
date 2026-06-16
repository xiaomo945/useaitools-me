import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST /api/sharing - Record share action and award points
export async function POST(request: NextRequest) {
  try {
    const { toolId, toolName, platform, userId } = await request.json();

    if (!toolId || !platform) {
      return NextResponse.json(
        { error: 'Missing required fields: toolId, platform' },
        { status: 400 }
      );
    }

    // Award points for sharing
    const pointsAwarded = 10; // 10 points per share

    // Record share action
    await prisma.shareAction.create({
      data: {
        toolId: String(toolId),
        toolName,
        platform,
        userId,
        pointsAwarded,
        sharedAt: new Date(),
      },
    });

    // Update user points if userId provided
    if (userId) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          points: {
            increment: pointsAwarded,
          },
        },
      });
    }

    return NextResponse.json({
      success: true,
      pointsAwarded,
      message: 'Thanks for sharing! You earned 10 points.',
    });
  } catch (error) {
    console.error('Failed to record share action:', error);
    return NextResponse.json(
      { error: 'Failed to record share action' },
      { status: 500 }
    );
  }
}

// GET /api/sharing - Get sharing statistics
export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');

    if (userId) {
      // Get user's sharing stats
      const userShares = await prisma.shareAction.findMany({
        where: { userId },
        orderBy: { sharedAt: 'desc' },
      });

      const totalPoints = userShares.reduce((sum: number, share: { pointsAwarded: number }) => sum + share.pointsAwarded, 0);

      return NextResponse.json({
        totalShares: userShares.length,
        totalPoints,
        recentShares: userShares.slice(0, 10),
      });
    }

    // Get overall sharing stats
    const totalShares = await prisma.shareAction.count();

    const platformStats = await prisma.shareAction.groupBy({
      by: ['platform'],
      _count: {
        platform: true,
      },
    });

    const topSharedTools = await prisma.shareAction.groupBy({
      by: ['toolId', 'toolName'],
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

    return NextResponse.json({
      totalShares,
      platformStats: platformStats.map((p: { platform: string; _count: { platform: number } }) => ({
        platform: p.platform,
        shares: p._count.platform,
      })),
      topSharedTools,
    });
  } catch (error) {
    console.error('Failed to fetch sharing stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sharing statistics' },
      { status: 500 }
    );
  }
}
