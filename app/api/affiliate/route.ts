import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const links = await prisma.affiliateLink.findMany({
      orderBy: { clickCount: 'desc' },
    });
    return NextResponse.json({ links, success: true });
  } catch (error) {
    console.error('Affiliate GET error:', error);
    return NextResponse.json(
      { error: 'Failed to load links', links: [] },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));

    const toolName = typeof body.toolName === 'string' ? body.toolName.trim() : '';
    const affiliateUrl =
      typeof body.affiliateUrl === 'string' ? body.affiliateUrl.trim() : '';

    if (!toolName || !affiliateUrl) {
      return NextResponse.json(
        { error: 'toolName and affiliateUrl are required' },
        { status: 400 }
      );
    }

    const link = await prisma.affiliateLink.create({
      data: {
        toolName,
        toolId: body.toolId || null,
        linkType: body.linkType || 'signup',
        affiliateUrl,
        originalUrl: body.originalUrl || null,
        network: body.network || null,
        status: body.status || 'active',
        notes: body.notes || null,
      },
    });

    return NextResponse.json({ success: true, link });
  } catch (error) {
    console.error('Affiliate POST error:', error);
    return NextResponse.json(
      { error: 'Failed to create link' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const id = body.id;

    if (!id || typeof id !== 'string') {
      return NextResponse.json(
        { error: 'Link id is required' },
        { status: 400 }
      );
    }

    const updateData: Record<string, unknown> = {};
    if (body.toolName && typeof body.toolName === 'string')
      updateData.toolName = body.toolName.trim();
    if (body.toolId && typeof body.toolId === 'string')
      updateData.toolId = body.toolId.trim();
    if (body.linkType && typeof body.linkType === 'string')
      updateData.linkType = body.linkType;
    if (body.affiliateUrl && typeof body.affiliateUrl === 'string')
      updateData.affiliateUrl = body.affiliateUrl.trim();
    if (body.originalUrl && typeof body.originalUrl === 'string')
      updateData.originalUrl = body.originalUrl.trim();
    if (body.network && typeof body.network === 'string')
      updateData.network = body.network.trim();
    if (body.status && typeof body.status === 'string')
      updateData.status = body.status;
    if (body.notes && typeof body.notes === 'string')
      updateData.notes = body.notes.trim();
    if (typeof body.clickCount === 'number')
      updateData.clickCount = body.clickCount;
    if (typeof body.conversionCount === 'number')
      updateData.conversionCount = body.conversionCount;
    if (typeof body.revenue === 'number') updateData.revenue = body.revenue;

    const link = await prisma.affiliateLink.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, link });
  } catch (error) {
    console.error('Affiliate PUT error:', error);
    return NextResponse.json(
      { error: 'Failed to update link' },
      { status: 500 }
    );
  }
}
