import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const competitors = await prisma.competitor.findMany({
      orderBy: { trafficRank: 'asc' },
    });
    return NextResponse.json({ competitors });
  } catch (error) {
    console.error('Failed to fetch competitors:', error);
    return NextResponse.json({ competitors: [] });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, domain, trafficRank, monthlyVisits, topKeywords, strengths, weaknesses } = body;

    const competitor = await prisma.competitor.create({
      data: {
        name,
        domain,
        trafficRank,
        monthlyVisits,
        topKeywords: JSON.stringify(topKeywords || []),
        strengths: JSON.stringify(strengths || []),
        weaknesses: JSON.stringify(weaknesses || []),
      },
    });

    return NextResponse.json({ competitor });
  } catch (error) {
    console.error('Failed to create competitor:', error);
    return NextResponse.json({ error: 'Failed to create competitor' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    const competitor = await prisma.competitor.update({
      where: { id },
      data: {
        ...updateData,
        topKeywords: updateData.topKeywords ? JSON.stringify(updateData.topKeywords) : undefined,
        strengths: updateData.strengths ? JSON.stringify(updateData.strengths) : undefined,
        weaknesses: updateData.weaknesses ? JSON.stringify(updateData.weaknesses) : undefined,
      },
    });

    return NextResponse.json({ competitor });
  } catch (error) {
    console.error('Failed to update competitor:', error);
    return NextResponse.json({ error: 'Failed to update competitor' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    await prisma.competitor.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete competitor:', error);
    return NextResponse.json({ error: 'Failed to delete competitor' }, { status: 500 });
  }
}
