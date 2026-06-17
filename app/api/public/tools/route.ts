import { NextRequest, NextResponse } from 'next/server'
import toolsData from '@/data/tools.json'

interface Tool {
  id: number
  name: string
  slug?: string
  description: string
  category: string
  url: string
  affiliate_link?: string
  icon_url?: string
  pricing?: string
  rating?: number
  rating_count?: number
  [key: string]: any
}

/**
 * 公开 API - 获取工具列表
 * GET /api/public/tools
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20')))
    const category = searchParams.get('category')
    const search = searchParams.get('search')

    const tools = toolsData as Tool[]

    // Filter
    let filtered = tools
    if (category) {
      filtered = filtered.filter(t => t.category.toLowerCase() === category.toLowerCase())
    }
    if (search) {
      const term = search.toLowerCase()
      filtered = filtered.filter(t =>
        t.name.toLowerCase().includes(term) ||
        t.description.toLowerCase().includes(term) ||
        t.category.toLowerCase().includes(term)
      )
    }

    // Sort by name
    filtered.sort((a, b) => a.name.localeCompare(b.name))

    const total = filtered.length
    const skip = (page - 1) * limit
    const paged = filtered.slice(skip, skip + limit)

    // Extract categories with counts
    const categoryCounts = new Map<string, number>()
    tools.forEach(t => {
      if (t.category) {
        categoryCounts.set(t.category, (categoryCounts.get(t.category) || 0) + 1)
      }
    })

    const response = NextResponse.json({
      success: true,
      data: {
        tools: paged,
        categories: Array.from(categoryCounts.entries()).map(([name, count]) => ({ name, count })),
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNext: page * limit < total,
          hasPrev: page > 1
        }
      },
      meta: {
        timestamp: new Date().toISOString(),
        version: '1.0'
      }
    })
    response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600')
    return response
  } catch (error) {
    console.error('公开 API 获取工具列表失败:', error)
    return NextResponse.json(
      {
        success: false,
        error: '获取工具列表失败',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
