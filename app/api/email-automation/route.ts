import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getNextWelcomeEmail } from '@/lib/email-automation';

// POST /api/email-automation/process - Process email automation for subscribers
export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json();

    if (action === 'check-welcome-sequence') {
      // Check all subscribers and send next welcome email if needed
      const subscribers = await prisma.siteSubscription.findMany({
        where: {
          status: 'active',
          createdAt: {
            // Subscribers within last 7 days
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        },
      });

      let emailsSent = 0;
      const results = [];

      for (const subscriber of subscribers) {
        const nextEmail = getNextWelcomeEmail(
          subscriber.createdAt.toISOString(),
          undefined // TODO: Track last email sent
        );

        if (nextEmail) {
          // In production, integrate with email service (SendGrid, Resend, etc.)
          // For now, log the email that would be sent
          console.log(`[Email Automation] Would send to ${subscriber.email}:`, {
            subject: nextEmail.subject,
            delayHours: nextEmail.delayHours,
          });

          results.push({
            email: subscriber.email,
            template: nextEmail.id,
            subject: nextEmail.subject,
          });
          emailsSent++;
        }
      }

      return NextResponse.json({
        success: true,
        emailsSent,
        results,
      });
    }

    if (action === 'send-weekly-picks') {
      // Generate and send weekly picks
      const tools = await prisma.tool.findMany({
        where: { isActive: true },
        orderBy: { rating: 'desc' },
        take: 10,
      });

      const weekNumber = getWeekNumber(new Date());
      
      // In production, send to all active subscribers
      const subscriberCount = await prisma.siteSubscription.count({
        where: { status: 'active' },
      });

      return NextResponse.json({
        success: true,
        weekNumber,
        subscriberCount,
        message: `Weekly Picks #${weekNumber} would be sent to ${subscriberCount} subscribers`,
      });
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Email automation error:', error);
    return NextResponse.json(
      { error: 'Failed to process email automation' },
      { status: 500 }
    );
  }
}

// GET /api/email-automation/stats - Get email automation statistics
export async function GET() {
  try {
    const totalSubscribers = await prisma.siteSubscription.count({
      where: { status: 'active' },
    });

    const recentSubscribers = await prisma.siteSubscription.count({
      where: {
        status: 'active',
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        },
      },
    });

    return NextResponse.json({
      totalSubscribers,
      recentSubscribers,
      welcomeSequenceEmails: 3,
    });
  } catch (error) {
    console.error('Failed to fetch email stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch email statistics' },
      { status: 500 }
    );
  }
}

function getWeekNumber(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 1);
  const diff = date.getTime() - start.getTime();
  const oneWeek = 1000 * 60 * 60 * 24 * 7;
  return Math.ceil(diff / oneWeek);
}
