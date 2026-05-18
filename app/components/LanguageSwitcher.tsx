'use client';

import { useState, useRef, useEffect, createContext, useContext } from 'react';

type Locale = 'en' | 'zh-CN';

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

// Translation files
const translations = {
  en: {
    'language.switch': 'Switch language',
    'language.current': 'Current',
    'language.en': 'English',
    'language.zh-CN': '简体中文',
    'metadata.title': 'Use AI Tools – Discover 50+ Best AI Tools in 2026',
    'metadata.description': 'Handpicked directory of 50+ AI tools across Writing, Image, Productivity, Code, Audio, and Video. Find the perfect AI tool for your workflow.',
    'nav.home': 'Home',
    'nav.blog': 'Blog',
    'categories.writing': 'Writing',
    'categories.image': 'Image',
    'categories.productivity': 'Productivity',
    'categories.code': 'Code',
    'categories.audio': 'Audio',
    'categories.video': 'Video',
    'hero.title': 'Discover the Best AI Tools',
    'hero.subtitle': 'Handpicked directory of AI tools for every task. Find, compare, and choose the perfect AI tool for your needs.',
    'hero.cta': 'Explore Tools',
    'footer.copyright': '© 2026 Use AI Tools. All rights reserved.',
    'footer.links.home': 'Home',
    'footer.links.blog': 'Blog',
    'footer.links.affiliate': 'Affiliate Disclosure'
  },
  'zh-CN': {
    'language.switch': '切换语言',
    'language.current': '当前',
    'language.en': 'English',
    'language.zh-CN': '简体中文',
    'metadata.title': 'Use AI Tools – 发现 50+ 最佳 AI 工具 (2026)',
    'metadata.description': '精心挑选的 AI 工具目录，涵盖写作、图像、生产力、代码、音频和视频。为您的工作流程找到完美的 AI 工具。',
    'nav.home': '首页',
    'nav.blog': '博客',
    'categories.writing': '写作',
    'categories.image': '图像',
    'categories.productivity': '生产力',
    'categories.code': '代码',
    'categories.audio': '音频',
    'categories.video': '视频',
    'hero.title': '发现最佳 AI 工具',
    'hero.subtitle': '精心挑选的 AI 工具目录。找到、比较并选择适合您需求的完美 AI 工具。',
    'hero.cta': '探索工具',
    'footer.copyright': '© 2026 Use AI Tools。保留所有权利。',
    'footer.links.home': '首页',
    'footer.links.blog': '博客',
    'footer.links.affiliate': '联盟披露'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>('en');

  // Load locale from localStorage on mount
  useEffect(() => {
    const savedLocale = localStorage.getItem('locale') as Locale;
    if (savedLocale && (savedLocale === 'en' || savedLocale === 'zh-CN')) {
      setLocale(savedLocale);
    } else {
      // Try to detect browser language
      const browserLang = navigator.language.split('-')[0];
      if (browserLang === 'zh') {
        setLocale('zh-CN');
      }
    }
  }, []);

  // Save locale to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('locale', locale);
    // Update html lang attribute
    document.documentElement.lang = locale;
  }, [locale]);

  const t = (key: string): string => {
    return translations[locale][key as keyof typeof translations.en] || key;
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

export default function LanguageSwitcher() {
  const { locale, setLocale, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const languages = [
    { code: 'en' as Locale, name: t('language.en') },
    { code: 'zh-CN' as Locale, name: t('language.zh-CN') }
  ];

  const currentLanguage = languages.find(lang => lang.code === locale)?.name || locale;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
        aria-label={t('language.switch')}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
        </svg>
        <span>{currentLanguage}</span>
        <svg className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden z-50">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setLocale(lang.code);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                locale === lang.code
                  ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 font-medium'
                  : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              {lang.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
