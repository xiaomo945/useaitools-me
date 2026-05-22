import Link from 'next/link';
import tools from '@/data/tools.json';

const popularTools = tools.slice(0, 6);

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 flex items-center justify-center py-12 sm:py-16 grid-background">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
        {/* 404 Graphic */}
        <div className="mb-8">
          <div className="text-8xl sm:text-9xl font-extrabold bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent tracking-tight">
            404
          </div>
        </div>

        {/* Title & Description */}
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-4">
          Page Not Found
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg mb-6">
          The page you're looking for might have been moved, deleted, or never existed.
          Don't worry — our AI tool directory has what you need.
        </p>

        {/* Search Box */}
        <form action="/search" method="GET" className="mb-10 max-w-md mx-auto">
          <div className="relative">
            <input
              type="search"
              name="q"
              placeholder="Search AI tools..."
              className="w-full px-5 py-3.5 pr-14 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-2xl shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:text-white text-lg outline-none transition-all"
              aria-label="Search AI tools"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors"
              aria-label="Search"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </form>

        {/* Popular Tools */}
        <div className="mb-10">
          <h2 className="text-sm font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-4">Popular Tools</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {popularTools.map((tool) => (
              <Link
                key={tool.id}
                href={`/tools/${tool.id}`}
                className="px-4 py-3 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-xl text-slate-900 dark:text-white font-medium hover:border-emerald-300 dark:hover:border-emerald-700 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 text-sm"
              >
                {tool.name}
              </Link>
            ))}
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Back to Home
          </Link>
          <Link
            href="/blog"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 dark:bg-gray-800 text-slate-900 dark:text-white font-semibold rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
          >
            Read Our Blog
          </Link>
        </div>
      </div>
    </div>
  );
}
