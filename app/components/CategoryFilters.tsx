'use client';

import React, { useRef } from 'react';
import { debugLog } from '../utils/debug';
import { track } from '@/lib/analytics';

interface CategoryFiltersProps {
  selectedCategories: string[];
  setSelectedCategories: (value: string[] | ((prev: string[]) => string[])) => void;
  selectedPricing: string;
  setSelectedPricing: (value: string) => void;
  vpnFilter: 'all' | 'no' | 'yes';
  setVpnFilter: (value: 'all' | 'no' | 'yes') => void;
  categories: string[];
  pricingOptions: string[];
  getCategoryColors: (category: string) => { bg: string; bgDark: string; text: string; textLight: string; border: string; ring: string; shadow: string };
  categoryButtonsRef: React.MutableRefObject<(HTMLButtonElement | null)[]>;
  handleCategoryKeyDown: (e: React.KeyboardEvent<HTMLButtonElement>, index: number) => void;
  toolsGridRef: React.RefObject<HTMLDivElement | null>;
}

const tooltipMap: Record<string, string> = {
  'All': 'Browse all AI tools',
  'Writing': 'Discover AI Writing assistants',
  'Image': 'Explore AI Image generators',
  'Productivity': 'Boost productivity with AI',
  'Code': 'AI Coding companions',
  'Audio': 'AI Audio tools',
  'Video': 'AI Video creation'
};

export default function CategoryFilters({
  selectedCategories,
  setSelectedCategories,
  selectedPricing,
  setSelectedPricing,
  vpnFilter,
  setVpnFilter,
  categories,
  pricingOptions,
  getCategoryColors,
  categoryButtonsRef,
  handleCategoryKeyDown,
  toolsGridRef,
}: CategoryFiltersProps) {
  return (
    <>
      {/* Category Buttons */}
      <div className="relative" data-tour="categories">
        {/* Left Gradient Fade */}
        <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-10 bg-gradient-to-r from-slate-50 dark:from-gray-950 to-transparent pointer-events-none z-10" />
        {/* Right Gradient Fade */}
        <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-10 bg-gradient-to-l from-slate-50 dark:from-gray-950 to-transparent pointer-events-none z-10" />
        
        <div 
          className="flex overflow-x-auto scrollbar-hide gap-1 sm:gap-2.5 sm:justify-center sm:flex-wrap px-2 sm:px-0 py-1 snap-x snap-mandatory scroll-smooth"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {categories.map((category, index) => {
            const isActive = category === 'All' ? selectedCategories.includes('All') : selectedCategories.includes(category);
            
            const buttonStyle = `px-2 py-1 sm:px-4 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 ease-out active:scale-[0.95] active:shadow-inner whitespace-nowrap focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none min-h-[44px] flex items-center justify-center touch-manipulation ${
              isActive
                ? category === 'All'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-600 text-white dark:bg-emerald-600 dark:text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 active:bg-gray-200 dark:active:bg-gray-700'
            }`;
            
            return (
              <button
                key={category}
                ref={(el) => {
                  if (el) {
                    categoryButtonsRef.current[index] = el;
                  }
                }}
                onClick={() => {
                  debugLog('Filter', `Category toggled: ${category}`);
                  track('filter', { category });
                  if (category === 'All') {
                    setSelectedCategories(['All']);
                  } else {
                    setSelectedCategories((prev: string[]) => {
                      const withoutAll = prev.filter(c => c !== 'All');
                      if (prev.includes(category)) {
                        const newCats = withoutAll.filter(c => c !== category);
                        return newCats.length === 0 ? ['All'] : newCats;
                      } else {
                        return [...withoutAll, category];
                      }
                    });
                  }
                  if (toolsGridRef.current) {
                    toolsGridRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
                onKeyDown={(e) => handleCategoryKeyDown(e, index)}
                className={`${buttonStyle} snap-start`}
                title={tooltipMap[category]}
              >
                {category}
                {category !== 'All' && selectedCategories.includes(category) && selectedCategories.length > 1 && (
                  <span className="ml-1 w-4 h-4 rounded-full bg-white/30 text-[10px] flex items-center justify-center">✓</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
      
      {/* Pricing Filter + 访问方式 */}
      <div className="flex flex-wrap items-center justify-center gap-2 mt-4 mb-2">
        {/* 免梯子 / 需梯子 —— 中文用户刚需维度 */}
        <div className="inline-flex rounded-full bg-gray-100 dark:bg-gray-800 p-0.5">
          {([
            { value: 'all', label: '全部' },
            { value: 'no', label: '免梯子' },
            { value: 'yes', label: '需梯子' },
          ] as const).map(opt => (
            <button
              key={opt.value}
              onClick={() => {
                debugLog('Filter', `VPN filter: ${opt.value}`);
                track('filter', { vpn: opt.value });
                setVpnFilter(opt.value);
              }}
              aria-pressed={vpnFilter === opt.value}
              className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 min-h-[36px] ${
                vpnFilter === opt.value
                  ? 'bg-emerald-600 text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div className="relative">
          <select
            value={selectedPricing}
            onChange={(e) => {
              debugLog('Filter', `Pricing changed: ${e.target.value}`);
              setSelectedPricing(e.target.value);
              if (toolsGridRef.current) {
                toolsGridRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }}
            aria-label="Filter by pricing type"
            className="appearance-none pl-3 sm:pl-4 pr-10 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 active:bg-gray-200 dark:active:bg-gray-700 transition-all duration-300 ease-out cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-300 border border-transparent focus:border-emerald-300 min-h-[44px]"
          >
            {pricingOptions.map((option) => (
              <option key={option} value={option}>
                {option === 'All' ? '💰 All Pricing' : option}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
      
      {/* Clear All Filters Button */}
      {(!selectedCategories.includes('All') || selectedPricing !== 'All' || vpnFilter !== 'all') && (
        <div className="flex justify-center mt-2 mb-2">
          <button
            onClick={() => {
              setSelectedCategories(['All']);
              setSelectedPricing('All');
              setVpnFilter('all');
              try { localStorage.removeItem('useaitools_prefs'); } catch {}
              debugLog('Filter', 'All filters cleared');
              if (toolsGridRef.current) {
                toolsGridRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors duration-200"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Clear All Filters
          </button>
        </div>
      )}

      {/* Active Filter Tags */}
      {(!selectedCategories.includes('All') || selectedPricing !== 'All' || vpnFilter !== 'all') && (
        <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
          {!selectedCategories.includes('All') && selectedCategories.map(cat => (
            <button
              key={cat}
              onClick={() => {
                const newCats = selectedCategories.filter(c => c !== cat);
                setSelectedCategories(newCats.length === 0 ? ['All'] : newCats);
              }}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 hover:bg-rose-100 dark:hover:bg-rose-900/30 hover:text-rose-700 dark:hover:text-rose-300 transition-colors duration-200"
            >
              {cat}
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          ))}
          {vpnFilter !== 'all' && (
            <button
              onClick={() => setVpnFilter('all')}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 hover:bg-rose-100 dark:hover:bg-rose-900/30 hover:text-rose-700 dark:hover:text-rose-300 transition-colors duration-200"
            >
              {vpnFilter === 'no' ? '免梯子' : '需梯子'}
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          {selectedPricing !== 'All' && (
            <button
              onClick={() => setSelectedPricing('All')}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-rose-100 dark:hover:bg-rose-900/30 hover:text-rose-700 dark:hover:text-rose-300 transition-colors duration-200"
            >
              💰 {selectedPricing}
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      )}
    </>
  );
}