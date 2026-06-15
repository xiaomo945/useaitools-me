import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * 公开 API - 工具数据分析
 * GET /api/public/analytics/tools/[slug] - 获取工具详细数据分析
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    // 获取工具基本信息
    const tool = await prisma.tool.findFirst({
      where: {
        slug,
        isActive: true
      },
      select: {
        id: true,
        name: true,
        slug: true,
        category: true,
        subcategory: true,
        pricing: true,
        priceMonthly: true,
        priceYearly: true,
        rating: true,
        reviewCount: true,
        viewCount: true,
        clickCount: true,
        createdAt: true,
        updatedAt: true
      }
    })

    if (!tool) {
      return NextResponse.json(
        {
          success: false,
          error: '工具未找到',
          slug
        },
        { status: 404 }
      )
    }

    // 获取评价统计
    const reviewStats = await prisma.review.groupBy({
      by: ['rating'],
      where: {
        toolId: tool.id,
        isApproved: true
      },
      _count: {
        rating: true
      }
    })

    const ratingDistribution = [5, 4, 3, 2, 1].map(star => {
      const stat = reviewStats.find((s: typeof reviewStats[number]) => s.rating === star)
      return {
        rating: star,
        count: stat?._count.rating || 0
      }
    })

    // 获取同类目排名
    const categoryRanking = await prisma.tool.findMany({
      where: {
        category: tool.category,
        isActive: true
      },
      orderBy: {
        rating: 'desc'
      },
      select: {
        id: true,
        name: true,
        slug: true,
        rating: true,
        reviewCount: true
      },
      take: 10
    })

    const rank = categoryRanking.findIndex((t: typeof categoryRanking[number]) => t.id === tool.id) + 1

    // 获取相关工具对比数据
    const relatedTools = await prisma.tool.findMany({
      where: {
        category: tool.category,
        isActive: true,
        id: { not: tool.id }
      },
      take: 5,
      select: {
        id: true,
        name: true,
        slug: true,
        rating: true,
        reviewCount: true,
        priceMonthly: true,
        priceYearly: true,
        pricing: true
      }
    })

    // 计算流行度指标
    const popularityScore = (tool.viewCount * 0.3 + tool.clickCount * 0.7) * (tool.rating / 5)

    // 获取价格历史（如果有）
    const pricingInsights = {
      currentPricing: tool.pricing,
      priceMonthly: tool.priceMonthly,
      priceYearly: tool.priceYearly,
      pricePosition: 'mid-range', // 可以后续根据同类目工具计算
      valueForMoney: tool.rating >= 4 ? 'excellent' : 'good'
    }

    return NextResponse.json({
      success: true,
      data: {
        tool: {
          id: tool.id,
          name: tool.name,
          slug: tool.slug,
          category: tool.category,
          subcategory: tool.subcategory
        },
        metrics: {
          views: tool.viewCount,
          clicks: tool.clickCount,
          clickThroughRate: tool.viewCount > 0 
            ? ((tool.clickCount / tool.viewCount) * 100).toFixed(2) + '%'
            : '0%',
          rating: tool.rating,
          reviewCount: tool.reviewCount,
          popularityScore: popularityScore.toFixed(2)
        },
        ratingDistribution,
        ranking: {
          categoryRank: rank,
          totalInCategory: categoryRanking.length,
          topInCategory: categoryRanking.slice(0, 3)
        },
        pricing: pricingInsights,
        relatedTools: relatedTools.map((rt: typeof relatedTools[number]) => ({
          name: rt.name,
          slug: rt.slug,
          rating: rt.rating,
          reviewCount: rt.reviewCount,
          pricing: rt.pricing
        })),
        insights: {
          strengths: [],
          weaknesses: [],
          recommendations: []
        },
        meta: {
          lastUpdated: tool.updatedAt,
          dataFreshness: 'real-time'
        }
      },
      meta: {
        timestamp: new Date().toISOString(),
        version: '1.0'
      }
    })
  } catch (error) {
    console.error('公开 API 获取工具数据分析失败:', error)
    return NextResponse.json(
      {
        success: false,
        error: '获取工具数据分析失败',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
