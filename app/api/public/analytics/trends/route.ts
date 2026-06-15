import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * 公开 API - 趋势分析
 * GET /api/public/analytics/trends - 获取平台整体趋势数据
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || '30' // 默认30天
    const days = parseInt(period) || 30

    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    // 获取最近添加的工具趋势
    const recentTools = await prisma.tool.findMany({
      where: {
        createdAt: {
          gte: startDate
        },
        isActive: true
      },
      select: {
        id: true,
        name: true,
        category: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // 按日期分组统计
    const toolsByDate = new Map<string, number>()
    recentTools.forEach((tool: typeof recentTools[number]) => {
      const date = new Date(tool.createdAt).toISOString().split('T')[0]
      toolsByDate.set(date, (toolsByDate.get(date) || 0) + 1)
    })

    const trendData = Array.from(toolsByDate.entries())
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date))

    // 获取热门分类趋势
    const categoryStats = await prisma.tool.groupBy({
      by: ['category'],
      where: {
        isActive: true
      },
      _count: {
        category: true
      },
      orderBy: {
        _count: {
          category: 'desc'
        }
      },
      take: 10
    })

    const categoryTrends = categoryStats.map(stat => ({
      category: stat.category,
      count: stat._count.category,
      percentage: 0 // 后续计算
    }))

    // 计算百分比
    const totalTools = categoryTrends.reduce((sum, c) => sum + c.count, 0)
    categoryTrends.forEach(c => {
      c.percentage = parseFloat(((c.count / totalTools) * 100).toFixed(2))
    })

    // 获取评分趋势
    const highRatedTools = await prisma.tool.findMany({
      where: {
        createdAt: {
          gte: startDate
        },
        isActive: true,
        rating: {
          gte: 4.0
        }
      },
      select: {
        id: true,
        rating: true,
        reviewCount: true,
        createdAt: true
      }
    })

    const avgRatingTrend = highRatedTools.length > 0
      ? highRatedTools.reduce((sum, t) => sum + t.rating, 0) / highRatedTools.length
      : 0

    // 获取价格趋势
    const paidTools = await prisma.tool.findMany({
      where: {
        createdAt: {
          gte: startDate
        },
        isActive: true,
        pricing: 'paid'
      },
      select: {
        priceMonthly: true,
        priceYearly: true
      }
    })

    const avgPriceMonthly = paidTools.length > 0
      ? paidTools
          .map(t => t.priceMonthly || 0)
          .filter(p => p > 0)
          .reduce((sum, p) => sum + p, 0) / paidTools.length
      : 0

    // 获取用户互动趋势（评价数量）
    const recentReviews = await prisma.review.findMany({
      where: {
        createdAt: {
          gte: startDate
        },
        isApproved: true
      },
      select: {
        id: true,
        rating: true,
        createdAt: true
      }
    })

    const reviewsByDate = new Map<string, number>()
    recentReviews.forEach(review => {
      const date = new Date(review.createdAt).toISOString().split('T')[0]
      reviewsByDate.set(date, (reviewsByDate.get(date) || 0) + 1)
    })

    const reviewTrend = Array.from(reviewsByDate.entries())
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date))

    return NextResponse.json({
      success: true,
      data: {
        period: {
          days,
          startDate: startDate.toISOString(),
          endDate: new Date().toISOString()
        },
        toolsTrend: {
          totalNewTools: recentTools.length,
          dailyBreakdown: trendData,
          avgPerDay: trendData.length > 0 
            ? (recentTools.length / trendData.length).toFixed(2)
            : '0'
        },
        categoryTrends: {
          distribution: categoryTrends,
          totalCategories: categoryTrends.length
        },
        ratingTrend: {
          avgRating: avgRatingTrend.toFixed(2),
          highRatedCount: highRatedTools.length,
          qualityIndicator: avgRatingTrend >= 4 ? 'excellent' : avgRatingTrend >= 3 ? 'good' : 'average'
        },
        pricingTrend: {
          avgMonthlyPrice: avgPriceMonthly.toFixed(2),
          paidToolsCount: paidTools.length,
          priceLevel: avgPriceMonthly > 50 ? 'premium' : avgPriceMonthly > 20 ? 'mid-range' : 'budget-friendly'
        },
        engagementTrend: {
          totalReviews: recentReviews.length,
          dailyBreakdown: reviewTrend,
          avgPerDay: reviewTrend.length > 0
            ? (recentReviews.length / reviewTrend.length).toFixed(2)
            : '0'
        },
        insights: {
          growthRate: trendData.length > 1 
            ? (((trendData[trendData.length - 1]?.count || 0) - (trendData[0]?.count || 0)) / (trendData[0]?.count || 1) * 100).toFixed(2) + '%'
            : '0%',
          topCategory: categoryTrends[0]?.category || 'N/A',
          marketActivity: recentTools.length > 50 ? 'very active' : recentTools.length > 20 ? 'active' : 'stable'
        },
        meta: {
          lastUpdated: new Date().toISOString(),
          dataFreshness: 'real-time'
        }
      },
      meta: {
        timestamp: new Date().toISOString(),
        version: '1.0'
      }
    })
  } catch (error) {
    console.error('公开 API 获取趋势分析失败:', error)
    return NextResponse.json(
      {
        success: false,
        error: '获取趋势分析失败',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
