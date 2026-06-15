import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/advertisements - 获取广告位列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const position = searchParams.get('position');
    const status = searchParams.get('status');
    const adType = searchParams.get('adType');

    const where: any = {};
    if (position) where.position = position;
    if (status) where.status = status;
    if (adType) where.adType = adType;

    const advertisements = await prisma.advertisement.findMany({
      where,
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'desc' }
      ],
    });

    return NextResponse.json({ advertisements });
  } catch (error) {
    console.error('Failed to fetch advertisements:', error);
    return NextResponse.json(
      { error: 'Failed to fetch advertisements' },
      { status: 500 }
    );
  }
}

// POST /api/advertisements - 创建广告位
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      title,
      description,
      imageUrl,
      targetUrl,
      position,
      adType,
      status,
      startDate,
      endDate,
      price,
      currency,
      advertiser,
      priority,
      targetCategory,
    } = body;

    if (!name || !title || !targetUrl || !position || !adType) {
      return NextResponse.json(
        { error: 'Missing required fields: name, title, targetUrl, position, adType' },
        { status: 400 }
      );
    }

    const advertisement = await prisma.advertisement.create({
      data: {
        name,
        title,
        description,
        imageUrl,
        targetUrl,
        position,
        adType,
        status: status || 'active',
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        price: price || 0,
        currency: currency || 'USD',
        advertiser,
        priority: priority || 0,
        targetCategory,
      },
    });

    return NextResponse.json({ advertisement });
  } catch (error) {
    console.error('Failed to create advertisement:', error);
    return NextResponse.json(
      { error: 'Failed to create advertisement' },
      { status: 500 }
    );
  }
}
