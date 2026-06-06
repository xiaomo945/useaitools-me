import type { Tool } from '@/types';
import Link from 'next/link';
import { ArrowRight, Star } from 'lucide-react';

interface GoldPicksProps {
  tools: Tool[];
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
    shortEnvVarName = 'AFFILIATE_PICTORY';
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
    shortEnvVarName = 'AFFILIATE_PICTORY';
  } else if (tool.name.includes('Grammarly')) {
    shortEnvVarName = 'AFFILIATE_GRAMMARLY';
  }
  const envLink = (shortEnvVarName && process.env[shortEnvVarName]) || process.env[envVarName];
  return envLink || tool.affiliate_link || tool.url;
}

export default function GoldPicks({ tools, categoryColors }: GoldPicksProps) {
  // Select top 3 tools by rating (minimum 4.5, must have best_for)
  const topTools = tools
    .filter(t => t.rating && t.rating >= 4.0 && t.best_for && t.best_for.length > 0)
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 3);

  if (topTools.length === 0) return null;

  return (
    <section className="mt-10 mb-12">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🏆</span>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Editor&apos;s Picks
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Our top 3 recommendations based on rating and use case fit
            </p>
          </div>
        </div>
        <Link
          href="/about#how-we-review"
          className="text-xs text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors flex items-center gap-1"
        >
          How we pick →
        </Link>
      </div>

      {/* Top 3 Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {topTools.map((tool, index) => {
          const hasAffiliate = hasAffiliateLink(tool);
          const affiliateUrl = getAffiliateLink(tool);
          const rankBadge = index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉';
          const isFeatured = index === 0;

          return (
            <div
              key={tool.id}
              className={`relative rounded-2xl overflow-hidden border transition-all duration-300 hover:-translate-y-1 ${
                isFeatured
                  ? 'border-emerald-200 dark:border-emerald-500/30 shadow-lg shadow-emerald-500/5 dark:shadow-emerald-500/10'
                  : 'border-slate-200/60 dark:border-gray-800/80 shadow-sm hover:shadow-md'
              } bg-white dark:bg-gray-900`}
            >
              {/* Rank Badge */}
              <div className="absolute top-3 left-3 z-10">
                <span className="text-lg">{rankBadge}</span>
              </div>

              {/* Affiliate Badge */}
              {hasAffiliate && (
                <div className="absolute top-3 right-3 z-10">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/20">
                    ✨ Exclusive Deal
                  </span>
                </div>
              )}

              {/* Top accent line for #1 */}
              {isFeatured && (
                <div className="h-1 w-full bg-gradient-to-r from-emerald-500 to-teal-500" />
              )}

              <div className={`p-5 ${isFeatured ? 'pt-6' : ''}`}>
                {/* Tool Name & Rating */}
                <div className="flex items-start gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-xl ${categoryColors.bgDark} ${categoryColors.textLight} flex items-center justify-center text-lg font-bold flex-shrink-0`}>
                    {tool.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-base text-slate-900 dark:text-white truncate">
                      {tool.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          {(tool.rating || 0).toFixed(1)}
                        </span>
                      </div>
                      <span className="text-xs text-slate-400 dark:text-slate-500">
                        {tool.pricing}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Best For Tags */}
                {tool.best_for && tool.best_for.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {tool.best_for.slice(0, 3).map((tag: string, i: number) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
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
                  rel="noopener noreferrer sponsored"
                  className={`w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 ${
                    isFeatured
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/25 hover:shadow-lg hover:shadow-emerald-500/30'
                      : hasAffiliate
                        ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/20 hover:bg-emerald-100 dark:hover:bg-emerald-500/20'
                        : `${categoryColors.bg} text-white hover:opacity-90`
                  }`}
                >
                  {hasAffiliate ? 'Try It Free' : 'Visit Website'}
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Transparency Note */}
      <div className="mt-4 flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
        <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>
          Picks are based on user ratings and best-for tags. We may earn a commission from some links, at no extra cost to you.{' '}
          <Link href="/affiliate-disclosure" className="underline hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
            Learn more
          </Link>
        </span>
      </div>
    </section>
  );
}
