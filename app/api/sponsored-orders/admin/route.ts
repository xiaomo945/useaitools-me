import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendEmail } from '@/lib/email'

/**
 * Operator endpoint for sponsored listings.
 *
 * There is no automatic payment verification, so a human has to confirm that
 * the money landed before a listing goes live. This endpoint is that step:
 * it lists every order and flips its status. It is protected by a shared
 * secret because simply knowing an order id must never be enough to buy a slot.
 *
 * Set SPONSOR_ADMIN_TOKEN in the Vercel project environment and send it in the
 * x-sponsor-token header. While the variable is missing the endpoint refuses
 * every request.
 */

const ALLOWED_STATUSES = ['pending', 'paid', 'active', 'expired', 'cancelled']

function isAuthorized(request: Request): boolean {
  const token = process.env.SPONSOR_ADMIN_TOKEN
  if (!token) return false
  return request.headers.get('x-sponsor-token') === token
}

// GET /api/sponsored-orders/admin - every order, newest first
export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const orders = await prisma.sponsoredOrder.findMany({
      include: {
        package: true,
        user: { select: { email: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({
      success: true,
      orders: orders.map((order: any) => ({
        id: order.id,
        title: order.title,
        description: order.description,
        targetUrl: order.targetUrl,
        status: order.status,
        amount: order.amount,
        currency: order.package?.currency || 'USD',
        startDate: order.startDate,
        endDate: order.endDate,
        clickCount: order.clickCount,
        viewCount: order.viewCount,
        buyerEmail: order.user?.email || null,
        packageName: order.package?.displayName || null,
        position: order.package?.position || null,
        createdAt: order.createdAt,
      })),
    })
  } catch (error) {
    console.error('Failed to fetch sponsored orders for admin:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 },
    )
  }
}

// PATCH /api/sponsored-orders/admin - { orderId, status }
export async function PATCH(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json().catch(() => ({}))
    const { orderId, status } = body || {}

    if (!orderId || !ALLOWED_STATUSES.includes(status)) {
      return NextResponse.json(
        { success: false, error: 'orderId is required and status must be a known value' },
        { status: 400 },
      )
    }

    const order = await prisma.sponsoredOrder.findUnique({
      where: { id: orderId },
      include: {
        package: true,
        user: { select: { email: true, name: true } },
      },
    })

    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 })
    }

    // A listing only starts running once an operator confirms payment, so the
    // clock starts on approval rather than on submission.
    let startDate = order.startDate
    let endDate = order.endDate
    if (status === 'active' && !startDate) {
      startDate = new Date()
      endDate = new Date()
      endDate.setDate(endDate.getDate() + (order.package?.duration || 30))
    }

    const updated = await prisma.sponsoredOrder.update({
      where: { id: orderId },
      data: {
        status,
        startDate,
        endDate,
        paymentMethod: order.paymentMethod || 'manual',
      },
    })

    const buyerEmail = (order.user as any)?.email
    if (buyerEmail && status === 'active') {
      const currency = order.package?.currency || 'USD'
      const amount = `${currency === 'USD' ? '$' : ''}${order.amount}${currency === 'USD' ? '' : ` ${currency}`}`
      const when = endDate ? new Date(endDate).toLocaleDateString('en-US') : 'the agreed date'

      await sendEmail({
        to: buyerEmail,
        subject: 'Your sponsored listing is now live',
        html: `Hi ${(order.user as any)?.name || 'there'},<br><br>
          Your listing <strong>${order.title}</strong> on Use AI Tools is now live.<br>
          Package: ${order.package?.displayName || 'standard'}<br>
          Amount: ${amount}<br>
          Runs until: ${when}<br><br>
          You can watch clicks and views under your account at
          <a href="https://useaitools.me/sponsored">useaitools.me/sponsored</a>.`,
        text: `Your sponsored listing "${order.title}" is now live on Use AI Tools. Runs until ${when}.`,
      })
    }

    return NextResponse.json({ success: true, order: { id: updated.id, status: updated.status } })
  } catch (error) {
    console.error('Failed to update sponsored order:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update order' },
      { status: 500 },
    )
  }
}
