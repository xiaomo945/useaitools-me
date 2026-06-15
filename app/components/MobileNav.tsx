'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, Bookmark, Clock, BarChart3 } from 'lucide-react';

export default function MobileNav() {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState(pathname);

  useEffect(() => {
    setTimeout(() => setActiveTab(pathname), 0);
  }, [pathname]);

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/search', icon: Search, label: 'Search' },
    { path: '/history', icon: Clock, label: 'History' },
    { path: '/saved', icon: Bookmark, label: 'Saved' },
    { path: '/leaderboard', icon: BarChart3, label: 'Top' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return activeTab === '/';
    return activeTab.startsWith(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-t border-slate-200/80 dark:border-gray-800/80 shadow-[0_-4px_24px_rgba(0,0,0,0.08)] z-50 md:hidden safe-area-inset-bottom">
      <div className="flex items-stretch justify-around py-1.5 px-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <Link
              key={item.path}
              href={item.path}
              className={`
                relative flex flex-col items-center justify-center py-2 px-3 min-w-[64px] min-h-[56px] rounded-xl
                transition-all duration-200 ease-out touch-manipulation
                ${active 
                  ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' 
                  : 'text-slate-500 dark:text-gray-500 active:bg-slate-100 dark:active:bg-gray-800'
                }
              `}
              aria-current={active ? 'page' : undefined}
            >
              <div className="relative">
                <Icon
                  className={`w-6 h-6 transition-all duration-200 ${
                    active ? 'scale-110' : 'scale-100'
                  }`}
                  strokeWidth={active ? 2.5 : 2}
                />
              </div>
              <span
                className={`text-[10px] mt-1 font-semibold tracking-wide transition-all duration-200 ${
                  active ? 'text-emerald-600 dark:text-emerald-400' : ''
                }`}
              >
                {item.label}
              </span>
              {active && (
                <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-emerald-500 dark:bg-emerald-400" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
