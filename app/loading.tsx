export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 sm:pt-16 pb-8">
        {/* Hero skeleton */}
        <div className="text-center mb-8 sm:mb-16">
          <div className="h-8 sm:h-12 w-32 sm:w-48 mx-auto mb-3 bg-slate-200 dark:bg-gray-800 rounded-xl animate-pulse" />
          <div className="h-6 sm:h-10 w-48 sm:w-72 mx-auto mb-2 bg-slate-200 dark:bg-gray-800 rounded-lg animate-pulse" />
          <div className="h-4 sm:h-6 w-64 sm:w-96 mx-auto mb-4 bg-slate-200 dark:bg-gray-800 rounded-lg animate-pulse" />
          <div className="h-10 w-72 mx-auto mb-4 bg-slate-200 dark:bg-gray-800 rounded-2xl animate-pulse" />
        </div>

        {/* Tool grid skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-900 border border-slate-200/60 dark:border-gray-800 rounded-2xl p-5"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-gray-800 animate-pulse" />
                <div className="flex-1">
                  <div className="h-4 w-24 bg-slate-200 dark:bg-gray-800 rounded animate-pulse mb-2" />
                  <div className="h-3 w-16 bg-slate-200 dark:bg-gray-800 rounded animate-pulse" />
                </div>
              </div>
              <div className="space-y-2 mb-4">
                <div className="h-3 w-full bg-slate-200 dark:bg-gray-800 rounded animate-pulse" />
                <div className="h-3 w-3/4 bg-slate-200 dark:bg-gray-800 rounded animate-pulse" />
              </div>
              <div className="flex items-center justify-between">
                <div className="h-6 w-16 bg-slate-200 dark:bg-gray-800 rounded-full animate-pulse" />
                <div className="h-9 w-24 bg-slate-200 dark:bg-gray-800 rounded-xl animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}