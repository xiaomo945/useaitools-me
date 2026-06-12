import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

async function saveToSupabase(email: string): Promise<boolean> {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return false;
  }

  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/subscribers`, {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json',
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      Prefer: 'return=minimal',
    },
      body: JSON.stringify({ email, subscribed_at: new Date().toISOString() }),
  });

    if (response.status === 409) {
      throw new Error('DUPLICATE');
    }

    if (!response.ok) {
      throw new Error(`Supabase error: ${response.status}`);
    }
    return true;
  } catch (error: any) {
    if (error.message === 'DUPLICATE') {
      throw error;
    }
    console.error('Supabase save failed:', error);
    return false;
  }
}

function saveToLocal(email: string): { success: boolean; message: string; status?: number } {
  const subscribersPath = path.join(process.cwd(), 'data', 'subscribers.json');

  let subscribers: { email: string; subscribedAt: string }[] = [];

  if (fs.existsSync(subscribersPath)) {
    const data = fs.readFileSync(subscribersPath, 'utf-8');
    subscribers = JSON.parse(data);
  }

  if (subscribers.some(sub => sub.email === email)) {
      return { success: false, message: 'Email already subscribed', status: 409 };
    }

  subscribers.push({
      email,
      subscribedAt: new Date().toISOString()
    });

  fs.writeFileSync(subscribersPath, JSON.stringify(subscribers, null, 2));

  console.warn(
    '[Newsletter] Using local JSON storage — data will be lost on redeploy. ' +
    'Set SUPABASE_URL and SUPABASE_ANON_KEY to enable persistent storage.'
  );

  return { success: true, message: 'Thanks for subscribing!' };
}

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ success: false, message: 'Invalid email address' }, { status: 400 });
    }

    // Try Supabase first
    if (SUPABASE_URL && SUPABASE_ANON_KEY) {
      try {
        await saveToSupabase(email);
        return NextResponse.json({ success: true, message: 'Thanks for subscribing!' });
      } catch (error: any) {
        if (error.message === 'DUPLICATE') {
          return NextResponse.json({ success: false, message: 'Email already subscribed' }, { status: 409 });
        }
        // Fall through to local storage
      }
    }

    // Fallback to local storage
    const result = saveToLocal(email);
    return NextResponse.json(
      { success: result.success, message: result.message },
      { status: result.status || 200 }
    );
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}