import Link from 'next/link';
import toolsData from '@/data/tools.json';
import type { Tool } from '@/types';

const tools = toolsData as Tool[];

// Pick 5 popular tools for recommendation
const popularTools = tools
  .filter(t => t.rating && t.rating >= 4.5)
  .slice(0, 5);

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 flex items-center justify-center py-12 sm:py-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
        {/* 404 Graphic */}
        <div className="mb-8">
          <div className="text-9xl font-extrabold text-emerald-600 dark:text-emerald-400 tracking-tight">
            404
          </div>
        </div>

        {/* Title & Description */}
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-4">
          Oops! This page doesn&apos;t exist.
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg mb-8">
          The AI tool you&apos;re looking for might have been moved. Try searching below!
        </p>

        {/* Search Box */}
        <div className="mb-10 max-w-md mx-auto">
          <form action="/search" method="get" className="relative">
            <input
              type="text"
              name="q"
              placeholder="Search for AI tools..."
              aria-label="Search for AI tools"
              className="w-full px-5 py-3 pr-12 border border-slate-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-slate-900 dark:text-white placeholder-slate-400 focus-visible:outline-2 focus-visible:outline-emerald-500 focus-visible:outline-offset-2 transition-colors"
            />
            <button
              type="submit"
              aria-label="Search"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-500 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </form>
        </div>

        {/* Popular Tools */}
        {popularTools.length > 0 && (
          <div className="mb-10">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Popular Tools You Might Like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {popularTools.map(tool => (
                <Link
                  key={tool.id}
                  href={`/tools/${tool.id}`}
                  className="group bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-xl p-4 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-left"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center text-sm font-bold text-emerald-600 dark:text-emerald-400">
                      {tool.name.charAt(0)}
                    </div>
                    <h3 className="font-semibold text-sm text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors truncate">
                      {tool.name}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{tool.description}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>

          <Link
            href="/help"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
          >
            Help Center
          </Link>
        </div>
      </div>
    </div>
  );
}
