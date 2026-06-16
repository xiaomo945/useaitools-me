import { NextRequest, NextResponse } from 'next/server';
import { sendWeeklyPicks } from '@/lib/email';
import tools from '@/data/tools.json';

// This endpoint sends weekly picks to all subscribers
// In production, this should be called by a cron job (e.g., Vercel Cron)
export async function POST(request: NextRequest) {
  // Verify it's an internal request (from cron or admin)
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Get all subscribers (from Supabase or local JSON)
    const subscribers = await getSubscribers();
    
    if (subscribers.length === 0) {
      return NextResponse.json({ message: 'No subscribers found' });
    }

    // Select 5 random tools with high ratings
    const topTools = tools
      .filter(t => t.rating && t.rating >= 4.0)
      .sort(() => Math.random() - 0.5)
      .slice(0, 5)
      .map(t => ({
        name: t.name,
        description: t.description.substring(0, 100) + '...',
        category: t.category,
        url: `https://useaitools.me/tools/${t.id}`,
      }));

    // Send weekly picks to each subscriber
    const results = await Promise.allSettled(
      subscribers.map(email => sendWeeklyPicks(email, topTools))
    );

    const successCount = results.filter(r => r.status === 'fulfilled').length;
    const failCount = results.length - successCount;

    return NextResponse.json({
      message: `Weekly picks sent to ${successCount} subscribers (${failCount} failed)`,
      successCount,
      failCount,
    });
  } catch (error) {
    console.error('[Weekly Picks] Send failed:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

async function getSubscribers(): Promise<string[]> {
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

  if (SUPABASE_URL && SUPABASE_ANON_KEY) {
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/subscribers?select=email`, {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        return data.map((row: any) => row.email);
      }
    } catch (error) {
      console.error('[Subscribers] Supabase fetch failed:', error);
    }
  }

  // Fallback to local JSON
  const fs = await import('fs');
  const path = await import('path');
  const subscribersPath = path.join(process.cwd(), 'data', 'subscribers.json');

  if (fs.existsSync(subscribersPath)) {
    const data = fs.readFileSync(subscribersPath, 'utf-8');
    const subscribers = JSON.parse(data);
    return subscribers.map((sub: any) => sub.email);
  }

  return [];
}
