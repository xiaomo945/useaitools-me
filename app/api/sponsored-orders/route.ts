import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import type { SponsoredOrder, SponsoredPackage } from '@prisma/client'

// POST /api/sponsored-orders - 创建赞助订单
export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { packageId, title, description, targetUrl, imageUrl } = body

    // 验证必填字段
    if (!packageId || !title || !targetUrl) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // 获取用户
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    // 获取套餐
    const pkg = await prisma.sponsoredPackage.findUnique({
      where: { id: packageId }
    })
    if (!pkg || !pkg.isActive) {
      return NextResponse.json(
        { success: false, error: 'Package not found or inactive' },
        { status: 404 }
      )
    }

    // 计算开始和结束日期
    const startDate = new Date()
    const endDate = new Date()
    endDate.setDate(endDate.getDate() + pkg.duration)

    // 创建订单（模拟支付成功）
    const order = await prisma.sponsoredOrder.create({
      data: {
        userId: user.id,
        packageId: pkg.id,
        status: 'active', // 模拟支付成功，直接激活
        title,
        description: description || null,
        targetUrl,
        imageUrl: imageUrl || null,
        startDate,
        endDate,
        amount: pkg.price,
        paymentMethod: 'demo',
        transactionId: `demo_${Date.now()}`
      },
      include: {
        package: true
      }
    })

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        title: order.title,
        status: order.status,
        startDate: order.startDate,
        endDate: order.endDate,
        amount: order.amount,
        package: {
          name: order.package.displayName,
          position: order.package.position,
          duration: order.package.duration
        }
      }
    })
  } catch (error) {
    console.error('Failed to create sponsored order:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create order' },
      { status: 500 }
    )
  }
}

// GET /api/sponsored-orders - 获取用户的赞助订单列表
export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    const orders = await prisma.sponsoredOrder.findMany({
      where: { userId: user.id },
      include: {
        package: true
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({
      success: true,
      orders: orders.map((order: SponsoredOrder & { package: SponsoredPackage }) => ({
        id: order.id,
        title: order.title,
        description: order.description,
        targetUrl: order.targetUrl,
        imageUrl: order.imageUrl,
        status: order.status,
        startDate: order.startDate,
        endDate: order.endDate,
        amount: order.amount,
        clickCount: order.clickCount,
        viewCount: order.viewCount,
        package: {
          name: order.package.displayName,
          position: order.package.position
        }
      }))
    })
  } catch (error) {
    console.error('Failed to fetch sponsored orders:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}
