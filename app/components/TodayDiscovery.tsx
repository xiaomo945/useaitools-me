'use client';

import { memo } from 'react';
import Link from 'next/link';

interface DailyPick {
  id: number;
  name: string;
  category: string;
}

interface TodayDiscoveryProps {
  showDailyPick: boolean;
  dailyPick: DailyPick | null;
  mysteryCount: number;
  getCategoryColors: (category: string) => any;
  setShowDailyPick: (show: boolean) => void;
  openMysteryBox: () => void;
}

const TodayDiscovery = memo(function TodayDiscovery({
  showDailyPick,
  dailyPick,
  mysteryCount,
  getCategoryColors,
  setShowDailyPick,
  openMysteryBox,
}: TodayDiscoveryProps) {
  return (
    <div className="mb-6 sm:mb-10">
      <div className="text-center mb-4">
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
          🎯 Today's Discovery
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Daily picks and surprises just for you
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-3xl mx-auto">
        {/* Daily Pick Card */}
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
            <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-4 sm:p-5 relative overflow-hidden">
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
              <div className="flex items-center gap-3">
                <Link
                  href={`/tools/${dailyPick.id}`}
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${colors.bg}/10 dark:${colors.bgDark} ${colors.textLight} dark:${colors.text} flex items-center justify-center text-lg sm:text-xl font-bold shrink-0 hover:scale-105 transition-transform duration-300`}
                  style={{ fontFamily: 'Playfair Display, serif' }}
                >
                  {dailyPick.name.charAt(0)}
                </Link>
                <div className="flex-1 min-w-0">
                  <Link href={`/tools/${dailyPick.id}`} className="inline-block">
                    <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors truncate">
                      {dailyPick.name}
                    </h3>
                  </Link>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">{reason}</p>
                </div>
              </div>
              <Link
                href={`/tools/${dailyPick.id}`}
                className="mt-3 w-full inline-flex items-center justify-center gap-1 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-sm hover:shadow-md transition-all duration-300 min-h-[40px]"
              >
                Try It →
              </Link>
            </div>
          );
        })()}

        {/* Mystery Box Card */}
        <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-4 sm:p-5 flex flex-col items-center justify-center text-center">
          <div className="text-4xl sm:text-5xl mb-3">🎁</div>
          <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white mb-1">
            Mystery Box
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-4">
            Discover a random hidden gem
          </p>
          <button
            onClick={openMysteryBox}
            disabled={mysteryCount >= 3}
            className={`w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-300 min-h-[44px] ${
              mysteryCount >= 3
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                : 'bg-amber-500 hover:bg-amber-600 text-white hover:shadow-md active:scale-[0.98]'
            }`}
          >
            {mysteryCount >= 3 ? 'Come back tomorrow' : `Open (${3 - mysteryCount} left today)`}
          </button>
        </div>
      </div>
    </div>
  );
});

export default TodayDiscovery;
