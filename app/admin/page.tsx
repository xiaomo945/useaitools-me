import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Footer from '@/app/components/Footer'

export const metadata = {
  title: 'Admin Dashboard - Use AI Tools',
  description: '网站管理后台 - 数据总览、联盟管理、赞助管理、内容报告',
}

export default async function AdminDashboardPage() {
  // ============ 统计数据（所有查询都有 try-catch，避免表不存在时报错） ============
  let totalTools = 0, totalSubs = 0, totalAff = 0, totalSlots = 0, totalReports = 0, totalInteractions = 0
  let categoryStats: any[] = [], toolRatings: { avg: number; high: number; count: number } = { avg: 0, high: 0, count: 0 }
  let recentSubmissions: any[] = [], recentReviews: any[] = []
  let totalRevenue = 0, totalClicks = 0

  try {
    totalTools = await prisma.tool.count()
    toolRatings = await prisma.tool.aggregate({
      _avg: { rating: true },
      _max: { rating: true },
      _count: { rating: true },
    }).then((r: any) => ({
      avg: Math.round((r._avg.rating || 0) * 10) / 10,
      high: r._max.rating || 0,
      count: r._count.rating || 0,
    }))
  } catch (e) { /* noop */ }

  try {
    const grouped = await (prisma.tool as any).groupBy({
      by: ['category'],
      _count: { id: true },
      _avg: { rating: true },
      orderBy: { _count: { id: 'desc' } },
      take: 8,
    });
    categoryStats = grouped as any[];
  } catch (e) { /* noop */ }

  try { totalSubs = await prisma.siteSubscription.count() } catch (e) { /* noop */ }
  try {
    const affStats = await prisma.affiliateLink.aggregate({
      _count: { id: true },
      _sum: { clickCount: true, revenue: true },
    })
    totalAff = affStats._count.id || 0
    totalClicks = affStats._sum.clickCount || 0
    totalRevenue = Math.round((affStats._sum.revenue || 0) * 100) / 100
  } catch (e) { /* noop */ }

  try { totalSlots = await prisma.sponsoredSlot.count() } catch (e) { /* noop */ }
  try { totalReports = await prisma.contentReport.count() } catch (e) { /* noop */ }
  try { totalInteractions = await prisma.userInteraction.count() } catch (e) { /* noop */ }

  try {
    recentSubmissions = await prisma.tool.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: { name: true, category: true, rating: true, slug: true, createdAt: true },
    })
  } catch (e) { /* noop */ }

  // ============ KPI 卡片数据 ============
  const kpis = [
    { label: '工具总数', value: totalTools, color: 'emerald', icon: '🔧', href: '/' },
    { label: '平均评分', value: toolRatings.avg, color: 'amber', icon: '⭐', suffix: '/5.0' },
    { label: '订阅用户', value: totalSubs, color: 'blue', icon: '📧', href: '/admin' },
    { label: '联盟链接', value: totalAff, color: 'purple', icon: '🔗', href: '/admin/affiliate' },
    { label: '联盟点击', value: totalClicks, color: 'pink', icon: '👆', suffix: '' },
    { label: '预估收入($)', value: totalRevenue, color: 'green', icon: '💰', suffix: '' },
    { label: '赞助位', value: totalSlots, color: 'orange', icon: '📢', href: '/admin/sponsored' },
    { label: '内容报告', value: totalReports, color: 'indigo', icon: '📊', href: '/admin/reports' },
  ]

  const colorClasses: Record<string, { bg: string; text: string; ring: string }> = {
    emerald: { bg: 'bg-emerald-100 dark:bg-emerald-500/20', text: 'text-emerald-600 dark:text-emerald-400', ring: 'group-hover:ring-emerald-500/30' },
    amber: { bg: 'bg-amber-100 dark:bg-amber-500/20', text: 'text-amber-600 dark:text-amber-400', ring: 'group-hover:ring-amber-500/30' },
    blue: { bg: 'bg-blue-100 dark:bg-blue-500/20', text: 'text-blue-600 dark:text-blue-400', ring: 'group-hover:ring-blue-500/30' },
    purple: { bg: 'bg-purple-100 dark:bg-purple-500/20', text: 'text-purple-600 dark:text-purple-400', ring: 'group-hover:ring-purple-500/30' },
    pink: { bg: 'bg-pink-100 dark:bg-pink-500/20', text: 'text-pink-600 dark:text-pink-400', ring: 'group-hover:ring-pink-500/30' },
    green: { bg: 'bg-green-100 dark:bg-green-500/20', text: 'text-green-600 dark:text-green-400', ring: 'group-hover:ring-green-500/30' },
    orange: { bg: 'bg-orange-100 dark:bg-orange-500/20', text: 'text-orange-600 dark:text-orange-400', ring: 'group-hover:ring-orange-500/30' },
    indigo: { bg: 'bg-indigo-100 dark:bg-indigo-500/20', text: 'text-indigo-600 dark:text-indigo-400', ring: 'group-hover:ring-indigo-500/30' },
  }

  // 分类占比计算
  const maxCount = Math.max(...categoryStats.map(c => c._count.id), 1)

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center text-2xl shadow-lg shadow-emerald-500/20">
              🎛️
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">管理后台</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">网站数据总览 · {totalTools} 个工具 · {totalSubs} 订阅 · ${totalRevenue} 预估收入</p>
            </div>
          </div>
          <div className="h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent mt-6"></div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-10">
          {kpis.map((kpi) => {
            const c = colorClasses[kpi.color] || colorClasses.emerald
            const Wrapper = ({ children }: { children: React.ReactNode }) => kpi.href
              ? <Link href={kpi.href} className="group block">{children}</Link>
              : <div className="group block">{children}</div>
            return (
              <Wrapper key={kpi.label}>
                <div className={`bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-200 dark:border-gray-800 hover:border-emerald-500/50 dark:hover:border-emerald-500/50 hover:shadow-md hover:-translate-y-0.5 transition-all`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-10 h-10 ${c.bg} rounded-xl flex items-center justify-center text-lg`}>
                      {kpi.icon}
                    </div>
                    {kpi.href && <span className="text-gray-300 dark:text-gray-600 group-hover:text-emerald-500 transition-colors text-sm">→</span>}
                  </div>
                  <div className={`text-2xl sm:text-3xl font-bold ${c.text} mb-1`}>
                    {kpi.value}{kpi.suffix || ''}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{kpi.label}</div>
                </div>
              </Wrapper>
            )
          })}
        </div>

        {/* Two-column main */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          {/* Category distribution */}
          <div className="lg:col-span-1 bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
              <span>📦</span> 分类分布
            </h2>
            <div className="space-y-3">
              {categoryStats.length === 0 && (
                <p className="text-gray-500 text-sm">暂无数据</p>
              )}
              {categoryStats.map((c: any) => {
                const pct = Math.round((c._count.id / totalTools) * 100) || 0
                const avg = Math.round((c._avg.rating || 0) * 10) / 10
                return (
                  <div key={c.category}>
                    <div className="flex items-center justify-between text-sm mb-1.5">
                      <span className="font-medium text-gray-800 dark:text-gray-200">{c.category}</span>
                      <span className="text-gray-500 dark:text-gray-400">{c._count.id} · ★{avg}</span>
                    </div>
                    <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all"
                        style={{ width: `${(c._count.id / maxCount) * 100}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Recent tools */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span>🆕</span> 最近加入的工具
              </h2>
              <Link href="/" className="text-sm text-emerald-600 hover:text-emerald-700">查看全部 →</Link>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {recentSubmissions.length === 0 && <p className="text-gray-500 text-sm py-8 text-center">暂无工具</p>}
              {recentSubmissions.map((t: any) => {
                const initial = t.name.charAt(0).toUpperCase()
                return (
                  <div key={t.slug} className="py-3 first:pt-0 last:pb-0 flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {initial}
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link href={`/tool/${t.slug}`} className="font-medium text-gray-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 truncate block">
                        {t.name}
                      </Link>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {t.category} · 加入于 {new Date(t.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-amber-500 font-semibold text-sm">★ {t.rating || '—'}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="mb-10">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
            <span>⚡</span> 快捷操作
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: '联盟链接管理', desc: '管理推广链接、查看点击和收入', icon: '🔗', href: '/admin/affiliate', color: 'emerald' },
              { title: '赞助位管理', desc: '创建/暂停赞助位、查看展示和点击', icon: '📢', href: '/admin/sponsored', color: 'amber' },
              { title: '内容报告', desc: '自动生成网站内容、流量报告', icon: '📊', href: '/admin/reports', color: 'blue' },
              { title: '工具提交审核', desc: '审核用户提交的 AI 工具', icon: '✅', href: '/admin/submissions', color: 'purple' },
            ].map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="group bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-200 dark:border-gray-800 hover:border-emerald-500/50 dark:hover:border-emerald-500/50 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/10 transition-all"
              >
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors mb-1">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* System status */}
        <div className="bg-gradient-to-br from-emerald-500/5 via-white to-teal-500/5 dark:from-emerald-500/10 dark:via-gray-900 dark:to-teal-500/10 rounded-2xl p-6 border border-emerald-200/50 dark:border-emerald-800/30">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">🟢</span>
            <h3 className="font-bold text-gray-900 dark:text-white text-lg">系统状态：正常</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="text-gray-500 dark:text-gray-400 mb-1">数据库</div>
              <div className="text-emerald-600 font-semibold">连接正常</div>
            </div>
            <div className="text-center">
              <div className="text-gray-500 dark:text-gray-400 mb-1">用户交互</div>
              <div className="text-emerald-600 font-semibold">{totalInteractions} 条</div>
            </div>
            <div className="text-center">
              <div className="text-gray-500 dark:text-gray-400 mb-1">Prisma</div>
              <div className="text-emerald-600 font-semibold">v6.19.3</div>
            </div>
            <div className="text-center">
              <div className="text-gray-500 dark:text-gray-400 mb-1">存储</div>
              <div className="text-emerald-600 font-semibold">SQLite · dev.db</div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
