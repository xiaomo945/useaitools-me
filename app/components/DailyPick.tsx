'use client';

import Link from 'next/link';

type DailyPickProps = {
  tool: {
    id: number;
    name: string;
    category: string;
  };
  onDismiss: () => void;
};

const categoryColorMap: Record<string, { bg: string; bgDark: string; text: string; textLight: string }> = {
  Writing:    { bg: 'bg-blue-500', bgDark: 'bg-blue-500/20', text: 'text-blue-300', textLight: 'text-blue-600' },
  Image:      { bg: 'bg-violet-500', bgDark: 'bg-violet-500/20', text: 'text-violet-300', textLight: 'text-violet-600' },
  Productivity: { bg: 'bg-teal-500', bgDark: 'bg-teal-500/20', text: 'text-teal-300', textLight: 'text-teal-600' },
  Code:       { bg: 'bg-orange-500', bgDark: 'bg-orange-500/20', text: 'text-orange-300', textLight: 'text-orange-600' },
  Audio:      { bg: 'bg-pink-500', bgDark: 'bg-pink-500/20', text: 'text-pink-300', textLight: 'text-pink-600' },
  Video:      { bg: 'bg-indigo-500', bgDark: 'bg-indigo-500/20', text: 'text-indigo-300', textLight: 'text-indigo-600' },
};

function getCategoryColors(category: string) {
  return categoryColorMap[category] || { bg: 'bg-slate-500', bgDark: 'bg-slate-500/20', text: 'text-slate-300', textLight: 'text-slate-600' };
}

export default function DailyPick({ tool, onDismiss }: DailyPickProps) {
  const colors = getCategoryColors(tool.category);
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
    <div className="bg-gradient-to-r from-emerald-50 via-white to-teal-50 dark:from-emerald-950/30 dark:via-gray-900 dark:to-teal-950/30 border border-emerald-200/60 dark:border-emerald-800/40 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-lg transition-all duration-300 relative overflow-hidden">
      <button
        onClick={() => {
          onDismiss();
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
          href={`/tools/${tool.id}`}
          className={`w-10 h-10 sm:w-14 sm:h-14 rounded-xl ${colors.bg}/10 dark:${colors.bgDark} ${colors.textLight} dark:${colors.text} flex items-center justify-center text-lg sm:text-2xl font-bold shrink-0 hover:scale-105 transition-transform duration-300`}
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          {tool.name.charAt(0)}
        </Link>
        <div className="flex-1 min-w-0">
          <Link href={`/tools/${tool.id}`} className="inline-block">
            <h3 className="font-bold text-sm sm:text-lg text-slate-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors truncate">
              🌟 {tool.name}
            </h3>
          </Link>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5 truncate">{reason}</p>
        </div>
        <Link
          href={`/tools/${tool.id}`}
          className="shrink-0 inline-flex items-center gap-1 px-3 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 min-h-[44px]"
        >
          Try It →
        </Link>
      </div>
    </div>
  );
}
