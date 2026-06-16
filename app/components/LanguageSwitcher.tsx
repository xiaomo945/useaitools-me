'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const locales = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
];

export function useLocale() {
  const [locale, setLocale] = useState('en');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('locale');
    if (saved && locales.some(l => l.code === saved)) {
      setLocale(saved);
    } else {
      const browserLang = navigator.language.split('-')[0];
      if (locales.some(l => l.code === browserLang)) {
        setLocale(browserLang);
        localStorage.setItem('locale', browserLang);
      }
    }
  }, []);

  return { locale, setLocale, mounted };
}

export function useTranslations(locale: string) {
  const [translations, setTranslations] = useState<any>(null);

  useEffect(() => {
    import(`@/locales/${locale}/common.json`)
      .then(module => setTranslations(module.default))
      .catch(() => {
        import('@/locales/en/common.json')
          .then(module => setTranslations(module.default));
      });
  }, [locale]);

  return translations;
}

export default function LanguageSwitcher() {
  const { locale, setLocale, mounted } = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleLocaleChange = (newLocale: string) => {
    setLocale(newLocale);
    localStorage.setItem('locale', newLocale);
    setIsOpen(false);
    
    // Update URL with locale prefix
    const segments = pathname.split('/');
    const currentLocale = segments[1];
    const isLocaleInPath = locales.some(l => l.code === currentLocale);
    
    if (isLocaleInPath) {
      segments[1] = newLocale;
      router.push(segments.join('/'));
    } else {
      router.push(`/${newLocale}${pathname}`);
    }
  };

  if (!mounted) {
    return (
      <div className="w-24 h-8 bg-slate-200 dark:bg-gray-700 rounded animate-pulse" />
    );
  }

  const currentLocale = locales.find(l => l.code === locale) || locales[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg hover:bg-slate-50 dark:hover:bg-gray-750 transition-colors"
        aria-label="Change language"
      >
        <span>{currentLocale.flag}</span>
        <span className="hidden sm:inline">{currentLocale.name}</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg shadow-lg z-20 overflow-hidden">
            {locales.map((l) => (
              <button
                key={l.code}
                onClick={() => handleLocaleChange(l.code)}
                className={`w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-gray-750 transition-colors ${
                  locale === l.code ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-300'
                }`}
              >
                <span className="text-lg">{l.flag}</span>
                <span>{l.name}</span>
                {locale === l.code && (
                  <svg className="w-4 h-4 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
