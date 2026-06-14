'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';

interface RecommendedTool {
  id: string;
  name: string;
  category: string;
  slug: string;
  iconUrl: string | null;
  rating: number | null;
  reviewCount: number | null;
  description: string | null;
}

export interface RecommendationsProps {
  variant: 'popular' | 'similar' | 'newest' | 'personalized';
  title?: string;
  limit?: number;
  currentToolId?: string;
  currentCategory?: string;
}

const VARIANT_ICONS: Record<string, string> = {
  popular: '🔥',
  similar: '✨',
  newest: '🆕',
  personalized: '🎯',
};

const DEFAULT_TITLES: Record<string, string> = {
  popular: '热门工具',
  similar: '类似工具',
  newest: '最新加入',
  personalized: '为你推荐',
};

function renderRating(rating: number | null): string {
  if (rating === null || rating === undefined) return '—';
  return Number(rating).toFixed(1);
}

export default function Recommendations({
  variant,
  title,
  limit = 6,
  currentToolId,
  currentCategory,
}: RecommendationsProps) {
  const [tools, setTools] = useState<RecommendedTool[] | null>(null);
  const [loading, setLoading] = useState(true);

  const displayTitle = title || DEFAULT_TITLES[variant] || '推荐工具';
  const apiVariant = variant === 'similar' ? 'similar_category' : variant;

  const query = useMemo(() => {
    const params = new URLSearchParams();
    params.set('variant', apiVariant);
    params.set('limit', String(limit));
    if (currentToolId) params.set('currentToolId', String(currentToolId));
    if (currentCategory) params.set('currentCategory', String(currentCategory));
    return params.toString();
  }, [apiVariant, limit, currentToolId, currentCategory]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    (async () => {
      try {
        const res = await fetch(`/api/recommendations?${query}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = (await res.json()) as RecommendedTool[];
        if (!cancelled) {
          if (Array.isArray(data)) {
            setTools(data);
          } else {
            setTools([]);
          }
        }
      } catch (e) {
        if (!cancelled) setTools([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [query]);

  return (
    <section className="py-10 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-emerald-50/40 via-white to-teal-50/40 dark:from-gray-950 dark:via-gray-900 dark:to-emerald-950/20 border-t border-b border-emerald-100/50 dark:border-emerald-900/30">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-md shadow-emerald-500/20">
              <span className="text-white text-base">{VARIANT_ICONS[variant] || '🎯'}</span>
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                {displayTitle}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                基于 {apiVariant} 策略为你精选
              </p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: Math.min(limit, 6) }).map((_, i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-2xl p-5 animate-pulse"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-11 h-11 rounded-xl bg-slate-200 dark:bg-gray-800" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-200 dark:bg-gray-800 rounded w-3/4" />
                    <div className="h-3 bg-slate-100 dark:bg-gray-800 rounded w-1/2" />
                  </div>
                </div>
                <div className="h-3 bg-slate-100 dark:bg-gray-800 rounded mb-2" />
                <div className="h-3 bg-slate-100 dark:bg-gray-800 rounded w-5/6" />
              </div>
            ))}
          </div>
        ) : tools && tools.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tools.map((tool, idx) => (
              <Link
                key={tool.id}
                href={`/tool/${tool.slug}`}
                className="group relative block bg-white dark:bg-gray-900 rounded-2xl border border-slate-200 dark:border-gray-800 p-5 shadow-sm hover:shadow-xl hover:shadow-emerald-500/10 hover:-translate-y-1 hover:border-emerald-300 dark:hover:border-emerald-600 transition-all duration-300 overflow-hidden"
                style={{ animationDelay: `${idx * 40}ms` }}
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-500 opacity-70 group-hover:opacity-100 transition-opacity" />
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-emerald-500/20">
                      {tool.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-slate-900 dark:text-white text-base leading-tight group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors truncate">
                        {tool.name}
                      </h3>
                      <span className="inline-block text-xs text-teal-600 dark:text-teal-400 font-semibold mt-1">
                        {tool.category}
                      </span>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-100/70 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
                    ⭐ {renderRating(tool.rating)}
                  </span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4 line-clamp-3">
                  {tool.description || '暂无描述'}
                </p>
                <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-gray-800">
                  <span className="text-xs text-slate-500 dark:text-slate-500 font-medium">
                    {tool.reviewCount ? `${tool.reviewCount.toLocaleString()} reviews` : '精选推荐'}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 group-hover:translate-x-1 transition-transform">
                    查看详情 →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 rounded-2xl bg-white/50 dark:bg-gray-900/50 border border-dashed border-slate-200 dark:border-gray-800">
            <div className="text-3xl mb-3">🔍</div>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              暂无推荐内容，请稍后再来查看
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
