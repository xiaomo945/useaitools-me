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

export default function FeaturedTools({ tools }: { tools: Tool[] }) {
  if (tools.length === 0) return null;

  return (
    <div className="mb-8 sm:mb-16">
      <div className="flex items-center gap-2 mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          🔥 Featured This Week
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tools.map((tool) => {
          const colors = getCategoryColors(tool.category);
          return (
            <div
              key={tool.id}
              className="bg-white dark:bg-gray-900 border border-slate-200/60 dark:border-gray-800 rounded-2xl p-5 shadow-sm hover:border-emerald-300 dark:hover:border-emerald-600 hover:shadow-xl hover:shadow-emerald-500/5 hover:-translate-y-1 transition-all duration-300 ease-out"
            >
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl ${colors.bg}/10 dark:${colors.bgDark} ${colors.textLight} dark:${colors.text} flex items-center justify-center text-lg sm:text-xl font-bold`} style={{ fontFamily: 'Playfair Display, serif' }}>
                    {tool.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                      {tool.name}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colors.bgDark} ${colors.textLight} dark:${colors.text}`}>
                        {tool.category}
                      </span>
                      {tool.needs_vpn ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          🪜 VPN
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                          ✅ Direct
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4 line-clamp-2">
                {tool.description}
              </p>
              <Link
                href={`/tools/${tool.id}`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
              >
                Learn More →
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}