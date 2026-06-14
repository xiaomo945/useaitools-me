import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

// PUT /api/submissions/[id] - 审核提交（批准或拒绝）
export async function PUT(
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
    const { status, reviewNote } = body

    // 验证状态
    if (!['approved', 'rejected'].includes(status)) {
      return NextResponse.json(
        { error: '无效的状态' },
        { status: 400 }
      )
    }

    // 检查提交是否存在
    const submission = await prisma.submission.findUnique({
      where: { id }
    })

    if (!submission) {
      return NextResponse.json(
        { error: '提交不存在' },
        { status: 404 }
      )
    }

    // 更新提交状态
    const updatedSubmission = await prisma.submission.update({
      where: { id },
      data: {
        status,
        reviewNote,
        reviewedBy: session.user.id,
        reviewedAt: new Date()
      }
    })

    // 如果批准，创建工具
    if (status === 'approved') {
      // 生成 slug
      const slug = submission.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')

      // 检查 slug 是否已存在
      const existingTool = await prisma.tool.findUnique({
        where: { slug }
      })

      if (!existingTool) {
        await prisma.tool.create({
          data: {
            name: submission.name,
            slug,
            description: submission.description,
            categoryName: submission.category,
            url: submission.url,
            pricing: 'Free',
            isActive: true
          }
        })
      }
    }

    return NextResponse.json(updatedSubmission)
  } catch (error) {
    console.error('审核提交失败:', error)
    return NextResponse.json(
      { error: '审核提交失败' },
      { status: 500 }
    )
  }
}
