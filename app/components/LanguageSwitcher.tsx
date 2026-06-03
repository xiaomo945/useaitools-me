'use client';

import { useState, useEffect } from 'react';
import { getLocale, setLocale, type Locale } from '@/app/i18n';

export default function LanguageSwitcher() {
  const [locale, setLocalLocale] = useState<Locale>('en');

  useEffect(() => {
    setLocalLocale(getLocale());
  }, []);

  const handleSwitch = (newLocale: Locale) => {
    setLocale(newLocale);
    setLocalLocale(newLocale);
    window.location.reload();
  };

  return (
    <div className="flex items-center gap-1 text-xs">
      <button
        onClick={() => handleSwitch('en')}
        className={`px-2 py-1 rounded-md transition-colors ${
          locale === 'en'
            ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-semibold'
            : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
        }`}
        aria-label="Switch to English"
      >
        EN
      </button>
      <span className="text-slate-300 dark:text-slate-600">|</span>
      <button
        onClick={() => handleSwitch('zh')}
        className={`px-2 py-1 rounded-md transition-colors ${
          locale === 'zh'
            ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-semibold'
            : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
        }`}
        aria-label="切换到中文"
      >
        中
      </button>
    </div>
  );
}
