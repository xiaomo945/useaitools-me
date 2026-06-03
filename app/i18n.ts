import en from '@/locales/en/common.json';
import zh from '@/locales/zh/common.json';

export type Locale = 'en' | 'zh';

const translations: Record<Locale, Record<string, any>> = { en, zh };

const DEFAULT_LOCALE: Locale = 'en';

export function getLocale(): Locale {
  if (typeof window === 'undefined') return DEFAULT_LOCALE;

  // Check localStorage first
  const saved = localStorage.getItem('locale') as Locale;
  if (saved && translations[saved]) return saved;

  // Check browser language
  const browserLang = navigator.language.toLowerCase();
  if (browserLang.startsWith('zh')) return 'zh';

  return DEFAULT_LOCALE;
}

export function setLocale(locale: Locale): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('locale', locale);
}

export function t(key: string, locale?: Locale): string {
  const currentLocale = locale || getLocale();
  const keys = key.split('.');
  let value: any = translations[currentLocale];

  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      // Fallback to English
      let fallback: any = translations[DEFAULT_LOCALE];
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
