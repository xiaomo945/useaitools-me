import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

// POST /api/submissions - 提交新工具
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: '请先登录' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { name, url, description, category, email } = body

    // 验证必填字段
    if (!name || !url || !description || !category || !email) {
      return NextResponse.json(
        { error: '缺少必填字段' },
        { status: 400 }
      )
    }

    // 验证 URL 格式
    try {
      new URL(url)
    } catch {
      return NextResponse.json(
        { error: 'URL 格式不正确' },
        { status: 400 }
      )
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: '邮箱格式不正确' },
        { status: 400 }
      )
    }

    // 检查是否已提交过相同 URL
    const existingSubmission = await prisma.submission.findFirst({
      where: {
        url,
        status: { in: ['pending', 'approved'] }
      }
    })

    if (existingSubmission) {
      return NextResponse.json(
        { error: '该工具已被提交，正在审核中或已通过' },
        { status: 400 }
      )
    }

    // 创建提交
    const submission = await prisma.submission.create({
      data: {
        name,
        url,
        description,
        category,
        email,
        status: 'pending',
        userId: session?.user?.id
      }
    })

    return NextResponse.json({
      success: true,
      submission
    }, { status: 201 })
  } catch (error) {
    console.error('提交工具失败:', error)
    return NextResponse.json(
      { error: '提交工具失败' },
      { status: 500 }
    )
  }
}

// GET /api/submissions - 获取提交列表（仅管理员）
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: '请先登录' },
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

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || 'pending'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = (page - 1) * limit

    const submissions = await prisma.submission.findMany({
      where: {
        status
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            image: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip,
      take: limit
    })

    const total = await prisma.submission.count({
      where: { status }
    })

    return NextResponse.json({
      submissions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('获取提交列表失败:', error)
    return NextResponse.json(
      { error: '获取提交列表失败' },
      { status: 500 }
    )
  }
}
