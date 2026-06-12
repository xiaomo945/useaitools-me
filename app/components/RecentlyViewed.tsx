'use client';

import { memo } from 'react';
import Link from 'next/link';

interface Tool {
  id: number;
  name: string;
  category: string;
  pricing: string;
  description: string;
}

interface ColorScheme {
  bg: string;
  bgDark: string;
  text: string;
  textLight: string;
}

interface PricingColors {
  bg: string;
  text: string;
}

interface RecentlyViewedProps {
  recentlyViewedIds: number[];
  tools: Tool[];
  getCategoryColors: (category: string) => ColorScheme;
  getPricingColors: (pricing: string) => PricingColors;
}

const RecentlyViewed = memo(function RecentlyViewed({
  recentlyViewedIds,
  tools,
  getCategoryColors,
  getPricingColors,
}: RecentlyViewedProps) {
  if (recentlyViewedIds.length === 0) return null;

  const displayTools = recentlyViewedIds
    .map((toolId) => tools.find((t) => t.id === toolId))
    .filter(Boolean) as Tool[];

  if (displayTools.length === 0) return null;

  return (
    <div className="mt-16 mb-10">
      <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-8 text-center">
        Recently Viewed
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {displayTools.map((tool) => {
          const colors = getCategoryColors(tool.category);
          const pricingColors = getPricingColors(tool.pricing);

          return (
            <Link
              key={tool.id}
              href={`/tools/${tool.id}`}
              className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-2xl p-5 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-out"
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className={`w-10 h-10 rounded-xl ${colors.bg}/10 dark:${colors.bgDark} ${colors.textLight} dark:${colors.text} flex items-center justify-center text-xl font-bold`}
                  style={{ fontFamily: 'Playfair Display, serif' }}
                >
                  {tool.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg text-slate-900 dark:text-white truncate">
                    {tool.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${colors.bgDark} ${colors.textLight} dark:${colors.text}`}
                    >
                      {tool.category}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${pricingColors.bg} ${pricingColors.text}`}
                    >
                      {tool.pricing}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed line-clamp-2">
                {tool.description}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
});

export default RecentlyViewed;
