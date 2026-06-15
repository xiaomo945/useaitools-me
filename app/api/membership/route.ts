import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

// GET /api/membership - 获取会员计划和用户会员状态
export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    // 获取所有活跃的会员计划
    const plans = await prisma.membershipPlan.findMany({
      where: { isActive: true },
      orderBy: { price: 'asc' }
    })

    // 解析 features JSON
    const plansWithFeatures = plans.map((plan: any) => ({
      ...plan,
      features: JSON.parse(plan.features)
    }))

    // 如果用户已登录，获取其会员状态
    let userMembership = null
    if (session?.user?.email) {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email }
      })

      if (user) {
        const membership = await prisma.membership.findFirst({
          where: {
            userId: user.id,
            status: 'active'
          },
          include: {
            plan: true
          }
        })

        if (membership) {
          userMembership = {
            id: membership.id,
            planName: membership.plan.displayName,
            planLevel: membership.plan.name,
            startDate: membership.startDate,
            endDate: membership.endDate,
            status: membership.status
          }
        }
      }
    }

    return NextResponse.json({
      plans: plansWithFeatures,
      userMembership
    })
  } catch (error) {
    console.error('Failed to fetch membership plans:', error)
    return NextResponse.json(
      { error: 'Failed to fetch membership plans' },
      { status: 500 }
    )
  }
}

// POST /api/membership - 创建会员订阅（模拟支付）
export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { planId, paymentMethod } = body

    if (!planId) {
      return NextResponse.json(
        { error: 'Plan ID is required' },
        { status: 400 }
      )
    }

    // 获取用户
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // 获取计划
    const plan = await prisma.membershipPlan.findUnique({
      where: { id: planId }
    })

    if (!plan) {
      return NextResponse.json(
        { error: 'Plan not found' },
        { status: 404 }
      )
    }

    // 检查是否已有活跃会员
    const existingMembership = await prisma.membership.findFirst({
      where: {
        userId: user.id,
        status: 'active'
      }
    })

    if (existingMembership) {
      return NextResponse.json(
        { error: 'User already has an active membership' },
        { status: 400 }
      )
    }

    // 计算结束日期
    const endDate = new Date()
    if (plan.interval === 'yearly') {
      endDate.setFullYear(endDate.getFullYear() + 1)
    } else {
      endDate.setMonth(endDate.getMonth() + 1)
    }

    // 创建会员记录（模拟支付成功）
    const membership = await prisma.membership.create({
      data: {
        userId: user.id,
        planId: plan.id,
        status: 'active',
        startDate: new Date(),
        endDate,
        paymentMethod: paymentMethod || 'demo',
        transactionId: `demo_${Date.now()}`
      },
      include: {
        plan: true
      }
    })

    return NextResponse.json({
      success: true,
      membership: {
        id: membership.id,
        planName: membership.plan.displayName,
        planLevel: membership.plan.name,
        startDate: membership.startDate,
        endDate: membership.endDate,
        status: membership.status
      }
    })
  } catch (error) {
    console.error('Failed to create membership:', error)
    return NextResponse.json(
      { error: 'Failed to create membership' },
      { status: 500 }
    )
  }
}
