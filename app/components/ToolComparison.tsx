'use client';

import Link from 'next/link';
import { ArrowRight, Check, X, Star } from 'lucide-react';
import SocialShare from '@/app/components/SocialShare';

interface ComparisonTool {
  id: number;
  name: string;
  slug: string;
  description: string;
  category: string;
  pricing: string;
  rating?: number;
  rating_count?: number;
  icon_url: string;
  affiliate_link?: string;
  url: string;
  pros_cons?: {
    pros: string[];
    cons: string[];
  };
  best_for?: string[];
  features?: string[];
}

interface ToolComparisonProps {
  tool1: ComparisonTool;
  tool2: ComparisonTool;
}

export default function ToolComparison({ tool1, tool2 }: ToolComparisonProps) {
  const getCTAUrl = (tool: ComparisonTool) => {
    return tool.affiliate_link || tool.url;
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, { bg: string; text: string }> = {
      Writing: { bg: 'bg-blue-500', text: 'text-blue-600' },
      Image: { bg: 'bg-violet-500', text: 'text-violet-600' },
      Productivity: { bg: 'bg-teal-500', text: 'text-teal-600' },
      Code: { bg: 'bg-orange-500', text: 'text-orange-600' },
      Audio: { bg: 'bg-pink-500', text: 'text-pink-600' },
      Video: { bg: 'bg-indigo-500', text: 'text-indigo-600' },
    };
    return colors[category] || colors.Productivity;
  };

  const colors1 = getCategoryColor(tool1.category);
  const colors2 = getCategoryColor(tool2.category);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 border-b border-slate-200/60 dark:border-gray-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white mb-4">
              {tool1.name} vs {tool2.name}
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Comprehensive comparison to help you choose the right {tool1.category.toLowerCase()} AI tool
            </p>
          </div>

          {/* Tool Cards Side by Side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {/* Tool 1 */}
            <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300">
              <div className="flex items-start gap-4 mb-4">
                <div className={`w-16 h-16 rounded-2xl ${colors1.bg}/10 dark:${colors1.bg}/20 flex items-center justify-center text-2xl font-bold flex-shrink-0`}>
                  {tool1.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                    {tool1.name}
                  </h2>
                  <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${colors1.bg}/10 dark:${colors1.bg}/20 ${colors1.text} dark:${colors1.text}`}>
                    {tool1.category}
                  </span>
                </div>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
                {tool1.description}
              </p>
              {tool1.rating && (
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${star <= Math.round(tool1.rating!) ? 'text-amber-400 fill-amber-400' : 'text-slate-300 dark:text-slate-600'}`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    {tool1.rating.toFixed(1)}
                  </span>
                  {tool1.rating_count && (
                    <span className="text-xs text-slate-500 dark:text-slate-500">
                      ({tool1.rating_count.toLocaleString()})
                    </span>
                  )}
                </div>
              )}
              <div className="mb-4">
                <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Pricing</div>
                <div className="text-lg font-bold text-slate-900 dark:text-white">
                  {tool1.pricing}
                </div>
              </div>
              <a
                href={getCTAUrl(tool1)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
              >
                Try {tool1.name} Free
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            {/* Tool 2 */}
            <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300">
              <div className="flex items-start gap-4 mb-4">
                <div className={`w-16 h-16 rounded-2xl ${colors2.bg}/10 dark:${colors2.bg}/20 flex items-center justify-center text-2xl font-bold flex-shrink-0`}>
                  {tool2.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                    {tool2.name}
                  </h2>
                  <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${colors2.bg}/10 dark:${colors2.bg}/20 ${colors2.text} dark:${colors2.text}`}>
                    {tool2.category}
                  </span>
                </div>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
                {tool2.description}
              </p>
              {tool2.rating && (
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${star <= Math.round(tool2.rating!) ? 'text-amber-400 fill-amber-400' : 'text-slate-300 dark:text-slate-600'}`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    {tool2.rating.toFixed(1)}
                  </span>
                  {tool2.rating_count && (
                    <span className="text-xs text-slate-500 dark:text-slate-500">
                      ({tool2.rating_count.toLocaleString()})
                    </span>
                  )}
                </div>
              )}
              <div className="mb-4">
                <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Pricing</div>
                <div className="text-lg font-bold text-slate-900 dark:text-white">
                  {tool2.pricing}
                </div>
              </div>
              <a
                href={getCTAUrl(tool2)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
              >
                Try {tool2.name} Free
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-8 text-center">
          Feature Comparison
        </h2>
        <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="grid grid-cols-3 border-b border-slate-200 dark:border-gray-800">
            <div className="p-4 sm:p-6 font-semibold text-slate-900 dark:text-white bg-slate-50 dark:bg-gray-800/50">
              Feature
            </div>
            <div className="p-4 sm:p-6 font-semibold text-slate-900 dark:text-white bg-slate-50 dark:bg-gray-800/50 text-center border-l border-slate-200 dark:border-gray-800">
              {tool1.name}
            </div>
            <div className="p-4 sm:p-6 font-semibold text-slate-900 dark:text-white bg-slate-50 dark:bg-gray-800/50 text-center border-l border-slate-200 dark:border-gray-800">
              {tool2.name}
            </div>
          </div>

          {/* Pricing Row */}
          <div className="grid grid-cols-3 border-b border-slate-200 dark:border-gray-800 hover:bg-slate-50 dark:hover:bg-gray-800/30 transition-colors">
            <div className="p-4 sm:p-6 font-medium text-slate-700 dark:text-slate-300">
              Pricing
            </div>
            <div className="p-4 sm:p-6 text-center text-slate-600 dark:text-slate-400 border-l border-slate-200 dark:border-gray-800">
              {tool1.pricing}
            </div>
            <div className="p-4 sm:p-6 text-center text-slate-600 dark:text-slate-400 border-l border-slate-200 dark:border-gray-800">
              {tool2.pricing}
            </div>
          </div>

          {/* Rating Row */}
          <div className="grid grid-cols-3 border-b border-slate-200 dark:border-gray-800 hover:bg-slate-50 dark:hover:bg-gray-800/30 transition-colors">
            <div className="p-4 sm:p-6 font-medium text-slate-700 dark:text-slate-300">
              User Rating
            </div>
            <div className="p-4 sm:p-6 text-center border-l border-slate-200 dark:border-gray-800">
              {tool1.rating ? (
                <div className="flex items-center justify-center gap-1">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {tool1.rating.toFixed(1)}
                  </span>
                </div>
              ) : (
                <span className="text-slate-400 dark:text-slate-500">N/A</span>
              )}
            </div>
            <div className="p-4 sm:p-6 text-center border-l border-slate-200 dark:border-gray-800">
              {tool2.rating ? (
                <div className="flex items-center justify-center gap-1">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {tool2.rating.toFixed(1)}
                  </span>
                </div>
              ) : (
                <span className="text-slate-400 dark:text-slate-500">N/A</span>
              )}
            </div>
          </div>

          {/* Best For Row */}
          {tool1.best_for && tool2.best_for && (
            <div className="grid grid-cols-3 border-b border-slate-200 dark:border-gray-800 hover:bg-slate-50 dark:hover:bg-gray-800/30 transition-colors">
              <div className="p-4 sm:p-6 font-medium text-slate-700 dark:text-slate-300">
                Best For
              </div>
              <div className="p-4 sm:p-6 text-center text-sm text-slate-600 dark:text-slate-400 border-l border-slate-200 dark:border-gray-800">
                {tool1.best_for.slice(0, 2).join(', ')}
              </div>
              <div className="p-4 sm:p-6 text-center text-sm text-slate-600 dark:text-slate-400 border-l border-slate-200 dark:border-gray-800">
                {tool2.best_for.slice(0, 2).join(', ')}
              </div>
            </div>
          )}
        </div>

        {/* Pros & Cons Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          {/* Tool 1 Pros & Cons */}
          {tool1.pros_cons && (
            <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                {tool1.name}
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-emerald-600 dark:text-emerald-400 mb-2 flex items-center gap-2">
                    <Check className="w-5 h-5" /> Pros
                  </h4>
                  <ul className="space-y-2">
                    {tool1.pros_cons.pros.map((pro, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                        <span className="text-emerald-500 mt-0.5">+</span>
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-amber-600 dark:text-amber-400 mb-2 flex items-center gap-2">
                    <X className="w-5 h-5" /> Cons
                  </h4>
                  <ul className="space-y-2">
                    {tool1.pros_cons.cons.map((con, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                        <span className="text-amber-500 mt-0.5">−</span>
                        {con}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Tool 2 Pros & Cons */}
          {tool2.pros_cons && (
            <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                {tool2.name}
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-emerald-600 dark:text-emerald-400 mb-2 flex items-center gap-2">
                    <Check className="w-5 h-5" /> Pros
                  </h4>
                  <ul className="space-y-2">
                    {tool2.pros_cons.pros.map((pro, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                        <span className="text-emerald-500 mt-0.5">+</span>
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-amber-600 dark:text-amber-400 mb-2 flex items-center gap-2">
                    <X className="w-5 h-5" /> Cons
                  </h4>
                  <ul className="space-y-2">
                    {tool2.pros_cons.cons.map((con, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                        <span className="text-amber-500 mt-0.5">−</span>
                        {con}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Recommendation Section */}
        <div className="mt-12 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border border-emerald-200/60 dark:border-emerald-800/40 rounded-2xl p-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-4">
            Which One Should You Choose?
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-2xl mx-auto">
            Both tools are excellent choices. {tool1.name} is great for {tool1.best_for?.[0] || 'general use'}, while {tool2.name} excels at {tool2.best_for?.[0] || 'general use'}.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={getCTAUrl(tool1)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-700 text-slate-900 dark:text-white font-semibold rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
            >
              Try {tool1.name}
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href={getCTAUrl(tool2)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
            >
              Try {tool2.name}
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Social Share */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-2xl p-5 flex items-center justify-center">
          <SocialShare
            title={`${tool1.name} vs ${tool2.name}: Which is Best?`}
            url={`https://useaitools.me/compare/${tool1.slug}-vs-${tool2.slug}`}
            description={`Compare ${tool1.name} and ${tool2.name} side-by-side. Features, pricing, pros & cons.`}
          />
        </div>
      </div>
    </div>
  );
}
