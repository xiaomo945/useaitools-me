import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

type SponsoredSlotPayload = {
  id?: string;
  slotName?: string;
  title?: string;
  description?: string;
  url?: string;
  imageUrl?: string;
  price?: number | string;
  currency?: string;
  advertiser?: string;
  status?: string;
  startDate?: string | null;
  endDate?: string | null;
  priority?: number | string;
  category?: string;
};

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const slotName = searchParams.get('slotName') || '';
  const category = searchParams.get('category');
  const admin = searchParams.get('admin') === '1';

  try {
    if (admin) {
      const slots = await prisma.sponsoredSlot.findMany({
        orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
      });
      return NextResponse.json({ slots, success: true });
    }

    if (!slotName) {
      return NextResponse.json({ slot: null }, { status: 400 });
    }

    const now = new Date();
    const slots = await prisma.sponsoredSlot.findMany({
      where: {
        slotName,
        status: 'active',
        OR: [
          { startDate: null },
          { startDate: { lte: now } },
        ],
        AND: [
          {
            OR: [
              { endDate: null },
              { endDate: { gte: now } },
            ],
          },
        ],
      },
      orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
      take: 10,
    });

    let chosen: (typeof slots)[number] | null = null;
    if (slots.length === 0) {
      chosen = null;
    } else if (category) {
      const categoryMatches = slots.filter(
        (s: { category: string | null }) => s.category && s.category.toLowerCase() === category.toLowerCase()
      );
      chosen = categoryMatches[0] || slots[0];
    } else {
      const noCategorySlots = slots.filter((s: { category: string | null }) => !s.category);
      chosen = noCategorySlots[0] || slots[0];
    }

    return NextResponse.json({ slot: chosen, success: true });
  } catch (error) {
    console.error('SponsoredSlot GET error:', error);
    return NextResponse.json(
      { error: 'Failed to load sponsored slot', slot: null },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => ({}))) as SponsoredSlotPayload;

    const slotName = typeof body.slotName === 'string' ? body.slotName.trim() : '';
    const title = typeof body.title === 'string' ? body.title.trim() : '';
    const url = typeof body.url === 'string' ? body.url.trim() : '';

    if (!slotName || !title || !url) {
      return NextResponse.json(
        { error: 'slotName, title, and url are required' },
        { status: 400 }
      );
    }

    const slot = await prisma.sponsoredSlot.create({
      data: {
        slotName,
        title,
        description: typeof body.description === 'string' ? body.description.trim() || null : null,
        url,
        imageUrl: typeof body.imageUrl === 'string' ? body.imageUrl.trim() || null : null,
        price: typeof body.price === 'number' ? body.price : Number(body.price) || 0,
        currency: typeof body.currency === 'string' ? body.currency.trim() || 'USD' : 'USD',
        advertiser: typeof body.advertiser === 'string' ? body.advertiser.trim() || null : null,
        status: typeof body.status === 'string' ? body.status.trim() || 'active' : 'active',
        startDate: body.startDate ? new Date(body.startDate) : null,
        endDate: body.endDate ? new Date(body.endDate) : null,
        priority: typeof body.priority === 'number' ? body.priority : Number(body.priority) || 0,
        category: typeof body.category === 'string' ? body.category.trim() || null : null,
      },
    });

    return NextResponse.json({ success: true, slot });
  } catch (error) {
    console.error('SponsoredSlot POST error:', error);
    return NextResponse.json(
      { error: 'Failed to create sponsored slot' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => ({}))) as SponsoredSlotPayload;
    const id = body.id;

    if (!id || typeof id !== 'string') {
      return NextResponse.json(
        { error: 'Slot id is required' },
        { status: 400 }
      );
    }

    const updateData: Record<string, unknown> = {};
    if (body.slotName && typeof body.slotName === 'string')
      updateData.slotName = body.slotName.trim();
    if (body.title && typeof body.title === 'string')
      updateData.title = body.title.trim();
    if (typeof body.description === 'string')
      updateData.description = body.description.trim() || null;
    if (body.url && typeof body.url === 'string') updateData.url = body.url.trim();
    if (typeof body.imageUrl === 'string')
      updateData.imageUrl = body.imageUrl.trim() || null;
    if (body.price !== undefined && body.price !== null)
      updateData.price = typeof body.price === 'number' ? body.price : Number(body.price) || 0;
    if (body.currency && typeof body.currency === 'string')
      updateData.currency = body.currency.trim();
    if (typeof body.advertiser === 'string')
      updateData.advertiser = body.advertiser.trim() || null;
    if (body.status && typeof body.status === 'string')
      updateData.status = body.status.trim();
    if (body.startDate !== undefined)
      updateData.startDate = body.startDate ? new Date(body.startDate) : null;
    if (body.endDate !== undefined)
      updateData.endDate = body.endDate ? new Date(body.endDate) : null;
    if (body.priority !== undefined && body.priority !== null)
      updateData.priority = typeof body.priority === 'number' ? body.priority : Number(body.priority) || 0;
    if (typeof body.category === 'string')
      updateData.category = body.category.trim() || null;

    const slot = await prisma.sponsoredSlot.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, slot });
  } catch (error) {
    console.error('SponsoredSlot PUT error:', error);
    return NextResponse.json(
      { error: 'Failed to update sponsored slot' },
      { status: 500 }
    );
  }
}
