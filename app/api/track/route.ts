import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const {
      affiliateLinkId,
      toolId,
      toolName,
      destination,
    }: {
      affiliateLinkId?: string;
      toolId?: string;
      toolName?: string;
      destination?: string;
    } = body;

    const userAgent = request.headers.get('user-agent') || '';
    const referer = request.headers.get('referer') || '';

    let targetLink: { id: string; affiliateUrl: string } | null = null;
    let fallbackUrl = destination || '';

    if (affiliateLinkId) {
      const link = await prisma.affiliateLink.findUnique({
        where: { id: affiliateLinkId, status: 'active' },
        select: { id: true, affiliateUrl: true, originalUrl: true },
      });
      if (link) {
        targetLink = { id: link.id, affiliateUrl: link.affiliateUrl };
        fallbackUrl = link.affiliateUrl || link.originalUrl || destination || '';
      }
    }

    if (!targetLink && toolName) {
      const link = await prisma.affiliateLink.findFirst({
        where: {
          toolName,
          status: 'active',
        },
        orderBy: { clickCount: 'desc' },
        take: 1,
        select: { id: true, affiliateUrl: true },
      });
      if (link) {
        targetLink = link;
        fallbackUrl = link.affiliateUrl || destination || '';
      }
    }

    if (targetLink) {
      await prisma.affiliateLink
        .update({
          where: { id: targetLink.id },
          data: {
            clickCount: { increment: 1 },
          },
        })
        .catch((e) => {
          console.error('Failed to update click count:', e);
        });
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('[Track]', {
        affiliateLinkId,
        toolId,
        toolName,
        userAgent: userAgent.slice(0, 80),
        referer,
        destination: fallbackUrl,
      });
    }

    return NextResponse.json({
      success: true,
      redirectUrl: fallbackUrl,
      tracked: !!targetLink,
    });
  } catch (error) {
    console.error('Track API error:', error);
    return NextResponse.json(
      { error: 'Failed to process tracking', redirectUrl: '' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const affiliateLinkId = searchParams.get('id') || '';
  const toolName = searchParams.get('tool') || '';
  const destination = searchParams.get('dest') || '';

  try {
    let targetLink: { id: string; affiliateUrl: string } | null = null;
    let redirectUrl = destination || '/';

    if (affiliateLinkId) {
      const link = await prisma.affiliateLink.findUnique({
        where: { id: affiliateLinkId, status: 'active' },
        select: { id: true, affiliateUrl: true, originalUrl: true },
      });
      if (link) {
        targetLink = { id: link.id, affiliateUrl: link.affiliateUrl };
        redirectUrl = link.affiliateUrl || link.originalUrl || destination || '/';
      }
    }

    if (!targetLink && toolName) {
      const link = await prisma.affiliateLink.findFirst({
        where: { toolName, status: 'active' },
        orderBy: { clickCount: 'desc' },
        take: 1,
        select: { id: true, affiliateUrl: true },
      });
      if (link) {
        targetLink = link;
        redirectUrl = link.affiliateUrl || destination || '/';
      }
    }

    if (targetLink) {
      await prisma.affiliateLink
        .update({
          where: { id: targetLink.id },
          data: { clickCount: { increment: 1 } },
        })
        .catch(() => undefined);
    }

    return NextResponse.redirect(redirectUrl || '/', { status: 302 });
  } catch (error) {
    console.error('Track GET error:', error);
    return NextResponse.redirect(destination || '/', { status: 302 });
  }
}
