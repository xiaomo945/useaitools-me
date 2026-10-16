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
            Sign-in error
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            {error === 'Configuration' && 'Configuration error. Please contact the administrator.'}
            {error === 'AccessDenied' && 'Access denied'}
            {error === 'Verification' && 'This verification link has expired or is invalid'}
            {error === 'default' && 'An unknown error occurred'}
            {!error && 'Something went wrong. Please try again.'}
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <Link
            href="/auth/signin"
            className="px-4 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg transition-colors"
          >
            Sign in again
          </Link>
          <Link
            href="/"
            className="px-4 py-3 bg-slate-100 dark:bg-gray-800 text-slate-700 dark:text-slate-200 font-semibold rounded-lg hover:bg-slate-200 dark:hover:bg-gray-700 transition-colors"
          >
            Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function ErrorPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ErrorContent />
    </Suspense>
  )
}
