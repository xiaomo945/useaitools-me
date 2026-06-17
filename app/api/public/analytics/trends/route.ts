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
  isActive?: boolean
}

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

    // 获取最近添加的工具趋势（使用 createdAt 或 last_updated）
    const recentTools = activeTools.filter(t => {
      const dateStr = t.createdAt || (t as any).last_updated
      if (!dateStr) return false
      return new Date(dateStr) >= startDate
    })

    // 按日期分组统计
    const toolsByDate = new Map<string, number>()
    recentTools.forEach((tool) => {
      const dateStr = tool.createdAt || (tool as any).last_updated
      const date = new Date(dateStr).toISOString().split('T')[0]
      toolsByDate.set(date, (toolsByDate.get(date) || 0) + 1)
    })

    const trendData = Array.from(toolsByDate.entries())
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date))

    // 获取热门分类趋势
    const categoryCountMap = new Map<string, number>()
    activeTools.forEach(t => {
      const count = categoryCountMap.get(t.category) || 0
      categoryCountMap.set(t.category, count + 1)
    })

    const categoryTrends = Array.from(categoryCountMap.entries())
      .map(([category, count]) => ({ category, count, percentage: 0 }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    // 计算百分比
    const totalTools = categoryTrends.reduce((sum, c) => sum + c.count, 0)
    categoryTrends.forEach(c => {
      c.percentage = parseFloat(((c.count / totalTools) * 100).toFixed(2))
    })

    // 获取评分趋势
    const highRatedTools = recentTools.filter(t => (t.rating || 0) >= 4.0)

    const avgRatingTrend = highRatedTools.length > 0
      ? highRatedTools.reduce((sum, t) => sum + (t.rating || 0), 0) / highRatedTools.length
      : 0

    // 获取价格趋势
    const paidTools = recentTools.filter(t => {
      const pricing = (t.pricing || '').toLowerCase()
      return pricing === 'paid' || pricing === 'premium'
    })

    const avgPriceMonthly = paidTools.length > 0
      ? paidTools
          .map(t => t.priceMonthly || 0)
          .filter(p => p > 0)
          .reduce((sum, p) => sum + p, 0) / paidTools.length
      : 0

    // 评价数据不可用（无数据库）
    const reviewTrend: Array<{ date: string; count: number }> = []

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
          totalReviews: 0,
          dailyBreakdown: reviewTrend,
          avgPerDay: '0'
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
