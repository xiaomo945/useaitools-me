import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

// GET /api/tools - 获取工具列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const sortBy = searchParams.get('sortBy') || 'name'
    const sortOrder = searchParams.get('sortOrder') || 'asc'

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
        { description: { contains: search } }
      ]
    }

    // 获取工具列表
    const tools = await prisma.tool.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        [sortBy]: sortOrder
      }
    })

    // 获取总数
    const total = await prisma.tool.count({ where })

    return NextResponse.json({
      tools,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('获取工具列表失败:', error)
    return NextResponse.json(
      { error: '获取工具列表失败' },
      { status: 500 }
    )
  }
}

// POST /api/tools - 创建新工具（仅管理员）
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json(
        { error: '未授权' },
        { status: 401 }
      )
    }

    // 检查是否为管理员
    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    })

    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: '权限不足' },
        { status: 403 }
      )
    }

    const body = await request.json()

    // 验证必填字段
    if (!body.name || !body.description || !body.category || !body.url) {
      return NextResponse.json(
        { error: '缺少必填字段' },
        { status: 400 }
      )
    }

    // 生成 slug
    const slug = body.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')

    // 检查 slug 是否已存在
    const existing = await prisma.tool.findUnique({
      where: { slug }
    })

    if (existing) {
      return NextResponse.json(
        { error: '工具名称已存在' },
        { status: 400 }
      )
    }

    // 创建工具
    const tool = await prisma.tool.create({
      data: {
        name: body.name,
        slug,
        description: body.description,
        longDescription: body.longDescription || body.description,
        categoryName: body.category,
        subcategory: body.subcategory,
        url: body.url,
        affiliateUrl: body.affiliateUrl,
        iconUrl: body.iconUrl,
        screenshotUrls: body.screenshotUrls ? JSON.stringify(body.screenshotUrls) : null,
        videoUrl: body.videoUrl,
        pricing: body.pricing || 'FREE',
        priceMonthly: body.priceMonthly,
        priceYearly: body.priceYearly,
        rating: body.rating || 0,
        reviewCount: body.reviewCount || 0,
        isActive: body.isActive !== false,
        isFeatured: body.isFeatured || false,
        isStaffPick: body.isStaffPick || false,
        tags: body.tags ? JSON.stringify(body.tags) : null,
        features: body.features ? JSON.stringify(body.features) : null,
        pros: body.pros ? JSON.stringify(body.pros) : null,
        cons: body.cons ? JSON.stringify(body.cons) : null
      }
    })

    return NextResponse.json(tool, { status: 201 })
  } catch (error) {
    console.error('创建工具失败:', error)
    return NextResponse.json(
      { error: '创建工具失败' },
      { status: 500 }
    )
  }
}
