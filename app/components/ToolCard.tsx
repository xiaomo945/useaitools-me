'use client';

import React, { useState, useRef, memo } from 'react';
import Link from 'next/link';

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

interface ToolCardProps {
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
}

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
}: ToolCardProps) {
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
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
      setSwipeOffset(deltaX * 0.3);
    }
  };

  const handleTouchEnd = (_e: React.TouchEvent) => {
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
    
    const deltaX = swipeOffset;
    if (Math.abs(deltaX) > 40 && onSwipeCategory) {
      onSwipeCategory(deltaX > 0 ? 'right' : 'left');
    }
    setSwipeOffset(0);
    
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
      role="article"
      aria-label={`${tool.name} - ${tool.category} tool`}
      tabIndex={0}
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
      {hasAffiliate && (
        <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
          <div className="shimmer-sweep" />
        </div>
      )}
      
      {hasAffiliate && (
        <div className="absolute top-3 right-3 z-10">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/25 animate-pulse-glow">
            🏷️ Staff Pick
          </span>
        </div>
      )}
      
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
          <span className="text-6xl animate-ping opacity-80">❤️</span>
        </div>
      )}
      
      <div className="p-3 sm:p-5">
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
              className={`group/compare w-7 h-7 rounded-lg border-2 transition-all duration-300 ease-out flex items-center justify-center relative ${
                isSelectedForCompare
                  ? 'bg-emerald-500 border-emerald-500 text-white shadow-md shadow-emerald-500/25'
                  : 'border-slate-300 dark:border-slate-600 hover:border-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/20'
              }`}
              aria-label={`Select ${tool.name} for comparison`}
              title="Add to compare"
            >
              {isSelectedForCompare ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-slate-400 group-hover/compare:text-emerald-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12M8 12h12M8 17h12M4 7h.01M4 12h.01M4 17h.01" />
                </svg>
              )}
              {!isSelectedForCompare && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full opacity-0 group-hover/compare:opacity-100 transition-opacity" />
              )}
            </button>
            {comparePulse && (
              <div className="absolute inset-0 rounded-lg bg-emerald-500 animate-ping opacity-30" />
            )}
            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap ${pricingColors.bg} ${pricingColors.text}`}>
              {tool.pricing}
            </span>
          </div>
        </div>

        <Link href={`/tools/${tool.id}`} className="block">
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed mt-2 sm:mt-3 mb-2 sm:mb-3 line-clamp-2 hover:text-gray-900 dark:hover:text-gray-100 transition-colors text-xs sm:text-base">
            {highlightText(tool.description, search)}
          </p>
        </Link>

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

        <div className="flex items-center justify-between gap-3">
          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${colors.bg} text-white dark:${colors.bgDark} dark:${colors.text} whitespace-nowrap`}>
            {tool.category}
          </span>
          
          <div className="flex items-center gap-1 sm:gap-2">
            <a
              href={getAffiliateLink(tool) || tool.url}
              target="_blank" rel="noopener noreferrer"
              onClick={(e) => {
                try {
                  const url = new URL(getAffiliateLink(tool) || tool.url);
                  const domain = url.hostname.replace('www.', '');
                  window.dispatchEvent(new CustomEvent('useaitools:external-link', { detail: { domain } }));
                } catch { /* ignore */ }
              }}
              className={`inline-flex items-center justify-center gap-0.5 sm:gap-1.5 px-1.5 sm:px-3 min-h-[44px] min-w-[44px] text-xs sm:text-sm font-semibold rounded-xl transition-all duration-300 ease-out hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none active:scale-[0.98] ${
                hasAffiliate
                  ? (ctaText || '').includes('10,000')
                    ? 'bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-sm hover:from-indigo-600 hover:to-violet-600 hover:shadow-xl hover:shadow-indigo-500/25 border border-transparent'
                    : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-sm hover:from-emerald-600 hover:to-teal-600 hover:shadow-xl hover:shadow-emerald-500/25 border border-transparent'
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
              {hasAffiliate && <span className="hidden sm:inline text-[10px] opacity-60 ml-0.5">Sponsored</span>}
            </a>
            <button
              onClick={(e) => {
                e.preventDefault();
                setSaveAnimating(true);
                setTimeout(() => setSaveAnimating(false), 400);
                toggleSave(tool.id);
              }}
              className={`inline-flex items-center justify-center gap-0.5 px-1.5 min-h-[44px] min-w-[44px] rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 ease-out relative overflow-hidden whitespace-nowrap active:scale-[0.98] ${
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
})

export default ToolCard;
