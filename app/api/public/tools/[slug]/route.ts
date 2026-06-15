import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * 公开 API - 获取单个工具详情
 * GET /api/public/tools/[slug]
 * 
 * 示例：
 * GET /api/public/tools/midjourney
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    const tool = await prisma.tool.findFirst({
      where: {
        slug,
        isActive: true
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

    // 获取相关推荐工具
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
        description: true,
        iconUrl: true,
        rating: true,
        pricing: true
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        tool: {
          ...tool,
          screenshotUrls: tool.screenshotUrls ? JSON.parse(tool.screenshotUrls) : [],
          tags: tool.tags ? JSON.parse(tool.tags) : [],
          features: tool.features ? JSON.parse(tool.features) : [],
          pros: tool.pros ? JSON.parse(tool.pros) : [],
          cons: tool.cons ? JSON.parse(tool.cons) : [],
          useCases: tool.useCases ? JSON.parse(tool.useCases) : []
        },
        relatedTools
      },
      meta: {
        timestamp: new Date().toISOString(),
        version: '1.0'
      }
    })
  } catch (error) {
    console.error('公开 API 获取工具详情失败:', error)
    return NextResponse.json(
      {
        success: false,
        error: '获取工具详情失败',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
