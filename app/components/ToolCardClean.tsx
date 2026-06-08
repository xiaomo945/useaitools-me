import type { Tool } from '@/types';
import { ArrowRight, Star } from 'lucide-react';
import Link from 'next/link';
import PricingBadge from './PricingBadge';
import { trackCtaClick } from '@/lib/analytics';

interface ToolCardCleanProps {
  tool: Tool;
  hasAffiliate: boolean;
  affiliateUrl: string;
  /** @deprecated use categoryColors from props */
  category?: string;
  index?: number;
  layout?: 'grid' | 'list';
}

// 分类色保留为**细线条 + 文字**两种形式，去除"彩虹糖"卡片
const categoryAccentMap: Record<string, { line: string; tag: string; icon: string }> = {
  Writing: { line: 'border-l-blue-400', tag: 'text-blue-600 dark:text-blue-400', icon: 'bg-blue-50 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400' },
  Image: { line: 'border-l-violet-400', tag: 'text-violet-600 dark:text-violet-400', icon: 'bg-violet-50 dark:bg-violet-500/15 text-violet-600 dark:text-violet-400' },
  Productivity: { line: 'border-l-teal-400', tag: 'text-teal-600 dark:text-teal-400', icon: 'bg-teal-50 dark:bg-teal-500/15 text-teal-600 dark:text-teal-400' },
  Code: { line: 'border-l-orange-400', tag: 'text-orange-600 dark:text-orange-400', icon: 'bg-orange-50 dark:bg-orange-500/15 text-orange-600 dark:text-orange-400' },
  Audio: { line: 'border-l-pink-400', tag: 'text-pink-600 dark:text-pink-400', icon: 'bg-pink-50 dark:bg-pink-500/15 text-pink-600 dark:text-pink-400' },
  Video: { line: 'border-l-indigo-400', tag: 'text-indigo-600 dark:text-indigo-400', icon: 'bg-indigo-50 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400' },
};

function getAccent(category: string) {
  return categoryAccentMap[category] || categoryAccentMap.Productivity;
}

export default function ToolCardClean({ tool, hasAffiliate, affiliateUrl, index = 0, layout = 'grid' }: ToolCardCleanProps) {
  const accent = getAccent(tool.category);

  if (layout === 'list') {
    return (
      <div
        className={`group relative bg-white dark:bg-gray-900 border border-slate-200/60 dark:border-gray-800 ${accent.line} border-l-4 rounded-xl overflow-hidden hover:border-slate-300 dark:hover:border-gray-700 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 ease-out animate-fade-in-up`}
        style={{ animationDelay: `${index * 30}ms` }}
      >
        <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4">
          <div className={`flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${accent.icon} flex items-center justify-center text-base sm:text-lg font-bold`}>
            {tool.name.charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-0.5">
              <h3 className="font-semibold text-sm sm:text-base text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors truncate">
                {tool.name}
              </h3>
              {hasAffiliate && (
                <span className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-semibold bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
                  🏷️ Staff Pick
                </span>
              )}
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1 mb-1">
              {tool.description}
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              {tool.rating && (
                <div className="flex items-center gap-0.5">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span className="text-[11px] font-medium text-slate-700 dark:text-slate-300">
                    {(tool.rating || 0).toFixed(1)}
                  </span>
                </div>
              )}
              <PricingBadge pricing={tool.pricing} size="sm" />
              <span className={`text-[10px] font-semibold uppercase tracking-wide ${accent.tag}`}>
                {tool.category}
              </span>
            </div>
          </div>
          <a
            href={affiliateUrl}
            target="_blank"
            rel="noopener noreferrer sponsored"
            onClick={() => trackCtaClick(tool.name, 'Visit', 'list_card', hasAffiliate)}
            className="flex-shrink-0 inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-gradient-to-r hover:from-emerald-500 hover:to-teal-500 hover:text-white text-slate-700 dark:text-slate-300 text-xs font-semibold transition-all duration-300"
          >
            Visit
            <ArrowRight className="w-3 h-3" />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`group relative bg-white dark:bg-gray-900 border border-slate-200/60 dark:border-gray-800 ${accent.line} border-l-4 rounded-2xl overflow-hidden hover:border-slate-300 dark:hover:border-gray-700 hover:shadow-xl hover:shadow-slate-900/5 hover:-translate-y-1 transition-all duration-300 ease-out animate-fade-in-up`}
      style={{ animationDelay: `${index * 30}ms` }}
    >
      {hasAffiliate && (
        <div className="absolute top-3 right-3 z-10">
          <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[9px] font-semibold bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-sm">
            🏷️ Staff Pick
          </span>
        </div>
      )}

      <div className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className={`flex-shrink-0 w-10 h-10 rounded-xl ${accent.icon} flex items-center justify-center text-lg font-bold`}>
            {tool.name.charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-base text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors truncate">
              {tool.name}
            </h3>
            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
              {tool.rating && (
                <div className="flex items-center gap-0.5">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    {(tool.rating || 0).toFixed(1)}
                  </span>
                </div>
              )}
              <PricingBadge pricing={tool.pricing} size="sm" />
            </div>
          </div>
        </div>

        <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2 mb-3 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
          {tool.description}
        </p>

        {tool.best_for && tool.best_for.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {tool.best_for.slice(0, 2).map((tag: string, i: number) => (
              <span key={i} className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
          <span className={`text-[10px] font-semibold uppercase tracking-wide ${accent.tag}`}>
            {tool.category}
          </span>
          <a
            href={affiliateUrl}
            target="_blank"
            rel="noopener noreferrer sponsored"
            onClick={() => trackCtaClick(tool.name, 'Visit', 'grid_card', hasAffiliate)}
            className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1"
          >
            Visit
            <ArrowRight className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
}
