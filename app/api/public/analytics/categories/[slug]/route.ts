import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

interface Tool {
  id: number
  name: string
  slug?: string
  category: string
  pricing?: string
  rating?: number
  reviewCount?: number
  viewCount?: number
  clickCount?: number
  priceMonthly?: number
  priceYearly?: number
  createdAt?: string
  last_updated?: string
  isActive?: boolean
}

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

    // 从 JSON 文件加载工具数据
    const toolsPath = path.join(process.cwd(), 'data', 'tools.json')
    if (!fs.existsSync(toolsPath)) {
      return NextResponse.json(
        { success: false, error: '工具数据文件未找到' },
        { status: 500 }
      )
    }

    const allTools: Tool[] = JSON.parse(fs.readFileSync(toolsPath, 'utf-8'))
    const activeTools = allTools.filter(t => t.isActive !== false)

    // 从工具数据中提取分类信息
    const categoryNames = Array.from(new Set(activeTools.map(t => t.category)))
    const matchedCategoryName = categoryNames.find(
      name => name.toLowerCase().replace(/\s+/g, '-') === slug.toLowerCase()
    )

    if (!matchedCategoryName) {
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
    const tools = activeTools.filter(t => t.category === matchedCategoryName)

    // 计算分类统计数据
    const totalTools = tools.length
    const avgRating = tools.length > 0
      ? tools.reduce((sum, t) => sum + (t.rating || 0), 0) / tools.length
      : 0
    const totalReviews = tools.reduce((sum, t) => sum + (t.reviewCount || 0), 0)
    const totalViews = tools.reduce((sum, t) => sum + (t.viewCount || 0), 0)
    const totalClicks = tools.reduce((sum, t) => sum + (t.clickCount || 0), 0)

    // 价格分布
    const paidTools = tools.filter(t => {
      const pricing = (t.pricing || '').toLowerCase()
      return pricing === 'paid' || pricing === 'premium'
    })
    const freeTools = tools.filter(t => (t.pricing || '').toLowerCase() === 'free')
    const freemiumTools = tools.filter(t => (t.pricing || '').toLowerCase() === 'freemium')

    // 价格统计
    const prices = paidTools
      .map(t => t.priceMonthly || 0)
      .filter(p => p > 0)
      .sort((a, b) => a - b)

    const priceStats = {
      min: prices.length > 0 ? prices[0] : 0,
      max: prices.length > 0 ? prices[prices.length - 1] : 0,
      avg: prices.length > 0 ? prices.reduce((sum, p) => sum + p, 0) / prices.length : 0,
      median: prices.length > 0 ? prices[Math.floor(prices.length / 2)] : 0
    }

    // 评分分布
    const ratingDistribution = [5, 4, 3, 2, 1].map(star => ({
      rating: star,
      count: tools.filter(t => Math.round(t.rating || 0) === star).length
    }))

    // 热门工具（按评分和评论数排序）
    const topTools = tools
      .sort((a, b) => ((b.rating || 0) * (b.reviewCount || 0)) - ((a.rating || 0) * (a.reviewCount || 0)))
      .slice(0, 10)
      .map(t => ({
        name: t.name,
        slug: t.slug || t.name.toLowerCase().replace(/\s+/g, '-'),
        rating: t.rating || 0,
        reviewCount: t.reviewCount || 0,
        pricing: t.pricing || 'unknown'
      }))

    // 最新工具
    const newestTools = tools
      .sort((a, b) => {
        const dateA = new Date(a.createdAt || a.last_updated || 0).getTime()
        const dateB = new Date(b.createdAt || b.last_updated || 0).getTime()
        return dateB - dateA
      })
      .slice(0, 5)
      .map(t => ({
        name: t.name,
        slug: t.slug || t.name.toLowerCase().replace(/\s+/g, '-'),
        rating: t.rating || 0,
        createdAt: t.createdAt || t.last_updated || new Date().toISOString()
      }))

    // 趋势分析
    const last30Days = new Date()
    last30Days.setDate(last30Days.getDate() - 30)

    const recentTools = tools.filter(t => {
      const dateStr = t.createdAt || t.last_updated
      if (!dateStr) return false
      return new Date(dateStr) > last30Days
    })
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
          id: slug,
          name: matchedCategoryName,
          slug,
          description: `${matchedCategoryName} 类 AI 工具合集`,
          icon: '📁'
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
