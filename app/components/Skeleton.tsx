import React from 'react';

export default function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-gray-900 border border-slate-200/60 dark:border-gray-800 rounded-2xl p-5 animate-pulse">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-11 h-11 rounded-xl bg-gray-200 dark:bg-gray-700" />
        <div className="flex-1">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
        </div>
      </div>
      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2" />
      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-3" />
      <div className="flex gap-2">
        <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full" />
        <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full" />
      </div>
    </div>
  );
}

export function PageGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-8 animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {Array.from({ length: count }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function ToolDetailSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 py-10 sm:py-16">
      <div className="max-w-4xl mx-auto px-3 sm:px-6">
        <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-3xl p-8 sm:p-12 animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4" />
          <div className="flex gap-2 mb-6">
            <div className="h-7 w-20 bg-gray-200 dark:bg-gray-700 rounded-full" />
            <div className="h-7 w-24 bg-gray-200 dark:bg-gray-700 rounded-full" />
          </div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-6" />
          <div className="h-12 w-48 bg-gray-200 dark:bg-gray-700 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function ComparePageSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-64 mb-8 animate-pulse" />
        <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-3xl p-8 animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl" />
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl" />
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function BlogDetailSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 py-10 sm:py-16">
      <div className="max-w-4xl mx-auto px-3 sm:px-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-8" />
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-xl mb-8" />
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function BlogListSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-8 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-2xl p-5 animate-pulse">
              <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded-xl mb-4" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2" />
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
