'use client';

import { useState, useEffect } from 'react';
import { X, Search, Heart, GitCompare, Sparkles } from 'lucide-react';

const STORAGE_KEY = 'useaitools_welcome_shown';

export default function WelcomePopup() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const shown = localStorage.getItem(STORAGE_KEY);
      if (shown) return;

      // 延迟 1.5 秒显示，避免与 GuidedTour 冲突
      const timer = setTimeout(() => {
        setVisible(true);
        localStorage.setItem(STORAGE_KEY, 'true');
      }, 1500);

      return () => clearTimeout(timer);
    } catch {
      // localStorage 不可用，静默跳过
    }
  }, []);

  const close = () => setVisible(false);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in p-4"
      onClick={close}
    >
      <div
        className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-gray-800 max-w-md w-full p-6 sm:p-8 animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="welcome-title"
      >
        {/* Close button */}
        <button
          onClick={close}
          aria-label="Close welcome popup"
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-gray-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/25">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h2 id="welcome-title" className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Welcome to Use AI Tools!
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            Discover 1,300+ curated AI tools to supercharge your workflow
          </p>
        </div>

        {/* Features */}
        <div className="space-y-3 mb-6">
          <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-gray-800/50">
            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center flex-shrink-0">
              <Search className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-slate-900 dark:text-white mb-0.5">
                Smart Search
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Find tools by name, category, or use case with fuzzy matching
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-gray-800/50">
            <div className="w-10 h-10 rounded-lg bg-rose-100 dark:bg-rose-500/20 flex items-center justify-center flex-shrink-0">
              <Heart className="w-5 h-5 text-rose-600 dark:text-rose-400" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-slate-900 dark:text-white mb-0.5">
                Save Favorites
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Bookmark tools you love and access them anytime from your saved list
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-gray-800/50">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
              <GitCompare className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-slate-900 dark:text-white mb-0.5">
                Compare Tools
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Compare up to 4 tools side-by-side to find the perfect fit
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={close}
          className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 transition-all duration-300"
        >
          Start Exploring
        </button>

        {/* Footer hint */}
        <p className="mt-4 text-xs text-center text-slate-400 dark:text-slate-500">
          Press <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-slate-100 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded">Esc</kbd> to close · Tour will guide you through
        </p>
      </div>
    </div>
  );
}
