export type HolidayTheme = {
  name: string;
  primaryColor: string;
  secondaryColor?: string;
  accentColor: string;
  decoration: 'snow' | 'fireworks' | 'pumpkin' | 'heart' | null;
  emoji: string;
};

export function getHolidayTheme(): HolidayTheme | null {
  if (typeof window === 'undefined') return null;

  const today = new Date();
  const month = today.getMonth() + 1;
  const date = today.getDate();

  const dismissed = localStorage.getItem('holidayThemeDismissed');
  if (dismissed === `${month}-${date}`) return null;

  // New Year (Jan 1-3)
  if (month === 1 && date <= 3) {
    return {
      name: 'New Year',
      primaryColor: 'from-amber-500 to-yellow-500',
      secondaryColor: 'bg-amber-50 dark:bg-amber-950/20',
      accentColor: 'text-amber-500',
      decoration: 'fireworks',
      emoji: '🎆',
    };
  }

  // Valentine's Day (Feb 14)
  if (month === 2 && date === 14) {
    return {
      name: 'Valentine',
      primaryColor: 'from-rose-500 to-pink-500',
      secondaryColor: 'bg-rose-50 dark:bg-rose-950/20',
      accentColor: 'text-rose-500',
      decoration: 'heart',
      emoji: '❤️',
    };
  }

  // Halloween (Oct 31)
  if (month === 10 && date === 31) {
    return {
      name: 'Halloween',
      primaryColor: 'from-orange-500 to-purple-600',
      secondaryColor: 'bg-orange-50 dark:bg-orange-950/20',
      accentColor: 'text-orange-500',
      decoration: 'pumpkin',
      emoji: '🎃',
    };
  }

  // Christmas (Dec 24-26)
  if (month === 12 && date >= 24 && date <= 26) {
    return {
      name: 'Christmas',
      primaryColor: 'from-red-600 to-green-600',
      secondaryColor: 'bg-green-50 dark:bg-green-950/20',
      accentColor: 'text-green-500',
      decoration: 'snow',
      emoji: '🎄',
    };
  }

  return null;
}

export function dismissHolidayTheme() {
  const today = new Date();
  localStorage.setItem('holidayThemeDismissed', `${today.getMonth() + 1}-${today.getDate()}`);
}
