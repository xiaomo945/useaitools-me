import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, variant, sessionId, metadata } = body;

    if (!type || !variant || !sessionId) {
      return NextResponse.json(
        { error: 'Missing required fields: type, variant, sessionId' },
        { status: 400 }
      );
    }

    // Record the experiment interaction
    const interaction = await prisma.interaction.create({
      data: {
        type: `ab_test_${type}`,
        sessionId,
        metadata: JSON.stringify({
          variant,
          ...metadata,
        }),
      },
    });

    return NextResponse.json({ success: true, interactionId: interaction.id });
  } catch (error) {
    console.error('Failed to record AB test interaction:', error);
    return NextResponse.json(
      { error: 'Failed to record AB test interaction' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    const where: any = {};
    if (type) {
      where.type = `ab_test_${type}`;
    } else {
      where.type = {
        startsWith: 'ab_test_',
      };
    }

    const interactions = await prisma.interaction.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
      take: 1000,
    });

    // Group by variant and calculate metrics
    const variantStats: Record<string, { count: number; conversions: number }> = {};

    interactions.forEach((interaction: any) => {
      const metadata = JSON.parse(interaction.metadata || '{}');
      const variant = metadata.variant || 'unknown';

      if (!variantStats[variant]) {
        variantStats[variant] = { count: 0, conversions: 0 };
      }

      variantStats[variant].count++;

      // Check if this is a conversion event
      if (interaction.type.includes('conversion') || interaction.type.includes('click')) {
        variantStats[variant].conversions++;
      }
    });

    // Calculate conversion rates
    const results = Object.entries(variantStats).map(([variant, stats]) => ({
      variant,
      impressions: stats.count,
      conversions: stats.conversions,
      conversionRate: stats.count > 0 ? (stats.conversions / stats.count) * 100 : 0,
    }));

    return NextResponse.json({ results });
  } catch (error) {
    console.error('Failed to fetch AB test results:', error);
    return NextResponse.json(
      { error: 'Failed to fetch AB test results' },
      { status: 500 }
    );
  }
}
