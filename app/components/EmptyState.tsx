import Link from 'next/link';
import type { Tool } from '@/types';
import { Search, Sparkles, X, ArrowRight } from 'lucide-react';
import { useMemo } from 'react';
import ToolCardClean from './ToolCardClean';

interface EmptyStateProps {
  query: string;
  tools: Tool[];
  onClearQuery: () => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
  affiliateMap: Map<number, boolean>;
  affiliateUrlMap: Map<number, string>;
}

const categoryAccentMap: Record<string, string> = {
  Writing: 'border-l-blue-400',
  Image: 'border-l-violet-400',
  Productivity: 'border-l-teal-400',
  Code: 'border-l-orange-400',
  Audio: 'border-l-pink-400',
  Video: 'border-l-indigo-400',
};

export default function EmptyState({ query, tools, onClearQuery, onClearFilters, hasActiveFilters, affiliateMap, affiliateUrlMap }: EmptyStateProps) {
  // 智能推荐：猜出用户可能想搜的 5 个相关分类
  const suggestedCategories = useMemo(() => {
    const q = query.toLowerCase();
    const categoryMap: Record<string, string[]> = {
      Writing: ['write', 'blog', 'content', 'copy', 'article', 'post', 'seo', 'email', 'social', 'resume', 'letter'],
      Image: ['image', 'art', 'photo', 'picture', 'graphic', 'logo', 'design', 'illustration', 'wallpaper'],
      Video: ['video', 'tiktok', 'youtube', 'short', 'reel', 'film', 'edit', 'clip', 'movie', 'animation'],
      Audio: ['audio', 'voice', 'music', 'podcast', 'sound', 'speech', 'song', 'tts', 'voiceover'],
      Code: ['code', 'programming', 'developer', 'software', 'app', 'api', 'debug', 'sql'],
      Productivity: ['productivity', 'meeting', 'note', 'task', 'project', 'workflow', 'schedule'],
    };

    const matched: string[] = [];
    Object.entries(categoryMap).forEach(([cat, keywords]) => {
      if (keywords.some(k => q.includes(k))) {
        matched.push(cat);
      }
    });
    if (matched.length === 0) {
      // 兜底：随机展示 3 个分类
      return ['Writing', 'Image', 'Video'].slice(0, 3);
    }
    return matched.slice(0, 3);
  }, [query]);

  // 推荐 Top 3 工具（评分最高）
  const recommendedTools = useMemo(() => {
    return [...tools]
      .filter(t => t.rating && t.rating >= 4.0)
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 3);
  }, [tools]);

  if (recommendedTools.length === 0) return null;

  return (
    <div className="text-center py-12 sm:py-16">
      <div className="max-w-2xl mx-auto">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 mb-4">
          <Search className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-2">
          No tools match &ldquo;{query}&rdquo;
          {hasActiveFilters && ' with current filters'}
        </h3>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mb-6">
          Try one of these popular categories, or explore our top-rated picks below.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {query && (
            <button
              onClick={onClearQuery}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <X className="w-3 h-3" />
              Clear search
            </button>
          )}
          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <X className="w-3 h-3" />
              Clear filters
            </button>
          )}
          {suggestedCategories.map(cat => (
            <Link
              key={cat}
              href={`/category/${cat.toLowerCase()}`}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30 hover:bg-emerald-100 dark:hover:bg-emerald-500/25 transition-colors`}
            >
              Browse {cat}
              <ArrowRight className="w-3 h-3" />
            </Link>
          ))}
        </div>

        {/* 推荐 Top 3 - 解决挑刺 #22 */}
        <div className="text-left">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Our Top 3 Picks (loved by users)
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {recommendedTools.map((tool, i) => (
              <div key={tool.id} className="text-left">
                <ToolCardClean
                  tool={tool}
                  hasAffiliate={affiliateMap.get(tool.id) || false}
                  affiliateUrl={affiliateUrlMap.get(tool.id) || tool.url}
                  index={i}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
