import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

interface Tool {
  id: number
  name: string
  slug?: string
  category: string
  subcategory?: string
  pricing?: string
  rating?: number
  reviewCount?: number
  viewCount?: number
  clickCount?: number
  priceMonthly?: number
  priceYearly?: number
  createdAt?: string
  updatedAt?: string
  last_updated?: string
  isActive?: boolean
}

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

    // 查找目标工具
    const tool = activeTools.find(t =>
      (t.slug || t.name.toLowerCase().replace(/\s+/g, '-')) === slug
    )

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

    // 评价数据不可用（无数据库），返回空分布
    const ratingDistribution = [5, 4, 3, 2, 1].map(star => ({
      rating: star,
      count: 0
    }))

    // 获取同类目排名
    const categoryTools = activeTools
      .filter(t => t.category === tool.category)
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))

    const rank = categoryTools.findIndex(t => t.id === tool.id) + 1

    // 获取相关工具对比数据
    const relatedTools = categoryTools
      .filter(t => t.id !== tool.id)
      .slice(0, 5)
      .map(t => ({
        name: t.name,
        slug: t.slug || t.name.toLowerCase().replace(/\s+/g, '-'),
        rating: t.rating || 0,
        reviewCount: t.reviewCount || 0,
        pricing: t.pricing || 'unknown'
      }))

    // 计算流行度指标
    const viewCount = tool.viewCount || 0
    const clickCount = tool.clickCount || 0
    const rating = tool.rating || 0
    const popularityScore = (viewCount * 0.3 + clickCount * 0.7) * (rating / 5)

    // 获取价格历史（如果有）
    const pricingInsights = {
      currentPricing: tool.pricing || 'unknown',
      priceMonthly: tool.priceMonthly || 0,
      priceYearly: tool.priceYearly || 0,
      pricePosition: 'mid-range',
      valueForMoney: rating >= 4 ? 'excellent' : 'good'
    }

    return NextResponse.json({
      success: true,
      data: {
        tool: {
          id: tool.id,
          name: tool.name,
          slug: tool.slug || tool.name.toLowerCase().replace(/\s+/g, '-'),
          category: tool.category,
          subcategory: tool.subcategory || null
        },
        metrics: {
          views: viewCount,
          clicks: clickCount,
          clickThroughRate: viewCount > 0
            ? ((clickCount / viewCount) * 100).toFixed(2) + '%'
            : '0%',
          rating,
          reviewCount: tool.reviewCount || 0,
          popularityScore: popularityScore.toFixed(2)
        },
        ratingDistribution,
        ranking: {
          categoryRank: rank || categoryTools.length,
          totalInCategory: categoryTools.length,
          topInCategory: categoryTools.slice(0, 3).map(t => ({
            id: t.id,
            name: t.name,
            slug: t.slug || t.name.toLowerCase().replace(/\s+/g, '-'),
            rating: t.rating || 0,
            reviewCount: t.reviewCount || 0
          }))
        },
        pricing: pricingInsights,
        relatedTools,
        insights: {
          strengths: [],
          weaknesses: [],
          recommendations: []
        },
        meta: {
          lastUpdated: tool.updatedAt || tool.last_updated || new Date().toISOString(),
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
