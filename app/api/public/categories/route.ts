import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * 公开 API - 获取所有分类
 * GET /api/public/categories
 * 
 * 查询参数：
 * - includeCount: 是否包含工具数量（默认 true）
 * 
 * 示例：
 * GET /api/public/categories
 * GET /api/public/categories?includeCount=false
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const includeCount = searchParams.get('includeCount') !== 'false'

    let categories
    if (includeCount) {
      // 获取分类并计算每个分类的工具数量
      categories = await prisma.category.findMany({
        where: {
          isActive: true
        },
        include: {
          _count: {
            select: {
              tools: {
                where: {
                  isActive: true
                }
              }
            }
          }
        },
        orderBy: {
          name: 'asc'
        }
      })

      // 转换数据格式
      categories = categories.map(category => ({
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description,
        icon: category.icon,
        toolCount: category._count.tools
      }))
    } else {
      categories = await prisma.category.findMany({
        where: {
          isActive: true
        },
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          icon: true
        },
        orderBy: {
          name: 'asc'
        }
      })
    }

    return NextResponse.json({
      success: true,
      data: {
        categories,
        total: categories.length
      },
      meta: {
        timestamp: new Date().toISOString(),
        version: '1.0'
      }
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
