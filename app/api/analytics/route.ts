import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// This endpoint receives Web Vitals metrics from the client (WebVitals.tsx).
// Vercel Analytics also collects these via the Vercel dashboard; this route
// persists them to the database for our own performance monitoring dashboard.
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.name || typeof body.value !== 'number') {
      return NextResponse.json(
        { error: 'Invalid metrics data' },
        { status: 400 }
      );
    }

    const validMetrics = ['LCP', 'FID', 'INP', 'CLS', 'TTFB', 'FCP'];
    const validRatings = ['good', 'needs-improvement', 'poor'];

    if (!validMetrics.includes(body.name)) {
      return NextResponse.json(
        { error: `Invalid metric name: ${body.name}` },
        { status: 400 }
      );
    }

    const rating = validRatings.includes(body.rating) ? body.rating : 'needs-improvement';
    const url = typeof body.url === 'string' ? body.url.slice(0, 500) : '';
    const userAgent = request.headers.get('user-agent')?.slice(0, 500) || null;

    // Persist to database (best-effort; never block on DB failure)
    try {
      await prisma.webVital.create({
        data: {
          metric: body.name,
          value: body.value,
          rating,
          url,
          userAgent,
        },
      });
    } catch (dbError) {
      console.error('[analytics] DB persist failed:', dbError);
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics]', {
        metric: body.name,
        value: body.value,
        rating,
        url,
        timestamp: new Date(body.timestamp).toISOString(),
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json(
      { error: 'Failed to process analytics data' },
      { status: 500 }
    );
  }
}

// GET: aggregated Core Web Vitals for the performance dashboard
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '7', 10);
    const since = new Date();
    since.setDate(since.getDate() - Math.min(Math.max(days, 1), 90));

    const metrics = ['LCP', 'FID', 'INP', 'CLS', 'TTFB', 'FCP'];

    const results = await Promise.all(
      metrics.map(async (metric) => {
        const records = await prisma.webVital.findMany({
          where: {
            metric,
            createdAt: { gte: since },
          },
          select: { value: true, rating: true },
        });

        if (records.length === 0) {
          return { metric, count: 0, p50: null, p75: null, p95: null, goodPct: null };
        }

        const values = records.map((r: { value: number; rating: string }) => r.value).sort((a: number, b: number) => a - b);
        const goodCount = records.filter((r: { value: number; rating: string }) => r.rating === 'good').length;

        const percentile = (p: number) => {
          const idx = Math.ceil((p / 100) * values.length) - 1;
          return values[Math.max(0, idx)];
        };

        return {
          metric,
          count: records.length,
          p50: percentile(50),
          p75: percentile(75),
          p95: percentile(95),
          goodPct: Math.round((goodCount / records.length) * 1000) / 10,
        };
      })
    );

    return NextResponse.json({
      period: { days, since: since.toISOString() },
      metrics: results,
    });
  } catch (error) {
    console.error('Failed to fetch Web Vitals:', error);
    return NextResponse.json(
      { error: 'Failed to fetch performance metrics' },
      { status: 500 }
    );
  }
}
