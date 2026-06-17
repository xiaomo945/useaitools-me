import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

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

    // 从 JSON 文件加载工具数据
    const toolsPath = path.join(process.cwd(), 'data', 'tools.json')
    let tools: any[] = []
    
    if (fs.existsSync(toolsPath)) {
      const data = fs.readFileSync(toolsPath, 'utf-8')
      tools = JSON.parse(data)
    }

    // 查找目标工具
    const tool = tools.find(t => t.slug === slug && t.isActive !== false)

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

    // 获取相关推荐工具（同分类的其他工具）
    const relatedTools = tools
      .filter(t => 
        t.category === tool.category && 
        t.slug !== slug && 
        t.isActive !== false
      )
      .slice(0, 5)
      .map(t => ({
        id: t.id,
        name: t.name,
        slug: t.slug,
        description: t.description,
        iconUrl: t.iconUrl || t.icon,
        rating: t.rating,
        pricing: t.pricing
      }))

    return NextResponse.json({
      success: true,
      data: {
        tool: {
          ...tool,
          screenshotUrls: Array.isArray(tool.screenshotUrls) ? tool.screenshotUrls : [],
          tags: Array.isArray(tool.tags) ? tool.tags : [],
          features: Array.isArray(tool.features) ? tool.features : [],
          pros: Array.isArray(tool.pros) ? tool.pros : [],
          cons: Array.isArray(tool.cons) ? tool.cons : [],
          useCases: Array.isArray(tool.useCases) ? tool.useCases : []
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
