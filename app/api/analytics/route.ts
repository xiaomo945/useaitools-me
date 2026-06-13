import { NextRequest, NextResponse } from 'next/server';

// This endpoint receives Web Vitals metrics from the client.
// In production, Vercel Analytics (<Analytics /> in layout.tsx) already
// collects and persists Web Vitals automatically via the Vercel dashboard.
// This route serves as a fallback for non-Vercel environments and
// development logging.
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.name || typeof body.value !== 'number') {
      return NextResponse.json(
        { error: 'Invalid metrics data' },
        { status: 400 }
      );
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics]', {
        metric: body.name,
        value: body.value,
        url: body.url,
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
