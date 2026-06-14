import { NextResponse } from 'next/server';

type Subscriber = {
  email: string;
  name?: string;
  subscribedAt: string;
};

const subscribers = new Map<string, Subscriber>();

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(request: Request) {
  try {
    let body: any = {};

    const contentType = request.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      body = await request.json().catch(() => ({}));
    } else {
      const formData = await request.formData().catch(() => null);
      if (formData) {
        body = {
          email: formData.get('email')?.toString() || '',
          name: formData.get('name')?.toString() || '',
        };
      }
    }

    const email = (body.email as string)?.trim() || '';
    const name = (body.name as string)?.trim() || undefined;

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required.' },
        { status: 400 }
      );
    }

    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    const subscriber: Subscriber = {
      email,
      name,
      subscribedAt: new Date().toISOString(),
    };

    subscribers.set(email, subscriber);

    return NextResponse.json(
      {
        success: true,
        message: 'Subscribed! Check your inbox for confirmation.',
        subscriber: { email, name: subscriber.name },
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
