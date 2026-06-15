import type { Tool } from '@/types';
import Link from 'next/link';
import { ArrowRight, Star } from 'lucide-react';

interface TopToolsProps {
  tools: Tool[];
  category: string;
  categoryColors: {
    bg: string;
    bgDark: string;
    text: string;
    textLight: string;
    border: string;
  };
}

// Helper function to check if a tool has affiliate link
function hasAffiliateLink(tool: Tool): boolean {
  const envVarName = `AFFILIATE_${tool.name.toUpperCase().replace(/\s+/g, '_')}`;
  let shortEnvVarName = '';
  if (tool.name.includes('Rytr')) {
    shortEnvVarName = 'AFFILIATE_RYTR';
  } else if (tool.name.includes('VEED')) {
    shortEnvVarName = 'AFFILIATE_VEED';
  } else if (tool.name.includes('Murf')) {
    shortEnvVarName = 'AFFILIATE_MURF';
  } else if (tool.name.includes('Pictory')) {
    shortEnvVarName = 'AFFILIATE_PICTOR';
  } else if (tool.name.includes('Grammarly')) {
    shortEnvVarName = 'AFFILIATE_GRAMMARLY';
  }
  const envLink = (shortEnvVarName && process.env[shortEnvVarName]) || process.env[envVarName];
  return !!(envLink || tool.affiliate_link);
}

// Helper function to get affiliate link
function getAffiliateLink(tool: Tool): string {
  const envVarName = `AFFILIATE_${tool.name.toUpperCase().replace(/\s+/g, '_')}`;
  let shortEnvVarName = '';
  if (tool.name.includes('Rytr')) {
    shortEnvVarName = 'AFFILIATE_RYTR';
  } else if (tool.name.includes('VEED')) {
    shortEnvVarName = 'AFFILIATE_VEED';
  } else if (tool.name.includes('Murf')) {
    shortEnvVarName = 'AFFILIATE_MURF';
  } else if (tool.name.includes('Pictory')) {
    shortEnvVarName = 'AFFILIATE_PICTOR';
  } else if (tool.name.includes('Grammarly')) {
    shortEnvVarName = 'AFFILIATE_GRAMMARLY';
  }
  const envLink = (shortEnvVarName && process.env[shortEnvVarName]) || process.env[envVarName];
  return envLink || tool.affiliate_link || tool.url;
}

export default function TopTools({ tools, category, categoryColors }: TopToolsProps) {
  // Select top 10 tools by rating (minimum 4.0)
  const topTools = tools
    .filter(t => t.rating && t.rating >= 4.0)
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 10);

  if (topTools.length === 0) return null;

  return (
    <section className="mt-12 mb-12">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🔥</span>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Top 10 {category} Tools
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Highest rated tools based on user reviews
            </p>
          </div>
        </div>
        <Link
          href="/about#how-we-review"
          className="text-xs text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors flex items-center gap-1"
        >
          How we rate →
        </Link>
      </div>

      {/* Top 10 Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {topTools.map((tool, index) => {
          const hasAffiliate = hasAffiliateLink(tool);
          const affiliateUrl = getAffiliateLink(tool);
          const rankBadge = index < 3 ? ['🥇', '🥈', '🥉'][index] : `#${index + 1}`;
          const isTop3 = index < 3;

          return (
            <Link
              href={`/tools/${tool.id}`}
              key={tool.id}
              className={`relative rounded-xl overflow-hidden border transition-all duration-300 hover:-translate-y-1 ${
                isTop3
                  ? 'border-emerald-200 dark:border-emerald-500/30 shadow-md hover:shadow-lg'
                  : 'border-slate-200/60 dark:border-gray-800/80 shadow-sm hover:shadow-md'
              } bg-white dark:bg-gray-900 group`}
            >
              {/* Rank Badge */}
              <div className="absolute top-2 left-2 z-10">
                <span className={`text-sm ${isTop3 ? '' : 'font-bold text-slate-500 dark:text-slate-400'}`}>
                  {rankBadge}
                </span>
              </div>

              {/* Affiliate Badge */}
              {hasAffiliate && (
                <div className="absolute top-2 right-2 z-10">
                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-semibold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/20">
                    ✨ Deal
                  </span>
                </div>
              )}

              <div className="p-4 pt-8">
                {/* Tool Icon & Name */}
                <div className="flex items-start gap-2 mb-2">
                  <div className={`w-9 h-9 rounded-lg ${categoryColors.bgDark} ${categoryColors.textLight} flex items-center justify-center text-base font-bold flex-shrink-0`}>
                    {tool.name.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-sm text-slate-900 dark:text-white truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {tool.name}
                    </h3>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                        {(tool.rating || 0).toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Pricing */}
                <div className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                  {tool.pricing}
                </div>

                {/* Best For Tags */}
                {tool.best_for && tool.best_for.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {tool.best_for.slice(0, 2).map((tag: string, i: number) => (
                      <span
                        key={i}
                        className="px-1.5 py-0.5 rounded-full text-[9px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 truncate"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* CTA Button */}
                <a
                  href={affiliateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className={`w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-300 hover:-translate-y-0.5 ${
                    isTop3
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-sm hover:shadow-md'
                      : hasAffiliate
                        ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/20 hover:bg-emerald-100 dark:hover:bg-emerald-500/20'
                        : `${categoryColors.bg} text-white hover:opacity-90`
                  }`}
                >
                  {hasAffiliate ? 'Try Free' : 'Visit'}
                  <ArrowRight className="w-3 h-3" />
                </a>
              </div>
            </Link>
          );
        })}
      </div>

      {/* View All Link */}
      <div className="mt-6 text-center">
        <Link
          href={`/?category=${category.toLowerCase()}`}
          className="inline-flex items-center gap-2 text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
        >
          View all {category} tools
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
