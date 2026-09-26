'use client';

import { useCallback, useEffect, useState } from 'react';
import { X } from 'lucide-react';

const STORAGE_KEY = 'uaic-consent-v1';

/** Dispatched by the footer link so the banner can reopen on demand. */
export const COOKIE_SETTINGS_EVENT = 'uaic-open-cookie-settings';

export type ConsentCategory = 'analytics' | 'advertising' | 'personalization' | 'functional';

export interface ConsentState {
  analytics: boolean;
  advertising: boolean;
  personalization: boolean;
  functional: boolean;
  updatedAt: number;
}

/** Everything but the audit timestamp — what the consent banner actually toggles. */
type ConsentSignals = Omit<ConsentState, 'updatedAt'>;

/**
 * Strictly necessary storage (session, security, CSRF) is always on and is not
 * offered as a choice — every jurisdiction treats it as exempt.
 */
const DENIED_BY_DEFAULT: ConsentSignals = {
  analytics: false,
  advertising: false,
  personalization: false,
  functional: true,
};

const CATEGORY_META: Array<{
  key: ConsentCategory;
  label: string;
  description: string;
}> = [
  {
    key: 'analytics',
    label: 'Analytics and performance',
    description: 'Lets us count visits and traffic sources so we know which content is worth keeping.',
  },
  {
    key: 'advertising',
    label: 'Advertising',
    description: 'Used by ad networks to serve and measure ads on this site. Required by Google AdSense.',
  },
  {
    key: 'personalization',
    label: 'Personalised content',
    description: 'Remembers your category filters and recommendations so the site adapts to you.',
  },
  {
    key: 'functional',
    label: 'Functional storage',
    description: 'Remembers your theme and language choice. Always on, because the site cannot work without it.',
  },
];

function readStoredConsent(): ConsentState | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<ConsentState>;
    if (typeof parsed?.updatedAt !== 'number') return null;
    return { ...DENIED_BY_DEFAULT, ...parsed } as ConsentState;
  } catch {
    return null;
  }
}

/**
 * Map our categories onto Google Consent Mode v2 signals. Google reads these
 * before it decides whether to set cookies or send pings for the EU/EEA.
 * https://developers.google.com/tag-platform/security/guides/consent
 */
function toConsentMode(state: ConsentSignals): Record<string, 'granted' | 'denied'> {
  return {
    ad_storage: state.advertising ? 'granted' : 'denied',
    ad_user_data: state.advertising ? 'granted' : 'denied',
    ad_personalization: state.personalization ? 'granted' : 'denied',
    analytics_storage: state.analytics ? 'granted' : 'denied',
    functionality_storage: state.functional ? 'granted' : 'denied',
    personalization_storage: state.personalization ? 'granted' : 'denied',
    security_storage: 'granted',
  };
}

function pushConsentMode(state: ConsentSignals) {
  if (typeof window === 'undefined') return;
  const signals = toConsentMode(state);
  const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag;
  if (typeof gtag !== 'function') {
    // No tag manager on the page yet — still expose the signals for the next
    // script that boots, so consent is never silently dropped.
    (window as unknown as Record<string, unknown>).uaicConsentMode = signals;
    return;
  }
  gtag('consent', 'update', signals);
}

export default function CookieConsent() {
  const [consent, setConsent] = useState<ConsentState | null>(null);
  const [bannerVisible, setBannerVisible] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [draft, setDraft] = useState<ConsentSignals>(DENIED_BY_DEFAULT);

  useEffect(() => {
    const stored = readStoredConsent();
    if (stored) {
      setConsent(stored);
      pushConsentMode(stored);
    } else {
      // Default to denied before the visitor answers: nothing non-essential may
      // run prior to consent.
      pushConsentMode(DENIED_BY_DEFAULT);
      setBannerVisible(true);
    }

    const openSettings = () => {
      setDraft(consent ?? DENIED_BY_DEFAULT);
      setSettingsOpen(true);
    };
    window.addEventListener(COOKIE_SETTINGS_EVENT, openSettings);
    return () => window.removeEventListener(COOKIE_SETTINGS_EVENT, openSettings);
  }, [consent]);

  const persist = useCallback((next: ConsentSignals) => {
    const record: ConsentState = { ...next, updatedAt: Date.now() };
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
    } catch {
      // Private browsing / quota — consent simply is not persisted.
    }
    setConsent(record);
    pushConsentMode(record);
    setBannerVisible(false);
    setSettingsOpen(false);
  }, []);

  const acceptAll = useCallback(
    () =>
      persist({
        analytics: true,
        advertising: true,
        personalization: true,
        functional: true,
      }),
    [persist],
  );

  const rejectAll = useCallback(
    () => persist(DENIED_BY_DEFAULT),
    [persist],
  );

  const saveDraft = useCallback(() => persist(draft), [draft, persist]);

  if (!bannerVisible && !settingsOpen) return null;

  return (
    <>
      {bannerVisible && (
        <div
          role="dialog"
          aria-modal="false"
          aria-label="Cookie consent"
          className="fixed inset-x-0 bottom-0 z-[100] border-t border-slate-200 bg-white/95 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95"
        >
          <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
                  <h2 className="text-base font-semibold">We value your privacy</h2>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  We use essential cookies to make the site work, and optionally analytics and advertising
                  cookies to understand what people find useful. Nothing optional runs until you allow it.
                  Read the <a className="underline underline-offset-2 hover:text-emerald-600" href="/privacy">privacy policy</a>.
                </p>
              </div>

              <div className="flex shrink-0 flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
                <button
                  type="button"
                  onClick={rejectAll}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Reject all
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDraft(DENIED_BY_DEFAULT);
                    setSettingsOpen(true);
                  }}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Customise
                </button>
                <button
                  type="button"
                  onClick={acceptAll}
                  className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
                >
                  Accept all
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {settingsOpen && (
        <div className="fixed inset-0 z-[110] flex items-end justify-center bg-slate-900/50 p-4 sm:items-center">
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Cookie preferences"
            className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl dark:bg-slate-900"
          >
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">Cookie preferences</h2>
              </div>
              <button
                type="button"
                onClick={() => setSettingsOpen(false)}
                aria-label="Close cookie preferences"
                className="rounded-lg p-1 text-slate-500 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <ul className="divide-y divide-slate-100 dark:divide-slate-800">
              {CATEGORY_META.map((category) => {
                const checked = category.key === 'functional' ? true : draft[category.key];
                const locked = category.key === 'functional';
                return (
                  <li key={category.key} className="px-6 py-4">
                    <label className="flex cursor-pointer items-start gap-3">
                      <input
                        type="checkbox"
                        className="mt-0.5 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                        checked={checked}
                        disabled={locked}
                        aria-describedby={`cookie-desc-${category.key}`}
                        onChange={(event) =>
                          setDraft((prev) => ({ ...prev, [category.key]: event.target.checked }))
                        }
                      />
                      <span>
                        <span className="block text-sm font-medium text-slate-900 dark:text-slate-100">
                          {category.label}
                          {locked && (
                            <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-normal text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                              Always on
                            </span>
                          )}
                        </span>
                        <span
                          id={`cookie-desc-${category.key}`}
                          className="mt-0.5 block text-sm text-slate-600 dark:text-slate-400"
                        >
                          {category.description}
                        </span>
                      </span>
                    </label>
                  </li>
                );
              })}
            </ul>

            <div className="flex flex-col gap-2 border-t border-slate-200 px-6 py-4 sm:flex-row sm:justify-end dark:border-slate-800">
              <button
                type="button"
                onClick={rejectAll}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Reject all
              </button>
              <button
                type="button"
                onClick={acceptAll}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Accept all
              </button>
              <button
                type="button"
                onClick={saveDraft}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
              >
                Save preferences
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
