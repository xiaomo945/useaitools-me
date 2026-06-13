import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.name || typeof body.value !== 'number') {
      return NextResponse.json(
        { error: 'Invalid metrics data' },
        { status: 400 }
      );
    }

    // In production, you could send this to:
    // - Your database
    // - External analytics service (e.g., Google Analytics, Mixpanel)
    // - Logging service (e.g., Datadog, LogRocket)
    
    // For now, log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics]', {
        metric: body.name,
        value: body.value,
        url: body.url,
        timestamp: new Date(body.timestamp).toISOString(),
      });
    }

    // TODO: Implement persistent storage or forward to analytics service
    // Example: await db.webVitals.create({ data: body });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json(
      { error: 'Failed to process analytics data' },
      { status: 500 }
    );
  }
}
