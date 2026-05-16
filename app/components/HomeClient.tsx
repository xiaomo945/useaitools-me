'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';

// 高亮搜索关键词的辅助函数
const highlightText = (text: string, searchTerm: string) => {
  if (!searchTerm.trim()) {
    return <>{text}</>;
  }

  const parts = text.split(new RegExp(`(${searchTerm})`, 'gi'));
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === searchTerm.toLowerCase() ? (
          <span key={i} className="bg-yellow-200 dark:bg-yellow-800 rounded px-1">
            {part}
          </span>
        ) : (
          part
        )
      )}
    </>
  );
};

type Tool = {
  id: number;
  name: string;
  description: string;
  category: string;
  pricing: string;
  url: string;
  affiliate_link: string;
  icon_url: string;
  examples?: any[];
};

type Category = string;

interface HomeClientProps {
  initialTools: Tool[];
}

export default function HomeClient({ initialTools }: HomeClientProps) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [savedIds, setSavedIds] = useState<number[]>([]);

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://useaitools.me"
      }
    ]
  };
  
  // Load saved ids from localStorage on mount
  React.useEffect(() => {
    const saved = localStorage.getItem('savedTools');
    if (saved) {
      setSavedIds(JSON.parse(saved));
    }
  }, []);
  
  // Save toggle function
  const toggleSave = (id: number) => {
    const newSavedIds = savedIds.includes(id)
      ? savedIds.filter((savedId) => savedId !== id)
      : [...savedIds, id];
    setSavedIds(newSavedIds);
    localStorage.setItem('savedTools', JSON.stringify(newSavedIds));
  };
  
  // Randomly select 3 featured tools - using Fisher-Yates shuffle for better randomness
  const [featuredTools] = useState(() => {
    const shuffled = [...initialTools];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, 3);
  });

  const categories: Category[] = ['All', 'Writing', 'Image', 'Productivity', 'Code', 'Audio', 'Video'];

  const filteredTools = useMemo(() => {
    return initialTools.filter((tool) => {
      const matchesSearch = 
        tool.name.toLowerCase().includes(search.toLowerCase()) || 
        tool.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || tool.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, selectedCategory, initialTools]);

  const getCategoryColors = (category: string) => {
    switch (category) {
      case 'Writing':
        return {
          bg: 'bg-blue-500',
          bgDark: 'bg-blue-500/20',
          text: 'text-blue-300',
          textLight: 'text-blue-600',
          border: 'border-blue-300',
          ring: 'hover:shadow-blue-500/20',
          shadow: 'rgba(59, 130, 246, 0.4)',
        };
      case 'Image':
        return {
          bg: 'bg-violet-500',
          bgDark: 'bg-violet-500/20',
          text: 'text-violet-300',
          textLight: 'text-violet-600',
          border: 'border-violet-300',
          ring: 'hover:shadow-violet-500/20',
          shadow: 'rgba(139, 92, 246, 0.4)',
        };
      case 'Productivity':
        return {
          bg: 'bg-teal-500',
          bgDark: 'bg-teal-500/20',
          text: 'text-teal-300',
          textLight: 'text-teal-600',
          border: 'border-teal-300',
          ring: 'hover:shadow-teal-500/20',
          shadow: 'rgba(20, 184, 166, 0.4)',
        };
      case 'Code':
        return {
          bg: 'bg-orange-500',
          bgDark: 'bg-orange-500/20',
          text: 'text-orange-300',
          textLight: 'text-orange-600',
          border: 'border-orange-300',
          ring: 'hover:shadow-orange-500/20',
          shadow: 'rgba(249, 115, 22, 0.4)',
        };
      case 'Audio':
        return {
          bg: 'bg-pink-500',
          bgDark: 'bg-pink-500/20',
          text: 'text-pink-300',
          textLight: 'text-pink-600',
          border: 'border-pink-300',
          ring: 'hover:shadow-pink-500/20',
          shadow: 'rgba(236, 72, 153, 0.4)',
        };
      case 'Video':
        return {
          bg: 'bg-indigo-500',
          bgDark: 'bg-indigo-500/20',
          text: 'text-indigo-300',
          textLight: 'text-indigo-600',
          border: 'border-indigo-300',
          ring: 'hover:shadow-indigo-500/20',
          shadow: 'rgba(99, 102, 241, 0.4)',
        };
      default:
        return {
          bg: 'bg-slate-500',
          bgDark: 'bg-slate-500/20',
          text: 'text-slate-300',
          textLight: 'text-slate-600',
          border: 'border-slate-300',
          ring: 'hover:shadow-slate-500/20',
          shadow: 'rgba(100, 116, 139, 0.4)',
        };
    }
  };

  const getPricingColors = (pricing: string) => {
    switch (pricing) {
      case 'Freemium':
        return {
          bg: 'bg-emerald-100 dark:bg-emerald-500/20',
          text: 'text-emerald-700 dark:text-emerald-300',
        };
      case 'Free Trial':
        return {
          bg: 'bg-blue-100 dark:bg-blue-500/20',
          text: 'text-blue-700 dark:text-blue-300',
        };
      case 'Paid':
        return {
          bg: 'bg-slate-100 dark:bg-slate-800',
          text: 'text-slate-700 dark:text-slate-300',
        };
      case 'Open Source':
        return {
          bg: 'bg-purple-100 dark:bg-purple-500/20',
          text: 'text-purple-700 dark:text-purple-300',
        };
      default:
        return {
          bg: 'bg-slate-100 dark:bg-slate-800',
          text: 'text-slate-700 dark:text-slate-300',
        };
    }
  };

  const [showBanner, setShowBanner] = useState(true);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 grid-background">
      {/* Announcement Banner */}
      {showBanner && (
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-3">
            <span className="text-lg">🚀</span>
            <p className="text-center text-sm sm:text-base font-medium">
              Now featuring 50+ AI tools across 6 categories. New tools added weekly!
            </p>
            <button
              onClick={() => setShowBanner(false)}
              className="ml-2 p-1 hover:bg-white/20 rounded-full transition-colors duration-200"
              aria-label="Close announcement"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
      <div className="py-12 sm:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Hero Section - Green Glass Card */}
        <div className="mb-10">
          <div className="bg-gradient-to-br from-emerald-50/80 via-white to-teal-50/80 dark:from-emerald-950/60 dark:via-gray-900 dark:to-teal-950/60 backdrop-blur-xl border border-white/60 dark:border-emerald-500/10 shadow-xl shadow-emerald-500/5 dark:shadow-2xl dark:shadow-emerald-500/5 rounded-3xl p-8 sm:p-12">
            {/* Title */}
            <div className="text-center mb-10">
              <img src="/logo.png" alt="Use AI Tools" className="h-16 sm:h-20 w-auto mx-auto mb-4 drop-shadow-md" />
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-2">
                <span style={{ fontFamily: 'Playfair Display, serif' }}>Use AI Tools</span>
                <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent font-extrabold ml-2">
                  – Your AI Toolbox
                </span>
              </h1>
              <p className="text-base sm:text-lg text-gray-500 dark:text-gray-400 mt-3 max-w-2xl mx-auto">
                Discover, compare, and choose the best AI tools for every task.
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                Curated by AI experts, updated weekly.
              </p>
              <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/compare"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold rounded-full shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 hover:-translate-y-0.5 transition-all duration-300"
                >
                  Compare AI Tools
                </Link>
                <Link
                  href="/blog"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold rounded-full shadow-lg shadow-pink-500/25 hover:shadow-xl hover:shadow-pink-500/30 hover:-translate-y-0.5 transition-all duration-300"
                >
                  AI Tools Blog
                </Link>
              </div>
            </div>

            {/* Search & Filter Container */}
            <div className="max-w-4xl mx-auto">
              {/* Search Box and Saved Link */}
              <div className="relative mb-6">
                <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                  <div className="relative flex-1 w-full">
                    <svg
                      className="absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                    <input
                      type="text"
                      placeholder="Search 50+ AI tools..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full px-5 py-4 pl-14 pr-12 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-slate-200 dark:border-gray-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all duration-300 ease-out"
                    />
                    {search && (
                      <button
                        onClick={() => setSearch('')}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-all duration-200"
                        aria-label="Clear search"
                      >
                        <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                  <Link
                    href="/saved"
                    className="inline-flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold rounded-full shadow-lg shadow-rose-500/25 hover:shadow-xl hover:shadow-rose-500/30 hover:-translate-y-0.5 transition-all duration-300"
                  >
                    ❤️ Saved Tools ({savedIds.length})
                  </Link>
                </div>
              </div>

              {/* Category Buttons */}
              <div className="flex flex-nowrap justify-start sm:justify-center gap-2 sm:gap-3 overflow-x-auto sm:overflow-visible pb-3 sm:pb-0 -mx-2 px-2 sm:mx-0 sm:px-0">
                {categories.map((category) => {
                  const isActive = selectedCategory === category;
                  const colors = getCategoryColors(category);
                  
                  const buttonStyle = `flex-shrink-0 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ease-out active:scale-95 whitespace-nowrap focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none relative overflow-hidden ${
                    isActive
                      ? `bg-gray-900 text-white dark:bg-white dark:text-gray-900`
                      : `bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700`
                  }`;
                  
                  return (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={buttonStyle}
                      style={isActive ? {
                        boxShadow: `0 0 12px ${colors.shadow}`
                      } : {}}
                    >
                      {category}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="mb-10">
          <div className="bg-gradient-to-br from-blue-50/80 via-white to-indigo-50/80 dark:from-blue-950/60 dark:via-gray-900 dark:to-indigo-950/60 backdrop-blur-xl border border-white/60 dark:border-blue-500/10 shadow-xl shadow-blue-500/5 dark:shadow-2xl dark:shadow-blue-500/5 rounded-3xl p-8 sm:p-12">
            <div className="text-center">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-4">
                About Use AI Tools
              </h2>
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                We curate the best AI tools for content creators, developers, and marketers. Every tool is handpicked, tested, and organized into categories so you can find exactly what you need. Updated weekly. Built by an indie maker from an internet café in China.
              </p>
            </div>
          </div>
        </div>

        {/* Featured This Week */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              🔥 Featured This Week
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredTools.map((tool, index) => {
              const colors = getCategoryColors(tool.category);
              return (
                <div
                  key={tool.id}
                  className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-3xl p-6 shadow-lg hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 ease-out animate-fade-in-up"
                  style={{ 
                    willChange: 'transform', 
                    animationDelay: `${index * 50}ms`,
                    opacity: 0,
                    animationFillMode: 'forwards'
                  }}
                >
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl ${colors.bg}/10 dark:${colors.bgDark} ${colors.textLight} dark:${colors.text} flex items-center justify-center text-xl font-bold`} style={{ fontFamily: 'Playfair Display, serif' }}>
                        {tool.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                          {tool.name}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colors.bgDark} ${colors.textLight} dark:${colors.text}`}>
                          {tool.category}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-slate-600 dark:text-gray-300 text-sm leading-relaxed mb-4 line-clamp-3">
                    {tool.description}
                  </p>
                  <Link
                    href={`/tools/${tool.id}`}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 hover:-translate-y-0.5 transition-all duration-300"
                  >
                    Learn More →
                  </Link>
                </div>
              );
            })}
          </div>
        </div>

        {/* Gradient Separator Line */}
        <div className="h-px bg-gradient-to-r from-transparent via-emerald-300 dark:via-emerald-700/40 to-transparent mb-10 mx-auto max-w-2xl" />

        {/* Tools Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7 transition-all duration-300 ease-out">
          {filteredTools.map((tool, index) => {
            const colors = getCategoryColors(tool.category);
            const pricingColors = getPricingColors(tool.pricing);
            
            return (
              <div
                key={tool.id}
                className={`bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 shadow-sm dark:shadow-xl rounded-2xl overflow-hidden group hover:-translate-y-1.5 transition-all duration-300 ease-out animate-fade-in-up ${colors.ring}`}
                style={{ 
                  animationDelay: `${index * 50}ms`,
                  willChange: 'transform'
                }}
              >
                {/* Category Color Bar - 3px Height */}
                <div className={`h-0.75 w-full ${colors.bg}`} style={{ height: '3px' }} />
                
                <div className="p-7">
                  {/* Tool Header */}
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-11 h-11 rounded-xl ${colors.bg}/10 dark:${colors.bgDark} ${colors.textLight} dark:${colors.text} flex items-center justify-center text-xl font-bold group-hover:scale-105 transition-transform duration-300 ease-out`} style={{ fontFamily: 'Playfair Display, serif' }}>
                        {tool.name.charAt(0)}
                      </div>
                      <h3 className="font-semibold text-xl text-slate-900 dark:text-white">
                        {highlightText(tool.name, search)}
                      </h3>
                    </div>
                    <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${pricingColors.bg} ${pricingColors.text}`}>
                      {tool.pricing}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-slate-600 dark:text-gray-300 leading-relaxed mb-6">
                    {highlightText(tool.description, search)}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between gap-3">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${colors.bg} text-white dark:${colors.bgDark} dark:${colors.text}`}>
                      {tool.category}
                    </span>
                    
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/compare?tool=${tool.id}`}
                        className="inline-flex items-center gap-2 px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 text-sm font-semibold rounded-lg transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-slate-100 dark:hover:bg-slate-700 hover:border-slate-400 dark:hover:border-slate-500 focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2 focus-visible:outline-none"
                      >
                        Compare
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7h12M8 12h12M8 17h12M4 7h.01M4 12h.01M4 17h.01"
                          />
                        </svg>
                      </Link>
                      <a
                        href={tool.affiliate_link || tool.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center gap-2 px-4 py-2 border ${colors.border} dark:${colors.bgDark} dark:border-transparent ${colors.textLight} dark:${colors.text} text-sm font-semibold rounded-lg transition-all duration-300 ease-out hover:-translate-y-0.5 hover:${colors.bg} hover:text-white hover:border-transparent focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:outline-none`}
                      >
                        Visit Website
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 17L17 7"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 7H8.5M17 7v8.5"
                          />
                        </svg>
                      </a>
                      <button
                        onClick={() => toggleSave(tool.id)}
                        className={`inline-flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ease-out ${
                          savedIds.includes(tool.id)
                            ? 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300 hover:bg-rose-200 dark:hover:bg-rose-500/30'
                            : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                      >
                        ❤️ {savedIds.includes(tool.id) ? 'Saved' : 'Save'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

               {/* Empty State */}
        {filteredTools.length === 0 && (
          <div className="text-center py-20">
            <div className="mx-auto w-20 h-20 mb-6 text-slate-300 dark:text-slate-600">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13.5 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M15 9l-6 6"
                />
              </svg>
            </div>
            <p className="text-slate-500 dark:text-slate-500 text-lg font-medium mb-4">
              No tools found. Try a different search term or category.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              <span className="text-sm text-slate-400 dark:text-slate-500">Try searching:</span>
              {['ChatGPT', 'Midjourney', 'GitHub Copilot', 'DALL-E', 'Notion AI'].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => {
                    setSearch(suggestion);
                    setSelectedCategory('All');
                  }}
                  className="px-3 py-1.5 text-sm bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Newsletter */}
        <div className="mt-16 mb-10">
          <div className="bg-gradient-to-br from-indigo-50/80 via-white to-purple-50/80 dark:from-indigo-950/60 dark:via-gray-900 dark:to-purple-950/60 backdrop-blur-xl border border-white/60 dark:border-indigo-500/10 shadow-xl shadow-indigo-500/5 dark:shadow-2xl dark:shadow-indigo-500/5 rounded-3xl p-8 sm:p-12 text-center">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-2">
              📬 Stay Updated
            </h2>
            <p className="text-base sm:text-lg text-gray-500 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
              Get the best new AI tools delivered weekly.
            </p>
            <form
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
              onSubmit={(e) => {
                e.preventDefault();
                alert('Thanks for subscribing!');
              }}
            >
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-5 py-3 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-slate-200 dark:border-gray-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all duration-300"
                required
              />
              <button
                type="submit"
                className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold rounded-full shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 hover:-translate-y-0.5 transition-all duration-300"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Impact 验证标签 - 不可见 */}
        <p style={{ display: 'none' }}>
          Impact-Site-Verification: 8b49f367-76f9-42f1-b988-7c24a629b8d8
        </p>
      </div>
      </div>
    </div>
  );
}
