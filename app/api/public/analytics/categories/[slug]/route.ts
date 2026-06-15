import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * 公开 API - 分类数据分析
 * GET /api/public/analytics/categories/[slug] - 获取分类详细数据分析
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    // 获取分类信息
    const category = await prisma.category.findFirst({
      where: {
        slug,
        isActive: true
      }
    })

    if (!category) {
      return NextResponse.json(
        {
          success: false,
          error: '分类未找到',
          slug
        },
        { status: 404 }
      )
    }

    // 获取该分类下的所有工具
    const tools = await prisma.tool.findMany({
      where: {
        category: category.name,
        isActive: true
      },
      select: {
        id: true,
        name: true,
        slug: true,
        rating: true,
        reviewCount: true,
        viewCount: true,
        clickCount: true,
        pricing: true,
        priceMonthly: true,
        priceYearly: true,
        createdAt: true
      }
    })

    // 计算分类统计数据
    const totalTools = tools.length
    const avgRating = tools.length > 0
      ? tools.reduce((sum: number, t: typeof tools[number]) => sum + t.rating, 0) / tools.length
      : 0
    const totalReviews = tools.reduce((sum: number, t: typeof tools[number]) => sum + t.reviewCount, 0)
    const totalViews = tools.reduce((sum: number, t: typeof tools[number]) => sum + t.viewCount, 0)
    const totalClicks = tools.reduce((sum: number, t: typeof tools[number]) => sum + t.clickCount, 0)

    // 价格分布
    type ToolItem = typeof tools[number]
    const paidTools = tools.filter((t: ToolItem) => t.pricing === 'paid' || t.pricing === 'freemium')
    const freeTools = tools.filter((t: ToolItem) => t.pricing === 'free')
    const freemiumTools = tools.filter((t: ToolItem) => t.pricing === 'freemium')

    // 价格统计
    const prices = paidTools
      .map((t: ToolItem) => t.priceMonthly || 0)
      .filter((p: number) => p > 0)
      .sort((a: number, b: number) => a - b)

    const priceStats = {
      min: prices.length > 0 ? prices[0] : 0,
      max: prices.length > 0 ? prices[prices.length - 1] : 0,
      avg: prices.length > 0 ? prices.reduce((sum: number, p: number) => sum + p, 0) / prices.length : 0,
      median: prices.length > 0 ? prices[Math.floor(prices.length / 2)] : 0
    }

    // 评分分布
    const ratingDistribution = [5, 4, 3, 2, 1].map(star => ({
      rating: star,
      count: tools.filter((t: ToolItem) => Math.round(t.rating) === star).length
    }))

    // 热门工具（按评分和评论数排序）
    const topTools = tools
      .sort((a: ToolItem, b: ToolItem) => (b.rating * b.reviewCount) - (a.rating * a.reviewCount))
      .slice(0, 10)
      .map((t: ToolItem) => ({
        name: t.name,
        slug: t.slug,
        rating: t.rating,
        reviewCount: t.reviewCount,
        pricing: t.pricing
      }))

    // 最新工具
    const newestTools = tools
      .sort((a: ToolItem, b: ToolItem) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
      .map((t: ToolItem) => ({
        name: t.name,
        slug: t.slug,
        rating: t.rating,
        createdAt: t.createdAt
      }))

    // 趋势分析
    const last30Days = new Date()
    last30Days.setDate(last30Days.getDate() - 30)

    const recentTools = tools.filter((t: ToolItem) => new Date(t.createdAt) > last30Days)
    const growthTrend = {
      newToolsLast30Days: recentTools.length,
      growthRate: totalTools > 0 ? ((recentTools.length / totalTools) * 100).toFixed(2) + '%' : '0%'
    }

    // 点击率分析
    const avgCTR = totalViews > 0
      ? ((totalClicks / totalViews) * 100).toFixed(2) + '%'
      : '0%'

    return NextResponse.json({
      success: true,
      data: {
        category: {
          id: category.id,
          name: category.name,
          slug: category.slug,
          description: category.description,
          icon: category.icon
        },
        metrics: {
          totalTools,
          avgRating: avgRating.toFixed(2),
          totalReviews,
          totalViews,
          totalClicks,
          avgClickThroughRate: avgCTR
        },
        pricing: {
          distribution: {
            free: freeTools.length,
            freemium: freemiumTools.length,
            paid: paidTools.length
          },
          stats: priceStats
        },
        ratingDistribution,
        topTools,
        newestTools,
        growthTrend,
        insights: {
          categoryMaturity: totalTools > 50 ? 'mature' : totalTools > 20 ? 'growing' : 'emerging',
          pricingInsight: priceStats.avg > 50 ? 'premium' : priceStats.avg > 20 ? 'mid-range' : 'budget-friendly',
          qualityLevel: avgRating >= 4 ? 'high' : avgRating >= 3 ? 'medium' : 'developing'
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
    console.error('公开 API 获取分类数据分析失败:', error)
    return NextResponse.json(
      {
        success: false,
        error: '获取分类数据分析失败',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
