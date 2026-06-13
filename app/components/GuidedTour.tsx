'use client';

import { useState, useEffect, useRef } from 'react';

const STORAGE_KEY = 'useaitools_tour_completed';
const AUTO_DISMISS_DELAY = 3000;

export default function GuidedTour() {
  const [visible, setVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const autoDismissTimerRef = useRef<NodeJS.Timeout | null>(null);

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

      // 1秒后显示提示气泡
      const showTimer = setTimeout(() => {
        setVisible(true);
        // 启动 3 秒自动关闭计时器
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
      className={`absolute left-0 right-0 mt-2 z-40 transition-opacity duration-300 ${
        isClosing ? 'opacity-0' : 'opacity-100'
      }`}
      role="dialog"
      aria-live="polite"
    >
      <div className="mx-3 sm:mx-0 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-lg shadow-sm px-4 py-2 flex items-center gap-3">
        {/* 提示文字 */}
        <p className="flex-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
          💡 试试搜索"blog writing"或选择分类
        </p>
        
        {/* 关闭按钮 */}
        <button
          onClick={closeTour}
          aria-label="Close tip"
          className="shrink-0 w-8 h-8 flex items-center justify-center rounded hover:bg-slate-100 dark:hover:bg-gray-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
