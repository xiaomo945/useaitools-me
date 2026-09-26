import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { checkRateLimit, getClientIp, isValidUrl, isValidLength } from '@/lib/rate-limit'

/**
 * Payment details for sponsored listings. There is no payment gateway wired up
 * yet, so buyers complete the transfer manually and an operator activates the
 * listing after confirming the money arrived.
 *
 * SPONSOR_PAYMENT_URL is meant to hold a Ko-fi / PayPal / Polar page so
 * buyers can pay in a couple of clicks. Leave it unset to fall back to email.
 */
const PAYMENT_EMAIL = process.env.SPONSOR_PAYMENT_EMAIL || 'affiliate@useaitools.me'
const PAYMENT_PAGE_URL = process.env.SPONSOR_PAYMENT_URL || ''

function buildPaymentInstructions(amount: number, currency: string, orderId: string) {
  const symbol = currency === 'USD' ? '$' : ''
  const amountLabel = `${symbol}${amount}${currency === 'USD' ? '' : ` ${currency}`}`

  // Returned as structured data rather than an HTML string so the client never
  // has to inject markup.
  const method = PAYMENT_PAGE_URL
    ? { label: 'an online payment page', url: PAYMENT_PAGE_URL, kind: 'link' as const }
    : {
        label: `a direct email to ${PAYMENT_EMAIL}`,
        url: `mailto:${PAYMENT_EMAIL}?subject=${encodeURIComponent(
          `Sponsored listing order ${orderId}`,
        )}`,
        kind: 'mailto' as const,
      }

  return {
    status: 'pending',
    amount,
    currency,
    needsOperatorApproval: true,
    method,
    steps: [
      `Send ${amountLabel} for order ${orderId} via ${method.label}.`,
      'Keep your payment confirmation — we match it against the order ID.',
      'Reply with the order ID plus your payment receipt.',
      'We verify the payment and switch the listing to active within two business days.',
      'Nothing is displayed to visitors until the payment is confirmed.',
    ],
  }
}

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

    // 速率限制：每 IP 每分钟 5 次
    const ip = getClientIp(request)
    const { allowed } = checkRateLimit(ip, { max: 5 })
    if (!allowed) {
      return NextResponse.json(
        { success: false, error: 'Too many requests. Please try again later.' },
        { status: 429 }
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

    // 字段长度校验
    if (!isValidLength(title, 1, 100)) {
      return NextResponse.json(
        { success: false, error: 'Title must be 1-100 characters' },
        { status: 400 }
      )
    }
    if (description && !isValidLength(description, 0, 500)) {
      return NextResponse.json(
        { success: false, error: 'Description must be 0-500 characters' },
        { status: 400 }
      )
    }

    // URL 格式校验
    if (!isValidUrl(targetUrl)) {
      return NextResponse.json(
        { success: false, error: 'Please provide a valid target URL (http or https)' },
        { status: 400 }
      )
    }
    if (imageUrl && !isValidUrl(imageUrl)) {
      return NextResponse.json(
        { success: false, error: 'Please provide a valid image URL' },
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

    const now = new Date()
    const endDate = new Date()
    endDate.setDate(endDate.getDate() + pkg.duration)

    // 订单一律从 pending 开始。早期这里写死了 status: 'active' + paymentMethod:
    // 'demo'，等于任何注册用户点一下就能白嫖一个已生效的广告位，因此必须保留
    // 人工确认这一步，只有运营在后台确认收款后才会变成 active。
    const order = await prisma.sponsoredOrder.create({
      data: {
        userId: user.id,
        packageId: pkg.id,
        status: 'pending',
        title,
        description: description || null,
        targetUrl,
        imageUrl: imageUrl || null,
        startDate: now,
        endDate,
        amount: pkg.price
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
      },
      payment: buildPaymentInstructions(pkg.price, pkg.currency, order.id)
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
      orders: orders.map((order: any) => ({
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
