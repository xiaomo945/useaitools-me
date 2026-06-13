'use client';

import { useState, useEffect, useRef } from 'react';

const STORAGE_KEY = 'useaitools_tour_completed';
const AUTO_DISMISS_DELAY = 8000;

export default function GuidedTour() {
  const [visible, setVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const autoDismissTimerRef = useRef<NodeJS.Timeout | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const closeTour = () => {
    setIsClosing(true);
    setTimeout(() => {
      setVisible(false);
      try {
        localStorage.setItem(STORAGE_KEY, 'true');
      } catch {}
    }, 300);
  };

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get('replay-tour') === '1') {
        localStorage.removeItem(STORAGE_KEY);
        window.history.replaceState({}, '', '/');
      }
      const completed = localStorage.getItem(STORAGE_KEY);
      if (completed) return;

      // 查找搜索框
      const searchInput = document.querySelector('input[type="text"][placeholder*="Search" i]') as HTMLInputElement;
      if (searchInput) {
        searchInputRef.current = searchInput;
      }

      // 1秒后显示提示气泡
      const showTimer = setTimeout(() => {
        setVisible(true);
        // 启动 8 秒自动关闭计时器
        autoDismissTimerRef.current = setTimeout(() => {
          closeTour();
        }, AUTO_DISMISS_DELAY);
      }, 1000);

      return () => {
        clearTimeout(showTimer);
        if (autoDismissTimerRef.current) {
          clearTimeout(autoDismissTimerRef.current);
        }
      };
    } catch {
      // localStorage 不可用，静默跳过
    }
  }, []);

  // 键盘 Esc 关闭
  useEffect(() => {
    if (!visible) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeTour();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      className={`absolute left-0 right-0 mt-2 z-40 transition-all duration-300 ${
        isClosing ? 'opacity-0 -translate-y-2' : 'opacity-100 translate-y-0'
      }`}
      role="dialog"
      aria-live="polite"
    >
      <div className="mx-3 sm:mx-0 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/40 border-2 border-emerald-200 dark:border-emerald-800/60 rounded-2xl shadow-lg shadow-emerald-500/10 px-4 py-3 flex items-center gap-3">
        {/* 提示文字 */}
        <p className="flex-1 text-sm sm:text-base font-medium text-slate-700 dark:text-slate-200">
          👋 Try searching for an AI tool or browse by category
        </p>
        
        {/* 关闭按钮 */}
        <button
          onClick={closeTour}
          aria-label="Close tip"
          className="shrink-0 w-11 h-11 flex items-center justify-center rounded-full hover:bg-emerald-100 dark:hover:bg-emerald-900/30 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-all duration-200 active:scale-95"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
