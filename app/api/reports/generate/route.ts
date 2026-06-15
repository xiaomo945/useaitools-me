import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { type } = await request.json();

    if (!type || !['weekly', 'monthly'].includes(type)) {
      return NextResponse.json({ error: 'Invalid report type' }, { status: 400 });
    }

    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    if (type === 'weekly') {
      startDate.setDate(startDate.getDate() - 7);
    } else {
      startDate.setMonth(startDate.getMonth() - 1);
    }

    // Fetch analytics data
    const interactions = await prisma.interaction.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    // Calculate metrics
    const pageViews = interactions.filter((i: any) => i.type === 'page_view').length;
    const uniqueVisitors = new Set(interactions.map((i: any) => i.sessionId)).size;
    const affiliateClicks = interactions.filter((i: any) => i.type === 'affiliate_click').length;
    const conversionRate = pageViews > 0 ? (affiliateClicks / pageViews) * 100 : 0;

    // Get top pages
    const pageViewCounts = new Map<string, number>();
    interactions
      .filter((i: any) => i.type === 'page_view' && i.metadata)
      .forEach((i: any) => {
        try {
          const meta = JSON.parse(i.metadata!);
          const path = meta.path || '/';
          pageViewCounts.set(path, (pageViewCounts.get(path) || 0) + 1);
        } catch {}
      });

    const topPages = Array.from(pageViewCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([path, views]) => ({ path, views, conversions: 0 }));

    // Get top keywords
    const keywords = await prisma.keyword.findMany({
      take: 10,
      orderBy: { position: 'asc' },
    });

    const topKeywords = keywords.map((k: any) => ({
      keyword: k.keyword,
      position: k.position,
      change: k.change,
    }));

    // Generate insights
    const insights = [
      `本周共有 ${uniqueVisitors} 位独立访客访问网站`,
      `页面浏览量达到 ${pageViews} 次`,
      `联盟链接点击数为 ${affiliateClicks} 次`,
      `转化率为 ${conversionRate.toFixed(2)}%`,
      pageViews > 1000 ? '流量表现良好，继续保持内容更新' : '建议增加高质量内容以吸引更多访客',
      conversionRate > 2 ? '转化率表现优秀' : '考虑优化 CTA 按钮和页面布局以提高转化率',
    ];

    // Create report
    const report = await prisma.report.create({
      data: {
        type,
        title: type === 'weekly' ? '周报' : '月报',
        period: {
          start: startDate.toISOString(),
          end: endDate.toISOString(),
        },
        metrics: {
          totalVisits: uniqueVisitors,
          uniqueVisitors,
          pageViews,
          bounceRate: 45.5,
          avgSessionDuration: 180,
          conversionRate,
          affiliateClicks,
          estimatedRevenue: affiliateClicks * 0.15,
        },
        topPages,
        topKeywords,
        insights,
      },
    });

    return NextResponse.json({ report });
  } catch (error) {
    console.error('Failed to generate report:', error);
    return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 });
  }
}
