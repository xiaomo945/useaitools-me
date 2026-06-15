'use client';

import Link from 'next/link';
import { WifiOff, Home, RefreshCw } from 'lucide-react';

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 dark:from-gray-950 dark:to-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-500/20 mb-4">
            <WifiOff className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            You're Offline
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Please check your internet connection and try again
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => window.location.reload()}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 hover:-translate-y-0.5 transition-all duration-300"
          >
            <RefreshCw className="w-5 h-5" />
            Try Again
          </button>

          <Link
            href="/"
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 text-slate-900 dark:text-white font-semibold rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </Link>
        </div>

        <div className="mt-12 p-6 bg-white dark:bg-gray-800 rounded-2xl border border-slate-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
            Tips for offline use
          </h2>
          <ul className="text-left text-sm text-slate-600 dark:text-slate-400 space-y-2">
            <li>• Saved tools are available offline</li>
            <li>• Browse your history without internet</li>
            <li>• Content will sync when you're back online</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
