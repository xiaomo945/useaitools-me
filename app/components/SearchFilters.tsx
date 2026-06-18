'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ArrowRight, Star, Filter, X, CheckSquare, Square } from 'lucide-react';

interface Tool {
  id: number;
  name: string;
  description: string;
  category: string;
  pricing: string;
  url: string;
  affiliate_link: string;
  icon_url?: string;
  rating?: number;
  best_for?: string[];
  rating_count?: number;
}

interface SearchFiltersProps {
  tools: Tool[];
  initialQuery?: string;
}

const categoryColorMap: Record<string, { bg: string; text: string }> = {
  Writing: { bg: 'bg-blue-500/10', text: 'text-blue-600 dark:text-blue-400' },
  Image: { bg: 'bg-violet-500/10', text: 'text-violet-600 dark:text-violet-400' },
  Productivity: { bg: 'bg-teal-500/10', text: 'text-teal-600 dark:text-teal-400' },
  Code: { bg: 'bg-orange-500/10', text: 'text-orange-600 dark:text-orange-400' },
  Audio: { bg: 'bg-pink-500/10', text: 'text-pink-600 dark:text-pink-400' },
  Video: { bg: 'bg-indigo-500/10', text: 'text-indigo-600 dark:text-indigo-400' },
};

const CATEGORIES = ['Writing', 'Image', 'Productivity', 'Code', 'Audio', 'Video'];
const PRICING_OPTIONS = ['Free', 'Freemium', 'Free Trial', 'Paid', 'Open Source'];

const SORT_OPTIONS = [
  { value: 'rating', label: 'Highest Rated' },
  { value: 'name', label: 'Name (A-Z)' },
  { value: 'reviews', label: 'Most Reviews' },
];

export default function SearchFilters({ tools, initialQuery = '' }: SearchFiltersProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedPricing, setSelectedPricing] = useState<string[]>([]);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState('rating');
  const [showFilters, setShowFilters] = useState(false);
  const [compareSelected, setCompareSelected] = useState<number[]>([]);

  const filteredAndSorted = useMemo(() => {
    let result = tools;

    if (selectedCategories.length > 0) {
      result = result.filter(t => selectedCategories.includes(t.category));
    }

    if (selectedPricing.length > 0) {
      result = result.filter(t => selectedPricing.includes(t.pricing));
    }

    if (minRating > 0) {
      result = result.filter(t => (t.rating || 0) >= minRating);
    }

    const sorted = [...result];
    if (sortBy === 'rating') {
      sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === 'name') {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'reviews') {
      sorted.sort((a, b) => (b.rating_count || 0) - (a.rating_count || 0));
    }

    return sorted;
  }, [tools, selectedCategories, selectedPricing, minRating, sortBy]);

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const togglePricing = (price: string) => {
    setSelectedPricing(prev =>
      prev.includes(price) ? prev.filter(p => p !== price) : [...prev, price]
    );
  };

  const toggleCompare = (id: number) => {
    setCompareSelected(prev => {
      if (prev.includes(id)) return prev.filter(i => i !== id);
      if (prev.length >= 4) return prev; // Max 4 for comparison
      return [...prev, id];
    });
  };

  const clearAll = () => {
    setSelectedCategories([]);
    setSelectedPricing([]);
    setMinRating(0);
  };

  const activeFilterCount = selectedCategories.length + selectedPricing.length + (minRating > 0 ? 1 : 0);

  return (
    <div>
      {/* Filter Bar */}
      <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-2xl p-4 mb-6">
        <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              {filteredAndSorted.length} of {tools.length} tools
            </span>
            {activeFilterCount > 0 && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-semibold">
                {activeFilterCount} active filter{activeFilterCount > 1 ? 's' : ''}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {activeFilterCount > 0 && (
              <button
                onClick={clearAll}
                className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                Clear all
              </button>
            )}
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              aria-label="Sort tools"
              className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              {SORT_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>Sort: {opt.label}</option>
              ))}
            </select>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden text-xs px-3 py-1.5 rounded-lg bg-emerald-500 text-white font-semibold"
            >
              {showFilters ? 'Hide' : 'Filters'}
            </button>
          </div>
        </div>

        <div className={`${showFilters ? 'block' : 'hidden md:block'} space-y-3`}>
          {/* Categories */}
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">Category</p>
            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.map(cat => {
                const isSelected = selectedCategories.includes(cat);
                const colors = categoryColorMap[cat];
                return (
                  <button
                    key={cat}
                    onClick={() => toggleCategory(cat)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                      isSelected
                        ? `${colors?.bg} ${colors?.text} ring-1 ring-emerald-500`
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Pricing */}
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">Pricing</p>
            <div className="flex flex-wrap gap-1.5">
              {PRICING_OPTIONS.map(price => {
                const isSelected = selectedPricing.includes(price);
                return (
                  <button
                    key={price}
                    onClick={() => togglePricing(price)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-500'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {price}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Min Rating */}
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">Minimum Rating</p>
            <div className="flex items-center gap-2">
              {[0, 3, 3.5, 4, 4.5].map(rating => (
                <button
                  key={rating}
                  onClick={() => setMinRating(rating)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all inline-flex items-center gap-1 ${
                    minRating === rating
                      ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 ring-1 ring-amber-500'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {rating === 0 ? (
                    'Any'
                  ) : (
                    <>
                      <Star className="w-3 h-3 fill-current" />
                      {rating}+
                    </>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Results Grid */}
      {filteredAndSorted.length === 0 ? (
        <div className="text-center py-12">
          <X className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <p className="text-slate-500 dark:text-slate-400">
            No tools match your filters. Try adjusting your criteria.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredAndSorted.map((tool, index) => {
            const colors = categoryColorMap[tool.category] || categoryColorMap.Productivity;
            const hasAffiliate = !!tool.affiliate_link;
            return (
              <div key={tool.id} className="relative group">
                {/* Compare Checkbox */}
                <button
                  onClick={(e) => { e.preventDefault(); toggleCompare(tool.id); }}
                  className={`absolute top-2 left-2 z-10 p-1 rounded-lg transition-all duration-200 ${
                    compareSelected.includes(tool.id)
                      ? 'bg-emerald-500 text-white shadow-md'
                      : 'bg-white/80 dark:bg-gray-800/80 text-slate-300 dark:text-slate-600 hover:text-emerald-500 dark:hover:text-emerald-400'
                  }`}
                  aria-label={compareSelected.includes(tool.id) ? `Remove ${tool.name} from compare` : `Add ${tool.name} to compare`}
                >
                  {compareSelected.includes(tool.id) ? (
                    <CheckSquare className="w-4 h-4" />
                  ) : (
                    <Square className="w-4 h-4" />
                  )}
                </button>

                <Link
                key={tool.id}
                href={`/tools/${tool.id}`}
                className="group relative bg-white dark:bg-gray-900 border border-slate-200/60 dark:border-gray-800 shadow-sm rounded-2xl overflow-hidden hover:border-emerald-300 dark:hover:border-emerald-600 hover:shadow-xl hover:shadow-emerald-500/5 hover:-translate-y-1 transition-all duration-300 ease-out animate-fade-in-up"
                style={{ animationDelay: `${index * 30}ms` }}
              >
                {hasAffiliate && (
                  <div className="absolute top-3 right-3 z-10">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md">
                      🏷️ Staff Pick
                    </span>
                  </div>
                )}

                <div className={`h-0.75 w-full ${colors.bg.replace('/10', '')}`} style={{ height: '3px' }} />

                <div className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-xl ${colors.bg} ${colors.text} flex items-center justify-center text-lg font-bold flex-shrink-0`}>
                      {tool.name.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-base text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors truncate">
                        {tool.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        {tool.rating && (
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                              {(tool.rating || 0).toFixed(1)}
                            </span>
                          </div>
                        )}
                        <span className="text-xs text-slate-400 dark:text-slate-500">
                          {tool.pricing}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-slate-600 dark:text-gray-300 line-clamp-2 mb-3 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                    {tool.description}
                  </p>

                  {tool.best_for && tool.best_for.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {tool.best_for.slice(0, 2).map((tag: string, i: number) => (
                        <span key={i} className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-gray-800">
                    <span className={`text-xs font-semibold ${colors.text} uppercase tracking-wide`}>
                      {tool.category}
                    </span>
                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                      View
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </Link>
              </div>
            );
          })}
        </div>
      )}

      {/* Floating Compare Button */}
      {compareSelected.length >= 2 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-fade-in-up">
          <Link
            href={`/compare?tools=${compareSelected.join(',')}`}
            className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-2xl shadow-2xl shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:-translate-y-1 transition-all duration-300"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12M8 12h12M8 17h12M4 7h.01M4 12h.01M4 17h.01" />
            </svg>
            Compare Selected ({compareSelected.length})
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      )}
    </div>
  );
}
