'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Footer from '@/app/components/Footer'

export default function AdminDashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState({
    totalTools: 0,
    pendingSubmissions: 0,
    totalUsers: 0,
    totalReviews: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  useEffect(() => {
    if (session?.user?.id) {
      loadStats()
    }
  }, [session])

  const loadStats = async () => {
    try {
      // 获取工具总数
      const toolsRes = await fetch('/api/tools?limit=1')
      if (toolsRes.ok) {
        const toolsData = await toolsRes.json()
        setStats(prev => ({ ...prev, totalTools: toolsData.pagination?.total || 0 }))
      }

      // 获取待审核提交数
      const submissionsRes = await fetch('/api/submissions?status=pending&limit=1')
      if (submissionsRes.ok) {
        const submissionsData = await submissionsRes.json()
        setStats(prev => ({ ...prev, pendingSubmissions: submissionsData.pagination?.total || 0 }))
      }
    } catch (error) {
      console.error('加载统计数据失败:', error)
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">加载中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            管理后台
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            管理工具、审核提交、查看数据
          </p>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
            <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">
              {stats.totalTools}
            </div>
            <div className="text-gray-600 dark:text-gray-400">工具总数</div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
            <div className="text-3xl font-bold text-amber-600 dark:text-amber-400 mb-2">
              {stats.pendingSubmissions}
            </div>
            <div className="text-gray-600 dark:text-gray-400">待审核提交</div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              {stats.totalUsers}
            </div>
            <div className="text-gray-600 dark:text-gray-400">用户总数</div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
              {stats.totalReviews}
            </div>
            <div className="text-gray-600 dark:text-gray-400">评价总数</div>
          </div>
        </div>

        {/* 快捷操作 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            href="/admin/submissions"
            className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 hover:border-emerald-500 dark:hover:border-emerald-500 transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-100 dark:bg-amber-500/20 rounded-xl flex items-center justify-center text-2xl">
                📋
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  审核工具提交
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  审核用户提交的 AI 工具
                </p>
              </div>
            </div>
          </Link>

          <Link
            href="/admin/tools"
            className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 hover:border-emerald-500 dark:hover:border-emerald-500 transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-500/20 rounded-xl flex items-center justify-center text-2xl">
                🔧
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  管理工具
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  编辑、删除、管理工具信息
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  )
}
