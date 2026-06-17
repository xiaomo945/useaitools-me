import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * 公开 API - 获取所有分类
 * GET /api/public/categories
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const includeCount = searchParams.get('includeCount') !== 'false'

    if (includeCount) {
      const rawCategories = await prisma.category.findMany({
        where: { isActive: true },
        include: {
          _count: {
            select: {
              tools: { where: { isActive: true } }
            }
          }
        },
        orderBy: { name: 'asc' }
      })

      const categories = rawCategories.map((c: {
        id: string
        name: string
        slug: string
        description: string | null
        icon: string | null
        _count: { tools: number }
      }) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        description: c.description,
        icon: c.icon,
        toolCount: c._count.tools
      }))

      const response = NextResponse.json({
        success: true,
        data: { categories, total: categories.length },
        meta: { timestamp: new Date().toISOString(), version: '1.0' }
      })
      response.headers.set('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=7200')
      return response
    } else {
      const categories = await prisma.category.findMany({
        where: { isActive: true },
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          icon: true
        },
        orderBy: { name: 'asc' }
      })

      const response = NextResponse.json({
        success: true,
        data: { categories, total: categories.length },
        meta: { timestamp: new Date().toISOString(), version: '1.0' }
      })
      response.headers.set('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=7200')
      return response
    }
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
