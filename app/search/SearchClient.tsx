'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import type { Tool } from '@/types';
import SearchFilters from '@/app/components/SearchFilters';

function SearchPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get('q') || '';
  const [searchQuery, setSearchQuery] = useState(query);
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(false);

  // 从 URL 同步搜索词
  useEffect(() => {
    setSearchQuery(query);
  }, [query]);

  // 从 API 加载数据
  useEffect(() => {
    const loadTools = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (searchQuery) params.set('q', searchQuery);
        params.set('limit', '100'); // 加载更多用于客户端过滤
        
        const res = await fetch(`/api/search?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setTools(data.tools);
        }
      } catch (error) {
        console.error('加载工具失败:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTools();
  }, [searchQuery]);

  // 处理搜索提交
  const handleSearch = (value: string) => {
    setSearchQuery(value);
    if (value.trim()) {
      router.push(`/search?q=${encodeURIComponent(value.trim())}`);
    } else {
      router.push('/search');
    }
  };

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
            Search across 1,300+ AI tools. Use filters to narrow down by category, pricing, and rating.
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
              onChange={e => handleSearch(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  handleSearch(searchQuery);
                }
              }}
              placeholder="Search 1,300+ AI tools (try 'Rytr', 'blog writing', 'free video editor')..."
              className="w-full pl-12 pr-32 py-4 rounded-2xl border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-slate-900 dark:text-white placeholder:text-slate-400 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              autoFocus
            />
            {/* 实时结果计数 */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
              {!loading && searchQuery && (
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hidden sm:inline">
                  {tools.length} {tools.length === 1 ? 'result' : 'results'}
                </span>
              )}
              {loading && (
                <span className="text-xs font-semibold text-slate-400 hidden sm:inline">
                  Loading...
                </span>
              )}
              {searchQuery && (
                <button
                  onClick={() => handleSearch('')}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 px-2 py-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
          {/* 移动端结果计数 */}
          {!loading && searchQuery && (
            <p className="sm:hidden text-center text-xs text-slate-500 dark:text-slate-400 mt-2">
              {tools.length} {tools.length === 1 ? 'result' : 'results'} for &ldquo;{searchQuery}&rdquo;
            </p>
          )}
        </div>

        {/* Filters + Results */}
        <SearchFilters tools={tools} initialQuery={searchQuery} />
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
