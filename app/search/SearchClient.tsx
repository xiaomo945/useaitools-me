'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import type { Tool } from '@/types';
import SearchFilters from '@/app/components/SearchFilters';
import { searchTools } from '@/lib/fuzzySearch';
import toolsData from '@/data/tools.json';

const tools = toolsData as unknown as Tool[];

// An empty query used to fall through to "show every tool", which meant the
// bare /search URL rendered all 1,165 result cards - a 3.9 MB document whose
// only purpose was to sit there until someone typed. It is the largest page on
// the site and it was in the sitemap. Now the empty state is a small set of
// links into the category pages, which are the pages that should rank.
const BROWSE_CATEGORIES = ['Writing', 'Image', 'Video', 'Audio', 'Code', 'Productivity'];
const categoryCounts = BROWSE_CATEGORIES.map(name => ({
  name,
  slug: name.toLowerCase(),
  count: tools.filter(t => t.category === name).length,
}));

function SearchPageInner() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [searchQuery, setSearchQuery] = useState(query);

  useEffect(() => {
    setTimeout(() => setSearchQuery(query), 0);
  }, [query]);

  // 分词 + 容错检索（name/description/description_en/category/best_for/examples）
  const { tools: textFiltered, relaxed } = useMemo(
    () => searchTools(tools, searchQuery),
    [searchQuery]
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 mb-4">
            🔍 Smart Search
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white mb-3">
            {searchQuery ? `Results for "${searchQuery}"` : 'Search AI Tools'}
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Search across {tools.length} AI tools. Use filters to narrow down by category and pricing.
          </p>
        </div>

        {/* Search Input */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={`Search ${tools.length} AI tools (try 'Rytr', 'blog writing', 'free video editor')...`}
              className="w-full pl-12 pr-32 py-4 rounded-2xl border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-slate-900 dark:text-white placeholder:text-slate-400 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              autoFocus
            />
            {/* 实时结果计数 - 解决挑刺 #19 */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
              {searchQuery && (
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hidden sm:inline">
                  {textFiltered.length} {textFiltered.length === 1 ? 'result' : 'results'}
                </span>
              )}
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 px-2 py-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
          {/* 移动端结果计数 */}
          {searchQuery && (
            <p className="sm:hidden text-center text-xs text-slate-500 dark:text-slate-400 mt-2">
              {textFiltered.length} {textFiltered.length === 1 ? 'result' : 'results'} for &ldquo;{searchQuery}&rdquo;
            </p>
          )}
          {searchQuery && relaxed && textFiltered.length > 0 && (
            <p className="text-center text-xs text-amber-600 dark:text-amber-400 mt-2">
              No exact matches — showing partial matches
            </p>
          )}
        </div>

        {/* Filters + Results */}
        {searchQuery.trim() ? (
          <SearchFilters tools={textFiltered} initialQuery={searchQuery} />
        ) : (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 text-center">
              Browse by category
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {categoryCounts.map(c => (
                <Link
                  key={c.slug}
                  href={`/category/${c.slug}`}
                  className="group flex flex-col gap-1 rounded-2xl border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-5 py-4 hover:border-emerald-500 hover:shadow-lg hover:shadow-emerald-500/5 transition-all"
                >
                  <span className="font-semibold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                    {c.name}
                  </span>
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    {c.count} tools
                  </span>
                </Link>
              ))}
            </div>
            <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-8">
              Or start from{' '}
              <Link href="/leaderboard" className="font-semibold text-emerald-600 dark:text-emerald-400 hover:underline">
                the leaderboard
              </Link>
              ,{' '}
              <Link href="/compare" className="font-semibold text-emerald-600 dark:text-emerald-400 hover:underline">
                side-by-side comparisons
              </Link>{' '}
              or{' '}
              <Link href="/blog" className="font-semibold text-emerald-600 dark:text-emerald-400 hover:underline">
                our reviews
              </Link>
              .
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 dark:bg-gray-950 flex items-center justify-center">
        <p className="text-slate-500 dark:text-slate-400">Loading search...</p>
      </div>
    }>
      <SearchPageInner />
    </Suspense>
  );
}
