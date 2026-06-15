import Link from 'next/link';
import type { Tool } from '@/types';

const categoryColorMap: Record<string, { bg: string; bgDark: string; text: string; textLight: string }> = {
  'Writing': { bg: 'bg-blue-500', bgDark: 'bg-blue-500/20', text: 'text-blue-300', textLight: 'text-blue-500' },
  'Image': { bg: 'bg-violet-500', bgDark: 'bg-violet-500/20', text: 'text-violet-300', textLight: 'text-violet-500' },
  'Productivity': { bg: 'bg-teal-500', bgDark: 'bg-teal-500/20', text: 'text-teal-300', textLight: 'text-teal-500' },
  'Code': { bg: 'bg-orange-500', bgDark: 'bg-orange-500/20', text: 'text-orange-300', textLight: 'text-orange-500' },
  'Audio': { bg: 'bg-pink-500', bgDark: 'bg-pink-500/20', text: 'text-pink-300', textLight: 'text-pink-500' },
  'Video': { bg: 'bg-indigo-500', bgDark: 'bg-indigo-500/20', text: 'text-indigo-300', textLight: 'text-indigo-500' },
};

function getCategoryColors(category: string) {
  return categoryColorMap[category] || { bg: 'bg-emerald-500', bgDark: 'bg-emerald-500/20', text: 'text-emerald-300', textLight: 'text-emerald-500' };
}

export default function TrendingTools({ tools }: { tools: Tool[] }) {
  // 按评分数量排序，取前4个作为热门工具
  const trending = [...tools]
    .sort((a, b) => (b.rating_count || 0) - (a.rating_count || 0))
    .slice(0, 4);

  if (trending.length === 0) return null;

  return (
    <div className="mb-8 sm:mb-16">
      <div className="flex items-center gap-2 mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          🔥 Trending This Week
        </h2>
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-gradient-to-r from-rose-500 to-amber-500 text-white">HOT</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {trending.map((tool, index) => {
          const colors = getCategoryColors(tool.category);
          return (
            <Link
              key={tool.id}
              href={`/tools/${tool.id}`}
              className="group bg-white dark:bg-gray-900 border border-slate-200/60 dark:border-gray-800 rounded-2xl p-4 sm:p-5 shadow-sm hover:border-emerald-300 dark:hover:border-emerald-600 hover:shadow-xl hover:shadow-emerald-500/5 hover:-translate-y-1 transition-all duration-300 ease-out relative overflow-hidden"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Trending Badge */}
              <div className="absolute top-3 right-3 z-10">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-sm">
                  <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.66 11.2C17.43 10.9 17.15 10.64 16.89 10.38C16.22 9.78 15.46 9.35 14.82 8.72C13.33 7.26 13 4.85 13.95 3C13 3.23 12.17 3.75 11.46 4.32C8.87 6.4 7.85 10.07 9.07 13.22C9.11 13.32 9.15 13.42 9.15 13.55C9.15 13.77 9 13.97 8.8 14.05C8.57 14.15 8.33 14.09 8.14 13.93C8.08 13.88 8.04 13.83 8 13.76C6.87 12.33 6.69 10.28 7.45 8.64C5.78 10 4.87 12.3 5 14.47C5.06 14.97 5.12 15.47 5.29 15.97C5.43 16.57 5.7 17.17 6 17.7C7.08 19.43 8.95 20.67 10.96 20.92C13.1 21.19 15.39 20.8 16.92 19.32C18.39 17.85 19.09 15.8 18.94 13.82C18.85 12.64 18.45 11.5 17.66 11.2Z"/>
                  </svg>
                  #{index + 1} Trending
                </span>
              </div>
              
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-xl ${colors.bg}/10 dark:${colors.bgDark} ${colors.textLight} dark:${colors.text} flex items-center justify-center text-lg font-bold shrink-0`} style={{ fontFamily: 'Playfair Display, serif' }}>
                  {tool.name.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-sm text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors truncate pr-16">
                    {tool.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-amber-500 font-semibold">★ {(tool.rating || 0).toFixed(1)}</span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500">{tool.rating_count || 0} reviews</span>
                  </div>
                </div>
              </div>
              
              <p className="text-xs text-slate-600 dark:text-gray-300 line-clamp-2 mb-3 leading-relaxed">
                {tool.description}
              </p>
              
              <div className="flex items-center justify-between">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${colors.bg} text-white dark:${colors.bgDark} dark:${colors.text}`}>
                  {tool.category}
                </span>
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                  View
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
