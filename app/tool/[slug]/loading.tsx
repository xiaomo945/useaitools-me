export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb Skeleton */}
        <div className="mb-8">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-48" />
        </div>

        {/* Header Skeleton */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-slate-200/60 dark:border-gray-800/80 p-8 mb-8">
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse" />
            <div className="flex-1">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-64 mb-3" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-96 mb-4" />
              <div className="flex gap-2">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse w-20" />
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse w-24" />
              </div>
            </div>
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-slate-200/60 dark:border-gray-800/80 p-8">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-48 mb-6" />
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-5/6" />
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-slate-200/60 dark:border-gray-800/80 p-6">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-32 mb-4" />
              <div className="space-y-3">
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
