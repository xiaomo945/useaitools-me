import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendEmail, renderWelcomeEmail } from '@/lib/email';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function getClientIp(request: NextRequest): string | null {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  const realIp = request.headers.get('x-real-ip');
  return realIp || null;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const email = (body.email as string)?.trim().toLowerCase();
    const name = (body.name as string)?.trim() || null;
    const source = (body.source as string)?.trim() || 'website';

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email is required.' },
        { status: 400 }
      );
    }

    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    const ipAddress = getClientIp(request);
    const userAgent = request.headers.get('user-agent') || null;

    // Upsert subscription: if email exists and is unsubscribed, reactivate.
    const subscription = await prisma.siteSubscription.upsert({
      where: { email },
      update: {
        status: 'active',
        name: name || undefined,
        source,
        ipAddress,
        userAgent,
      },
      create: {
        email,
        name,
        source,
        ipAddress,
        userAgent,
        status: 'active',
      },
    });

    // Send welcome email (best-effort, never block subscription on email failure)
    const wasReactivation = subscription.createdAt !== subscription.updatedAt && subscription.status === 'active';
    if (!wasReactivation) {
      const emailPayload = renderWelcomeEmail(email, name || undefined);
      const result = await sendEmail(emailPayload);
      if (!result.success && process.env.NODE_ENV === 'development') {
        console.warn('[subscribe] Welcome email failed:', result.error);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Thanks for subscribing! Check your inbox for a welcome email.',
    });
  } catch (error) {
    console.error('Subscription failed:', error);
    return NextResponse.json(
      { success: false, message: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}

// GET: subscriber count (public, for social proof display)
export async function GET() {
  try {
    const count = await prisma.siteSubscription.count({
      where: { status: 'active' },
    });
    return NextResponse.json({ success: true, count });
  } catch (error) {
    console.error('Failed to fetch subscriber count:', error);
    return NextResponse.json(
      { success: false, count: 0 },
      { status: 500 }
    );
  }
}
