export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Skeleton */}
        <div className="text-center mb-12">
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-80 mx-auto mb-4" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-96 mx-auto" />
        </div>

        {/* Comparison Table Skeleton */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-slate-200/60 dark:border-gray-800/80 overflow-hidden">
          <div className="grid grid-cols-2 gap-4 p-6 border-b border-slate-200 dark:border-gray-800">
            <div className="space-y-3">
              <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4 mx-auto" />
            </div>
            <div className="space-y-3">
              <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4 mx-auto" />
            </div>
          </div>
          <div className="p-6 space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="grid grid-cols-2 gap-4 py-3 border-b border-slate-100 dark:border-gray-800 last:border-0">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-5/6" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-5/6" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
