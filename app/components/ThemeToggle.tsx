'use client';

import { useEffect, useState, useCallback } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark' | null>(null);
  const [isManual, setIsManual] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
    const manualFlag = localStorage.getItem('themeManual');

    setTimeout(() => {
      if (savedTheme && manualFlag === 'true') {
        setTheme(savedTheme);
        setIsManual(true);
      } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setTheme(prefersDark ? 'dark' : 'light');
        setIsManual(false);
      }
    }, 0);
  }, []);

  useEffect(() => {
    if (!theme) return;

    const root = window.document.documentElement;

    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    if (isManual) {
      localStorage.setItem('theme', theme);
      localStorage.setItem('themeManual', 'true');
    } else {
      localStorage.removeItem('theme');
      localStorage.removeItem('themeManual');
    }
  }, [theme, isManual]);

  useEffect(() => {
    if (isManual) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      setTheme(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [isManual]);

  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
    setIsManual(true);
  }, []);

  const resetToAuto = useCallback(() => {
    setIsManual(false);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(prefersDark ? 'dark' : 'light');
  }, []);

  if (!theme) return null;

  return (
    <div className="fixed bottom-20 left-4 md:bottom-4 md:left-auto md:right-4 z-40 flex flex-col items-center gap-1">
      <button
        onClick={toggleTheme}
        className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 shadow-lg hover:shadow-xl hover:-translate-y-1 active:scale-95 transition-all duration-300 ease-out"
        aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
      >
        {theme === 'light' ? (
          <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-slate-700" />
        ) : (
          <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-slate-200" />
        )}
      </button>
      <button
        onClick={isManual ? resetToAuto : undefined}
        className={`text-[9px] sm:text-[10px] font-semibold px-1.5 py-0.5 rounded-full transition-all duration-300 ${
          isManual
            ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 hover:bg-amber-200 dark:hover:bg-amber-900/50 cursor-pointer'
            : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 cursor-default'
        }`}
        aria-label={isManual ? 'Reset to auto-follow system theme' : 'Following system theme'}
      >
        {isManual ? 'Manual' : 'Auto'}
      </button>
    </div>
  );
}
