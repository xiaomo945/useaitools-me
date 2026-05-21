import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    
    if (!email || !email.includes('@')) {
      return NextResponse.json({ success: false, message: 'Invalid email address' }, { status: 400 });
    }

    const subscribersPath = path.join(process.cwd(), 'data', 'subscribers.json');
    
    let subscribers: { email: string; subscribedAt: string }[] = [];
    
    if (fs.existsSync(subscribersPath)) {
      const data = fs.readFileSync(subscribersPath, 'utf-8');
      subscribers = JSON.parse(data);
    }

    if (subscribers.some(sub => sub.email === email)) {
      return NextResponse.json({ success: false, message: 'Email already subscribed' }, { status: 409 });
    }

    subscribers.push({
      email,
      subscribedAt: new Date().toISOString()
    });

    fs.writeFileSync(subscribersPath, JSON.stringify(subscribers, null, 2));

    return NextResponse.json({ success: true, message: 'Thanks for subscribing!' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}