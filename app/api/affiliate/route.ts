import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/affiliate - 获取所有联盟链接及分析数据
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const network = searchParams.get('network');
    const sortBy = searchParams.get('sortBy') || 'clickCount';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    const where: any = {};
    if (status) where.status = status;
    if (network) where.network = network;

    const orderBy: any = {};
    orderBy[sortBy] = sortOrder;

    const affiliateLinks = await prisma.affiliateLink.findMany({
      where,
      orderBy,
    });

    // 计算总体统计
    const totalClicks = affiliateLinks.reduce((sum: number, link: any) => sum + link.clickCount, 0);
    const totalConversions = affiliateLinks.reduce((sum: number, link: any) => sum + link.conversionCount, 0);
    const totalRevenue = affiliateLinks.reduce((sum: number, link: any) => sum + link.revenue, 0);
    const avgConversionRate = totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0;

    // 按网络分组统计
    const networkStats: Record<string, { clicks: number; conversions: number; revenue: number }> = {};
    affiliateLinks.forEach((link: any) => {
      const network = link.network || 'Unknown';
      if (!networkStats[network]) {
        networkStats[network] = { clicks: 0, conversions: 0, revenue: 0 };
      }
      networkStats[network].clicks += link.clickCount;
      networkStats[network].conversions += link.conversionCount;
      networkStats[network].revenue += link.revenue;
    });

    // 找出表现最好和最差的链接
    const sortedByPerformance = [...affiliateLinks].sort((a, b) => {
      const rateA = a.clickCount > 0 ? a.conversionCount / a.clickCount : 0;
      const rateB = b.clickCount > 0 ? b.conversionCount / b.clickCount : 0;
      return rateB - rateA;
    });

    const topPerformers = sortedByPerformance.slice(0, 5);
    const underperformers = sortedByPerformance.slice(-5).reverse();

    return NextResponse.json({
      affiliateLinks,
      stats: {
        totalLinks: affiliateLinks.length,
        totalClicks,
        totalConversions,
        totalRevenue,
        avgConversionRate,
      },
      networkStats,
      topPerformers,
      underperformers,
    });
  } catch (error) {
    console.error('Failed to fetch affiliate links:', error);
    return NextResponse.json(
      { error: 'Failed to fetch affiliate links' },
      { status: 500 }
    );
  }
}

// POST /api/affiliate - 创建新的联盟链接
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { toolId, toolName, linkType, affiliateUrl, originalUrl, network, notes } = body;

    if (!toolName || !affiliateUrl || !linkType) {
      return NextResponse.json(
        { error: 'Missing required fields: toolName, affiliateUrl, linkType' },
        { status: 400 }
      );
    }

    const affiliateLink = await prisma.affiliateLink.create({
      data: {
        toolId,
        toolName,
        linkType,
        affiliateUrl,
        originalUrl,
        network,
        notes,
      },
    });

    return NextResponse.json({ affiliateLink }, { status: 201 });
  } catch (error) {
    console.error('Failed to create affiliate link:', error);
    return NextResponse.json(
      { error: 'Failed to create affiliate link' },
      { status: 500 }
    );
  }
}
