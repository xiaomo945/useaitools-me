'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Footer from '@/app/components/Footer';
import toolsData from '@/data/tools.json';
import type { Tool } from '@/types';

const tools = toolsData as Tool[];

const categories = ['Writing', 'Image', 'Productivity', 'Code', 'Audio', 'Video'] as const;
const categoryColors: Record<string, string> = {
  Writing: 'bg-blue-500',
  Image: 'bg-violet-500',
  Productivity: 'bg-teal-500',
  Code: 'bg-orange-500',
  Audio: 'bg-pink-500',
  Video: 'bg-indigo-500',
};

export default function DashboardPage() {
  const [affiliateClicks, setAffiliateClicks] = useState(0);
  const [savedCount, setSavedCount] = useState(0);
  const [historyCount, setHistoryCount] = useState(0);

  useEffect(() => {
    try {
      const clicks = parseInt(localStorage.getItem('affiliateClickCount') || '0');
      const saved = JSON.parse(localStorage.getItem('savedTools') || '[]');
      const history = JSON.parse(localStorage.getItem('toolHistory') || '[]');
      setTimeout(() => {
        setAffiliateClicks(clicks);
        setSavedCount(saved.length);
        setHistoryCount(history.length);
      }, 0);
    } catch {}
  }, []);

  const totalTools = tools.length;
  const categoryStats = categories.map(cat => ({
    name: cat,
    count: tools.filter(t => t.category === cat).length,
    color: categoryColors[cat],
  }));
  const maxCategoryCount = Math.max(...categoryStats.map(c => c.count));
  const freeTools = tools.filter(t => t.pricing === 'Free' || t.pricing === 'Freemium' || t.pricing === 'Open Source').length;

  // Simulated weekly data
  const weeklyData = [
    { day: 'Mon', value: 3 },
    { day: 'Tue', value: 5 },
    { day: 'Wed', value: 2 },
    { day: 'Thu', value: 7 },
    { day: 'Fri', value: 4 },
    { day: 'Sat', value: 1 },
    { day: 'Sun', value: 6 },
  ];
  const maxWeekly = Math.max(...weeklyData.map(d => d.value));

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
            Dashboard
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Site statistics and health overview
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-2xl p-6">
            <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mb-1">{totalTools}</div>
            <div className="text-sm text-slate-500 dark:text-slate-400">Total Tools</div>
          </div>
          <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-2xl p-6">
            <div className="text-3xl font-extrabold text-blue-600 dark:text-blue-400 mb-1">{freeTools}</div>
            <div className="text-sm text-slate-500 dark:text-slate-400">Free/Freemium</div>
          </div>
          <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-2xl p-6">
            <div className="text-3xl font-extrabold text-violet-600 dark:text-violet-400 mb-1">{savedCount}</div>
            <div className="text-sm text-slate-500 dark:text-slate-400">Saved Tools</div>
          </div>
          <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-2xl p-6">
            <div className="text-3xl font-extrabold text-amber-600 dark:text-amber-400 mb-1">{historyCount}</div>
            <div className="text-sm text-slate-500 dark:text-slate-400">Browsed Tools</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Category Distribution */}
          <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Category Distribution</h2>
            <div className="space-y-4">
              {categoryStats.map(cat => (
                <div key={cat.name}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{cat.name}</span>
                    <span className="text-sm text-slate-500">{cat.count} tools</span>
                  </div>
                  <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${cat.color} rounded-full transition-all duration-700`}
                      style={{ width: `${(cat.count / maxCategoryCount) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly Activity */}
          <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Weekly Activity</h2>
            <div className="flex items-end gap-3 h-40">
              {weeklyData.map(d => (
                <div key={d.day} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-t-lg relative" style={{ height: '100%' }}>
                    <div
                      className="absolute bottom-0 w-full bg-gradient-to-t from-emerald-500 to-teal-400 rounded-t-lg transition-all duration-700"
                      style={{ height: `${(d.value / maxWeekly) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-slate-500">{d.day}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-10 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Quick Links</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/" className="p-4 border border-slate-200 dark:border-gray-700 rounded-xl text-center hover:bg-slate-50 dark:hover:bg-gray-800 transition-colors">
              <div className="text-2xl mb-2">🏠</div>
              <div className="text-sm font-medium text-slate-700 dark:text-slate-300">Home</div>
            </Link>
            <Link href="/compare" className="p-4 border border-slate-200 dark:border-gray-700 rounded-xl text-center hover:bg-slate-50 dark:hover:bg-gray-800 transition-colors">
              <div className="text-2xl mb-2">⚖️</div>
              <div className="text-sm font-medium text-slate-700 dark:text-slate-300">Compare</div>
            </Link>
            <Link href="/saved" className="p-4 border border-slate-200 dark:border-gray-700 rounded-xl text-center hover:bg-slate-50 dark:hover:bg-gray-800 transition-colors">
              <div className="text-2xl mb-2">❤️</div>
              <div className="text-sm font-medium text-slate-700 dark:text-slate-300">Saved</div>
            </Link>
            <Link href="/help" className="p-4 border border-slate-200 dark:border-gray-700 rounded-xl text-center hover:bg-slate-50 dark:hover:bg-gray-800 transition-colors">
              <div className="text-2xl mb-2">❓</div>
              <div className="text-sm font-medium text-slate-700 dark:text-slate-300">Help</div>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
