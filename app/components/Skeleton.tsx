'use client';

import React from 'react';

// Base shimmer animation component
export function Skeleton({ className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 skeleton-shimmer ${className}`}
      {...props}
    />
  );
}

// Card skeleton for tool cards
export function ToolCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
      <div className="h-0.75 bg-emerald-500/30" style={{ height: '3px' }} />
      <div className="p-7">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <Skeleton className="w-11 h-11 rounded-xl" />
            <Skeleton className="h-7 w-32 rounded-lg" />
          </div>
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
        <Skeleton className="h-16 w-full rounded-lg mb-6" />
        <div className="flex items-center justify-between gap-3">
          <Skeleton className="h-6 w-24 rounded-full" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-10 w-32 rounded-lg" />
            <Skeleton className="h-10 w-28 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Tool detail page skeleton
export function ToolDetailSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Back to Home Link */}
        <div className="mb-8">
          <Skeleton className="h-6 w-32 rounded-lg" />
        </div>

        {/* Header Card */}
        <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-3xl shadow-xl overflow-hidden mb-8">
          <div className="h-1 bg-emerald-500/30" />
          <div className="p-8 sm:p-12">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
              <div>
                <Skeleton className="h-10 w-64 rounded-lg mb-4" />
                <Skeleton className="h-6 w-32 rounded-full" />
              </div>
              <Skeleton className="h-9 w-28 rounded-xl" />
            </div>
            <Skeleton className="h-20 w-full rounded-lg mb-8" />
            <Skeleton className="h-12 w-48 rounded-xl" />
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-3xl p-8 mb-8">
          <Skeleton className="h-7 w-40 rounded-lg mb-6" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20">
                <Skeleton className="w-8 h-8 rounded-lg" />
                <Skeleton className="h-5 w-40 rounded-lg" />
              </div>
            ))}
          </div>
        </div>

        {/* Examples Section */}
        <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-3xl p-8 mb-8">
          <Skeleton className="h-7 w-48 rounded-lg mb-6" />
          <div className="space-y-6">
            {[1, 2].map((i) => (
              <div key={i} className="pb-6 border-b border-slate-100 dark:border-gray-800 last:pb-0 last:border-b-0">
                <div className="flex items-center gap-3 mb-4">
                  <Skeleton className="w-8 h-8 rounded-full" />
                  <Skeleton className="h-4 w-24 rounded-lg" />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Skeleton className="h-48 w-full rounded-xl" />
                  <div className="bg-slate-100 dark:bg-gray-800/60 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <Skeleton className="h-4 w-24 rounded-lg" />
                      <Skeleton className="h-8 w-20 rounded-full" />
                    </div>
                    <Skeleton className="h-28 w-full rounded-lg" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Related Tools Section */}
        <div className="mb-8">
          <Skeleton className="h-7 w-40 rounded-lg mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Skeleton className="w-10 h-10 rounded-xl" />
                  <Skeleton className="h-6 w-32 rounded-lg" />
                </div>
                <Skeleton className="h-12 w-full rounded-lg mb-4" />
                <Skeleton className="h-9 w-32 rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Blog post detail skeleton
export function BlogDetailSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 py-12 sm:py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <Skeleton className="h-6 w-32 rounded-lg" />
        </div>

        <div className="mb-8">
          <Skeleton className="h-4 w-24 rounded-lg mb-4" />
          <Skeleton className="h-12 w-full rounded-lg mb-4" />
        </div>

        <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-3xl p-8 sm:p-12 shadow-xl mb-8">
          <div className="space-y-4">
            <Skeleton className="h-5 w-full rounded-lg" />
            <Skeleton className="h-5 w-full rounded-lg" />
            <Skeleton className="h-5 w-3/4 rounded-lg" />
            <div className="pt-4">
              <Skeleton className="h-6 w-48 rounded-lg mb-4" />
              <Skeleton className="h-5 w-full rounded-lg mb-2" />
              <Skeleton className="h-5 w-full rounded-lg mb-2" />
              <Skeleton className="h-5 w-2/3 rounded-lg" />
            </div>
            <div className="pt-4">
              <Skeleton className="h-6 w-40 rounded-lg mb-4" />
              <Skeleton className="h-5 w-full rounded-lg mb-2" />
              <Skeleton className="h-5 w-5/6 rounded-lg" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-3xl p-6 shadow-lg">
          <div className="flex items-center gap-4 mb-4">
            <Skeleton className="w-5 h-5 rounded-full" />
            <Skeleton className="h-5 w-40 rounded-lg" />
          </div>
          <div className="flex flex-wrap gap-4">
            <Skeleton className="h-11 w-32 rounded-full" />
            <Skeleton className="h-11 w-32 rounded-full" />
            <Skeleton className="h-11 w-28 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Generic grid skeleton for category and saved pages
export function PageGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Back to Home Link */}
        <div className="mb-8">
          <Skeleton className="h-6 w-32 rounded-lg" />
        </div>

        {/* Page Header */}
        <div className="mb-10">
          <div className="bg-gradient-to-br from-emerald-50/80 via-white to-teal-50/80 dark:from-emerald-950/60 dark:via-gray-900 dark:to-teal-950/60 backdrop-blur-xl border border-white/60 dark:border-emerald-500/10 rounded-3xl p-8 sm:p-12">
            <div className="text-center">
              <Skeleton className="h-12 w-64 rounded-lg mb-4 mx-auto" />
              <Skeleton className="h-5 w-96 rounded-lg mx-auto" />
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {Array.from({ length: count }).map((_, i) => (
            <ToolCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

// Compare page skeleton
export function ComparePageSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <Skeleton className="h-6 w-32 rounded-lg" />
        </div>

        <div className="mb-10">
          <div className="bg-gradient-to-br from-emerald-50/80 via-white to-teal-50/80 dark:from-emerald-950/60 dark:via-gray-900 dark:to-teal-950/60 backdrop-blur-xl border border-white/60 dark:border-emerald-500/10 rounded-3xl p-8 sm:p-12">
            <div className="text-center">
              <Skeleton className="h-12 w-72 rounded-lg mb-2 mx-auto" />
              <Skeleton className="h-5 w-[500px] rounded-lg mx-auto mt-3" />
            </div>
          </div>
        </div>

        <div className="mb-10 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-3xl p-8 sm:p-12 shadow-xl">
          <div className="grid grid-cols-1 gap-6">
            <div>
              <Skeleton className="h-4 w-16 rounded-lg mb-2" />
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>
            <div>
              <Skeleton className="h-4 w-16 rounded-lg mb-2" />
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Blog list skeleton
export function BlogListSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <Skeleton className="h-6 w-32 rounded-lg" />
        </div>

        <div className="mb-10">
          <div className="text-center mb-10">
            <Skeleton className="h-12 w-80 rounded-lg mb-4 mx-auto" />
            <Skeleton className="h-5 w-[600px] rounded-lg mx-auto" />
          </div>
        </div>

        <div className="space-y-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-3xl overflow-hidden shadow-sm">
              <div className="p-7">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <Skeleton className="h-5 w-24 rounded-full" />
                  <Skeleton className="h-5 w-32 rounded-full" />
                </div>
                <Skeleton className="h-8 w-full rounded-lg mb-2" />
                <Skeleton className="h-10 w-full rounded-lg mb-4" />
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-24 rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
