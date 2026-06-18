import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

// GET /api/tools/[id] - 获取单个工具
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const tool = await prisma.tool.findUnique({
      where: { id },
      include: {
        reviews: {
          where: { isApproved: true },
          include: {
            user: {
              select: {
                name: true,
                image: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    })

    if (!tool) {
      return NextResponse.json(
        { error: '工具不存在' },
        { status: 404 }
      )
    }

    // 增加浏览次数
    await prisma.tool.update({
      where: { id },
      data: { viewCount: { increment: 1 } }
    })

    return NextResponse.json(tool)
  } catch (error) {
    console.error('获取工具详情失败:', error)
    return NextResponse.json(
      { error: '获取工具详情失败' },
      { status: 500 }
    )
  }
}

// PUT /api/tools/[id] - 更新工具（仅管理员）
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
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
      where: { id: session?.user?.id }
    })

    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: '权限不足' },
        { status: 403 }
      )
    }

    const body = await request.json()

    // 检查工具是否存在
    const existing = await prisma.tool.findUnique({
      where: { id }
    })

    if (!existing) {
      return NextResponse.json(
        { error: '工具不存在' },
        { status: 404 }
      )
    }

    // 如果名称改变，需要更新 slug
    let slug = existing.slug
    if (body.name && body.name !== existing.name) {
      slug = body.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
      
      // 检查新 slug 是否已存在
      const slugExists = await prisma.tool.findUnique({
        where: { slug }
      })
      
      if (slugExists && slugExists.id !== id) {
        return NextResponse.json(
          { error: '工具名称已存在' },
          { status: 400 }
        )
      }
    }

    // 更新工具
    const tool = await prisma.tool.update({
      where: { id },
      data: {
        name: body.name,
        slug,
        description: body.description,
        longDescription: body.longDescription,
        category: body.category,
        subcategory: body.subcategory,
        url: body.url,
        affiliateUrl: body.affiliateUrl,
        iconUrl: body.iconUrl,
        screenshotUrls: body.screenshotUrls ? JSON.stringify(body.screenshotUrls) : existing.screenshotUrls,
        videoUrl: body.videoUrl,
        pricing: body.pricing,
        priceMonthly: body.priceMonthly,
        priceYearly: body.priceYearly,
        rating: body.rating,
        reviewCount: body.reviewCount,
        isActive: body.isActive,
        isFeatured: body.isFeatured,
        isStaffPick: body.isStaffPick,
        tags: body.tags ? JSON.stringify(body.tags) : existing.tags,
        features: body.features ? JSON.stringify(body.features) : existing.features,
        pros: body.pros ? JSON.stringify(body.pros) : existing.pros,
        cons: body.cons ? JSON.stringify(body.cons) : existing.cons
      }
    })

    return NextResponse.json(tool)
  } catch (error) {
    console.error('更新工具失败:', error)
    return NextResponse.json(
      { error: '更新工具失败' },
      { status: 500 }
    )
  }
}

// DELETE /api/tools/[id] - 删除工具（仅管理员）
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
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
      where: { id: session?.user?.id }
    })

    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: '权限不足' },
        { status: 403 }
      )
    }

    // 检查工具是否存在
    const existing = await prisma.tool.findUnique({
      where: { id }
    })

    if (!existing) {
      return NextResponse.json(
        { error: '工具不存在' },
        { status: 404 }
      )
    }

    // 软删除（设置为不活跃）
    await prisma.tool.update({
      where: { id },
      data: { isActive: false }
    })

    return NextResponse.json({ message: '工具已删除' })
  } catch (error) {
    console.error('删除工具失败:', error)
    return NextResponse.json(
      { error: '删除工具失败' },
      { status: 500 }
    )
  }
}
