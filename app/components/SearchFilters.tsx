'use client';

import { useState, useMemo, useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Star, Filter, X, CheckSquare, Square } from 'lucide-react';
import { generateSlugFromName } from '@/lib/slug';
import type { Tool } from '@/types';
import {
  CATEGORIES,
  PRICING_OPTIONS,
  SKILL_LEVEL_OPTIONS,
  VPN_OPTIONS,
  DEFAULT_FILTERS,
  ToolFilterState,
  VpnFilter,
  applyToolFilters,
  countActiveFilters,
  parseFiltersFromParams,
  writeFiltersToParams,
} from '@/lib/toolFilters';

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

const SORT_OPTIONS = [
  { value: 'updated', label: 'Recently Updated' },
  { value: 'name', label: 'Name (A-Z)' },
];

function chipClass(selected: string, extra?: string) {
  return `px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
    selected === 'on'
      ? `${extra || 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'} ring-1 ring-emerald-500`
      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
  }`;
}

export default function SearchFilters({ tools, initialQuery = '' }: SearchFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<ToolFilterState>(() =>
    parseFiltersFromParams(new URLSearchParams(searchParams?.toString() ?? ''))
  );
  const [sortBy, setSortBy] = useState('updated');
  const [showFilters, setShowFilters] = useState(false);
  const [compareSelected, setCompareSelected] = useState<number[]>([]);

  // 筛选状态写回 URL，方便分享与收录
  const currentQuery = searchParams?.toString() ?? '';
  useEffect(() => {
    const params = new URLSearchParams(currentQuery);
    writeFiltersToParams(params, filters);
    const next = params.toString();
    if (next === currentQuery) return;
    router.replace(next ? `${pathname}?${next}` : pathname, { scroll: false });
  }, [filters, currentQuery, pathname, router]);

  const patch = (partial: Partial<ToolFilterState>) =>
    setFilters(prev => ({ ...prev, ...partial }));

  const toggleIn = (key: 'categories' | 'pricing' | 'skillLevels', value: string) =>
    setFilters(prev => {
      const list = prev[key];
      return {
        ...prev,
        [key]: list.includes(value) ? list.filter(v => v !== value) : [...list, value],
      };
    });

  const filteredAndSorted = useMemo(() => {
    const result = applyToolFilters(tools, filters);
    const sorted = [...result];
    if (sortBy === 'name') {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      sorted.sort((a, b) => (b.last_updated || '').localeCompare(a.last_updated || ''));
    }
    return sorted;
  }, [tools, filters, sortBy]);

  const toggleCompare = (id: number) => {
    setCompareSelected(prev => {
      if (prev.includes(id)) return prev.filter(i => i !== id);
      if (prev.length >= 4) return prev; // Max 4 for comparison
      return [...prev, id];
    });
  };

  const clearAll = () => {
    setFilters(DEFAULT_FILTERS);
    setCompareSelected([]);
  };

  const activeFilterCount = countActiveFilters(filters);
  const noVpnCount = useMemo(() => tools.filter(t => t.needs_vpn === false).length, [tools]);
  const zhCount = useMemo(
    () => tools.filter(t => (t.languages || []).some(l => /chinese|中文/i.test(l))).length,
    [tools]
  );

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
          {/* Access: whether a tool is reachable without a VPN */}
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
              Access
            </p>
            <div className="flex flex-wrap gap-1.5">
              {VPN_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => patch({ vpn: opt.value as VpnFilter })}
                  className={chipClass(filters.vpn === opt.value ? 'on' : 'off')}
                >
                  {opt.label}
                  {opt.value === 'no' && ` · ${noVpnCount}`}
                </button>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">Category</p>
            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.map(cat => {
                const isSelected = filters.categories.includes(cat);
                const colors = categoryColorMap[cat];
                return (
                  <button
                    key={cat}
                    onClick={() => toggleIn('categories', cat)}
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
              {PRICING_OPTIONS.map(price => (
                <button
                  key={price}
                  onClick={() => toggleIn('pricing', price)}
                  className={chipClass(filters.pricing.includes(price) ? 'on' : 'off')}
                >
                  {price}
                </button>
              ))}
            </div>
          </div>

          {/* Skill level */}
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
              Level
            </p>
            <div className="flex flex-wrap gap-1.5">
              {SKILL_LEVEL_OPTIONS.map(level => (
                <button
                  key={level.value}
                  onClick={() => toggleIn('skillLevels', level.value)}
                  className={chipClass(filters.skillLevels.includes(level.value) ? 'on' : 'off')}
                >
                  {level.label}
                </button>
              ))}
            </div>
          </div>

          {/* Language support */}
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
              Language
            </p>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => patch({ chineseOnly: !filters.chineseOnly })}
                className={chipClass(filters.chineseOnly ? 'on' : 'off')}
              >
                Supports Chinese · {zhCount}
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Results Grid */}
      {filteredAndSorted.length === 0 ? (
        <div className="text-center py-12">
          <X className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <p className="text-slate-500 dark:text-slate-400">
            {initialQuery
              ? `No tools match "${initialQuery}" with the current filters.`
              : 'No tools match your filters. Try adjusting your criteria.'}
          </p>
          {activeFilterCount > 0 && (
            <button
              onClick={clearAll}
              className="mt-4 text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              Clear all filters
            </button>
          )}
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
                href={`/tool/${generateSlugFromName(tool.name)}`}
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
                      <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                        {tool.rating != null && (
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                              {tool.rating.toFixed(1)}
                            </span>
                          </div>
                        )}
                        <span className="text-xs text-slate-400 dark:text-slate-500">
                          {tool.pricing}
                        </span>
                        <span
                          className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                            tool.needs_vpn
                              ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300'
                              : 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
                          }`}
                          title={
                            tool.needs_vpn
                              ? 'Region-locked: may be unreachable in some regions'
                              : 'Global access: reachable without a VPN'
                          }
                        >
                          {tool.needs_vpn ? 'Region-locked' : 'Global access'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-slate-600 dark:text-gray-300 line-clamp-2 mb-3 group-hover:text-slate-900 dark:hover:text-white transition-colors">
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
