import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * 公开 API - 获取工具列表
 * GET /api/public/tools
 * 
 * 查询参数：
 * - page: 页码（默认 1）
 * - limit: 每页数量（默认 20，最大 100）
 * - category: 分类筛选
 * - search: 搜索关键词
 * - sortBy: 排序字段（name, createdAt, rating, clickCount）
 * - sortOrder: 排序方向（asc, desc）
 * 
 * 示例：
 * GET /api/public/tools?page=1&limit=10&category=writing&search=ai
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20')))
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const sortBy = searchParams.get('sortBy') || 'name'
    const sortOrder = searchParams.get('sortOrder') || 'asc'

    // 验证排序字段
    const validSortFields = ['name', 'createdAt', 'rating', 'clickCount', 'viewCount']
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'name'

    const skip = (page - 1) * limit

    // 构建查询条件
    const where: any = {
      isActive: true
    }

    if (category) {
      where.category = category
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
        { tags: { contains: search } }
      ]
    }

    // 获取工具列表
    const tools = await prisma.tool.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        [sortField]: sortOrder
      },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        longDescription: true,
        category: true,
        subcategory: true,
        url: true,
        iconUrl: true,
        screenshotUrls: true,
        pricing: true,
        priceMonthly: true,
        priceYearly: true,
        rating: true,
        reviewCount: true,
        tags: true,
        features: true,
        pros: true,
        cons: true,
        createdAt: true,
        updatedAt: true
      }
    })

    // 获取总数
    const total = await prisma.tool.count({ where })

    // 获取所有分类（用于筛选）
    const categories = await prisma.tool.groupBy({
      by: ['category'],
      where: { isActive: true },
      _count: { category: true }
    })

    return NextResponse.json({
      success: true,
      data: {
        tools: tools.map((tool: typeof tools[number]) => ({
          ...tool,
          screenshotUrls: tool.screenshotUrls ? JSON.parse(tool.screenshotUrls) : [],
          tags: tool.tags ? JSON.parse(tool.tags) : [],
          features: tool.features ? JSON.parse(tool.features) : [],
          pros: tool.pros ? JSON.parse(tool.pros) : [],
          cons: tool.cons ? JSON.parse(tool.cons) : []
        })),
        categories: categories.map((c: typeof categories[number]) => ({
          name: c.category,
          count: c._count.category
        })),
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
