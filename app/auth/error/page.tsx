'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'

function ErrorContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h2 className="mt-6 text-3xl font-extrabold text-slate-900 dark:text-white">
            登录出错
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            {error === 'Configuration' && '配置错误，请联系管理员'}
            {error === 'AccessDenied' && '访问被拒绝'}
            {error === 'Verification' && '验证链接已过期或无效'}
            {error === 'default' && '发生未知错误'}
            {!error && '发生错误，请重试'}
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <Link
            href="/auth/signin"
            className="px-4 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg transition-colors"
          >
            重新登录
          </Link>
          <Link
            href="/"
            className="px-4 py-3 bg-slate-100 dark:bg-gray-800 text-slate-700 dark:text-slate-200 font-semibold rounded-lg hover:bg-slate-200 dark:hover:bg-gray-700 transition-colors"
          >
            返回首页
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function ErrorPage() {
  return (
    <Suspense fallback={<div>加载中...</div>}>
      <ErrorContent />
    </Suspense>
  )
}
