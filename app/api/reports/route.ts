import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { generateReport, buildMarkdownSummary, type ReportType } from '@/scripts/generate-report'

const validTypes: readonly ReportType[] = ['weekly', 'monthly', 'seo', 'tools', 'content'] as const

function parseBody(raw: unknown): { type: ReportType; periodStart?: Date; periodEnd?: Date } {
  if (!raw || typeof raw !== 'object') {
    throw new Error('Invalid request body')
  }
  const body = raw as Record<string, unknown>
  const type = typeof body.type === 'string' ? body.type : undefined
  if (!type || !(validTypes as readonly string[]).includes(type)) {
    throw new Error(`Invalid type. Must be one of: ${validTypes.join(', ')}`)
  }
  let periodStart: Date | undefined
  let periodEnd: Date | undefined
  if (typeof body.periodStart === 'string' && body.periodStart) {
    periodStart = new Date(body.periodStart)
  }
  if (typeof body.periodEnd === 'string' && body.periodEnd) {
    periodEnd = new Date(body.periodEnd)
  }
  return { type: type as ReportType, periodStart, periodEnd }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    const generatedBy = session?.user?.email ?? 'system'

    let input: { type: ReportType; periodStart?: Date; periodEnd?: Date }
    const contentType = request.headers.get('content-type') || ''

    if (contentType.includes('application/json')) {
      const raw = await request.json()
      input = parseBody(raw)
    } else {
      const form = await request.formData()
      const type = form.get('type')
      if (!type || typeof type !== 'string' || !(validTypes as readonly string[]).includes(type)) {
        return NextResponse.json(
          { error: `Invalid type. Must be one of: ${validTypes.join(', ')}` },
          { status: 400 }
        )
      }
      const startValue = form.get('periodStart')
      const endValue = form.get('periodEnd')
      input = {
        type: type as ReportType,
        periodStart: typeof startValue === 'string' && startValue ? new Date(startValue) : undefined,
        periodEnd: typeof endValue === 'string' && endValue ? new Date(endValue) : undefined
      }
    }

    const report = await generateReport({
      type: input.type,
      periodStart: input.periodStart,
      periodEnd: input.periodEnd,
      generatedBy
    })

    const summary = buildMarkdownSummary(report)

    const saved = await prisma.contentReport.create({
      data: {
        reportType: report.summary.type,
        periodStart: new Date(report.summary.periodStart),
        periodEnd: new Date(report.summary.periodEnd),
        data: JSON.stringify(report),
        summary,
        generatedBy
      }
    })

    if (contentType.includes('application/json')) {
      return NextResponse.json({ id: saved.id, createdAt: saved.createdAt, report, summary })
    }

    return NextResponse.redirect('/admin/reports', { status: 303 })
  } catch (error) {
    console.error('生成报告失败:', error)
    const message = error instanceof Error ? error.message : '生成报告失败'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}

export async function GET() {
  try {
    const reports = await prisma.contentReport.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20
    })
    return NextResponse.json({ reports })
  } catch (error) {
    console.error('获取报告失败:', error)
    return NextResponse.json({ error: '获取报告失败' }, { status: 500 })
  }
}
