'use client';

import React from 'react';
import Link from 'next/link';

interface HeroSectionProps {
  mysteryCount: number;
  openMysteryBox: () => void;
  showDailyPick: boolean;
  dailyPick: { id: number; name: string; category: string; rating?: number; description: string } | null;
  getCategoryColors: (category: string) => { bg: string; bgDark: string; text: string; textLight: string; border: string; ring: string; shadow: string };
  setShowDailyPick: (value: boolean) => void;
}

export default function HeroSection({
  mysteryCount,
  openMysteryBox,
  showDailyPick,
  dailyPick,
  getCategoryColors,
  setShowDailyPick,
}: HeroSectionProps) {
  return (
    <div className="text-center mb-8 sm:mb-16 relative">
      {/* Background Breathing Glow - Only Desktop */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent rounded-full blur-3xl animate-breathe pointer-events-none hidden sm:block" />
      
      <img src="/logo.png" alt="Use AI Tools Logo - Discover the best AI tools" className="h-8 sm:h-12 lg:h-14 w-auto mx-auto mb-2 sm:mb-3 relative z-10" width="72" height="43" loading="eager" decoding="sync" fetchPriority="high" />
      <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-extrabold tracking-tight mb-2 sm:mb-3 relative z-10 max-w-3xl mx-auto leading-tight">
        <span className="text-slate-900 dark:text-white">
          Find the Best AI Tools for Any Task
        </span>
        <span className="block text-emerald-500 dark:text-emerald-400">
          All in One Place
        </span>
      </h1>
      <p className="text-sm sm:text-lg lg:text-xl text-slate-500 dark:text-slate-400 mb-2 sm:mb-5 max-w-2xl mx-auto relative z-10 leading-relaxed font-normal">
        1,400+ AI tools across 6 categories. Honest reviews. Instant comparisons. Zero fluff.
      </p>
      
      {/* Trust Signal */}
      <div className="mb-4 sm:mb-8 relative z-10">
        <p className="text-xs sm:text-sm text-slate-400 dark:text-slate-500 font-medium leading-relaxed">
          Built in public by an indie maker from an internet café. 1,400+ tools handpicked, not paid for.
        </p>
      </div>

      {/* Submit Tool + Mystery Box Buttons */}
      <div className="text-center mb-6 sm:mb-8 flex flex-wrap items-center justify-center gap-3">
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
            <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden">
              <button
                onClick={() => {
                  setShowDailyPick(false);
                  try { localStorage.setItem('dailyPickDismissed', today); } catch {}
                }}
                className="absolute top-2 right-2 p-1 hover:bg-slate-100 dark:hover:bg-gray-800 rounded-full transition-colors z-10"
                aria-label="Dismiss daily pick"
              >
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="flex items-center gap-2 mb-3">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold bg-emerald-500 text-white shadow-sm">
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
                  className="shrink-0 inline-flex items-center gap-1 px-3 sm:px-5 py-2 sm:py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-sm hover:shadow-md transition-all duration-300 min-h-[44px]"
                >
                  Try It →
                </Link>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}