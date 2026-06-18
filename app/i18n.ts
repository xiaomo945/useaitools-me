import en from '@/locales/en/common.json';
import zh from '@/locales/zh/common.json';
import ja from '@/locales/ja/common.json';
import ko from '@/locales/ko/common.json';
import es from '@/locales/es/common.json';
import fr from '@/locales/fr/common.json';
import de from '@/locales/de/common.json';

export type Locale = 'en' | 'zh' | 'ja' | 'ko' | 'es' | 'fr' | 'de';

type TranslationValue = string | { [key: string]: TranslationValue };
const translations: Record<Locale, Record<string, TranslationValue>> = {
  en,
  zh,
  ja,
  ko,
  es,
  fr,
  de,
};

const DEFAULT_LOCALE: Locale = 'en';

export function getLocale(): Locale {
  if (typeof window === 'undefined') return DEFAULT_LOCALE;

  // Check localStorage first
  const saved = localStorage.getItem('locale') as Locale;
  if (saved && translations[saved]) return saved;

  // Check browser language
  const browserLang = navigator.language.toLowerCase();
  if (browserLang.startsWith('zh')) return 'zh';
  if (browserLang.startsWith('ja')) return 'ja';
  if (browserLang.startsWith('ko')) return 'ko';
  if (browserLang.startsWith('es')) return 'es';
  if (browserLang.startsWith('fr')) return 'fr';
  if (browserLang.startsWith('de')) return 'de';

  return DEFAULT_LOCALE;
}

export function setLocale(locale: Locale): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('locale', locale);
}

export function t(key: string, locale?: Locale): string {
  const currentLocale = locale || getLocale();
  const keys = key.split('.');
  let value: TranslationValue = translations[currentLocale];

  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      // Fallback to English
      let fallback: TranslationValue = translations[DEFAULT_LOCALE];
      for (const fk of keys) {
        if (fallback && typeof fallback === 'object' && fk in fallback) {
          fallback = fallback[fk];
        } else {
          return key;
        }
      }
      return typeof fallback === 'string' ? fallback : key;
    }
  }

  return typeof value === 'string' ? value : key;
}
