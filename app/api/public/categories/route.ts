import { NextResponse } from 'next/server'
import toolsData from '@/data/tools.json'

interface Tool {
  id: number
  name: string
  category: string
  description: string
  url: string
  affiliate_link?: string
  icon_url?: string
  pricing?: string
  rating?: number
  rating_count?: number
  [key: string]: any
}

/**
 * 公开 API - 获取所有分类
 * GET /api/public/categories
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const includeCount = searchParams.get('includeCount') !== 'false'

    // 从工具数据中提取分类
    const tools = toolsData as Tool[]
    const categoryMap = new Map<string, { name: string; count: number }>()

    tools.forEach(tool => {
      const category = tool.category
      if (category) {
        const existing = categoryMap.get(category)
        if (existing) {
          existing.count++
        } else {
          categoryMap.set(category, { name: category, count: 1 })
        }
      }
    })

    const categories = Array.from(categoryMap.entries()).map(([slug, data]) => ({
      id: slug.toLowerCase(),
      name: data.name,
      slug: slug.toLowerCase(),
      description: `${data.name} AI tools`,
      icon: getCategoryIcon(data.name),
      toolCount: includeCount ? data.count : undefined
    }))

    return NextResponse.json({
      success: true,
      data: { categories, total: categories.length },
      meta: { timestamp: new Date().toISOString(), version: '1.0' }
    })
  } catch (error) {
    console.error('公开 API 获取分类列表失败:', error)
    return NextResponse.json(
      {
        success: false,
        error: '获取分类列表失败',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

function getCategoryIcon(category: string): string {
  const iconMap: Record<string, string> = {
    'Writing': '✍️',
    'Image': '🖼️',
    'Video': '🎥',
    'Audio': '🎵',
    'Productivity': '⚡',
    'Code': '💻'
  }
  return iconMap[category] || '🔧'
}
