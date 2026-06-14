import { prisma } from '@/lib/prisma'
import { format } from 'date-fns'
import Link from 'next/link'
import Footer from '@/app/components/Footer'

export const dynamic = 'force-dynamic'

const typeLabels: Record<string, string> = {
  weekly: '周度',
  monthly: '月度',
  seo: 'SEO',
  tools: '工具',
  content: '内容'
}

export default async function AdminReportsPage() {
  const reports = await prisma.contentReport.findMany({
    orderBy: { createdAt: 'desc' },
    take: 20
  })

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent mb-2">
            报告管理
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            查看并生成内容、工具、SEO 等各种运营报告
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          <form action="/api/reports" method="post" className="inline">
            <input type="hidden" name="type" value="weekly" />
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition-colors"
            >
              生成周度报告
            </button>
          </form>
          <form action="/api/reports" method="post" className="inline">
            <input type="hidden" name="type" value="monthly" />
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-teal-600 text-white font-medium hover:bg-teal-700 transition-colors"
            >
              生成月度报告
            </button>
          </form>
          <form action="/api/reports" method="post" className="inline">
            <input type="hidden" name="type" value="seo" />
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-cyan-600 text-white font-medium hover:bg-cyan-700 transition-colors"
            >
              生成 SEO 报告
            </button>
          </form>
          <form action="/api/reports" method="post" className="inline">
            <input type="hidden" name="type" value="tools" />
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
            >
              生成工具报告
            </button>
          </form>
          <form action="/api/reports" method="post" className="inline">
            <input type="hidden" name="type" value="content" />
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors"
            >
              生成内容报告
            </button>
          </form>
        </div>

        {reports.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-12 border border-gray-200 dark:border-gray-800 text-center">
            <p className="text-gray-500 dark:text-gray-400">暂无报告，请点击上方按钮生成。</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(reports as any[]).map((report: any) => {
              const label = typeLabels[report.reportType] || report.reportType
              const summaryText = report.summary ?? ''
              const trimmedSummary = summaryText.length > 200 ? summaryText.slice(0, 200) + '...' : summaryText
              return (
                <div
                  key={report.id}
                  className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300">
                      {label}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {format(new Date(report.createdAt), 'yyyy-MM-dd HH:mm')}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                    周期: {format(new Date(report.periodStart), 'yyyy-MM-dd')} ~{' '}
                    {format(new Date(report.periodEnd), 'yyyy-MM-dd')}
                  </p>
                  <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-sans leading-relaxed">
                    {trimmedSummary}
                  </pre>
                </div>
              )
            })}
          </div>
        )}

        <div className="mt-10">
          <Link
            href="/admin"
            className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            ← 返回管理后台
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  )
}
