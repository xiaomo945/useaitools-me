'use client';

import React from 'react';
import Link from 'next/link';

interface HeroSectionProps {
  mysteryCount: number;
  openMysteryBox: () => void;
}

export default function HeroSection({
  mysteryCount,
  openMysteryBox,
}: HeroSectionProps) {
  return (
    <div className="text-center mb-8 sm:mb-16 relative">
      {/* Subtle static glow - subtle, no animation */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-500/[0.04] via-transparent to-transparent rounded-full blur-3xl pointer-events-none hidden sm:block" />
      
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

      {/* Submit Tool + Mystery Box Buttons */}
      <div className="text-center mb-6 sm:mb-8 flex flex-wrap items-center justify-center gap-3 relative z-10">
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
              : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:shadow-lg hover:shadow-emerald-500/25 hover:-translate-y-0.5 active:scale-[0.98]'
          }`}
        >
          🎁 Mystery Box {mysteryCount >= 3 ? '(Done today)' : `(${3 - mysteryCount} left)`}
        </button>
      </div>
    </div>
  );
}