import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

// GET /api/tools/[id]/reviews - 获取工具评价
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  
  try {
    const reviews = await prisma.review.findMany({
      where: {
        toolId: id,
        isApproved: true
      },
      include: {
        user: {
          select: {
            name: true,
            image: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(reviews)
  } catch (error) {
    console.error('获取评价失败:', error)
    return NextResponse.json(
      { error: '获取评价失败' },
      { status: 500 }
    )
  }
}

// POST /api/tools/[id]/reviews - 创建评价（需登录）
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: '请先登录' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { rating, title, content, pros, cons } = body

    // 验证必填字段
    if (!rating || !content) {
      return NextResponse.json(
        { error: '评分和内容不能为空' },
        { status: 400 }
      )
    }

    // 验证评分范围
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: '评分必须在 1-5 之间' },
        { status: 400 }
      )
    }

    // 检查是否已评价过
    const existingReview = await prisma.review.findUnique({
      where: {
        userId_toolId: {
          userId: session.user.id,
          toolId: id
        }
      }
    })

    if (existingReview) {
      return NextResponse.json(
        { error: '您已评价过该工具' },
        { status: 400 }
      )
    }

    // 创建评价
    const review = await prisma.review.create({
      data: {
        rating,
        title,
        content,
        pros: pros ? JSON.stringify(pros) : null,
        cons: cons ? JSON.stringify(cons) : null,
        isApproved: true, // 暂时自动通过，后续可改为需审核
        userId: session.user.id,
        toolId: id
      },
      include: {
        user: {
          select: {
            name: true,
            image: true
          }
        }
      }
    })

    // 更新工具的平均评分和评价数
    const stats = await prisma.review.aggregate({
      where: {
        toolId: id,
        isApproved: true
      },
      _avg: {
        rating: true
      },
      _count: true
    })

    await prisma.tool.update({
      where: { id },
      data: {
        rating: stats._avg.rating || 0,
        reviewCount: stats._count
      }
    })

    return NextResponse.json(review, { status: 201 })
  } catch (error) {
    console.error('创建评价失败:', error)
    return NextResponse.json(
      { error: '创建评价失败' },
      { status: 500 }
    )
  }
}
