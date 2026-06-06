'use client';

import React, { useState, useMemo, useRef, useEffect, memo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import StarRating from './StarRating';
import SkeletonCard from './Skeleton';
import { useToast } from './Toast';
import { debugLog } from '../utils/debug';
import { playSaveSound, playUnsaveSound, playCompareSound, playSearchSound } from '../utils/sound';
import CardParticleEffect from './CardParticleEffect';
import EnhancedHeroEffect from './EnhancedHeroEffect';

// 高亮搜索关键词的辅助函数
const highlightText = (text: string, searchTerm: string) => {
  if (!searchTerm.trim()) {
    return <>{text}</>;
  }

  const parts = text.split(new RegExp(`(${searchTerm})`, 'gi'));
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === searchTerm.toLowerCase() ? (
          <span key={i} className="bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200 rounded px-1">
            {part}
          </span>
        ) : (
          part
        )
      )}
    </>
  );
};

// Memoized Tool Card Component
const ToolCard = memo(function ToolCard({
  tool,
  index,
  search,
  isSaved,
  isSelectedForCompare,
  toggleSave,
  toggleCompare,
  hasAffiliate,
  ctaText,
  heartBurst,
  getCategoryColors,
  getPricingColors,
  getSkillLevelColors,
  getAffiliateLink,
  router,
  comparePulse,
  onLongPress,
  shortcutNumber,
  onSwipeCategory
}: {
  tool: any;
  index: number;
  search: string;
  isSaved: boolean;
  isSelectedForCompare: boolean;
  toggleSave: (id: number) => void;
  toggleCompare: (id: number) => void;
  hasAffiliate: boolean;
  ctaText: string;
  heartBurst: boolean;
  getCategoryColors: (cat: string) => any;
  getPricingColors: (pricing: string) => any;
  getSkillLevelColors: (level: 'beginner' | 'intermediate' | 'advanced') => any;
  getAffiliateLink: (tool: any) => string;
  router: any;
  comparePulse: boolean;
  onLongPress: (tool: any) => void;
  shortcutNumber?: number;
  onSwipeCategory?: (direction: 'left' | 'right') => void;
}) {
  const colors = getCategoryColors(tool.category);
  const pricingColors = getPricingColors(tool.pricing);
  const [saveAnimating, setSaveAnimating] = useState(false);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const [isLongPress, setIsLongPress] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const lastTapRef = useRef<number>(0);
  const [doubleTapHeart, setDoubleTapHeart] = useState(false);
  const touchStartXRef = useRef<number>(0);
  const touchStartYRef = useRef<number>(0);
  const [swipeOffset, setSwipeOffset] = useState(0);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData('text/plain', String(tool.id));
    e.dataTransfer.effectAllowed = 'copy';
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsLongPress(false);
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
    longPressTimer.current = setTimeout(() => {
      setIsLongPress(true);
      if (navigator.vibrate) navigator.vibrate(10);
      onLongPress(tool);
    }, 500);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
    const deltaX = e.touches[0].clientX - touchStartXRef.current;
    const deltaY = e.touches[0].clientY - touchStartYRef.current;
    // Only horizontal swipe (not vertical scroll)
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
      setSwipeOffset(deltaX * 0.3);
    }
  };

  const handleTouchEnd = (_e: React.TouchEvent) => {
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
    
    const deltaX = swipeOffset;
    // Swipe detection
    if (Math.abs(deltaX) > 40 && onSwipeCategory) {
      onSwipeCategory(deltaX > 0 ? 'right' : 'left');
    }
    setSwipeOffset(0);
    
    // Double-tap detection
    const now = Date.now();
    if (now - lastTapRef.current < 300) {
      toggleSave(tool.id);
      setDoubleTapHeart(true);
      setTimeout(() => setDoubleTapHeart(false), 500);
    }
    lastTapRef.current = now;
  };

  return (
    <div
      key={tool.id}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={`group bg-white dark:bg-gray-900 border border-slate-200/60 dark:border-gray-800 shadow-sm rounded-2xl overflow-hidden hover:border-emerald-300 dark:hover:border-emerald-600 hover:shadow-xl hover:shadow-emerald-500/5 hover:-translate-y-1 active:scale-[0.98] transition-all duration-300 ease-out animate-fade-in-up focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 block relative select-none ${isDragging ? 'opacity-50 scale-[0.98]' : ''} ${hasAffiliate ? 'affiliate-card' : ''}`}
      style={{
        animationDelay: `${index * 50}ms`,
        willChange: 'transform',
        transform: swipeOffset ? `translateX(${swipeOffset}px)` : undefined,
        transition: swipeOffset ? 'none' : undefined,
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchMove={handleTouchMove}
      onTouchCancel={handleTouchEnd}
    >
      {/* Particle Effect */}
      <CardParticleEffect active={true} />
      
      {/* Shimmer effect for affiliate cards */}
      {hasAffiliate && (
        <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
          <div className="shimmer-sweep" />
        </div>
      )}
      
      {/* Staff Pick Badge for affiliate tools */}
      {hasAffiliate && (
        <div className="absolute top-3 right-3 z-10">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/25 animate-pulse-glow">
            🏷️ Staff Pick
          </span>
        </div>
      )}
      
      {/* Category Color Bar - 3px Height */}
      <div className={`h-0.75 w-full ${colors.bg}`} style={{ height: '3px' }} />
      
      {shortcutNumber && (
        <div className="absolute top-2 left-2 z-10">
          <kbd className="px-1 py-0.5 text-[9px] font-mono font-bold bg-slate-900/60 dark:bg-white/20 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            Alt+{shortcutNumber}
          </kbd>
        </div>
      )}
      {doubleTapHeart && (
        <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
          <span className="text-5xl animate-ping opacity-80">❤️</span>
        </div>
      )}
      
      <div className="p-3 sm:p-5">
        {/* Tool Header with Compare Checkbox */}
        <div className="flex items-start justify-between gap-2 sm:gap-3 mb-2 sm:mb-3">
          <div className="flex items-center gap-2 sm:gap-2.5">
            <Link
              href={`/tools/${tool.id}`}
              className={`w-8 h-8 sm:w-11 sm:h-11 rounded-xl ${colors.bg}/10 dark:${colors.bgDark} ${colors.textLight} dark:${colors.text} flex items-center justify-center text-xs sm:text-xl font-bold hover:scale-105 transition-transform duration-300 ease-out`}
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              {tool.name.charAt(0)}
            </Link>
            <div className="min-w-0">
              <Link href={`/tools/${tool.id}`} className="inline-block">
                <h3 className="font-semibold text-sm sm:text-lg text-slate-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors truncate">
                  {highlightText(tool.name, search)}
                </h3>
              </Link>
              <div className="flex items-center gap-1.5 mt-0.5">
                {tool.needs_vpn ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    🪜 VPN
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                    ✅ Direct
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 relative">
            <button
              onClick={(e) => {
                e.preventDefault();
                toggleCompare(tool.id);
              }}
              className={`w-6 h-6 rounded border-2 transition-all duration-300 ease-out flex items-center justify-center ${
                isSelectedForCompare
                  ? 'bg-emerald-500 border-emerald-500 text-white'
                  : 'border-slate-300 dark:border-slate-600 hover:border-emerald-400'
              }`}
              aria-label={`Select ${tool.name} for comparison`}
              title="Select for comparison"
            >
              {isSelectedForCompare && (
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
            {comparePulse && (
              <div className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-30" />
            )}
            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap ${pricingColors.bg} ${pricingColors.text}`}>
              {tool.pricing}
            </span>
          </div>
        </div>

        {/* Description - linkable to tool page */}
        <Link href={`/tools/${tool.id}`} className="block">
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed mt-2 sm:mt-3 mb-2 sm:mb-3 line-clamp-2 hover:text-gray-900 dark:hover:text-gray-100 transition-colors text-xs sm:text-base">
            {highlightText(tool.description, search)}
          </p>
        </Link>

        {/* Star Rating */}
        <div className="flex items-center gap-2 mb-3">
          <StarRating
            rating={tool.rating || 4.0}
            count={tool.rating_count || 0}
            size="sm"
          />
        </div>

        {/* Skill Level & Best For Tags */}
        <div className="mb-3 space-y-1.5">
          {tool.skill_level && (
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap ${getSkillLevelColors(tool.skill_level).bg} ${getSkillLevelColors(tool.skill_level).text}`}>
              {getSkillLevelColors(tool.skill_level).label}
            </span>
          )}
          <div className="flex flex-wrap gap-1.5">
            {tool.best_for?.slice(0, 3).map((tag: string, i: number) => (
              <span
                key={i}
                className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3">
          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${colors.bg} text-white dark:${colors.bgDark} dark:${colors.text} whitespace-nowrap`}>
            {tool.category}
          </span>
          
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => router.push(`/compare?tool=${tool.id}`)}
              className="inline-flex items-center justify-center gap-0.5 sm:gap-1.5 px-1.5 sm:px-3 min-h-[44px] min-w-[44px] border border-gray-300 dark:border-gray-600 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm text-gray-600 dark:text-gray-400 text-xs sm:text-sm font-semibold rounded-lg transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-white dark:hover:bg-gray-800 hover:border-emerald-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:shadow-md focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2 focus-visible:outline-none active:scale-[0.98]"
            >
              <svg
                className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7h12M8 12h12M8 17h12M4 7h.01M4 12h.01M4 17h.01"
                />
              </svg>
              <span className="hidden sm:inline">Compare</span>
            </button>
            <a
              href={getAffiliateLink(tool) || tool.url}
              target="_blank"
              rel="noopener noreferrer sponsored"
              onClick={(e) => {
                debugLog('ToolClick', `CTA clicked: ${tool.name} (affiliate: ${hasAffiliate})`);
                try {
                  const url = new URL(getAffiliateLink(tool) || tool.url);
                  const domain = url.hostname.replace('www.', '');
                  window.dispatchEvent(new CustomEvent('useaitools:external-link', { detail: { domain } }));
                } catch { /* ignore */ }
              }}
              className={`inline-flex items-center justify-center gap-0.5 sm:gap-1.5 px-1.5 sm:px-3 min-h-[44px] min-w-[44px] text-xs sm:text-sm font-semibold rounded-lg transition-all duration-300 ease-out hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:outline-none active:scale-[0.98] ${
                hasAffiliate
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-sm hover:from-emerald-600 hover:to-teal-600 hover:shadow-md hover:shadow-emerald-500/25 border border-transparent'
                  : 'border border-emerald-300 dark:border-emerald-600/30 bg-white/10 backdrop-blur-md dark:bg-gray-800/30 text-emerald-600 dark:text-emerald-400 hover:bg-gradient-to-r hover:from-emerald-500 hover:to-teal-500 hover:text-white hover:border-transparent'
              }`}
            >
              <svg
                className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 17L17 7"
                />
              </svg>
              <span className="sm:hidden text-[10px]">Visit</span>
              <span className="hidden sm:inline">{ctaText}</span>
              {hasAffiliate && <span className="hidden sm:inline text-[10px] opacity-60 ml-0.5">via partner</span>}
            </a>
            <button
              onClick={(e) => {
                e.preventDefault();
                setSaveAnimating(true);
                setTimeout(() => setSaveAnimating(false), 400);
                toggleSave(tool.id);
              }}
              className={`inline-flex items-center justify-center gap-0.5 px-1.5 min-h-[44px] min-w-[44px] rounded-lg text-xs sm:text-sm font-semibold transition-all duration-300 ease-out relative overflow-hidden whitespace-nowrap active:scale-[0.98] ${
                isSaved
                  ? 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300 hover:bg-rose-200 dark:hover:bg-rose-500/30'
                  : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              } ${saveAnimating ? 'scale-125' : ''}`}
              aria-label={isSaved ? `Unsave ${tool.name}` : `Save ${tool.name}`}
            >
              {isSaved ? (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              )}
              {heartBurst && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="w-4 h-4 bg-rose-500 rounded-full animate-heart-burst" />
                </span>
              )}
              <span className="hidden sm:inline ml-1">{isSaved ? 'Saved' : 'Save'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

type Tool = {
  id: number;
  name: string;
  description: string;
  category: string;
  pricing: string;
  url: string;
  affiliate_link: string;
  icon_url: string;
  examples?: { prompt: string; image_url: string }[];
  needs_vpn: boolean;
  languages: string[];
  rating?: number;
  rating_count?: number;
  skill_level?: 'beginner' | 'intermediate' | 'advanced';
  best_for?: string[];
};

// Helper function to check if a tool has affiliate link (environment variable or JSON field)
const hasAffiliateLink = (tool: Tool): boolean => {
  const envVarName = `AFFILIATE_${tool.name.toUpperCase().replace(/\s+/g, '_')}`;
  let shortEnvVarName = '';
  if (tool.name === 'Rytr') {
    shortEnvVarName = 'AFFILIATE_RYTR';
  } else if (tool.name === 'VEED.io') {
    shortEnvVarName = 'AFFILIATE_VEED';
  } else if (tool.name === 'Murf AI') {
    shortEnvVarName = 'AFFILIATE_MURF';
  } else if (tool.name === 'Pictory') {
    shortEnvVarName = 'AFFILIATE_PICTORY';
  }
  const envLink = (shortEnvVarName && process.env[shortEnvVarName]) || process.env[envVarName];
  return !!(envLink || tool.affiliate_link);
};

// Helper function to get affiliate link for a tool with UTM parameters
const getAffiliateLink = (tool: Tool): string => {
  const envVarName = `AFFILIATE_${tool.name.toUpperCase().replace(/\s+/g, '_')}`;
  let shortEnvVarName = '';
  if (tool.name === 'Rytr') {
    shortEnvVarName = 'AFFILIATE_RYTR';
  } else if (tool.name === 'VEED.io') {
    shortEnvVarName = 'AFFILIATE_VEED';
  } else if (tool.name === 'Murf AI') {
    shortEnvVarName = 'AFFILIATE_MURF';
  } else if (tool.name === 'Pictory') {
    shortEnvVarName = 'AFFILIATE_PICTORY';
  }
  const envLink = (shortEnvVarName && process.env[shortEnvVarName]) || process.env[envVarName];
  const baseLink = envLink || tool.affiliate_link;
  
  if (!baseLink) return '';
  
  // Add UTM parameters for tracking
  const url = new URL(baseLink);
  url.searchParams.set('utm_source', 'useaitools');
  url.searchParams.set('utm_medium', 'referral');
  url.searchParams.set('utm_campaign', 'staff_pick');
  return url.toString();
};

// CTA A/B test variants
const ctaVariants = {
  A: 'Get Started for Free',
  B: 'Get Started for Free',
};

type Category = string;

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  date: string;
  description: string;
  category: string;
  images?: Array<{
    url: string;
    alt: string;
  }>;
}

interface HomeClientProps {
  initialTools: Tool[];
  featuredTools: Tool[];
  blogPosts: BlogPost[];
  totalCount: number;
}

export default function HomeClient({ initialTools, featuredTools, blogPosts, totalCount }: HomeClientProps) {
  const [displayedTools, setDisplayedTools] = useState<Tool[]>(initialTools);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<Category[]>(['All']);
  const [selectedPricing, setSelectedPricing] = useState<string>('All');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const blurTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();
  const toolsGridRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [savedIds, setSavedIds] = useState<number[]>([]);
  const [selectedForCompare, setSelectedForCompare] = useState<number[]>([]);
  const [heartBurst, setHeartBurst] = useState<{ [key: number]: boolean }>({});
  const [recentlyViewedIds, setRecentlyViewedIds] = useState<number[]>([]);
  const [ctaVariant, setCtaVariant] = useState<keyof typeof ctaVariants>('A');
  const heartBurstRefs = useRef<{ [key: number]: HTMLSpanElement | null }>({});
  const categoryButtonsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const loadMoreTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [showWelcomeTip, setShowWelcomeTip] = useState(false);
  const [comparePulse, setComparePulse] = useState<{ [key: number]: boolean }>({});
  const [showNewContentBanner, setShowNewContentBanner] = useState(false);
  const [showRestoredNotice, setShowRestoredNotice] = useState(false);
  const { addToast } = useToast();

  // Pull to refresh state
  const [pullStartY, setPullStartY] = useState(0);
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showPullIndicator, setShowPullIndicator] = useState(false);

  // Long press menu state
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  
  // Load localStorage data after mount (SSR-safe)
  useEffect(() => {
    // Load saved tools
    try {
      const saved = localStorage.getItem('savedTools');
      if (saved) setSavedIds(JSON.parse(saved));
    } catch { /* ignore */ }
    
    // Load recently viewed
    try {
      const recent = localStorage.getItem('recentlyViewed');
      if (recent) setRecentlyViewedIds(JSON.parse(recent));
    } catch { /* ignore */ }

    try {
      const searches = localStorage.getItem('recentSearches');
      if (searches) setRecentSearches(JSON.parse(searches));
    } catch { /* ignore */ }
    
    // Load CTA variant (A/B test)
    try {
      const stored = localStorage.getItem('ctaVariant') as keyof typeof ctaVariants;
      if (stored === 'A' || stored === 'B') {
        setCtaVariant(stored);
      } else {
        const v = Math.random() < 0.5 ? 'A' : 'B';
        setCtaVariant(v);
        localStorage.setItem('ctaVariant', v);
      }
    } catch { /* ignore */ }

    // Check if first visit
    try {
      const hasVisited = localStorage.getItem('hasVisitedBefore');
      if (!hasVisited) {
        setShowWelcomeTip(true);
        localStorage.setItem('hasVisitedBefore', 'true');
        setTimeout(() => setShowWelcomeTip(false), 10000);
      }
    } catch { /* ignore */ }

    // Check for new content since last visit
    try {
      const lastVisit = localStorage.getItem('lastVisitTimestamp');
      const now = Date.now();
      if (lastVisit) {
        const lastVisitTime = parseInt(lastVisit, 10);
        const daysSinceLastVisit = (now - lastVisitTime) / (1000 * 60 * 60 * 24);
        if (daysSinceLastVisit > 1) {
          const dismissedBanner = localStorage.getItem('dismissedNewContentBanner');
          if (!dismissedBanner || parseInt(dismissedBanner, 10) < lastVisitTime) {
            setShowNewContentBanner(true);
          }
        }
      }
      localStorage.setItem('lastVisitTimestamp', String(now));
    } catch { /* ignore */ }
  }, []);

  // Save filter preferences to localStorage
  useEffect(() => {
    try {
      const hasVisited = localStorage.getItem('useaitools_visited');
      if (hasVisited) {
        localStorage.setItem('useaitools_prefs', JSON.stringify({
          selectedCategories,
          selectedPricing,
        }));
      }
    } catch {}
  }, [selectedCategories, selectedPricing]);

  // Restore filter preferences on first visit (not first-time users)
  useEffect(() => {
    try {
      const hasVisited = localStorage.getItem('useaitools_visited');
      if (!hasVisited) {
        localStorage.setItem('useaitools_visited', 'true');
        return;
      }
      const prefs = localStorage.getItem('useaitools_prefs');
      if (prefs) {
        const parsed = JSON.parse(prefs);
        if (parsed.selectedCategories && parsed.selectedCategories.length > 0 && !parsed.selectedCategories.includes('All')) {
          setSelectedCategories(parsed.selectedCategories);
          setShowRestoredNotice(true);
          setTimeout(() => setShowRestoredNotice(false), 3000);
        }
        if (parsed.selectedPricing && parsed.selectedPricing !== 'All') {
          setSelectedPricing(parsed.selectedPricing);
          setShowRestoredNotice(true);
          setTimeout(() => setShowRestoredNotice(false), 3000);
        }
      }
    } catch {}
  }, []);

  const saveRecentSearch = (term: string) => {
    if (!term.trim()) return;
    try {
      const updated = [term, ...recentSearches.filter(s => s !== term)].slice(0, 5);
      setRecentSearches(updated);
      localStorage.setItem('recentSearches', JSON.stringify(updated));
    } catch { /* ignore */ }
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  const removeRecentSearch = (termToRemove: string) => {
    const updated = recentSearches.filter(s => s !== termToRemove);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  const loadMoreTools = async () => {
    if (isLoadingMore || !hasMore) return;
    
    if (loadMoreTimeoutRef.current) {
      clearTimeout(loadMoreTimeoutRef.current);
    }
    
    loadMoreTimeoutRef.current = setTimeout(async () => {
      setIsLoadingMore(true);
      try {
        const nextPage = page + 1;
        const response = await fetch(`/api/tools?page=${nextPage}&limit=20`);
        const data = await response.json();
        setDisplayedTools(prev => [...prev, ...data.tools]);
        setPage(nextPage);
        setHasMore(data.hasMore);
      } catch (error) {
        console.error('Failed to load more tools:', error);
      } finally {
        setIsLoadingMore(false);
      }
    }, 300);
  };

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !isLoadingMore && hasMore) {
        loadMoreTools();
      }
    }, { threshold: 0.1, rootMargin: '200px' });

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [isLoadingMore, hasMore, page]);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (loadMoreTimeoutRef.current) {
        clearTimeout(loadMoreTimeoutRef.current);
      }
      if (blurTimeoutRef.current) {
        clearTimeout(blurTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (displayedTools.length > 0) {
      const newIds = displayedTools.map(t => t.id);
      localStorage.setItem('allDisplayedToolIds', JSON.stringify(newIds));
    }
  }, [displayedTools]);
  
  // Keyboard navigation for search box (Esc to clear, Enter to search page)
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const itemCount = search.trim() ? autocompleteItems.length : recentSearches.length;
    if (e.key === 'Escape') {
      setSearch('');
      setShowSuggestions(false);
      setSelectedIndex(-1);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < itemCount - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : itemCount - 1));
    } else if (e.key === 'Enter') {
      if (selectedIndex >= 0 && selectedIndex < itemCount) {
        e.preventDefault();
        if (search.trim()) {
          const item = autocompleteItems[selectedIndex];
          if (item) {
            if (item.type === 'tool') {
              setSearch(item.name);
              saveRecentSearch(item.name);
            } else {
              saveRecentSearch(item.name);
              router.push(`/blog/${blogPosts.find(p => p.id === item.id)?.slug || ''}`);
            }
            setShowSuggestions(false);
            setSelectedIndex(-1);
          }
        } else {
          const term = recentSearches[selectedIndex];
          if (term) {
            setSearch(term);
            setShowSuggestions(false);
            setSelectedIndex(-1);
          }
        }
      } else if (search.trim()) {
        saveRecentSearch(search.trim());
        router.push(`/search?q=${encodeURIComponent(search.trim())}`);
      }
    }
  };

  // Auto scroll to tools grid when search is entered
  useEffect(() => {
    if (search.trim()) {
      toolsGridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setShowWelcomeTip(false);
    }
  }, [search]);

  // Navigate to search page
  const goToSearchPage = () => {
    if (search.trim()) {
      debugLog('Search', `Navigating to search page: "${search.trim()}"`);
      playSearchSound();
      router.push(`/search?q=${encodeURIComponent(search.trim())}`);
    }
  };

  // Search suggestions - popular tools and categories
  const popularSearches = [
    { type: 'category', label: 'AI Writing Tools', value: 'writing' },
    { type: 'category', label: 'AI Image Generators', value: 'image' },
    { type: 'category', label: 'AI Video Tools', value: 'video' },
    { type: 'category', label: 'AI Audio Tools', value: 'audio' },
    { type: 'category', label: 'AI Code Tools', value: 'code' },
    { type: 'category', label: 'AI Productivity Tools', value: 'productivity' },
  ];

  // Get popular tools by rating count
  const popularTools = useMemo(() => {
    return [...displayedTools]
      .sort((a, b) => (b.rating_count || 0) - (a.rating_count || 0))
      .slice(0, 3);
  }, [displayedTools]);

  // Get search suggestions based on input
  const searchSuggestions = useMemo(() => {
    const suggestions: { type: string; label: string; value: string; toolId?: number }[] = [];

    if (!search.trim()) {
      // Add categories first
      suggestions.push(...popularSearches);
      
      // Add popular tools sorted by rating_count descending
      const sortedTools = [...displayedTools].sort((a, b) => (b.rating_count || 0) - (a.rating_count || 0));
      const topTools = sortedTools.slice(0, 8);
      topTools.forEach(tool => {
        suggestions.push({
          type: 'tool',
          label: tool.name,
          value: tool.name,
          toolId: tool.id
        });
      });
    } else {
      const query = search.toLowerCase();
      // Add matching tools
      displayedTools.forEach(tool => {
        if (tool.name.toLowerCase().includes(query)) {
          suggestions.push({
            type: 'tool',
            label: tool.name,
            value: tool.name,
            toolId: tool.id,
          });
        }
      });

      // Add matching categories
      popularSearches.forEach(category => {
        if (category.label.toLowerCase().includes(query)) {
          suggestions.push(category);
        }
      });
    }

    return suggestions.slice(0, 10);
  }, [search, displayedTools]);

  const autocompleteItems = useMemo(() => {
    if (!search.trim()) return [];
    const query = search.toLowerCase();
    const items: { type: 'tool' | 'blog'; name: string; category: string; id: number; score: number }[] = [];
    
    displayedTools.forEach(tool => {
      if (items.length >= 8) return;
      const nameMatch = tool.name.toLowerCase().includes(query);
      const descMatch = tool.description.toLowerCase().includes(query);
      if (nameMatch || descMatch) {
        items.push({
          type: 'tool',
          name: tool.name,
          category: tool.category,
          id: tool.id,
          score: nameMatch ? (tool.rating || 4) * 10 : (tool.rating || 4)
        });
      }
    });
    
    blogPosts.forEach(post => {
      if (items.length >= 10) return;
      if (post.title.toLowerCase().includes(query) || post.description.toLowerCase().includes(query)) {
        const titleMatch = post.title.toLowerCase().includes(query);
        items.push({
          type: 'blog',
          name: post.title,
          category: post.category,
          id: post.id,
          score: titleMatch ? 50 : 20
        });
      }
    });
    
    return items.sort((a, b) => b.score - a.score).slice(0, 5);
  }, [search, displayedTools, blogPosts]);

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: { type: string; label: string; value: string; toolId?: number }) => {
    if (suggestion.type === 'tool' && suggestion.toolId) {
      router.push(`/tools/${suggestion.toolId}`);
    } else if (suggestion.type === 'category') {
      router.push(`/category/${suggestion.value}`);
    } else {
      router.push(`/search?q=${encodeURIComponent(suggestion.label)}`);
    }
    setSearch(suggestion.label);
    setShowSuggestions(false);
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const searchContainer = document.querySelector('.search-container');
      if (searchContainer && !searchContainer.contains(target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Keyboard navigation for category buttons (arrow keys)
  const handleCategoryKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      const nextIndex = (index + 1) % categories.length;
      categoryButtonsRef.current[nextIndex]?.focus();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prevIndex = (index - 1 + categories.length) % categories.length;
      categoryButtonsRef.current[prevIndex]?.focus();
    }
  };
  
  // Save toggle function with heart burst effect
  const toggleSave = (id: number) => {
    const wasSaved = savedIds.includes(id);
    debugLog('Save', wasSaved ? `Removing tool ${id}` : `Saving tool ${id}`);
    if (wasSaved) {
      playUnsaveSound();
    } else {
      playSaveSound();
    }
    const newSavedIds = wasSaved
      ? savedIds.filter((savedId) => savedId !== id)
      : [...savedIds, id];
    setSavedIds(newSavedIds);
    localStorage.setItem('savedTools', JSON.stringify(newSavedIds));
    
    if (!wasSaved) {
      setHeartBurst(prev => ({ ...prev, [id]: true }));
      setTimeout(() => {
        setHeartBurst(prev => ({ ...prev, [id]: false }));
      }, 500);
      addToast('❤️ Added to favorites', 'success');
    } else {
      addToast('Removed from favorites', 'info');
    }
  };

  // Toggle tool for comparison
  const toggleCompare = (id: number) => {
    const wasSelected = selectedForCompare.includes(id);
    debugLog('Compare', wasSelected ? `Removing tool ${id} from compare` : `Adding tool ${id} to compare`);
    if (!wasSelected) playCompareSound();
    setSelectedForCompare(prev => {
      if (wasSelected) {
        return prev.filter(toolId => toolId !== id);
      } else {
        setComparePulse(prev => ({ ...prev, [id]: true }));
        setTimeout(() => setComparePulse(prev => ({ ...prev, [id]: false })), 600);
        addToast('📊 Added to compare', 'success');
        if (prev.length >= 2) {
          return prev.slice(1).concat(id);
        }
        return prev.concat(id);
      }
    });
  };

  // Pull to refresh functions
  const handleTouchStartPull = (e: React.TouchEvent) => {
    if (window.scrollY === 0 && !isRefreshing) {
      setPullStartY(e.touches[0].clientY);
    }
  };

  const handleTouchMovePull = (e: React.TouchEvent) => {
    if (window.scrollY === 0 && !isRefreshing && pullStartY) {
      const currentY = e.touches[0].clientY;
      const distance = currentY - pullStartY;
      if (distance > 0) {
        setPullDistance(distance);
        setShowPullIndicator(true);
      }
    }
  };

  const handleTouchEndPull = async () => {
    if (pullDistance > 60 && !isRefreshing) {
      setIsRefreshing(true);
      // Simulate refresh
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Reset tools to initial state
      setDisplayedTools(initialTools);
      setPage(1);
      setIsRefreshing(false);
      addToast('✅ Page refreshed', 'success');
    }
    setPullDistance(0);
    setShowPullIndicator(false);
    setPullStartY(0);
  };

  // Long press menu handlers
  const handleLongPress = (tool: Tool) => {
    setSelectedTool(tool);
    setShowMenu(true);
  };

  const closeMenu = () => {
    setShowMenu(false);
    setTimeout(() => setSelectedTool(null), 300);
  };

  const handleMenuAction = (action: string) => {
    if (!selectedTool) return;
    
    switch (action) {
      case 'favorite':
        toggleSave(selectedTool.id);
        break;
      case 'compare':
        toggleCompare(selectedTool.id);
        break;
      case 'copy':
        if (navigator.clipboard) {
          navigator.clipboard.writeText(selectedTool.url);
          addToast('🔗 Link copied to clipboard', 'success');
        }
        break;
      case 'details':
        router.push(`/tools/${selectedTool.id}`);
        break;
    }
    closeMenu();
  };
  


  const categories: Category[] = ['All', 'Writing', 'Image', 'Productivity', 'Code', 'Audio', 'Video'];
  const pricingOptions: string[] = ['All', 'Free', 'Freemium', 'Free Trial', 'Paid', 'Open Source'];

  // Daily Discovery - seeded by date, same tool for all users on same day
  const dailyPick = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10); // "2026-06-02"
    const dismissed = typeof window !== 'undefined' ? localStorage.getItem('dailyPickDismissed') : '';
    if (dismissed === today) return null;
    
    // Seed a pseudo-random index from date
    let hash = 0;
    for (let i = 0; i < today.length; i++) {
      hash = ((hash << 5) - hash) + today.charCodeAt(i);
      hash |= 0;
    }
    
    // Filter high-rated but less popular tools (hidden gems)
    const candidates = displayedTools.filter(t => 
      (t.rating || 0) >= 4.0 && !savedIds.includes(t.id)
    );
    if (candidates.length === 0) return null;
    
    return candidates[Math.abs(hash) % candidates.length];
  }, [displayedTools, savedIds]);

  // Mystery Box logic
  const getMysteryCount = () => {
    try {
      const today = new Date().toISOString().slice(0, 10);
      const stored = localStorage.getItem('mysteryBoxCount');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.date === today) return parsed.count;
      }
      return 0;
    } catch { return 0; }
  };

  const incrementMysteryCount = () => {
    try {
      const today = new Date().toISOString().slice(0, 10);
      const newCount = mysteryCount + 1;
      localStorage.setItem('mysteryBoxCount', JSON.stringify({ date: today, count: newCount }));
      setMysteryCount(newCount);
    } catch {}
  };

  const openMysteryBox = () => {
    const unsaved = displayedTools.filter(t => !savedIds.includes(t.id));
    if (unsaved.length === 0) return;
    const random = unsaved[Math.floor(Math.random() * unsaved.length)];
    setMysteryTool(random);
    setMysteryRevealed(false);
    
    // Generate 3 hints
    const hints: string[] = [];
    const categoryHints: Record<string, string> = {
      'Writing': 'This tool helps you write faster',
      'Image': 'This tool creates stunning visuals',
      'Video': 'This tool brings videos to life',
      'Audio': 'This tool transforms audio content',
      'Code': 'This tool supercharges your coding',
      'Productivity': 'This tool boosts your productivity',
    };
    hints.push(categoryHints[random.category] || 'This tool uses AI in creative ways');
    
    if (random.pricing === 'Free' || random.pricing === 'Freemium') {
      hints.push('Free plan available');
    } else {
      hints.push('Premium quality experience');
    }
    
    const ratingHint = (random.rating || 4.0) >= 4.5 ? 'Loved by users worldwide' : 'Highly rated by the community';
    hints.push(ratingHint);
    
    setMysteryHints(hints);
    setShowMysteryBox(true);
    incrementMysteryCount();
  };

  // Initialize mystery count
  useEffect(() => {
    setMysteryCount(getMysteryCount());
  }, []);

  // Debounced search with 300ms delay
  const [debouncedSearch, setDebouncedSearch] = useState('');
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      if (search.trim()) {
        debugLog('Search', `Debounced search: "${search}"`);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Synonym map for search enhancement
  const searchSynonyms: Record<string, string[]> = {
    'photo': ['image', 'picture', 'visual'],
    'picture': ['image', 'photo', 'visual'],
    'image': ['photo', 'picture', 'visual'],
    'video': ['movie', 'film', 'animation'],
    'audio': ['music', 'sound', 'voice', 'speech'],
    'voice': ['audio', 'speech', 'tts'],
    'writing': ['text', 'content', 'copy', 'writer'],
    'writer': ['writing', 'text', 'content'],
    'code': ['programming', 'developer', 'coding'],
    'coding': ['code', 'programming', 'developer'],
    'text': ['writing', 'content', 'writer'],
    'music': ['audio', 'sound'],
    'art': ['image', 'design', 'creative'],
    'design': ['image', 'art', 'creative'],
  };

  // Levenshtein distance for typo tolerance
  const levenshtein = (a: string, b: string): number => {
    const matrix: number[][] = [];
    for (let i = 0; i <= b.length; i++) matrix[i] = [i];
    for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        matrix[i][j] = b[i-1] === a[j-1]
          ? matrix[i-1][j-1]
          : Math.min(matrix[i-1][j-1]+1, matrix[i][j-1]+1, matrix[i-1][j]+1);
      }
    }
    return matrix[b.length][a.length];
  };

  // Enhanced search matching
  const fuzzyMatch = (text: string, query: string): { match: boolean; score: number } => {
    const lowerText = text.toLowerCase();
    const lowerQuery = query.toLowerCase();
    
    // Exact substring match (highest score)
    if (lowerText.includes(lowerQuery)) {
      const index = lowerText.indexOf(lowerQuery);
      return { match: true, score: index === 0 ? 100 : 80 };
    }
    
    // Synonym match
    const synonyms = searchSynonyms[lowerQuery];
    if (synonyms) {
      for (const syn of synonyms) {
        if (lowerText.includes(syn)) {
          return { match: true, score: 60 };
        }
      }
    }
    
    // Typo tolerance: check each word in text against query
    const words = lowerText.split(/\s+/);
    for (const word of words) {
      if (word.length >= 3 && lowerQuery.length >= 3) {
        const dist = levenshtein(word.substring(0, lowerQuery.length + 2), lowerQuery);
        if (dist <= 1) {
          return { match: true, score: 40 };
        }
      }
    }
    
    return { match: false, score: 0 };
  };

  // 智能排序：优先展示海外 AI 工具（needs_vpn: true），中文工具排在后面
  const filteredTools = useMemo(() => {
    const filtered = displayedTools.map((tool) => {
      if (!debouncedSearch.trim()) {
        const matchesCategory = selectedCategories.includes('All') || selectedCategories.includes(tool.category);
        const matchesPricing = selectedPricing === 'All' || tool.pricing === selectedPricing;
        return { tool, score: 0, matches: matchesCategory && matchesPricing };
      }
      
      const nameMatch = fuzzyMatch(tool.name, debouncedSearch);
      const descMatch = fuzzyMatch(tool.description, debouncedSearch);
      const matchesSearch = nameMatch.match || descMatch.match;
      const searchScore = Math.max(nameMatch.score, descMatch.score * 0.7);
      
      const matchesCategory = selectedCategories.includes('All') || selectedCategories.includes(tool.category);
      const matchesPricing = selectedPricing === 'All' || tool.pricing === selectedPricing;
      
      return { tool, score: searchScore, matches: matchesSearch && matchesCategory && matchesPricing };
    }).filter(item => item.matches);
    
    // Sort by relevance score (search), then Staff Pick, then VPN, then name
    return [...filtered].sort((a, b) => {
      // Search relevance first
      if (debouncedSearch.trim()) {
        if (a.score !== b.score) return b.score - a.score;
      }
      
      const aHasAffiliate = hasAffiliateLink(a.tool);
      const bHasAffiliate = hasAffiliateLink(b.tool);
      if (aHasAffiliate && !bHasAffiliate) return -1;
      if (!aHasAffiliate && bHasAffiliate) return 1;

      if (a.tool.needs_vpn && !b.tool.needs_vpn) return -1;
      if (!a.tool.needs_vpn && b.tool.needs_vpn) return 1;

      return a.tool.name.localeCompare(b.tool.name);
    }).map(item => item.tool);
  }, [debouncedSearch, selectedCategories, selectedPricing, displayedTools]);

  useEffect(() => {
    if (!selectedCategories.includes('All') || selectedPricing !== 'All' || debouncedSearch) {
      setIsFilterTransitioning(true);
      const timer = setTimeout(() => setIsFilterTransitioning(false), 300);
      return () => clearTimeout(timer);
    }
  }, [selectedCategories, selectedPricing, debouncedSearch]);

  useEffect(() => {
    const handleOpenTool = (e: Event) => {
      const { index } = (e as CustomEvent).detail;
      const tool = filteredTools[index];
      if (tool) {
        debugLog('Shortcut', `Alt+${index + 1} opening tool: ${tool.name}`);
        router.push(`/tools/${tool.id}`);
      }
    };

    window.addEventListener('useaitools:open-tool', handleOpenTool);
    return () => window.removeEventListener('useaitools:open-tool', handleOpenTool);
  }, [filteredTools, router]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      const hasUnsubmittedSearch = search.trim().length > 0;
      const hasUnviewedCompare = selectedForCompare.length > 0;
      if (hasUnsubmittedSearch || hasUnviewedCompare) {
        e.preventDefault();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [search, selectedForCompare]);

  // Save scroll position and filter state before navigating away
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a[href^="/tools/"]');
      if (anchor) {
        try {
          sessionStorage.setItem('useaitools_scrollY', String(window.scrollY));
          sessionStorage.setItem('useaitools_filters', JSON.stringify({
            selectedCategories,
            selectedPricing,
            search
          }));
        } catch { /* ignore */ }
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [selectedCategories, selectedPricing, search]);

  // Restore scroll position and filter state on return
  useEffect(() => {
    try {
      const isBackNavigation = sessionStorage.getItem('useaitools_scrollY');
      if (isBackNavigation) {
        const filters = sessionStorage.getItem('useaitools_filters');
        if (filters) {
          const parsed = JSON.parse(filters);
          if (parsed.selectedCategories && parsed.selectedCategories.length > 0) setSelectedCategories(parsed.selectedCategories);
          if (parsed.selectedPricing) setSelectedPricing(parsed.selectedPricing);
          if (parsed.search) setSearch(parsed.search);
        }
        const scrollY = parseInt(isBackNavigation, 10);
        sessionStorage.removeItem('useaitools_scrollY');
        sessionStorage.removeItem('useaitools_filters');
        requestAnimationFrame(() => {
          window.scrollTo(0, scrollY);
        });
      }
    } catch { /* ignore */ }
  }, []);

  const getCategoryColors = (category: string) => {
    switch (category) {
      case 'Writing':
        return {
          bg: 'bg-blue-500',
          bgDark: 'bg-blue-500/20',
          text: 'text-blue-300',
          textLight: 'text-blue-600',
          border: 'border-blue-300',
          ring: 'hover:shadow-blue-500/20',
          shadow: 'rgba(59, 130, 246, 0.4)',
        };
      case 'Image':
        return {
          bg: 'bg-violet-500',
          bgDark: 'bg-violet-500/20',
          text: 'text-violet-300',
          textLight: 'text-violet-600',
          border: 'border-violet-300',
          ring: 'hover:shadow-violet-500/20',
          shadow: 'rgba(139, 92, 246, 0.4)',
        };
      case 'Productivity':
        return {
          bg: 'bg-teal-500',
          bgDark: 'bg-teal-500/20',
          text: 'text-teal-300',
          textLight: 'text-teal-600',
          border: 'border-teal-300',
          ring: 'hover:shadow-teal-500/20',
          shadow: 'rgba(20, 184, 166, 0.4)',
        };
      case 'Code':
        return {
          bg: 'bg-orange-500',
          bgDark: 'bg-orange-500/20',
          text: 'text-orange-300',
          textLight: 'text-orange-600',
          border: 'border-orange-300',
          ring: 'hover:shadow-orange-500/20',
          shadow: 'rgba(249, 115, 22, 0.4)',
        };
      case 'Audio':
        return {
          bg: 'bg-pink-500',
          bgDark: 'bg-pink-500/20',
          text: 'text-pink-300',
          textLight: 'text-pink-600',
          border: 'border-pink-300',
          ring: 'hover:shadow-pink-500/20',
          shadow: 'rgba(236, 72, 153, 0.4)',
        };
      case 'Video':
        return {
          bg: 'bg-indigo-500',
          bgDark: 'bg-indigo-500/20',
          text: 'text-indigo-300',
          textLight: 'text-indigo-600',
          border: 'border-indigo-300',
          ring: 'hover:shadow-indigo-500/20',
          shadow: 'rgba(99, 102, 241, 0.4)',
        };
      default:
        return {
          bg: 'bg-slate-500',
          bgDark: 'bg-slate-500/20',
          text: 'text-slate-300',
          textLight: 'text-slate-600',
          border: 'border-slate-300',
          ring: 'hover:shadow-slate-500/20',
          shadow: 'rgba(100, 116, 139, 0.4)',
        };
    }
  };

  const getPricingColors = (pricing: string) => {
    switch (pricing) {
      case 'Freemium':
        return {
          bg: 'bg-emerald-100 dark:bg-emerald-500/20',
          text: 'text-emerald-700 dark:text-emerald-300',
        };
      case 'Free Trial':
        return {
          bg: 'bg-blue-100 dark:bg-blue-500/20',
          text: 'text-blue-700 dark:text-blue-300',
        };
      case 'Paid':
        return {
          bg: 'bg-slate-100 dark:bg-slate-800',
          text: 'text-slate-700 dark:text-slate-300',
        };
      case 'Open Source':
        return {
          bg: 'bg-purple-100 dark:bg-purple-500/20',
          text: 'text-purple-700 dark:text-purple-300',
        };
      default:
        return {
          bg: 'bg-slate-100 dark:bg-slate-800',
          text: 'text-slate-700 dark:text-slate-300',
        };
    }
  };

  const getSkillLevelColors = (level: string) => {
    switch (level) {
      case 'beginner':
        return {
          bg: 'bg-emerald-100 dark:bg-emerald-500/20',
          text: 'text-emerald-700 dark:text-emerald-300',
          label: '🌱 Beginner',
        };
      case 'intermediate':
        return {
          bg: 'bg-amber-100 dark:bg-amber-500/20',
          text: 'text-amber-700 dark:text-amber-300',
          label: '🔥 Intermediate',
        };
      case 'advanced':
        return {
          bg: 'bg-rose-100 dark:bg-rose-500/20',
          text: 'text-rose-700 dark:text-rose-300',
          label: '⚡ Advanced',
        };
      default:
        return {
          bg: 'bg-slate-100 dark:bg-slate-800',
          text: 'text-slate-700 dark:text-slate-300',
          label: '🌱 Beginner',
        };
    }
  };

  const [showBanner, setShowBanner] = useState(true);
  const [showDailyPick, setShowDailyPick] = useState(true);
  const [showMysteryBox, setShowMysteryBox] = useState(false);
  const [mysteryTool, setMysteryTool] = useState<Tool | null>(null);
  const [mysteryRevealed, setMysteryRevealed] = useState(false);
  const [mysteryHints, setMysteryHints] = useState<string[]>([]);
  const [mysteryCount, setMysteryCount] = useState(0);

  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isFilterTransitioning, setIsFilterTransitioning] = useState(false);

  useEffect(() => {
    setSpeechSupported(
      typeof window !== 'undefined' &&
      ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)
    );
  }, []);

  const startVoiceSearch = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setSearch(transcript);
      setShowSuggestions(true);
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const handleDragOverCompare = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    setIsDragOver(true);
  };

  const handleDragLeaveCompare = () => {
    setIsDragOver(false);
  };

  const handleDropCompare = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const toolId = parseInt(e.dataTransfer.getData('text/plain'), 10);
    if (!isNaN(toolId) && !selectedForCompare.includes(toolId)) {
      toggleCompare(toolId);
    }
  };

  const tooltipMap: Record<string, string> = {
    'All': 'Browse all AI tools',
    'Writing': 'Discover AI Writing assistants',
    'Image': 'Explore AI Image generators',
    'Productivity': 'Boost productivity with AI',
    'Code': 'AI Coding companions',
    'Audio': 'AI Audio tools',
    'Video': 'AI Video creation'
  };

  return (
    <div 
      className="min-h-screen bg-slate-50 dark:bg-gray-950 relative overflow-x-hidden"
      onTouchStart={handleTouchStartPull}
      onTouchMove={handleTouchMovePull}
      onTouchEnd={handleTouchEndPull}
      onTouchCancel={handleTouchEndPull}
    >
      {/* Pull to refresh indicator */}
      {showPullIndicator && (
        <div 
          className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center transition-all duration-200"
          style={{ transform: `translateY(${Math.min(pullDistance * 0.5, 80)}px)`, paddingTop: '10px' }}
        >
          <div className={`flex flex-col items-center gap-2 ${isRefreshing ? 'animate-pulse' : ''}`}>
            <svg 
              className={`w-6 h-6 text-emerald-500 ${isRefreshing ? 'animate-spin' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
              />
            </svg>
            <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
              {isRefreshing ? 'Refreshing...' : pullDistance > 60 ? 'Release to refresh' : 'Pull to refresh'}
            </span>
          </div>
        </div>
      )}
      {/* New Content Banner */}
      {showNewContentBanner && (
        <div className="bg-emerald-50 dark:bg-emerald-950/30 border-b border-emerald-200 dark:border-emerald-800 py-3 px-4 z-10 relative animate-slide-in">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-3">
            <span className="text-sm sm:text-base font-medium text-emerald-700 dark:text-emerald-300">
              🆕 New tools added since your last visit. Check them out!
            </span>
            <button
              onClick={() => {
                setShowNewContentBanner(false);
                try {
                  localStorage.setItem('dismissedNewContentBanner', String(Date.now()));
                } catch { /* ignore */ }
              }}
              className="p-1 hover:bg-emerald-200 dark:hover:bg-emerald-800 rounded-full transition-colors duration-200"
              aria-label="Dismiss new content notification"
            >
              <svg className="w-4 h-4 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
      {/* Announcement Banner */}
      {showBanner && (
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 z-10 relative">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-3">
            <span className="text-lg">🚀</span>
            <p className="text-center text-sm sm:text-base font-medium">
              Now featuring 50+ AI tools across 6 categories. New tools added weekly!
            </p>
            <button
              onClick={() => setShowBanner(false)}
              className="ml-2 p-1 hover:bg-white/20 rounded-full transition-colors duration-200"
              aria-label="Close announcement"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
      <div className="py-6 sm:py-16 px-3 sm:px-8 relative z-10">
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        {/* Hero Section with Glow */}
        <div className="text-center mb-8 sm:mb-16 relative">
          {/* Enhanced Hero Background Effect */}
          <EnhancedHeroEffect />
          {/* Background Breathing Glow - Only Desktop */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent rounded-full blur-3xl animate-breathe pointer-events-none hidden sm:block" />
          
          <img src="/logo.png" alt="Use AI Tools Logo - Discover the best AI tools" className="h-8 sm:h-12 lg:h-14 w-auto mx-auto mb-2 sm:mb-3 relative z-10" width="72" height="43" loading="eager" decoding="async" />
          <h1 className="text-2xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight mb-1 sm:mb-2 relative z-10">
            <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              Use AI Tools
            </span>
          </h1>
          <p className="text-sm sm:text-xl lg:text-3xl font-light text-emerald-600 dark:text-emerald-400 mb-2 sm:mb-4 relative z-10">
            Your AI Toolbox
          </p>
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-lg max-w-2xl mx-auto mb-4 sm:mb-8 relative z-10 leading-relaxed">
            Discover and compare AI tools in our comprehensive AI tools directory. Find the best AI tools for writing, images, video, and more. Curated weekly.
          </p>
          
          {/* Trust Signal */}
          <div className="mb-4 sm:mb-8 relative z-10">
            <p className="text-[10px] sm:text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
              Built in public by an indie maker from an internet café in China. 690+ tools handpicked, not paid for.
            </p>
          </div>
          
          {/* Search Box */}
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
                className="w-full px-3 sm:px-5 py-2 sm:py-3 pl-9 sm:pl-14 pr-16 sm:pr-24 h-9 sm:h-11 text-sm sm:text-base rounded-2xl bg-white dark:bg-gray-900 border border-slate-200/60 dark:border-gray-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-300 dark:focus:border-emerald-600 shadow-sm transition-all duration-300 ease-out"
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

          {/* Help Me Choose + Submit Tool + Mystery Box Buttons */}
          <div className="text-center mb-6 sm:mb-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/compare"
              className="inline-flex items-center gap-2 px-5 py-2.5 border-2 border-emerald-600 dark:border-emerald-500 text-emerald-600 dark:text-emerald-400 font-semibold rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-500/10 hover:-translate-y-0.5 transition-all duration-300 text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              Help Me Choose
            </Link>
            <Link
              href="/submit"
              className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 rounded-full hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-all duration-300 min-h-[44px]"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Submit a Tool
            </Link>
            <button
              onClick={openMysteryBox}
              disabled={mysteryCount >= 3}
              className={`inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold rounded-full transition-all duration-300 min-h-[44px] ${
                mysteryCount >= 3
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-amber-400 to-orange-400 dark:from-amber-500 dark:to-orange-500 text-white hover:shadow-lg hover:shadow-amber-400/25 hover:-translate-y-0.5 active:scale-[0.98]'
              }`}
            >
              🎁 Mystery Box {mysteryCount >= 3 ? '(Done today)' : `(${3 - mysteryCount} left)`}
            </button>
          </div>

          {/* Today's Discovery - Daily Pick */}
          {showDailyPick && dailyPick && (() => {
            const colors = getCategoryColors(dailyPick.category);
            const reasons = [
              'A hidden gem worth exploring',
              'Highly rated but often overlooked',
              'Users love this underrated tool',
              'Try something new today',
              'A fresh pick just for you',
            ];
            const today = new Date().toISOString().slice(0, 10);
            let hash = 0;
            for (let i = 0; i < today.length; i++) {
              hash = ((hash << 5) - hash) + today.charCodeAt(i);
              hash |= 0;
            }
            const reason = reasons[Math.abs(hash) % reasons.length];
            return (
              <div className="mb-6 sm:mb-8">
                <div className="bg-gradient-to-r from-emerald-50 via-white to-teal-50 dark:from-emerald-950/30 dark:via-gray-900 dark:to-teal-950/30 border border-emerald-200/60 dark:border-emerald-800/40 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-lg transition-all duration-300 relative overflow-hidden">
                  <button
                    onClick={() => {
                      setShowDailyPick(false);
                      try { localStorage.setItem('dailyPickDismissed', today); } catch {}
                    }}
                    className="absolute top-2 right-2 p-1 hover:bg-emerald-200 dark:hover:bg-emerald-800 rounded-full transition-colors z-10"
                    aria-label="Dismiss daily pick"
                  >
                    <svg className="w-4 h-4 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-sm">
                      💡 Daily Pick
                    </span>
                  </div>
                  <div className="flex items-center gap-3 sm:gap-4">
                    <Link
                      href={`/tools/${dailyPick.id}`}
                      className={`w-10 h-10 sm:w-14 sm:h-14 rounded-xl ${colors.bg}/10 dark:${colors.bgDark} ${colors.textLight} dark:${colors.text} flex items-center justify-center text-lg sm:text-2xl font-bold shrink-0 hover:scale-105 transition-transform duration-300`}
                      style={{ fontFamily: 'Playfair Display, serif' }}
                    >
                      {dailyPick.name.charAt(0)}
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link href={`/tools/${dailyPick.id}`} className="inline-block">
                        <h3 className="font-bold text-sm sm:text-lg text-slate-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors truncate">
                          🌟 {dailyPick.name}
                        </h3>
                      </Link>
                      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5 truncate">{reason}</p>
                    </div>
                    <Link
                      href={`/tools/${dailyPick.id}`}
                      className="shrink-0 inline-flex items-center gap-1 px-3 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 min-h-[44px]"
                    >
                      Try It →
                    </Link>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Recently Viewed Quick Access */}
          {recentlyViewedIds.length > 0 && (
            <div className="mb-4 sm:mb-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400">🕐 Recently Viewed</span>
              </div>
              <div className="flex overflow-x-auto scrollbar-hide gap-2 pb-1">
                {recentlyViewedIds.slice(0, 5).map((toolId) => {
                  const tool = displayedTools.find(t => t.id === toolId);
                  if (!tool) return null;
                  const colors = getCategoryColors(tool.category);
                  return (
                    <Link
                      key={tool.id}
                      href={`/tools/${tool.id}`}
                      className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-full whitespace-nowrap hover:border-emerald-300 dark:hover:border-emerald-600 hover:shadow-md transition-all duration-300 ease-out shrink-0"
                    >
                      <span className={`w-5 h-5 rounded-md ${colors.bg}/10 dark:${colors.bgDark} ${colors.textLight} dark:${colors.text} flex items-center justify-center text-[10px] font-bold`} style={{ fontFamily: 'Playfair Display, serif' }}>
                        {tool.name.charAt(0)}
                      </span>
                      <span className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate max-w-[100px]">{tool.name}</span>
                      <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${colors.bg} text-white dark:${colors.bgDark} dark:${colors.text}`}>
                        {tool.category}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* For You - Personalized Recommendations */}
          {(() => {
            const viewedCategories: Record<string, number> = {};
            recentlyViewedIds.forEach(id => {
              const t = displayedTools.find(tool => tool.id === id);
              if (t) viewedCategories[t.category] = (viewedCategories[t.category] || 0) + 1;
            });
            const topCategory = Object.entries(viewedCategories).sort((a, b) => b[1] - a[1])[0]?.[0];
            const unviewed = displayedTools.filter(t => !recentlyViewedIds.includes(t.id));
            const forYouTools = topCategory
              ? unviewed.filter(t => t.category === topCategory).sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 3)
              : unviewed.sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 3);
            
            if (forYouTools.length === 0) return null;
            return (
              <div className="mb-4 sm:mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs sm:text-sm font-semibold text-emerald-600 dark:text-emerald-400">🫵 For You</span>
                  {topCategory && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 font-medium">
                      Based on your {topCategory} interest
                    </span>
                  )}
                </div>
                <div className="flex overflow-x-auto scrollbar-hide gap-2 pb-1">
                  {forYouTools.map((tool) => {
                    const colors = getCategoryColors(tool.category);
                    return (
                      <Link
                        key={tool.id}
                        href={`/tools/${tool.id}`}
                        className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-emerald-50 to-white dark:from-emerald-950/20 dark:to-gray-900 border border-emerald-200/60 dark:border-emerald-800/40 rounded-full whitespace-nowrap hover:border-emerald-400 dark:hover:border-emerald-600 hover:shadow-md transition-all duration-300 ease-out shrink-0"
                      >
                        <span className={`w-5 h-5 rounded-md ${colors.bg}/10 dark:${colors.bgDark} ${colors.textLight} dark:${colors.text} flex items-center justify-center text-[10px] font-bold`} style={{ fontFamily: 'Playfair Display, serif' }}>
                          {tool.name.charAt(0)}
                        </span>
                        <span className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate max-w-[100px]">{tool.name}</span>
                        <span className="text-[10px] text-amber-500 font-semibold">★ {tool.rating || '4.5'}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })()}

          {/* Category Buttons */}
          <div className="relative" data-tour="categories">
            {/* Left Gradient Fade */}
            <div className="absolute left-0 top-0 bottom-0 w-6 sm:w-10 bg-gradient-to-r from-slate-50 dark:from-gray-950 to-transparent pointer-events-none z-10" />
            {/* Right Gradient Fade */}
            <div className="absolute right-0 top-0 bottom-0 w-6 sm:w-10 bg-gradient-to-l from-slate-50 dark:from-gray-950 to-transparent pointer-events-none z-10" />
            
            <div className="flex overflow-x-auto scrollbar-hide gap-1 sm:gap-2.5 sm:justify-center sm:flex-wrap px-2 sm:px-0 py-1">
              {categories.map((category, index) => {
                const isActive = category === 'All' ? selectedCategories.includes('All') : selectedCategories.includes(category);
                
                const buttonStyle = `px-2 py-1 sm:px-4 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 ease-out active:scale-[0.98] whitespace-nowrap focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none min-h-[44px] flex items-center justify-center ${
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
                      if (category === 'All') {
                        setSelectedCategories(['All']);
                      } else {
                        setSelectedCategories(prev => {
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
                    className={buttonStyle}
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
          
          {/* Pricing Filter Dropdown */}
          <div className="flex justify-center mt-4 mb-2">
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
          {(!selectedCategories.includes('All') || selectedPricing !== 'All' || debouncedSearch) && (
            <div className="flex justify-center mt-2 mb-2">
              <button
                onClick={() => {
                  setSelectedCategories(['All']);
                  setSelectedPricing('All');
                  setSearch('');
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
          {showRestoredNotice && (
            <div className="flex justify-center mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 animate-fade-in-up">
                🔄 Filters restored from last visit
              </span>
            </div>
          )}
          {(!selectedCategories.includes('All') || selectedPricing !== 'All') && (
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
          
          {/* Search Result Count */}
          <div className="text-center mb-8">
            <p className={`text-sm sm:text-lg font-semibold text-slate-600 dark:text-slate-300 ${
              search.trim() || !selectedCategories.includes('All') || selectedPricing !== 'All' ? 'animate-pulse' : ''
            }`}>
              {search.trim() || !selectedCategories.includes('All') || selectedPricing !== 'All' ? (
                filteredTools.length === 0 ? (
                  <span className="text-rose-500 dark:text-rose-400">No tools found</span>
                ) : (
                  `Showing ${filteredTools.length} tool${filteredTools.length !== 1 ? 's' : ''}`
                )
              ) : (
                `Showing all ${displayedTools.length} of ${totalCount} tools`
              )}
            </p>
          </div>
        </div>

        {/* Our Products */}
        <div className="mb-8 sm:mb-16">
          <div className="text-center mb-4 sm:mb-8">
            <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-2 sm:mb-3">
              🚀 Our Products
            </h2>
            <p className="text-slate-600 dark:text-gray-400">
              Affordable AI tools built for real creators with real budgets
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6">
            {/* Use AI Writer */}
            <div className="bg-white dark:bg-gray-900 border-2 border-emerald-200 dark:border-emerald-500/20 rounded-2xl p-3 sm:p-6 shadow-sm hover:shadow-xl hover:shadow-emerald-500/5 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-transparent to-teal-500/5 pointer-events-none" />
              {/* Live Now Badge */}
              <div className="absolute top-3 right-3 z-10">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/25">
                  ✨ Live Now
                </span>
              </div>
              <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">🖋️</div>
              <h3 className="font-bold text-sm sm:text-lg text-slate-900 dark:text-white mb-1 sm:mb-2">Use AI Writer</h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-gray-300 mb-3 sm:mb-4 leading-relaxed line-clamp-2">
                Write 3x faster with AI — try it free. The AI writing tool built for creators who refuse to overpay. $5/mo vs Jasper $49/mo.
              </p>
              <div className="flex items-center gap-2 mb-4">
                <span className="px-2 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">$5/mo</span>
                <span className="px-2 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">Writing</span>
              </div>
              <a
                href="https://tryaiwriter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 sm:py-3 h-9 sm:h-11 text-sm sm:text-base bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 min-h-[44px] whitespace-nowrap"
              >
                Try It Free →
              </a>
            </div>

            {/* Use AI Image */}
            <div className="bg-white dark:bg-gray-900 border-2 border-violet-200 dark:border-violet-500/20 rounded-2xl p-3 sm:p-6 shadow-sm hover:shadow-xl hover:shadow-violet-500/5 hover:-translate-y-1 transition-all duration-300">
              <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">🎨</div>
              <h3 className="font-bold text-sm sm:text-lg text-slate-900 dark:text-white mb-1 sm:mb-2">Use AI Image</h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-gray-300 mb-3 sm:mb-4 leading-relaxed line-clamp-2">
                Create stunning visuals in seconds. Text to image, multiple art styles, commercial use allowed.
              </p>
              <div className="flex items-center gap-2 mb-4">
                <span className="px-2 py-1 rounded-full text-xs font-semibold bg-violet-100 dark:bg-violet-500/20 text-violet-700 dark:text-violet-300">$7/mo</span>
                <span className="px-2 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">Image</span>
              </div>
              <Link
                href="/image"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 sm:py-3 h-9 sm:h-11 text-sm sm:text-base bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-semibold rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 min-h-[44px] whitespace-nowrap"
              >
                Learn More →
              </Link>
            </div>

            {/* Mobile App */}
            <div className="bg-white dark:bg-gray-900 border-2 border-slate-200 dark:border-slate-500/20 rounded-2xl p-3 sm:p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-3 right-3">
                <span className="px-2 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">Coming Soon</span>
              </div>
              <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">📱</div>
              <h3 className="font-bold text-sm sm:text-lg text-slate-900 dark:text-white mb-1 sm:mb-2">Mobile App</h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-gray-300 mb-3 sm:mb-4 leading-relaxed line-clamp-2">
                Your favorite AI tools, now in your pocket. Push notifications, offline access, widget support.
              </p>
              <div className="flex items-center gap-2 mb-4">
                <span className="px-2 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">Free</span>
                <span className="px-2 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">iOS & Android</span>
              </div>
              <Link
                href="/mobile"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 sm:py-3 h-9 sm:h-11 text-sm sm:text-base bg-slate-800 dark:bg-slate-700 text-white font-semibold rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 opacity-70 min-h-[44px] whitespace-nowrap"
              >
                Join Waitlist →
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Blog Posts */}
        <div className="mb-8 sm:mb-16">
          <div className="flex items-center justify-between mb-4 sm:mb-8">
            <div>
              <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-1 sm:mb-2">
                📝 Recent Blog Posts
              </h2>
              <p className="text-slate-600 dark:text-gray-400">
                Guides, comparisons, and tips to get the most out of AI tools
              </p>
            </div>
            <Link href="/blog" className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 rounded-full hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-all duration-300">
              View All →
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
            {[...blogPosts]
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .slice(0, 5)
              .map((post, index) => {
                const getCategoryColors = (category: string) => {
                  switch (category) {
                    case 'Writing': return { bg: 'bg-blue-500', text: 'text-blue-500' };
                    case 'Image': return { bg: 'bg-violet-500', text: 'text-violet-500' };
                    case 'Video': return { bg: 'bg-indigo-500', text: 'text-indigo-500' };
                    case 'Audio': return { bg: 'bg-pink-500', text: 'text-pink-500' };
                    case 'Productivity': return { bg: 'bg-teal-500', text: 'text-teal-500' };
                    default: return { bg: 'bg-slate-500', text: 'text-slate-500' };
                  }
                };
                const colors = getCategoryColors(post.category);
                return (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="group bg-white dark:bg-gray-900 border border-slate-200/60 dark:border-gray-800 rounded-2xl p-3 sm:p-5 shadow-sm hover:shadow-xl hover:shadow-emerald-500/5 hover:-translate-y-1 transition-all duration-300 ease-out animate-fade-in-up"
                    style={{ 
                      animationDelay: `${index * 50}ms`,
                      opacity: 0,
                      animationFillMode: 'forwards'
                    }}
                  >
                    {post.images?.[0] && (
                      <img
                        src={post.images[0].url}
                        alt={post.images[0].alt}
                        className="w-full h-28 sm:h-40 object-cover rounded-xl mb-3 sm:mb-4"
                        loading="lazy"
                        decoding="async"
                      />
                    )}
                    <div className="flex items-center gap-2 mb-2 sm:mb-3">
                      <span className="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {post.category}
                      </span>
                      <span className="text-[10px] sm:text-xs text-slate-400 dark:text-gray-500">
                        {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                    <h3 className="font-bold text-sm sm:text-lg text-slate-900 dark:text-white mb-1 sm:mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-gray-300 leading-relaxed line-clamp-2 mb-2 sm:mb-4">
                      {post.description}
                    </p>
                    <div className="flex items-center gap-1 font-semibold text-xs sm:text-sm text-emerald-600 dark:text-emerald-400">
                      Read More →
                    </div>
                  </Link>
                );
              })}
          </div>
        </div>

        {/* Browse by Use Case */}
        <div className="mb-8 sm:mb-16">
          <div className="text-center mb-4 sm:mb-8">
            <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-2 sm:mb-3">
              Browse by Use Case
            </h2>
            <p className="text-slate-600 dark:text-gray-400">
              Compare AI tools and find the best AI writing tools, AI image generators, and AI video tools for your workflow
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            {[
              {
                title: 'Content Creation',
                description: 'Writing & Images',
                icon: '✍️',
                href: '/category/writing',
                color: 'bg-blue-500/10 hover:bg-blue-500/20',
              },
              {
                title: 'Software Development',
                description: 'Code & Dev',
                icon: '💻',
                href: '/category/code',
                color: 'bg-orange-500/10 hover:bg-orange-500/20',
              },
              {
                title: 'Video Production',
                description: 'Video Editing',
                icon: '🎬',
                href: '/category/video',
                color: 'bg-indigo-500/10 hover:bg-indigo-500/20',
              },
              {
                title: 'Podcast & Audio',
                description: 'Voice & Sound',
                icon: '🎙️',
                href: '/category/audio',
                color: 'bg-pink-500/10 hover:bg-pink-500/20',
              },
              {
                title: 'Business & Productivity',
                description: 'Workflows',
                icon: '📊',
                href: '/category/productivity',
                color: 'bg-teal-500/10 hover:bg-teal-500/20',
              },
              {
                title: 'Student & Education',
                description: 'Learning',
                icon: '📚',
                href: '/category/writing',
                color: 'bg-purple-500/10 hover:bg-purple-500/20',
              },
              {
                title: 'AI Workflows',
                description: 'Step-by-step guides',
                icon: '🔄',
                href: '/workflows',
                color: 'bg-emerald-500/10 hover:bg-emerald-500/20',
              },
            ].map((useCase) => (
              <Link
                key={useCase.title}
                href={useCase.href}
                className={`group p-3 sm:p-5 rounded-xl ${useCase.color} border border-transparent hover:border-slate-200 dark:hover:border-gray-700 transition-all duration-300 ease-out hover:-translate-y-1`}
              >
                <div className="text-2xl sm:text-3xl mb-2 sm:mb-3">{useCase.icon}</div>
                <h3 className="font-semibold text-slate-900 dark:text-white text-xs sm:text-sm mb-0.5 sm:mb-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors truncate">
                  {useCase.title}
                </h3>
                <p className="text-[10px] sm:text-xs text-slate-500 dark:text-gray-400 truncate">
                  {useCase.description}
                </p>
              </Link>
            ))}
          </div>
        </div>

        {/* Featured This Week */}
        <div className="mb-8 sm:mb-16">
          <div className="flex items-center gap-2 mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              🔥 Featured This Week
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {featuredTools.map((tool, index) => {
              const colors = getCategoryColors(tool.category);
              return (
                <div
                  key={tool.id}
                  className="shimmer-card bg-white dark:bg-gray-900 border border-slate-200/60 dark:border-gray-800 rounded-2xl p-3 sm:p-5 shadow-sm hover:border-emerald-300 dark:hover:border-emerald-600 hover:shadow-xl hover:shadow-emerald-500/5 hover:-translate-y-1 transition-all duration-300 ease-out animate-fade-in-up"
                  style={{ 
                    willChange: 'transform', 
                    animationDelay: `${index * 50}ms`,
                    opacity: 0,
                    animationFillMode: 'forwards'
                  }}
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
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                              🪜 VPN
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
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

        {/* Blog Entry Card */}
        <div className="mb-16">
          <Link href="/blog" className="block">
            <div className="bg-gradient-to-br from-emerald-50/90 via-white to-teal-50/90 dark:from-emerald-950/70 dark:via-gray-900 dark:to-teal-950/70 backdrop-blur-xl border border-emerald-200/60 dark:border-emerald-500/10 shadow-xl shadow-emerald-500/5 dark:shadow-2xl dark:shadow-emerald-500/5 rounded-3xl p-5 sm:p-10 hover:shadow-2xl hover:shadow-emerald-500/10 hover:-translate-y-1 transition-all duration-300 ease-out">
              <div className="text-center">
                <div className="text-3xl sm:text-4xl mb-3">📝</div>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-3">
                  AI Tool Comparisons & Guides
                </h2>
                <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
                  In-depth reviews to help you choose the perfect tool
                </p>
                <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 hover:-translate-y-0.5 transition-all duration-300">
                  Explore Blog →
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Gradient Separator Line */}
        <div className="h-px bg-gradient-to-r from-transparent via-emerald-300 dark:via-emerald-700/40 to-transparent mb-16 mx-auto max-w-2xl" />

        {/* Tools Grid */}
        <div ref={toolsGridRef} className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5 md:gap-6 lg:gap-7 transition-all duration-300 ease-out ${isFilterTransitioning ? 'opacity-50' : 'opacity-100'}`} data-tour="toolcard">
          {filteredTools.map((tool, index) => {
            const isSaved = savedIds.includes(tool.id);
            const isSelectedForCompare = selectedForCompare.includes(tool.id);
            const hasAffiliate = hasAffiliateLink(tool);
            const ctaText = hasAffiliate ? ctaVariants[ctaVariant] : 'Visit Website';
            
            return (
              <ToolCard
                key={tool.id}
                tool={tool}
                index={index}
                search={search}
                isSaved={isSaved}
                isSelectedForCompare={isSelectedForCompare}
                toggleSave={toggleSave}
                toggleCompare={toggleCompare}
                hasAffiliate={hasAffiliate}
                ctaText={ctaText}
                heartBurst={!!heartBurst[tool.id]}
                getCategoryColors={getCategoryColors}
                getPricingColors={getPricingColors}
                getSkillLevelColors={getSkillLevelColors}
                getAffiliateLink={getAffiliateLink}
                router={router}
                comparePulse={!!comparePulse[tool.id]}
                onLongPress={handleLongPress}
                shortcutNumber={index < 9 ? index + 1 : undefined}
                onSwipeCategory={(direction) => {
                  const catIndex = categories.indexOf(selectedCategories.filter(c => c !== 'All')[0] || 'All');
                  if (direction === 'left' && catIndex > 0) {
                    setSelectedCategories([categories[catIndex - 1]]);
                  } else if (direction === 'right' && catIndex < categories.length - 1) {
                    setSelectedCategories([categories[catIndex + 1]]);
                  }
                }}
              />
            );
          })}
        </div>

        {/* Load More Sentinel */}
        {!isLoadingMore && hasMore && (
          <div ref={loadMoreRef} className="h-20 flex items-center justify-center" aria-label="Loading more tools">
            <div className="flex items-center gap-3 text-slate-500 dark:text-gray-400">
              <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span className="text-sm font-medium">Loading more tools...</span>
            </div>
          </div>
        )}
        {isLoadingMore && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {filteredTools.length === 0 && (
          <div className="text-center py-20">
            <div className="mx-auto w-12 h-12 sm:w-20 sm:h-20 mb-6 text-slate-300 dark:text-slate-600">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full" aria-hidden="true">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13.5 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M15 9l-6 6"
                />
              </svg>
            </div>
            <p className="text-slate-500 dark:text-slate-500 text-lg font-medium mb-4">
              So empty, so serene. Try a different search maybe?
            </p>
            {search.trim() && (
              <Link
                href={`/search?q=${encodeURIComponent(search.trim())}`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 hover:-translate-y-0.5 transition-all duration-300 mb-6"
              >
                Try searching in full page →
              </Link>
            )}
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              <span className="text-sm text-slate-400 dark:text-slate-500">Try searching:</span>
              {['ChatGPT', 'Midjourney', 'GitHub Copilot', 'DALL-E', 'Notion AI'].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => {
                    setSearch(suggestion);
                    setSelectedCategories(['All']);
                  }}
                  className="px-3 py-1.5 text-sm bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>

            {/* Top 3 Recommended Tools */}
            {(() => {
              const topRated = [...displayedTools]
                .sort((a, b) => (b.rating || 0) - (a.rating || 0))
                .slice(0, 3);
              if (topRated.length === 0) return null;
              return (
                <div className="mt-10 max-w-2xl mx-auto">
                  <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-4">⭐ Popular picks you might like</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {topRated.map((tool) => {
                      const colors = getCategoryColors(tool.category);
                      return (
                        <Link
                          key={tool.id}
                          href={`/tools/${tool.id}`}
                          className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-xl p-4 shadow-sm hover:shadow-lg hover:border-emerald-300 dark:hover:border-emerald-600 hover:-translate-y-1 transition-all duration-300 text-left relative"
                        >
                          <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-gradient-to-r from-emerald-500 to-teal-500 text-white">Recommended</span>
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`w-7 h-7 rounded-lg ${colors.bg}/10 dark:${colors.bgDark} ${colors.textLight} dark:${colors.text} flex items-center justify-center text-sm font-bold`} style={{ fontFamily: 'Playfair Display, serif' }}>
                              {tool.name.charAt(0)}
                            </span>
                            <h4 className="font-semibold text-sm text-slate-900 dark:text-white truncate">{tool.name}</h4>
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-2">{tool.description}</p>
                          <div className="flex items-center gap-1.5">
                            <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-semibold ${colors.bg} text-white dark:${colors.bgDark} dark:${colors.text}`}>{tool.category}</span>
                            <span className="text-[10px] text-amber-500 font-semibold">★ {tool.rating || '4.5'}</span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* Newsletter */}
        <div className="mt-8 sm:mt-16 mb-6 sm:mb-10">
          <div className="bg-gradient-to-br from-indigo-50/80 via-white to-purple-50/80 dark:from-indigo-950/60 dark:via-gray-900 dark:to-purple-950/60 backdrop-blur-xl border border-white/60 dark:border-indigo-500/10 shadow-xl shadow-indigo-500/5 dark:shadow-2xl dark:shadow-indigo-500/5 rounded-3xl p-4 sm:p-12 text-center">
            <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-2">
              📬 Stay Updated
            </h2>
            <p className="text-base sm:text-lg text-gray-500 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
              Get the best new AI tools delivered weekly.
            </p>
            <form
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
              onSubmit={(e) => {
                e.preventDefault();
                alert('Thanks for subscribing!');
              }}
            >
              <input
                type="email"
                placeholder="Your email"
                aria-label="Email address for newsletter"
                className="flex-1 px-5 py-3 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-slate-200 dark:border-gray-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all duration-300"
                required
              />
              <button
                type="submit"
                className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold rounded-full shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 hover:-translate-y-0.5 transition-all duration-300"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Recently Viewed Section */}
        {recentlyViewedIds.length > 0 && (
          <div className="mt-16 mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-8 text-center">
              Recently Viewed
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {recentlyViewedIds.map((toolId) => {
                const tool = displayedTools.find(t => t.id === toolId);
                if (!tool) return null;
                
                const colors = getCategoryColors(tool.category);
                const pricingColors = getPricingColors(tool.pricing);
                
                return (
                  <Link
                    key={tool.id}
                    href={`/tools/${tool.id}`}
                    className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-2xl p-5 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-out"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-10 h-10 rounded-xl ${colors.bg}/10 dark:${colors.bgDark} ${colors.textLight} dark:${colors.text} flex items-center justify-center text-xl font-bold`} style={{ fontFamily: 'Playfair Display, serif' }}>
                        {tool.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg text-slate-900 dark:text-white truncate">
                          {tool.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${colors.bgDark} ${colors.textLight} dark:${colors.text}`}>
                            {tool.category}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${pricingColors.bg} ${pricingColors.text}`}>
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
        )}

        {/* FAQ Section */}
        <div className="mt-16 mb-10">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-8 text-center">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              <details className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-2xl overflow-hidden">
                <summary className="px-6 py-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-gray-800 transition-colors duration-200 font-semibold text-slate-900 dark:text-white flex items-center justify-between">
                  <span>What is Use AI Tools?</span>
                  <svg className="w-5 h-5 text-slate-500 dark:text-gray-400 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-6 py-4 text-slate-600 dark:text-gray-300 border-t border-slate-100 dark:border-gray-800">
                  Use AI Tools is a curated directory of the best AI tools available today. We organize tools into categories like Writing, Image, Productivity, Code, Audio, and Video to help you find the perfect tool for your needs.
                </div>
              </details>
              <details className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-2xl overflow-hidden">
                <summary className="px-6 py-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-gray-800 transition-colors duration-200 font-semibold text-slate-900 dark:text-white flex items-center justify-between">
                  <span>How do I choose the right AI tool?</span>
                  <svg className="w-5 h-5 text-slate-500 dark:text-gray-400 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-6 py-4 text-slate-600 dark:text-gray-300 border-t border-slate-100 dark:border-gray-800">
                  You can browse by category, use our search function, or read our detailed comparison guides. Each tool includes a description, pricing information, and a link to the official website.
                </div>
              </details>
              <details className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-2xl overflow-hidden">
                <summary className="px-6 py-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-gray-800 transition-colors duration-200 font-semibold text-slate-900 dark:text-white flex items-center justify-between">
                  <span>Are the AI tools listed here free?</span>
                  <svg className="w-5 h-5 text-slate-500 dark:text-gray-400 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-6 py-4 text-slate-600 dark:text-gray-300 border-t border-slate-100 dark:border-gray-800">
                  We include both free and paid AI tools. Many tools offer free tiers or trials, while others require a subscription. We clearly label each tool with its pricing model for easy comparison.
                </div>
              </details>
            </div>
          </div>
        </div>

        {/* Impact 验证标签 - 不可见 */}
        <p style={{ display: 'none' }}>
          Impact-Site-Verification: 8b49f367-76f9-42f1-b988-7c24a629b8d8
        </p>
      </div>
      </div>

      {/* Mystery Box Modal */}
      {showMysteryBox && mysteryTool && (
        <>
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" onClick={() => { setShowMysteryBox(false); setMysteryRevealed(false); }} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-gray-700 max-w-md w-full overflow-hidden pointer-events-auto animate-fade-in-up">
              {!mysteryRevealed ? (
                <div className="p-6 sm:p-8 text-center">
                  <div className="text-6xl mb-4 animate-bounce">🎁</div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">What's inside?</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Here are some clues...</p>
                  <div className="space-y-3 mb-8">
                    {mysteryHints.map((hint, i) => (
                      <div key={i} className="flex items-center gap-3 px-4 py-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl text-left">
                        <span className="text-lg">💡</span>
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{hint}</span>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => setMysteryRevealed(true)}
                    className="w-full px-6 py-3 bg-gradient-to-r from-amber-400 to-orange-400 dark:from-amber-500 dark:to-orange-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 text-lg"
                  >
                    🎁 Reveal!
                  </button>
                </div>
              ) : (
                <div className="p-6 sm:p-8 text-center">
                  <div className="text-4xl mb-2">🎉</div>
                  <p className="text-xs font-semibold text-amber-500 mb-3 uppercase tracking-wider">You discovered</p>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{mysteryTool.name}</h3>
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getCategoryColors(mysteryTool.category).bg} text-white`}>
                      {mysteryTool.category}
                    </span>
                    <span className="text-amber-500 font-semibold text-sm">★ {mysteryTool.rating || '4.5'}</span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">{mysteryTool.description}</p>
                  <div className="flex flex-col gap-3">
                    <Link
                      href={`/tools/${mysteryTool.id}`}
                      onClick={() => { setShowMysteryBox(false); setMysteryRevealed(false); }}
                      className="w-full px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      View Details →
                    </Link>
                    {mysteryCount < 3 ? (
                      <button
                        onClick={() => { setMysteryRevealed(false); openMysteryBox(); }}
                        className="w-full px-6 py-3 border-2 border-slate-200 dark:border-gray-700 text-slate-700 dark:text-slate-300 font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-gray-800 transition-all duration-300"
                      >
                        🎲 Try Another
                      </button>
                    ) : (
                      <p className="text-xs text-slate-400 dark:text-slate-500">Come back tomorrow for more mystery boxes!</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Comparison Bar */}
      {selectedForCompare.length > 0 && (
        <div
          onDragOver={handleDragOverCompare}
          onDragLeave={handleDragLeaveCompare}
          onDrop={handleDropCompare}
          className={`fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-slate-200 dark:border-gray-800 shadow-2xl z-50 transform transition-all duration-300 ease-out ${isDragOver ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 shadow-emerald-500/20' : ''}`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {selectedForCompare.length === 1 ? '1 tool selected' : '2 tools selected'}
                </span>
                <div className="flex items-center gap-2">
                  {selectedForCompare.map((toolId) => {
                    const tool = displayedTools.find(t => t.id === toolId);
                    if (!tool) return null;
                    const colors = getCategoryColors(tool.category);
                    return (
                      <span key={tool.id} className={`px-3 py-1 rounded-full text-xs font-semibold ${colors.bgDark} ${colors.textLight} dark:${colors.text}`}>
                        {tool.name}
                      </span>
                    );
                  })}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedForCompare([])}
                  className="px-3 py-2 text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
                >
                  Clear
                </button>
                <Link
                  href={`/compare?tool=${selectedForCompare[0]}${selectedForCompare[1] ? `&tool=${selectedForCompare[1]}` : ''}`}
                  className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
                >
                  Compare Now →
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Long Press Menu */}
      {showMenu && selectedTool && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50" 
            onClick={closeMenu}
          />
          {/* Menu */}
          <div className="fixed bottom-0 left-0 right-0 z-50">
            <div className="bg-white dark:bg-gray-900 rounded-t-3xl shadow-2xl p-6 drawer-enter">
              <div className="w-12 h-1 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto mb-6" />
              <div className="text-center mb-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{selectedTool.name}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{selectedTool.category} • {selectedTool.pricing}</p>
              </div>
              <div className="space-y-3">
                <button 
                  onClick={() => handleMenuAction('favorite')}
                  className="w-full flex items-center gap-4 px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                    <span className="text-xl">❤️</span>
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-slate-900 dark:text-white">Save to Favorites</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Keep this tool handy for later</div>
                  </div>
                </button>
                
                <button 
                  onClick={() => handleMenuAction('compare')}
                  className="w-full flex items-center gap-4 px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                    <span className="text-xl">📊</span>
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-slate-900 dark:text-white">Add to Compare</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Compare with other tools</div>
                  </div>
                </button>
                
                <button 
                  onClick={() => handleMenuAction('copy')}
                  className="w-full flex items-center gap-4 px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                    <span className="text-xl">🔗</span>
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-slate-900 dark:text-white">Copy Tool Link</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Share this tool with others</div>
                  </div>
                </button>
                
                <button 
                  onClick={() => handleMenuAction('details')}
                  className="w-full flex items-center gap-4 px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                    <span className="text-xl">📋</span>
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-slate-900 dark:text-white">View Details</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">See full tool information</div>
                  </div>
                </button>
              </div>
              <button 
                onClick={closeMenu}
                className="w-full mt-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
