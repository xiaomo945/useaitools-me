import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => ({}))) as {
      sponsoredSlotId?: string;
      action?: string;
    };

    const sponsoredSlotId = body.sponsoredSlotId;
    const action = body.action;

    if (!sponsoredSlotId || typeof sponsoredSlotId !== 'string') {
      return NextResponse.json(
        { error: 'sponsoredSlotId is required' },
        { status: 400 }
      );
    }

    if (action !== 'click' && action !== 'view') {
      return NextResponse.json(
        { error: 'action must be "click" or "view"' },
        { status: 400 }
      );
    }

    const updateField = action === 'click' ? 'clickCount' : 'viewCount';

    await prisma.sponsoredSlot
      .update({
        where: { id: sponsoredSlotId },
        data: { [updateField]: { increment: 1 } },
      })
      .catch((e) => {
        console.error('Failed to update sponsored slot count:', e);
      });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Track sponsored error:', error);
    return NextResponse.json(
      { error: 'Failed to process tracking' },
      { status: 500 }
    );
  }
}
