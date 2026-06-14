'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface HeroSectionProps {
  totalCount: number;
}

const CATEGORIES = [
  { name: 'Writing', icon: '✍️', color: 'from-blue-500 to-cyan-500' },
  { name: 'Image', icon: '🎨', color: 'from-purple-500 to-pink-500' },
  { name: 'Video', icon: '🎬', color: 'from-red-500 to-orange-500' },
  { name: 'Audio', icon: '🎵', color: 'from-green-500 to-teal-500' },
  { name: 'Code', icon: '💻', color: 'from-indigo-500 to-purple-500' },
  { name: 'Productivity', icon: '⚡', color: 'from-yellow-500 to-orange-500' },
];

export default function HeroSection({ totalCount }: HeroSectionProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="relative overflow-hidden">
      {/* Animated Mesh Gradient Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 dark:bg-purple-900 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-70 animate-blob" />
        <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 dark:bg-yellow-900 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 dark:bg-pink-900 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-70 animate-blob animation-delay-4000" />
        <div className="absolute bottom-0 right-20 w-72 h-72 bg-emerald-300 dark:bg-emerald-900 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-70 animate-blob animation-delay-6000" />
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 -z-10 bg-grid-pattern opacity-5 dark:opacity-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
        {/* Logo & Badge */}
        <div className="text-center mb-8 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-slate-200/60 dark:border-gray-800/80 shadow-sm mb-6">
            <img src="/logo.png" alt="Use AI Tools" className="h-6 w-auto" width="24" height="24" loading="eager" />
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              {totalCount.toLocaleString()}+ AI Tools Curated
            </span>
          </div>
        </div>

        {/* Main Headline */}
        <div className="text-center mb-12 animate-fade-in-up animation-delay-200">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight mb-6 leading-[1.1]">
            <span className="text-slate-900 dark:text-white">Discover the </span>
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 bg-clip-text text-transparent">
                Best AI Tools
              </span>
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
                <path d="M0 6 Q75 0, 150 6 T300 6" stroke="url(#gradient)" strokeWidth="3" strokeLinecap="round" className="animate-draw" />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="50%" stopColor="#14b8a6" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
              </svg>
            </span>
            <br />
            <span className="text-slate-900 dark:text-white">for Every Task</span>
          </h1>
          <p className="text-lg sm:text-xl lg:text-2xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed font-light">
            Browse, compare, and choose from {totalCount.toLocaleString()}+ handpicked AI tools.
            <br className="hidden sm:block" />
            No fluff. Just the tools that actually work.
          </p>
        </div>

        {/* Search Box - The Core Feature */}
        <div className="max-w-3xl mx-auto mb-12 animate-fade-in-up animation-delay-400">
          <form onSubmit={handleSearch} className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-500" />
            <div className="relative flex items-center bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-slate-200/60 dark:border-gray-800/80 overflow-hidden">
              <svg className="absolute left-5 w-6 h-6 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search AI tools... (e.g., 'video editor', 'copywriting', 'code assistant')"
                className="flex-1 pl-14 pr-32 py-5 sm:py-6 text-base sm:text-lg bg-transparent text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none"
                aria-label="Search AI tools"
              />
              <button
                type="submit"
                className="absolute right-3 px-6 py-3 sm:px-8 sm:py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/25 active:scale-[0.98] min-h-[44px]"
              >
                Search
              </button>
            </div>
          </form>

          {/* Quick Search Suggestions */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-sm">
            <span className="text-slate-500 dark:text-slate-400">Popular:</span>
            {['ChatGPT', 'Midjourney', 'Copywriting', 'Video Editor', 'Code Assistant'].map((term) => (
              <button
                key={term}
                onClick={() => {
                  setSearchQuery(term);
                  router.push(`/search?q=${encodeURIComponent(term)}`);
                }}
                className="px-3 py-1 rounded-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-slate-200/60 dark:border-gray-800/80 text-slate-700 dark:text-slate-300 hover:border-emerald-500/50 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all duration-300"
              >
                {term}
              </button>
            ))}
          </div>
        </div>

        {/* Category Navigation */}
        <div className="max-w-5xl mx-auto mb-12 animate-fade-in-up animation-delay-600">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {CATEGORIES.map((category, index) => (
              <Link
                key={category.name}
                href={`/?category=${category.name.toLowerCase()}`}
                className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-900 border border-slate-200/60 dark:border-gray-800/80 p-4 sm:p-5 text-center hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                <div className="relative">
                  <div className="text-3xl sm:text-4xl mb-2">{category.icon}</div>
                  <div className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white">
                    {category.name}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Stats Bar */}
        <div className="max-w-4xl mx-auto animate-fade-in-up animation-delay-800">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-1">
                {totalCount.toLocaleString()}+
              </div>
              <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">AI Tools</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-1">6</div>
              <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Categories</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-1">100%</div>
              <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Handpicked</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-1">Weekly</div>
              <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Updated</div>
            </div>
          </div>
        </div>

        {/* Trust Signal */}
        <div className="text-center mt-12 animate-fade-in-up animation-delay-1000">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Built with ❤️ by an indie developer • No paid listings • 100% independent
          </p>
        </div>
      </div>
    </div>
  );
}