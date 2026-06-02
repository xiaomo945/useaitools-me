'use client';

import { useState, useEffect } from 'react';
import { getHolidayTheme, dismissHolidayTheme, type HolidayTheme } from '@/app/utils/theme-calendar';

export default function HolidayBanner() {
  const [theme, setTheme] = useState<HolidayTheme | null>(null);

  useEffect(() => {
    setTheme(getHolidayTheme());
  }, []);

  if (!theme) return null;

  const decorationEmoji = theme.decoration === 'snow' ? '❄️'
    : theme.decoration === 'fireworks' ? '🎆'
    : theme.decoration === 'pumpkin' ? '🎃'
    : theme.decoration === 'heart' ? '💖'
    : '✨';

  const handleDismiss = () => {
    dismissHolidayTheme();
    setTheme(null);
  };

  return (
    <div className={`bg-gradient-to-r ${theme.primaryColor} text-white py-2 px-4 text-center text-sm relative`}>
      <span className="mr-2">{decorationEmoji}</span>
      <span className="font-medium">Happy {theme.name}!</span>
      <span className="mx-2">—</span>
      <span>Enjoy the special theme today</span>
      <span className="ml-2">{decorationEmoji}</span>
      <button
        onClick={handleDismiss}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors"
        aria-label="Dismiss holiday theme"
      >
        ✕
      </button>
    </div>
  );
}
