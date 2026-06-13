'use client';

import { memo } from 'react';
import Link from 'next/link';

interface Tool {
  id: number;
  name: string;
  category: string;
  rating?: number;
}

interface ForYouRecommendationsProps {
  tools: Tool[];
  recentlyViewedIds: number[];
  getCategoryColors: (category: string) => any;
}

const ForYouRecommendations = memo(function ForYouRecommendations({
  tools,
  recentlyViewedIds,
  getCategoryColors,
}: ForYouRecommendationsProps) {
  // 计算用户最常浏览的分类
  const viewedCategories: Record<string, number> = {};
  recentlyViewedIds.forEach(id => {
    const tool = tools.find(t => t.id === id);
    if (tool) viewedCategories[tool.category] = (viewedCategories[tool.category] || 0) + 1;
  });
  
  const topCategory = Object.entries(viewedCategories).sort((a, b) => b[1] - a[1])[0]?.[0];
  const unviewed = tools.filter(t => !recentlyViewedIds.includes(t.id));
  const forYouTools = topCategory
    ? unviewed.filter(t => t.category === topCategory).sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 3)
    : unviewed.sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 3);
  
  if (forYouTools.length === 0) return null;
  
  return (
    <div className="mb-4 sm:mb-6">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs sm:text-sm font-semibold text-emerald-600 dark:text-emerald-400">🫵 For You</span>
        {topCategory && (
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 font-medium">
            Based on your {topCategory} interest
          </span>
        )}
      </div>
      <div className="flex overflow-x-auto scrollbar-hide gap-2 pb-1">
        {forYouTools.map((tool) => {
          const colors = getCategoryColors(tool.category);
          return (
            <Link
              key={tool.id}
              href={`/tools/${tool.id}`}
              className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-emerald-50 to-white dark:from-emerald-950/20 dark:to-gray-900 border border-emerald-200/60 dark:border-emerald-800/40 rounded-full whitespace-nowrap hover:border-emerald-400 dark:hover:border-emerald-600 hover:shadow-md transition-all duration-300 ease-out shrink-0"
            >
              <span className={`w-5 h-5 rounded-md ${colors.bg}/10 dark:${colors.bgDark} ${colors.textLight} dark:${colors.text} flex items-center justify-center text-[10px] font-bold`} style={{ fontFamily: 'Playfair Display, serif' }}>
                {tool.name.charAt(0)}
              </span>
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate max-w-[100px]">{tool.name}</span>
              <span className="text-[10px] text-amber-500 font-semibold">★ {tool.rating || '4.5'}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
});

export default ForYouRecommendations;
