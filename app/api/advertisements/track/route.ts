import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, action } = body;

    if (!id || !action) {
      return NextResponse.json(
        { error: 'Missing required fields: id, action' },
        { status: 400 }
      );
    }

    if (!['view', 'click'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action. Must be "view" or "click"' },
        { status: 400 }
      );
    }

    const advertisement = await prisma.advertisement.findUnique({
      where: { id },
    });

    if (!advertisement) {
      return NextResponse.json(
        { error: 'Advertisement not found' },
        { status: 404 }
      );
    }

    const updateData = action === 'view' 
      ? { viewCount: { increment: 1 } }
      : { clickCount: { increment: 1 } };

    await prisma.advertisement.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to track advertisement:', error);
    return NextResponse.json(
      { error: 'Failed to track advertisement' },
      { status: 500 }
    );
  }
}
