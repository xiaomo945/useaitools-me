import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

// GET /api/bookmarks - 获取用户收藏列表
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!(session?.user as any)?.id) {
      return NextResponse.json(
        { error: '请先登录' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = (page - 1) * limit

    const bookmarks = await prisma.bookmark.findMany({
      where: {
        userId: (session as any).user.id
      },
      include: {
        tool: {
          select: {
            id: true,
            name: true,
            slug: true,
            description: true,
            category: true,
            iconUrl: true,
            rating: true,
            pricing: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip,
      take: limit
    })

    const total = await prisma.bookmark.count({
      where: {
        userId: (session as any).user.id
      }
    })

    return NextResponse.json({
      bookmarks,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('获取收藏列表失败:', error)
    return NextResponse.json(
      { error: '获取收藏列表失败' },
      { status: 500 }
    )
  }
}

// POST /api/bookmarks - 添加收藏
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!(session?.user as any)?.id) {
      return NextResponse.json(
        { error: '请先登录' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { toolId } = body

    if (!toolId) {
      return NextResponse.json(
        { error: '工具ID不能为空' },
        { status: 400 }
      )
    }

    // 检查是否已收藏
    const existing = await prisma.bookmark.findUnique({
      where: {
        userId_toolId: {
          userId: (session as any).user.id,
          toolId
        }
      }
    })

    if (existing) {
      return NextResponse.json(
        { error: '已收藏该工具' },
        { status: 400 }
      )
    }

    // 检查工具是否存在
    const tool = await prisma.tool.findUnique({
      where: { id: toolId }
    })

    if (!tool) {
      return NextResponse.json(
        { error: '工具不存在' },
        { status: 404 }
      )
    }

    // 创建收藏
    const bookmark = await prisma.bookmark.create({
      data: {
        userId: (session as any).user.id,
        toolId
      },
      include: {
        tool: {
          select: {
            id: true,
            name: true,
            slug: true,
            description: true,
            category: true,
            iconUrl: true,
            rating: true,
            pricing: true
          }
        }
      }
    })

    return NextResponse.json(bookmark, { status: 201 })
  } catch (error) {
    console.error('添加收藏失败:', error)
    return NextResponse.json(
      { error: '添加收藏失败' },
      { status: 500 }
    )
  }
}

// DELETE /api/bookmarks - 取消收藏
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!(session?.user as any)?.id) {
      return NextResponse.json(
        { error: '请先登录' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const toolId = searchParams.get('toolId')

    if (!toolId) {
      return NextResponse.json(
        { error: '工具ID不能为空' },
        { status: 400 }
      )
    }

    // 检查是否已收藏
    const existing = await prisma.bookmark.findUnique({
      where: {
        userId_toolId: {
          userId: (session as any).user.id,
          toolId
        }
      }
    })

    if (!existing) {
      return NextResponse.json(
        { error: '未收藏该工具' },
        { status: 404 }
      )
    }

    // 删除收藏
    await prisma.bookmark.delete({
      where: {
        userId_toolId: {
          userId: (session as any).user.id,
          toolId
        }
      }
    })

    return NextResponse.json({ message: '已取消收藏' })
  } catch (error) {
    console.error('取消收藏失败:', error)
    return NextResponse.json(
      { error: '取消收藏失败' },
      { status: 500 }
    )
  }
}
