import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const period = searchParams.get('period') || '30d';

    // Calculate date range
    const days = period === '7d' ? 7 : period === '30d' ? 30 : 90;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Fetch interaction data
    const interactions = await prisma.userInteraction.findMany({
      where: {
        createdAt: {
          gte: startDate,
        },
      },
      select: {
        actionType: true,
        toolId: true,
        createdAt: true,
      },
    });

    // Calculate funnel stages
    const pageViews = interactions.filter((i: any) => i.actionType === 'page_view').length;
    const toolClicks = interactions.filter((i: any) => i.actionType === 'tool_click').length;
    const affiliateClicks = interactions.filter((i: any) => i.actionType === 'affiliate_click').length;
    const toolDetailViews = interactions.filter((i: any) => i.actionType === 'tool_detail').length;

    // Calculate conversion rates
    const homepageToToolRate = pageViews > 0 ? (toolDetailViews / pageViews) * 100 : 0;
    const toolToAffiliateRate = toolDetailViews > 0 ? (affiliateClicks / toolDetailViews) * 100 : 0;
    const overallRate = pageViews > 0 ? (affiliateClicks / pageViews) * 100 : 0;

    const stages = [
      {
        id: 'homepage',
        name: '首页访问',
        count: pageViews,
        conversionRate: 100,
        icon: 'Users',
        color: 'bg-blue-600',
      },
      {
        id: 'tool_detail',
        name: '工具详情页',
        count: toolDetailViews,
        conversionRate: homepageToToolRate,
        icon: 'MousePointer',
        color: 'bg-indigo-600',
      },
      {
        id: 'tool_click',
        name: '工具点击',
        count: toolClicks,
        conversionRate: toolDetailViews > 0 ? (toolClicks / toolDetailViews) * 100 : 0,
        icon: 'ExternalLink',
        color: 'bg-purple-600',
      },
      {
        id: 'affiliate_click',
        name: '联盟链接点击',
        count: affiliateClicks,
        conversionRate: toolToAffiliateRate,
        icon: 'DollarSign',
        color: 'bg-emerald-600',
      },
    ];

    return NextResponse.json({ stages });
  } catch (error) {
    console.error('Funnel API error:', error);
    return NextResponse.json(
      {
        stages: [
          {
            id: 'homepage',
            name: '首页访问',
            count: 0,
            conversionRate: 100,
            icon: 'Users',
            color: 'bg-blue-600',
          },
          {
            id: 'tool_detail',
            name: '工具详情页',
            count: 0,
            conversionRate: 0,
            icon: 'MousePointer',
            color: 'bg-indigo-600',
          },
          {
            id: 'tool_click',
            name: '工具点击',
            count: 0,
            conversionRate: 0,
            icon: 'ExternalLink',
            color: 'bg-purple-600',
          },
          {
            id: 'affiliate_click',
            name: '联盟链接点击',
            count: 0,
            conversionRate: 0,
            icon: 'DollarSign',
            color: 'bg-emerald-600',
          },
        ],
      },
      { status: 200 }
    );
  }
}
