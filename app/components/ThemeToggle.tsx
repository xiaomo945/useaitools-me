'use client';

import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark' | null>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
    
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'dark' : 'light');
    }
  }, []);

  useEffect(() => {
    if (!theme) return;

    const root = window.document.documentElement;
    
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  if (!theme) return null;

  return (
    <button
      onClick={toggleTheme}
      className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-40 w-10 h-10 md:w-11 md:h-11 flex items-center justify-center rounded-full bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-out"
      aria-label={theme === 'light' ? '切换到深色模式' : 'Switch to light mode'}
    >
      {theme === 'light' ? (
        <Moon className="w-5 h-5 md:w-6 md:h-6 text-slate-700" />
      ) : (
        <Sun className="w-5 h-5 md:w-6 md:h-6 text-slate-200" />
      )}
    </button>
  );
}
