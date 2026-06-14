'use client'

import Link from 'next/link'

type AffiliateLinkRow = {
  id: string
  toolId: string | null
  toolName: string
  linkType: string
  affiliateUrl: string
  network: string | null
  status: string
  clickCount: number
  conversionCount: number
  revenue: number
  createdAt: string
}

type AffiliateLinkData = {
  links: AffiliateLinkRow[]
  totalClicks: number
  totalConversions: number
  totalRevenue: number
}

export default function AffiliateAdminClient({
  initialData
}: {
  initialData: AffiliateLinkData
}) {
  const { links, totalClicks, totalConversions, totalRevenue } = initialData

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            联盟链接管理
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            追踪联盟链接的点击、转化和收入数据
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
            <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">
              {totalClicks}
            </div>
            <div className="text-gray-600 dark:text-gray-400">总点击</div>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              {totalConversions}
            </div>
            <div className="text-gray-600 dark:text-gray-400">总转化</div>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
              {totalRevenue.toFixed(2)}
            </div>
            <div className="text-gray-600 dark:text-gray-400">总收入</div>
          </div>
        </div>

        {links.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-12 border border-gray-200 dark:border-gray-800 text-center">
            <p className="text-gray-500 dark:text-gray-400">暂无联盟链接数据。</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800">
            <table className="min-w-full bg-white dark:bg-gray-900 text-left">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-200">工具</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-200">类型</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-200">联盟 URL</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-200">点击</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-200">转化</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-200">收入</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-200">状态</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {links.map((link) => (
                  <tr key={link.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/40">
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{link.toolName}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{link.linkType}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                      <a
                        href={link.affiliateUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-600 dark:text-emerald-400 hover:underline break-all"
                      >
                        {link.affiliateUrl}
                      </a>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{link.clickCount}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{link.conversionCount}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{link.revenue.toFixed(2)}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{link.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
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
    </div>
  )
}
