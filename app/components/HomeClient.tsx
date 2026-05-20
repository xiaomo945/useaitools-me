'use client';

import React, { useState, useMemo, useRef } from 'react';
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
  examples?: { prompt: string; image_url: string }[];
  needs_vpn: boolean;
  languages: string[];
};

// Helper function to check if a tool has affiliate link (environment variable or JSON field)
const hasAffiliateLink = (tool: Tool): boolean => {
  const envVarName = `AFFILIATE_${tool.name.toUpperCase().replace(/\s+/g, '_')}`;
  let shortEnvVarName = '';
  if (tool.name === 'VEED.io') {
    shortEnvVarName = 'AFFILIATE_VEED';
  } else if (tool.name === 'Murf AI') {
    shortEnvVarName = 'AFFILIATE_MURF';
  } else if (tool.name === 'Pictory') {
    shortEnvVarName = 'AFFILIATE_PICTORY';
  }
  const envLink = (shortEnvVarName && process.env[shortEnvVarName]) || process.env[envVarName];
  return !!(envLink || tool.affiliate_link);
};

// Helper function to get affiliate link for a tool
const getAffiliateLink = (tool: Tool): string => {
  const envVarName = `AFFILIATE_${tool.name.toUpperCase().replace(/\s+/g, '_')}`;
  let shortEnvVarName = '';
  if (tool.name === 'VEED.io') {
    shortEnvVarName = 'AFFILIATE_VEED';
  } else if (tool.name === 'Murf AI') {
    shortEnvVarName = 'AFFILIATE_MURF';
  } else if (tool.name === 'Pictory') {
    shortEnvVarName = 'AFFILIATE_PICTORY';
  }
  const envLink = (shortEnvVarName && process.env[shortEnvVarName]) || process.env[envVarName];
  return envLink || tool.affiliate_link;
};

type Category = string;

interface HomeClientProps {
  initialTools: Tool[];
}

export default function HomeClient({ initialTools }: HomeClientProps) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  // Load saved ids from localStorage on initialization
  const getSavedIds = (): number[] => {
    try {
      const saved = localStorage.getItem('savedTools');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  };
  
  // Load recently viewed from localStorage on initialization
  const getRecentlyViewedIds = (): number[] => {
    try {
      const recent = localStorage.getItem('recentlyViewed');
      return recent ? JSON.parse(recent) : [];
    } catch {
      return [];
    }
  };
  
  const [savedIds, setSavedIds] = useState<number[]>(getSavedIds());
  const [selectedForCompare, setSelectedForCompare] = useState<number[]>([]);
  const [heartBurst, setHeartBurst] = useState<{ [key: number]: boolean }>({});
  const [recentlyViewedIds, setRecentlyViewedIds] = useState<number[]>(getRecentlyViewedIds());
  const heartBurstRefs = useRef<{ [key: number]: HTMLSpanElement | null }>({});
  const categoryButtonsRef = useRef<(HTMLButtonElement | null)[]>([]);
  
  // Keyboard navigation for search box (Esc to clear)
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setSearch('');
    }
  };
  
  // Keyboard navigation for category buttons (arrow keys)
  const handleCategoryKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      const nextIndex = (index + 1) % categories.length;
      categoryButtonsRef.current[nextIndex]?.focus();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prevIndex = (index - 1 + categories.length) % categories.length;
      categoryButtonsRef.current[prevIndex]?.focus();
    }
  };
  
  // Save toggle function with heart burst effect
  const toggleSave = (id: number) => {
    const newSavedIds = savedIds.includes(id)
      ? savedIds.filter((savedId) => savedId !== id)
      : [...savedIds, id];
    setSavedIds(newSavedIds);
    localStorage.setItem('savedTools', JSON.stringify(newSavedIds));
    
    if (!savedIds.includes(id)) {
      setHeartBurst(prev => ({ ...prev, [id]: true }));
      setTimeout(() => {
        setHeartBurst(prev => ({ ...prev, [id]: false }));
      }, 500);
    }
  };

  // Toggle tool for comparison
  const toggleCompare = (id: number) => {
    setSelectedForCompare(prev => {
      if (prev.includes(id)) {
        return prev.filter(toolId => toolId !== id);
      } else {
        if (prev.length >= 2) {
          return prev.slice(1).concat(id);
        }
        return prev.concat(id);
      }
    });
  };
  
  // 智能选择 3 个精选工具 - 优先选择中国 AI 工具
  const [featuredTools] = useState(() => {
    // 先筛选出不需要 VPN 的中国 AI 工具
    const chineseTools = initialTools.filter(tool => !tool.needs_vpn);
    // 然后是所有工具
    const allTools = [...initialTools];
    
    // 智能选择：如果有中国 AI 工具，优先选择，然后混合其他工具
    const selected: Tool[] = [];
    
    // 从中国 AI 工具中选择最多 2 个
    const chineseCandidates = [...chineseTools];
    for (let i = chineseCandidates.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [chineseCandidates[i], chineseCandidates[j]] = [chineseCandidates[j], chineseCandidates[i]];
    }
    selected.push(...chineseCandidates.slice(0, 2));
    
    // 从所有工具中选择剩余的（排除已选择的）
    const remaining = allTools.filter(t => !selected.some(s => s.id === t.id));
    for (let i = remaining.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [remaining[i], remaining[j]] = [remaining[j], remaining[i]];
    }
    selected.push(...remaining.slice(0, 3 - selected.length));
    
    return selected;
  });

  const categories: Category[] = ['All', 'Writing', 'Image', 'Productivity', 'Code', 'Audio', 'Video'];

  // 智能排序：优先展示海外 AI 工具（needs_vpn: true），中文工具排在后面
  const filteredTools = useMemo(() => {
    const filtered = initialTools.filter((tool) => {
      const matchesSearch = 
        tool.name.toLowerCase().includes(search.toLowerCase()) || 
        tool.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || tool.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
    
    // 智能排序：海外工具优先展示
    return [...filtered].sort((a, b) => {
      if (a.needs_vpn && !b.needs_vpn) return -1;
      if (!a.needs_vpn && b.needs_vpn) return 1;
      
      // 都需要 VPN 或都不需要 VPN 的情况下，按原顺序（id）
      return a.id - b.id;
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

  const tooltipMap: Record<string, string> = {
    'All': 'Browse all AI tools',
    'Writing': 'Discover AI Writing assistants',
    'Image': 'Explore AI Image generators',
    'Productivity': 'Boost productivity with AI',
    'Code': 'AI Coding companions',
    'Audio': 'AI Audio tools',
    'Video': 'AI Video creation'
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 relative overflow-hidden">
      {/* Announcement Banner */}
      {showBanner && (
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 z-10 relative">
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
      <div className="py-12 sm:py-16 px-4 sm:px-8 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Hero Section with Glow */}
        <div className="text-center mb-16 relative">
          {/* Background Breathing Glow - Only Desktop */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent rounded-full blur-3xl animate-breathe pointer-events-none hidden sm:block" />
          
          <img src="/logo.png" alt="Use AI Tools Logo - Discover the best AI tools" className="h-12 sm:h-14 w-auto mx-auto mb-3 relative z-10" width="80" height="48" loading="eager" />
          <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight mb-2 relative z-10">
            <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              Use AI Tools
            </span>
          </h1>
          <p className="text-2xl sm:text-3xl font-light text-emerald-600 dark:text-emerald-400 mb-4 relative z-10">
            Your AI Toolbox
          </p>
          <p className="text-slate-500 dark:text-slate-400 text-base sm:text-lg max-w-2xl mx-auto mb-8 relative z-10">
            Discover, compare & choose the best AI tools for every task. Curated weekly.
          </p>
          
          {/* Trust Signal */}
          <div className="mb-8 relative z-10">
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
              Built in public by an indie maker from an internet café in China. 135+ tools handpicked, not paid for. Here&apos;s my story →
            </p>
          </div>
          
          {/* Search Box */}
          <div className="relative max-w-2xl mx-auto mb-8 px-4 sm:px-0">
            <div className="relative">
              <svg
                className="absolute left-4 sm:left-5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
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
                onKeyDown={handleSearchKeyDown}
                aria-label="Search AI tools"
                autoComplete="off"
                autoCorrect="off"
                spellCheck="false"
                className="w-full px-4 sm:px-5 py-3 sm:py-4 pl-12 sm:pl-14 pr-10 sm:pr-12 rounded-2xl bg-white dark:bg-gray-900 border border-slate-200/60 dark:border-gray-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-300 dark:focus:border-emerald-600 shadow-sm transition-all duration-300 ease-out"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all duration-200"
                  aria-label="Clear search"
                >
                  <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Submit Tool Button */}
          <div className="text-center mb-8">
            <Link
              href="/submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 rounded-full hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-all duration-300"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Submit a Tool
            </Link>
          </div>

          {/* Category Buttons */}
          <div className="relative">
            {/* Left Gradient Fade */}
            <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-10 bg-gradient-to-r from-slate-50 dark:from-gray-950 to-transparent pointer-events-none z-10" />
            {/* Right Gradient Fade */}
            <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-10 bg-gradient-to-l from-slate-50 dark:from-gray-950 to-transparent pointer-events-none z-10" />
            
            <div className="flex overflow-x-auto scrollbar-hide gap-2.5 sm:gap-3 sm:justify-center sm:flex-wrap px-6 sm:px-0 py-1">
              {categories.map((category, index) => {
                const isActive = selectedCategory === category;
                
                const buttonStyle = `px-4 sm:px-5 py-2.5 sm:py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ease-out active:scale-[0.98] whitespace-nowrap focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none min-h-[44px] flex items-center justify-center ${
                  isActive
                    ? category === 'All'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`;
                
                return (
                  <button
                    key={category}
                    ref={(el) => {
                      if (el) {
                        categoryButtonsRef.current[index] = el;
                      }
                    }}
                    onClick={() => setSelectedCategory(category)}
                    onKeyDown={(e) => handleCategoryKeyDown(e, index)}
                    className={buttonStyle}
                    title={tooltipMap[category]}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
          </div>
          
          {/* Search Result Count */}
          <div className="text-center mb-8">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              {search.trim() || selectedCategory !== 'All' ? (
                filteredTools.length === 0 ? (
                  <span className="text-rose-500 dark:text-rose-400">No tools found</span>
                ) : (
                  `Showing ${filteredTools.length} tool${filteredTools.length !== 1 ? 's' : ''}`
                )
              ) : (
                `Showing all ${initialTools.length} tools`
              )}
            </p>
          </div>
        </div>

        {/* Featured This Week */}
        <div className="mb-16">
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
                  className="shimmer-card bg-white dark:bg-gray-900 border border-slate-200/60 dark:border-gray-800 rounded-2xl p-5 shadow-sm hover:border-emerald-300 dark:hover:border-emerald-600 hover:shadow-xl hover:shadow-emerald-500/5 hover:-translate-y-1 transition-all duration-300 ease-out animate-fade-in-up"
                  style={{ 
                    willChange: 'transform', 
                    animationDelay: `${index * 50}ms`,
                    opacity: 0,
                    animationFillMode: 'forwards'
                  }}
                >
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-11 h-11 rounded-xl ${colors.bg}/10 dark:${colors.bgDark} ${colors.textLight} dark:${colors.text} flex items-center justify-center text-xl font-bold`} style={{ fontFamily: 'Playfair Display, serif' }}>
                        {tool.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                          {tool.name}
                        </h3>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colors.bgDark} ${colors.textLight} dark:${colors.text}`}>
                            {tool.category}
                          </span>
                          {tool.needs_vpn ? (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                              🪜 VPN
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                              ✅ Direct
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4 line-clamp-2">
                    {tool.description}
                  </p>
                  <Link
                    href={`/tools/${tool.id}`}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
                  >
                    Learn More →
                  </Link>
                </div>
              );
            })}
          </div>
        </div>

        {/* Blog Entry Card */}
        <div className="mb-16">
          <Link href="/blog" className="block">
            <div className="bg-gradient-to-br from-emerald-50/90 via-white to-teal-50/90 dark:from-emerald-950/70 dark:via-gray-900 dark:to-teal-950/70 backdrop-blur-xl border border-emerald-200/60 dark:border-emerald-500/10 shadow-xl shadow-emerald-500/5 dark:shadow-2xl dark:shadow-emerald-500/5 rounded-3xl p-8 sm:p-10 hover:shadow-2xl hover:shadow-emerald-500/10 hover:-translate-y-1 transition-all duration-300 ease-out">
              <div className="text-center">
                <div className="text-3xl sm:text-4xl mb-3">📝</div>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-3">
                  AI Tool Comparisons & Guides
                </h2>
                <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
                  In-depth reviews to help you choose the perfect tool
                </p>
                <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 hover:-translate-y-0.5 transition-all duration-300">
                  Explore Blog →
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Gradient Separator Line */}
        <div className="h-px bg-gradient-to-r from-transparent via-emerald-300 dark:via-emerald-700/40 to-transparent mb-16 mx-auto max-w-2xl" />

        {/* Tools Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7 transition-all duration-300 ease-out">
          {filteredTools.map((tool, index) => {
            const colors = getCategoryColors(tool.category);
            const pricingColors = getPricingColors(tool.pricing);
            const isSaved = savedIds.includes(tool.id);
            const isSelectedForCompare = selectedForCompare.includes(tool.id);
            const hasAffiliate = hasAffiliateLink(tool);
            const ctaText = hasAffiliate ? '🔗 Try It Free' : 'Visit Website';
            
            return (
              <Link
                key={tool.id}
                href={`/tools/${tool.id}`}
                className={`bg-white dark:bg-gray-900 border border-slate-200/60 dark:border-gray-800 shadow-sm rounded-2xl overflow-hidden hover:border-emerald-300 dark:hover:border-emerald-600 hover:shadow-xl hover:shadow-emerald-500/5 hover:-translate-y-1 active:scale-[0.98] transition-all duration-300 ease-out animate-fade-in-up focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 block relative ${hasAffiliate ? 'affiliate-card' : ''}`}
                style={{ 
                  animationDelay: `${index * 50}ms`,
                  willChange: 'transform'
                }}
              >
                {/* Shimmer effect for affiliate cards */}
                {hasAffiliate && (
                  <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
                    <div className="shimmer-sweep" />
                  </div>
                )}
                
                {/* Staff Pick Badge for affiliate tools */}
                {hasAffiliate && (
                  <div className="absolute top-3 right-3 z-10">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/25 animate-pulse-glow">
                      🏷️ Staff Pick
                    </span>
                  </div>
                )}
                
                {/* Category Color Bar - 3px Height */}
                <div className={`h-0.75 w-full ${colors.bg}`} style={{ height: '3px' }} />
                
                <div className="p-5">
                  {/* Tool Header with Compare Checkbox */}
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-11 h-11 rounded-xl ${colors.bg}/10 dark:${colors.bgDark} ${colors.textLight} dark:${colors.text} flex items-center justify-center text-xl font-bold hover:scale-105 transition-transform duration-300 ease-out`} style={{ fontFamily: 'Playfair Display, serif' }}>
                        {tool.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg text-slate-900 dark:text-white">
                          {highlightText(tool.name, search)}
                        </h3>
                        <div className="flex items-center gap-1.5 mt-1">
                          {tool.needs_vpn ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                              🪜 VPN Required
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                              ✅ Direct Access
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleCompare(tool.id);
                        }}
                        className={`w-6 h-6 rounded border-2 transition-all duration-300 ease-out flex items-center justify-center ${
                          isSelectedForCompare 
                            ? 'bg-emerald-500 border-emerald-500 text-white' 
                            : 'border-slate-300 dark:border-slate-600 hover:border-emerald-400'
                        }`}
                        aria-label={`Select ${tool.name} for comparison`}
                        title="Select for comparison"
                      >
                        {isSelectedForCompare && (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>
                      <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${pricingColors.bg} ${pricingColors.text}`}>
                        {tool.pricing}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed mt-4 mb-4 line-clamp-2">
                    {highlightText(tool.description, search)}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between gap-3">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${colors.bg} text-white dark:${colors.bgDark} dark:${colors.text} whitespace-nowrap`}>
                      {tool.category}
                    </span>
                    
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <Link
                        href={`/compare?tool=${tool.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-3 min-h-[44px] min-w-[44px] border border-gray-300 dark:border-gray-600 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm text-gray-600 dark:text-gray-400 text-xs sm:text-sm font-semibold rounded-lg transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-white dark:hover:bg-gray-800 hover:border-emerald-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:shadow-md focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2 focus-visible:outline-none active:scale-[0.98]"
                      >
                        <svg
                          className="w-3.5 h-3.5 sm:w-4 sm:h-4"
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
                        <span className="hidden sm:inline">Compare</span>
                      </Link>
                      <a
                        href={getAffiliateLink(tool) || tool.url}
                        target="_blank"
                        rel="noopener noreferrer sponsored"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-3 min-h-[44px] min-w-[44px] border border-emerald-300 dark:border-emerald-600/30 bg-white/10 backdrop-blur-md dark:bg-gray-800/30 text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm font-semibold rounded-lg transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-gradient-to-r hover:from-emerald-500 hover:to-teal-500 hover:text-white hover:border-transparent focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:outline-none active:scale-[0.98]"
                      >
                        <svg
                          className="w-3.5 h-3.5 sm:w-4 sm:h-4"
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
                        </svg>
                        <span className="hidden sm:inline">{ctaText}</span>
                      </a>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleSave(tool.id);
                        }}
                        className={`inline-flex items-center justify-center gap-0.5 px-2 min-h-[44px] min-w-[44px] rounded-lg text-xs sm:text-sm font-semibold transition-all duration-300 ease-out relative overflow-hidden whitespace-nowrap active:scale-[0.98] ${
                          isSaved
                            ? 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300 hover:bg-rose-200 dark:hover:bg-rose-500/30'
                            : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                        aria-label={isSaved ? `Unsave ${tool.name}` : `Save ${tool.name}`}
                      >
                        <span ref={el => { heartBurstRefs.current[tool.id] = el; }}>
                          {heartBurst[tool.id] && (
                            <span className="heart-burst absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                          )}
                        </span>
                        ❤️ <span className="hidden sm:inline">{isSaved ? 'Saved' : 'Save'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredTools.length === 0 && (
          <div className="text-center py-20">
            <div className="mx-auto w-20 h-20 mb-6 text-slate-300 dark:text-slate-600">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full" aria-hidden="true">
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
              So empty, so serene. Try a different search maybe?
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
                aria-label="Email address for newsletter"
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

        {/* Recently Viewed Section */}
        {recentlyViewedIds.length > 0 && (
          <div className="mt-16 mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-8 text-center">
              Recently Viewed
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {recentlyViewedIds.map((toolId) => {
                const tool = initialTools.find(t => t.id === toolId);
                if (!tool) return null;
                
                const colors = getCategoryColors(tool.category);
                const pricingColors = getPricingColors(tool.pricing);
                
                return (
                  <Link
                    key={tool.id}
                    href={`/tools/${tool.id}`}
                    className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-2xl p-5 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-out"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-10 h-10 rounded-xl ${colors.bg}/10 dark:${colors.bgDark} ${colors.textLight} dark:${colors.text} flex items-center justify-center text-xl font-bold`} style={{ fontFamily: 'Playfair Display, serif' }}>
                        {tool.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg text-slate-900 dark:text-white truncate">
                          {tool.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${colors.bgDark} ${colors.textLight} dark:${colors.text}`}>
                            {tool.category}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${pricingColors.bg} ${pricingColors.text}`}>
                            {tool.pricing}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed line-clamp-2">
                      {tool.description}
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* FAQ Section */}
        <div className="mt-16 mb-10">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-8 text-center">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              <details className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-2xl overflow-hidden">
                <summary className="px-6 py-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-gray-800 transition-colors duration-200 font-semibold text-slate-900 dark:text-white flex items-center justify-between">
                  <span>What is Use AI Tools?</span>
                  <svg className="w-5 h-5 text-slate-500 dark:text-gray-400 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-6 py-4 text-slate-600 dark:text-gray-300 border-t border-slate-100 dark:border-gray-800">
                  Use AI Tools is a curated directory of the best AI tools available today. We organize tools into categories like Writing, Image, Productivity, Code, Audio, and Video to help you find the perfect tool for your needs.
                </div>
              </details>
              <details className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-2xl overflow-hidden">
                <summary className="px-6 py-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-gray-800 transition-colors duration-200 font-semibold text-slate-900 dark:text-white flex items-center justify-between">
                  <span>How do I choose the right AI tool?</span>
                  <svg className="w-5 h-5 text-slate-500 dark:text-gray-400 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-6 py-4 text-slate-600 dark:text-gray-300 border-t border-slate-100 dark:border-gray-800">
                  You can browse by category, use our search function, or read our detailed comparison guides. Each tool includes a description, pricing information, and a link to the official website.
                </div>
              </details>
              <details className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-2xl overflow-hidden">
                <summary className="px-6 py-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-gray-800 transition-colors duration-200 font-semibold text-slate-900 dark:text-white flex items-center justify-between">
                  <span>Are the AI tools listed here free?</span>
                  <svg className="w-5 h-5 text-slate-500 dark:text-gray-400 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-6 py-4 text-slate-600 dark:text-gray-300 border-t border-slate-100 dark:border-gray-800">
                  We include both free and paid AI tools. Many tools offer free tiers or trials, while others require a subscription. We clearly label each tool with its pricing model for easy comparison.
                </div>
              </details>
            </div>
          </div>
        </div>

        {/* Impact 验证标签 - 不可见 */}
        <p style={{ display: 'none' }}>
          Impact-Site-Verification: 8b49f367-76f9-42f1-b988-7c24a629b8d8
        </p>
      </div>
      </div>

      {/* Comparison Bar */}
      {selectedForCompare.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-slate-200 dark:border-gray-800 shadow-2xl z-50 transform transition-transform duration-300 ease-out">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {selectedForCompare.length === 1 ? '1 tool selected' : '2 tools selected'}
                </span>
                <div className="flex items-center gap-2">
                  {selectedForCompare.map((toolId) => {
                    const tool = initialTools.find(t => t.id === toolId);
                    if (!tool) return null;
                    const colors = getCategoryColors(tool.category);
                    return (
                      <span key={tool.id} className={`px-3 py-1 rounded-full text-xs font-semibold ${colors.bgDark} ${colors.textLight} dark:${colors.text}`}>
                        {tool.name}
                      </span>
                    );
                  })}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedForCompare([])}
                  className="px-3 py-2 text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
                >
                  Clear
                </button>
                <Link
                  href={`/compare?tool=${selectedForCompare[0]}${selectedForCompare[1] ? `&tool=${selectedForCompare[1]}` : ''}`}
                  className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
                >
                  Compare Now →
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
