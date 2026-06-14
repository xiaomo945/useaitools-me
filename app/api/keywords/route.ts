import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const keywords = await prisma.keyword.findMany({
      orderBy: { updatedAt: 'desc' },
    });

    return NextResponse.json({ keywords });
  } catch (error) {
    console.error('Failed to fetch keywords:', error);
    return NextResponse.json({ keywords: [] }, { status: 200 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { keyword } = await request.json();

    if (!keyword || typeof keyword !== 'string') {
      return NextResponse.json(
        { error: 'Invalid keyword' },
        { status: 400 }
      );
    }

    // Simulate keyword data (in production, integrate with Google Search Console API)
    const keywordData = {
      keyword: keyword.toLowerCase().trim(),
      position: Math.floor(Math.random() * 50) + 1,
      previousPosition: Math.floor(Math.random() * 50) + 1,
      change: Math.floor(Math.random() * 20) - 10,
      url: `https://useaitools.me/blog/${keyword.toLowerCase().replace(/\s+/g, '-')}`,
      searchVolume: Math.floor(Math.random() * 10000) + 100,
      difficulty: Math.floor(Math.random() * 100),
    };

    const created = await prisma.keyword.create({
      data: keywordData,
    });

    return NextResponse.json({ keyword: created }, { status: 201 });
  } catch (error) {
    console.error('Failed to create keyword:', error);
    return NextResponse.json(
      { error: 'Failed to create keyword' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { keyword } = await request.json();

    if (!keyword || typeof keyword !== 'string') {
      return NextResponse.json(
        { error: 'Invalid keyword' },
        { status: 400 }
      );
    }

    await prisma.keyword.deleteMany({
      where: { keyword: keyword.toLowerCase().trim() },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete keyword:', error);
    return NextResponse.json(
      { error: 'Failed to delete keyword' },
      { status: 500 }
    );
  }
}
