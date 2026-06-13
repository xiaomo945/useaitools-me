'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface SearchBarProps {
  search: string;
  setSearch: (value: string) => void;
  showSuggestions: boolean;
  setShowSuggestions: (value: boolean) => void;
  selectedIndex: number;
  setSelectedIndex: (value: number) => void;
  recentSearches: string[];
  clearRecentSearches: () => void;
  removeRecentSearch: (term: string) => void;
  saveRecentSearch: (term: string) => void;
  autocompleteItems: { type: 'tool' | 'blog'; name: string; category: string; id: number; score: number }[];
  popularTools: { id: number; name: string; category: string; rating?: number }[];
  blogPosts: { id: number; title: string; slug: string; date: string; description: string; category: string }[];
  router: ReturnType<typeof useRouter>;
  goToSearchPage: () => void;
  handleSearchKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  speechSupported: boolean;
  isListening: boolean;
  startVoiceSearch: () => void;
  showWelcomeTip: boolean;
  setShowWelcomeTip: (value: boolean) => void;
  searchInputRef: React.RefObject<HTMLInputElement | null>;
  blurTimeoutRef: React.MutableRefObject<NodeJS.Timeout | null>;
}

export default function SearchBar({
  search,
  setSearch,
  showSuggestions,
  setShowSuggestions,
  selectedIndex,
  setSelectedIndex,
  recentSearches,
  clearRecentSearches,
  removeRecentSearch,
  saveRecentSearch,
  autocompleteItems,
  popularTools,
  blogPosts,
  router,
  goToSearchPage,
  handleSearchKeyDown,
  speechSupported,
  isListening,
  startVoiceSearch,
  showWelcomeTip,
  setShowWelcomeTip,
  searchInputRef,
  blurTimeoutRef,
}: SearchBarProps) {
  return (
    <div className="search-container relative max-w-2xl mx-auto mb-4 sm:mb-8 px-3 sm:px-0">
      <div className="relative">
        <svg
          className="absolute left-3 sm:left-5 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          ref={searchInputRef}
          type="text"
          placeholder="Search AI tools..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setShowSuggestions(true);
            setSelectedIndex(-1);
          }}
          onFocus={() => {
            if (blurTimeoutRef.current) {
              clearTimeout(blurTimeoutRef.current);
            }
            setShowSuggestions(true);
          }}
          onBlur={() => {
            blurTimeoutRef.current = setTimeout(() => {
              setShowSuggestions(false);
              setSelectedIndex(-1);
            }, 200);
          }}
          onKeyDown={handleSearchKeyDown}
          aria-label="Search AI tools"
          autoComplete="off"
          autoCorrect="off"
          spellCheck="false"
          className="w-full px-3 sm:px-5 py-2 sm:py-3 pl-9 sm:pl-14 pr-16 sm:pr-24 h-9 sm:h-11 text-sm sm:text-base rounded-2xl bg-white dark:bg-gray-900 border border-slate-200/60 dark:border-gray-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-300 dark:focus:border-emerald-600 shadow-lg shadow-emerald-500/10 dark:shadow-emerald-500/5 ring-4 ring-emerald-500/5 dark:ring-emerald-500/3 transition-all duration-300 ease-out"
        />
        <div className="absolute right-1.5 sm:right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-0.5 sm:gap-1">
          {speechSupported && (
            <button
              onClick={startVoiceSearch}
              className={`p-1.5 sm:p-2 rounded-full transition-all duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center ${
                isListening
                  ? 'bg-red-500 text-white animate-pulse'
                  : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400'
              }`}
              aria-label={isListening ? 'Listening...' : 'Voice search'}
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </button>
          )}
          {search && (
            <button
              onClick={() => setSearch('')}
              className="p-1.5 sm:p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Clear search"
            >
              <svg className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          <button
            onClick={goToSearchPage}
            disabled={!search.trim()}
            className={`p-1.5 sm:p-2 rounded-full transition-all duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center ${
              search.trim()
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:shadow-lg hover:shadow-emerald-500/30'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
            }`}
            aria-label="Search"
          >
            <svg className="w-3.5 h-3.5 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Search Suggestions Dropdown */}
      {showSuggestions && (search.trim() || recentSearches.length > 0) && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl shadow-xl z-50 overflow-hidden">
          {search.trim() ? (
            autocompleteItems.length > 0 ? (
              <div className="py-1">
                <div className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Suggestions
                </div>
                {autocompleteItems.map((item, i) => (
                  <button
                    key={`${item.type}-${item.id}`}
                    className={`w-full text-left px-4 py-3 text-sm transition-colors flex items-center gap-3 ${i === selectedIndex ? 'bg-emerald-50 dark:bg-emerald-900/20' : 'hover:bg-emerald-50 dark:hover:bg-emerald-900/20'}`}
                    onClick={() => {
                      if (blurTimeoutRef.current) clearTimeout(blurTimeoutRef.current);
                      if (item.type === 'tool') {
                        setSearch(item.name);
                        saveRecentSearch(item.name);
                      } else {
                        saveRecentSearch(item.name);
                        const post = blogPosts.find(p => p.id === item.id);
                        if (post) router.push(`/blog/${post.slug}`);
                      }
                      setShowSuggestions(false);
                      setSelectedIndex(-1);
                    }}
                  >
                    {item.type === 'tool' ? (
                      <span className="text-sm">🛠️</span>
                    ) : (
                      <span className="text-sm">📝</span>
                    )}
                    <span className="font-medium text-slate-900 dark:text-white truncate">{item.name}</span>
                    <span className={`ml-auto text-xs px-2 py-0.5 rounded-full shrink-0 ${
                      item.type === 'tool'
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400'
                        : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-400'
                    }`}>
                      {item.type === 'tool' ? item.category : 'Blog'}
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="px-4 py-6 text-center text-sm text-slate-500">
                No results found
              </div>
            )
          ) : (
            <div className="py-1">
              {/* Popular Tools Section */}
              <div>
                <div className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  🔥 Popular Tools
                </div>
                {popularTools.map((tool, i) => (
                  <button
                    key={`popular-${tool.id}`}
                    className={`w-full text-left px-4 py-3 text-sm transition-colors flex items-center gap-3 ${i === selectedIndex ? 'bg-emerald-50 dark:bg-emerald-900/20' : 'hover:bg-emerald-50 dark:hover:bg-emerald-900/20'}`}
                    onClick={() => {
                      if (blurTimeoutRef.current) clearTimeout(blurTimeoutRef.current);
                      router.push(`/tools/${tool.id}`);
                      setShowSuggestions(false);
                      setSelectedIndex(-1);
                    }}
                  >
                    <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <span className="font-medium text-slate-900 dark:text-white truncate">{tool.name}</span>
                    <div className="ml-auto flex items-center gap-1">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 shrink-0">
                        {tool.category}
                      </span>
                      <div className="flex items-center gap-0.5">
                        <svg className="w-3 h-3 text-amber-500" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                        <span className="text-xs text-slate-500">{tool.rating}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              
              {/* Recent Searches Section */}
              <div className="border-t border-slate-200 dark:border-gray-700">
                <div className="flex items-center justify-between px-4 py-2">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Recent Searches
                  </span>
                  {recentSearches.length > 0 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        clearRecentSearches();
                      }}
                      className="text-xs text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                    >
                      Clear All
                    </button>
                  )}
                </div>
                {recentSearches.length > 0 ? (
                  recentSearches.map((term, i) => (
                    <button
                      key={i}
                      className={`w-full text-left px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-2 group ${i + popularTools.length === selectedIndex ? 'bg-emerald-50 dark:bg-emerald-900/20' : 'hover:bg-emerald-50 dark:hover:bg-emerald-900/20'}`}
                      onClick={() => {
                        if (blurTimeoutRef.current) clearTimeout(blurTimeoutRef.current);
                        setSearch(term);
                        setShowSuggestions(false);
                        setSelectedIndex(-1);
                      }}
                    >
                      <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="flex-1 truncate">{term}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeRecentSearch(term);
                        }}
                        className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-gray-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-6 text-center text-sm text-slate-500">
                    No recent searches
                  </div>
                )}
              </div>
            </div>
          )}
          {search.trim() && (
            <div className="border-t border-slate-200 dark:border-gray-700 px-3 py-2">
              <button
                onClick={() => {
                  if (blurTimeoutRef.current) clearTimeout(blurTimeoutRef.current);
                  saveRecentSearch(search.trim());
                  goToSearchPage();
                }}
                className="w-full flex items-center justify-center gap-2 text-sm text-slate-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Search for &quot;{search}&quot;
              </button>
            </div>
          )}
        </div>
      )}
      
      {/* Welcome Tip */}
      {showWelcomeTip && (
        <div className="mt-3 flex items-center justify-center gap-2 px-4 py-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-800 animate-slide-in">
          <span className="text-xl">👋</span>
          <p className="text-sm text-emerald-800 dark:text-emerald-200">
            Try searching for <span className="font-semibold">"AI writer"</span> or browse by category below
          </p>
          <button
            onClick={() => setShowWelcomeTip(false)}
            className="ml-2 p-1 rounded-full hover:bg-emerald-200 dark:hover:bg-emerald-800 transition-colors"
          >
            <svg className="w-4 h-4 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}