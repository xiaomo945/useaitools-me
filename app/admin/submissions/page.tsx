'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Footer from '@/app/components/Footer'

interface Submission {
  id: string
  name: string
  url: string
  description: string
  category: string
  email: string
  status: string
  createdAt: string
  user: {
    name: string
    email: string
    image?: string
  }
}

export default function AdminSubmissionsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'pending' | 'approved' | 'rejected'>('pending')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  useEffect(() => {
    if ((session?.user as any)?.id) {
      loadSubmissions()
    }
  }, [session, filter])

  const loadSubmissions = async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/submissions?status=${filter}`)
      if (res.ok) {
        const data = await res.json()
        setSubmissions(data.submissions)
      }
    } catch (error) {
      console.error('加载提交失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleReview = async (id: string, status: 'approved' | 'rejected', note?: string) => {
    try {
      const res = await fetch(`/api/submissions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, reviewNote: note })
      })

      if (res.ok) {
        await loadSubmissions()
      }
    } catch (error) {
      console.error('审核失败:', error)
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
            工具提交审核
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            审核用户提交的 AI 工具
          </p>
        </div>

        {/* 筛选器 */}
        <div className="flex gap-2 mb-6">
          {(['pending', 'approved', 'rejected'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filter === status
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {status === 'pending' && '待审核'}
              {status === 'approved' && '已通过'}
              {status === 'rejected' && '已拒绝'}
            </button>
          ))}
        </div>

        {/* 提交列表 */}
        {submissions.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-12 text-center">
            <p className="text-gray-500 dark:text-gray-400">暂无{filter === 'pending' ? '待审核' : filter === 'approved' ? '已通过' : '已拒绝'}的提交</p>
          </div>
        ) : (
          <div className="space-y-4">
            {submissions.map((submission) => (
              <div
                key={submission.id}
                className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {submission.name}
                    </h3>
                    <a
                      href={submission.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-600 dark:text-emerald-400 hover:underline text-sm mb-3 block"
                    >
                      {submission.url}
                    </a>
                    <p className="text-gray-600 dark:text-gray-400 mb-3">
                      {submission.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-500">
                      <span>分类: {submission.category}</span>
                      <span>提交者: {submission.user.name || submission.user.email}</span>
                      <span>提交时间: {new Date(submission.createdAt).toLocaleDateString('zh-CN')}</span>
                    </div>
                  </div>
                  {filter === 'pending' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleReview(submission.id, 'approved')}
                        className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                      >
                        通过
                      </button>
                      <button
                        onClick={() => handleReview(submission.id, 'rejected')}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        拒绝
                      </button>
                    </div>
                  )}
                  {filter !== 'pending' && (
                    <div className="text-sm font-medium">
                      {submission.status === 'approved' && (
                        <span className="text-emerald-600 dark:text-emerald-400">已通过</span>
                      )}
                      {submission.status === 'rejected' && (
                        <span className="text-red-600 dark:text-red-400">已拒绝</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}
