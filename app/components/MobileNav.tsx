'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, Bookmark, Clock, BarChart3 } from 'lucide-react';

export default function MobileNav() {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState(pathname);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setActiveTab(pathname);
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 300);
    return () => clearTimeout(timer);
  }, [pathname]);

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/search', icon: Search, label: 'Search' },
    { path: '/history', icon: Clock, label: 'History' },
    { path: '/saved', icon: Bookmark, label: 'Saved' },
    { path: '/leaderboard', icon: BarChart3, label: 'Leaderboard' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return activeTab === '/';
    return activeTab.startsWith(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-slate-200 dark:border-gray-800 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] z-50 md:hidden">
      <div className={`flex items-center justify-around py-2 transition-all duration-300 ${isAnimating ? 'scale-[1.02]' : 'scale-100'}`}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <Link
              key={item.path}
              href={item.path}
              className="relative flex flex-col items-center py-2 px-1 sm:px-2 flex-1 transition-all duration-300 min-w-0"
              onClick={() => setIsAnimating(true)}
            >
              <div className={`relative transition-all duration-300 ${active ? 'scale-110' : 'scale-100'} active:scale-110`}>
                <Icon
                  className={`w-6 h-6 transition-all duration-300 ${
                    active
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-slate-400 dark:text-gray-500'
                  }`}
                />
                {/* Active glow effect */}
                {active && (
                  <div className="absolute inset-0 bg-emerald-500/20 blur-xl -z-10" />
                )}
              </div>
              <span
                className={`text-[10px] sm:text-xs mt-1 font-medium transition-all duration-300 whitespace-nowrap overflow-hidden text-ellipsis ${
                  active
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-slate-500 dark:text-gray-500'
                }`}
              >
                {item.label}
              </span>
              {/* Active indicator dot */}
              {active && (
                <div className="absolute top-1 w-1 h-1 rounded-full bg-emerald-600 dark:bg-emerald-400 animate-pulse" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
