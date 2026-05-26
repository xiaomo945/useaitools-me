'use client';

import React, { useState, useMemo, useRef, useEffect, memo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import StarRating from './StarRating';

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

// Memoized Tool Card Component
const ToolCard = memo(function ToolCard({
  tool,
  index,
  search,
  isSaved,
  isSelectedForCompare,
  toggleSave,
  toggleCompare,
  hasAffiliate,
  ctaText,
  heartBurst,
  getCategoryColors,
  getPricingColors,
  getSkillLevelColors,
  getAffiliateLink,
  router
}: {
  tool: any;
  index: number;
  search: string;
  isSaved: boolean;
  isSelectedForCompare: boolean;
  toggleSave: (id: number) => void;
  toggleCompare: (id: number) => void;
  hasAffiliate: boolean;
  ctaText: string;
  heartBurst: boolean;
  getCategoryColors: (cat: string) => any;
  getPricingColors: (pricing: string) => any;
  getSkillLevelColors: (level: string) => any;
  getAffiliateLink: (tool: any) => string;
  router: any;
}) {
  const colors = getCategoryColors(tool.category);
  const pricingColors = getPricingColors(tool.pricing);

  return (
    <div
      key={tool.id}
      className={`bg-white dark:bg-gray-900 border border-slate-200/60 dark:border-gray-800 shadow-sm rounded-2xl overflow-hidden hover:border-emerald-300 dark:hover:border-emerald-600 hover:shadow-xl hover:shadow-emerald-500/5 hover:-translate-y-1 transition-all duration-300 ease-out animate-fade-in-up focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 block relative ${hasAffiliate ? 'affiliate-card' : ''}`}
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
            <Link
              href={`/tools/${tool.id}`}
              className={`w-11 h-11 rounded-xl ${colors.bg}/10 dark:${colors.bgDark} ${colors.textLight} dark:${colors.text} flex items-center justify-center text-xl font-bold hover:scale-105 transition-transform duration-300 ease-out`}
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              {tool.name.charAt(0)}
            </Link>
            <div>
              <Link href={`/tools/${tool.id}`} className="inline-block">
                <h3 className="font-semibold text-lg text-slate-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  {highlightText(tool.name, search)}
                </h3>
              </Link>
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

        {/* Description - linkable to tool page */}
        <Link href={`/tools/${tool.id}`} className="block">
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed mt-4 mb-4 line-clamp-2 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
            {highlightText(tool.description, search)}
          </p>
        </Link>

        {/* Star Rating */}
        <div className="flex items-center gap-2 mb-4">
          <StarRating
            rating={tool.rating || 4.0}
            count={tool.rating_count || 0}
            size="sm"
          />
        </div>

        {/* Skill Level & Best For Tags */}
        <div className="mb-4 space-y-2">
          {tool.skill_level && (
            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${getSkillLevelColors(tool.skill_level).bg} ${getSkillLevelColors(tool.skill_level).text}`}>
              {getSkillLevelColors(tool.skill_level).label}
            </span>
          )}
          <div className="flex flex-wrap gap-1.5">
            {tool.best_for?.slice(0, 3).map((tag: string, i: number) => (
              <span
                key={i}
                className="inline-flex items-center px-2 py-1 rounded-full text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3">
          <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${colors.bg} text-white dark:${colors.bgDark} dark:${colors.text} whitespace-nowrap`}>
            {tool.category}
          </span>
          
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => router.push(`/compare?tool=${tool.id}`)}
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
            </button>
            <a
              href={getAffiliateLink(tool) || tool.url}
              target="_blank"
              rel="noopener noreferrer sponsored"
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
                toggleSave(tool.id);
              }}
              className={`inline-flex items-center justify-center gap-0.5 px-2 min-h-[44px] min-w-[44px] rounded-lg text-xs sm:text-sm font-semibold transition-all duration-300 ease-out relative overflow-hidden whitespace-nowrap active:scale-[0.98] ${
                isSaved
                  ? 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300 hover:bg-rose-200 dark:hover:bg-rose-500/30'
                  : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
              aria-label={isSaved ? `Unsave ${tool.name}` : `Save ${tool.name}`}
            >
              <span>{heartBurst && <span className="heart-burst absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />}</span>
              ❤️ <span className="hidden sm:inline">{isSaved ? 'Saved' : 'Save'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

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
  rating?: number;
  rating_count?: number;
  skill_level?: 'beginner' | 'intermediate' | 'advanced';
  best_for?: string[];
};

// Helper function to check if a tool has affiliate link (environment variable or JSON field)
const hasAffiliateLink = (tool: Tool): boolean => {
  const envVarName = `AFFILIATE_${tool.name.toUpperCase().replace(/\s+/g, '_')}`;
  let shortEnvVarName = '';
  if (tool.name === 'Rytr') {
    shortEnvVarName = 'AFFILIATE_RYTR';
  } else if (tool.name === 'VEED.io') {
    shortEnvVarName = 'AFFILIATE_VEED';
  } else if (tool.name === 'Murf AI') {
    shortEnvVarName = 'AFFILIATE_MURF';
  } else if (tool.name === 'Pictory') {
    shortEnvVarName = 'AFFILIATE_PICTORY';
  }
  const envLink = (shortEnvVarName && process.env[shortEnvVarName]) || process.env[envVarName];
  return !!(envLink || tool.affiliate_link);
};

// Helper function to get affiliate link for a tool with UTM parameters
const getAffiliateLink = (tool: Tool): string => {
  const envVarName = `AFFILIATE_${tool.name.toUpperCase().replace(/\s+/g, '_')}`;
  let shortEnvVarName = '';
  if (tool.name === 'Rytr') {
    shortEnvVarName = 'AFFILIATE_RYTR';
  } else if (tool.name === 'VEED.io') {
    shortEnvVarName = 'AFFILIATE_VEED';
  } else if (tool.name === 'Murf AI') {
    shortEnvVarName = 'AFFILIATE_MURF';
  } else if (tool.name === 'Pictory') {
    shortEnvVarName = 'AFFILIATE_PICTORY';
  }
  const envLink = (shortEnvVarName && process.env[shortEnvVarName]) || process.env[envVarName];
  const baseLink = envLink || tool.affiliate_link;
  
  if (!baseLink) return '';
  
  // Add UTM parameters for tracking
  const url = new URL(baseLink);
  url.searchParams.set('utm_source', 'useaitools');
  url.searchParams.set('utm_medium', 'referral');
  url.searchParams.set('utm_campaign', 'staff_pick');
  return url.toString();
};

// CTA A/B test variants
const ctaVariants = {
  A: '🔗 Try It Free',
  B: '🚀 Get Started Now',
};

type Category = string;

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  date: string;
  description: string;
  category: string;
  images?: Array<{
    url: string;
    alt: string;
  }>;
}

interface HomeClientProps {
  initialTools: Tool[];
  featuredTools: Tool[];
  blogPosts: BlogPost[];
}

export default function HomeClient({ initialTools, featuredTools, blogPosts }: HomeClientProps) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [selectedPricing, setSelectedPricing] = useState<string>('All');
  const [selectedSkillLevels, setSelectedSkillLevels] = useState<string[]>([]);
  const [selectedBestFor, setSelectedBestFor] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const router = useRouter();
  const toolsGridRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [savedIds, setSavedIds] = useState<number[]>([]);
  const [selectedForCompare, setSelectedForCompare] = useState<number[]>([]);
  const [heartBurst, setHeartBurst] = useState<{ [key: number]: boolean }>({});
  const [recentlyViewedIds, setRecentlyViewedIds] = useState<number[]>([]);
  const [ctaVariant, setCtaVariant] = useState<keyof typeof ctaVariants>('A');
  const heartBurstRefs = useRef<{ [key: number]: HTMLSpanElement | null }>({});
  const categoryButtonsRef = useRef<(HTMLButtonElement | null)[]>([]);
  
  // Load localStorage data after mount (SSR-safe)
  useEffect(() => {
    // Load saved tools
    try {
      const saved = localStorage.getItem('savedTools');
      if (saved) setSavedIds(JSON.parse(saved));
    } catch { /* ignore */ }
    
    // Load recently viewed
    try {
      const recent = localStorage.getItem('recentlyViewed');
      if (recent) setRecentlyViewedIds(JSON.parse(recent));
    } catch { /* ignore */ }
    
    // Load CTA variant (A/B test)
    try {
      const stored = localStorage.getItem('ctaVariant') as keyof typeof ctaVariants;
      if (stored === 'A' || stored === 'B') {
        setCtaVariant(stored);
      } else {
        const v = Math.random() < 0.5 ? 'A' : 'B';
        setCtaVariant(v);
        localStorage.setItem('ctaVariant', v);
      }
    } catch { /* ignore */ }
  }, []);
  
  // Keyboard navigation for search box (Esc to clear, Enter to search page)
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setSearch('');
    } else if (e.key === 'Enter') {
      if (search.trim()) {
        router.push(`/search?q=${encodeURIComponent(search.trim())}`);
      }
    }
  };

  // Auto scroll to tools grid when search is entered
  useEffect(() => {
    if (search.trim()) {
      toolsGridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [search]);

  // Navigate to search page
  const goToSearchPage = () => {
    if (search.trim()) {
      router.push(`/search?q=${encodeURIComponent(search.trim())}`);
    }
  };

  // Search suggestions - popular tools and categories
  const popularSearches = [
    { type: 'category', label: 'AI Writing Tools', value: 'writing' },
    { type: 'category', label: 'AI Image Generators', value: 'image' },
    { type: 'category', label: 'AI Video Tools', value: 'video' },
    { type: 'category', label: 'AI Audio Tools', value: 'audio' },
    { type: 'category', label: 'AI Code Tools', value: 'code' },
    { type: 'category', label: 'AI Productivity Tools', value: 'productivity' },
  ];

  // Get search suggestions based on input
  const searchSuggestions = useMemo(() => {
    const suggestions: { type: string; label: string; value: string; toolId?: number }[] = [];

    if (!search.trim()) {
      // Add categories first
      suggestions.push(...popularSearches);
      
      // Add popular tools sorted by rating_count descending
      const sortedTools = [...initialTools].sort((a, b) => (b.rating_count || 0) - (a.rating_count || 0));
      const topTools = sortedTools.slice(0, 8);
      topTools.forEach(tool => {
        suggestions.push({
          type: 'tool',
          label: tool.name,
          value: tool.name,
          toolId: tool.id
        });
      });
    } else {
      const query = search.toLowerCase();
      // Add matching tools
      initialTools.forEach(tool => {
        if (tool.name.toLowerCase().includes(query)) {
          suggestions.push({
            type: 'tool',
            label: tool.name,
            value: tool.name,
            toolId: tool.id,
          });
        }
      });

      // Add matching categories
      popularSearches.forEach(category => {
        if (category.label.toLowerCase().includes(query)) {
          suggestions.push(category);
        }
      });
    }

    return suggestions.slice(0, 10);
  }, [search, initialTools]);

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: { type: string; label: string; value: string; toolId?: number }) => {
    if (suggestion.type === 'tool' && suggestion.toolId) {
      router.push(`/tools/${suggestion.toolId}`);
    } else if (suggestion.type === 'category') {
      router.push(`/category/${suggestion.value}`);
    } else {
      router.push(`/search?q=${encodeURIComponent(suggestion.label)}`);
    }
    setSearch(suggestion.label);
    setShowSuggestions(false);
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const searchContainer = document.querySelector('.search-container');
      if (searchContainer && !searchContainer.contains(target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
  


  const categories: Category[] = ['All', 'Writing', 'Image', 'Productivity', 'Code', 'Audio', 'Video'];

  // 智能排序：优先展示海外 AI 工具（needs_vpn: true），中文工具排在后面
  const filteredTools = useMemo(() => {
    const filtered = initialTools.filter((tool) => {
      const matchesSearch = 
        tool.name.toLowerCase().includes(search.toLowerCase()) || 
        tool.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || tool.category === selectedCategory;
      
      // Pricing filter
      const matchesPricing = selectedPricing === 'All' || tool.pricing === selectedPricing;
      
      // Skill Level filter (multi-select)
      const matchesSkillLevel = selectedSkillLevels.length === 0 || 
        (tool.skill_level && selectedSkillLevels.includes(tool.skill_level));
      
      // Best For filter (multi-select)
      const matchesBestFor = selectedBestFor.length === 0 || 
        (tool.best_for && tool.best_for.some(tag => selectedBestFor.includes(tag)));
      
      return matchesSearch && matchesCategory && matchesPricing && matchesSkillLevel && matchesBestFor;
    });
    
    // 智能排序：Staff Pick(联盟) > 海外工具(needs_vpn) > 按名称字母排序
    return [...filtered].sort((a, b) => {
      const aHasAffiliate = hasAffiliateLink(a);
      const bHasAffiliate = hasAffiliateLink(b);

      // 1. 联盟链接工具优先 (Staff Pick)
      if (aHasAffiliate && !bHasAffiliate) return -1;
      if (!aHasAffiliate && bHasAffiliate) return 1;

      // 2. 海外工具优先
      if (a.needs_vpn && !b.needs_vpn) return -1;
      if (!a.needs_vpn && b.needs_vpn) return 1;

      // 3. 按名称字母排序
      return a.name.localeCompare(b.name);
    });
  }, [search, selectedCategory, selectedPricing, selectedSkillLevels, selectedBestFor, initialTools]);

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

  const getSkillLevelColors = (level: 'beginner' | 'intermediate' | 'advanced') => {
    switch (level) {
      case 'beginner':
        return {
          bg: 'bg-emerald-100 dark:bg-emerald-500/20',
          text: 'text-emerald-700 dark:text-emerald-300',
          label: '🌱 Beginner',
        };
      case 'intermediate':
        return {
          bg: 'bg-amber-100 dark:bg-amber-500/20',
          text: 'text-amber-700 dark:text-amber-300',
          label: '🔥 Intermediate',
        };
      case 'advanced':
        return {
          bg: 'bg-rose-100 dark:bg-rose-500/20',
          text: 'text-rose-700 dark:text-rose-300',
          label: '⚡ Advanced',
        };
      default:
        return {
          bg: 'bg-slate-100 dark:bg-slate-800',
          text: 'text-slate-700 dark:text-slate-300',
          label: '🌱 Beginner',
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
            Discover and compare AI tools in our comprehensive AI tools directory. Find the best AI tools for writing, images, video, and more. Curated weekly.
          </p>
          
          {/* Trust Signal */}
          <div className="mb-8 relative z-10">
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
              Built in public by an indie maker from an internet café in China. 135+ tools handpicked, not paid for. Here&apos;s my story →
            </p>
          </div>
          
          {/* Search Box */}
          <div className="search-container relative max-w-2xl mx-auto mb-8 px-4 sm:px-0">
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
                ref={searchInputRef}
                type="text"
                placeholder="Search best AI tools, AI writing tools, AI image generators, AI video tools..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                onKeyDown={handleSearchKeyDown}
                aria-label="Search AI tools"
                autoComplete="off"
                autoCorrect="off"
                spellCheck="false"
                className="w-full px-4 sm:px-5 py-3 sm:py-4 pl-12 sm:pl-14 pr-20 sm:pr-24 rounded-2xl bg-white dark:bg-gray-900 border border-slate-200/60 dark:border-gray-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-300 dark:focus:border-emerald-600 shadow-sm transition-all duration-300 ease-out"
              />
              <div className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                {search && (
                  <button
                    onClick={() => setSearch('')}
                    className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all duration-200"
                    aria-label="Clear search"
                  >
                    <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
                <button
                  onClick={goToSearchPage}
                  disabled={!search.trim()}
                  className={`p-2 rounded-full transition-all duration-200 ${
                    search.trim()
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:shadow-lg hover:shadow-emerald-500/30'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                  }`}
                  aria-label="Search"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Search Suggestions Dropdown */}
            {showSuggestions && searchSuggestions.length > 0 && (
              <div className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-900 rounded-xl border border-slate-200 dark:border-gray-700 shadow-xl overflow-hidden">
                <div className="p-2">
                  {!search.trim() && (
                    <div className="px-3 py-2 text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider">
                      Popular Searches
                    </div>
                  )}
                  {search.trim() && (
                    <div className="px-3 py-2 text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider">
                      Search Results
                    </div>
                  )}
                  {searchSuggestions.map((suggestion, index) => (
                    <button
                      key={`${suggestion.type}-${suggestion.value}-${index}`}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors text-left group"
                    >
                      {suggestion.type === 'tool' ? (
                        <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                        </svg>
                      )}
                      <span className="text-sm text-slate-700 dark:text-gray-200">{suggestion.label}</span>
                      <span className={`ml-auto text-xs px-2 py-0.5 rounded-full ${
                        suggestion.type === 'tool' 
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400'
                          : 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400'
                      }`}>
                        {suggestion.type === 'tool' ? 'Tool' : 'Category'}
                      </span>
                    </button>
                  ))}
                </div>
                {search.trim() && (
                  <div className="border-t border-slate-200 dark:border-gray-700 px-3 py-2">
                    <button
                      onClick={goToSearchPage}
                      className="w-full flex items-center justify-center gap-2 text-sm text-slate-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      Search for "{search}"
                    </button>
                  </div>
                )}
              </div>
            )}
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

          {/* Advanced Filters */}
          <div className="mt-4 space-y-3">
            {/* Pricing Filter - Dropdown */}
            <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide px-2 sm:px-0">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 whitespace-nowrap">Pricing:</span>
              <select
                value={selectedPricing}
                onChange={(e) => setSelectedPricing(e.target.value)}
                className="px-3 py-2 rounded-full text-xs font-semibold bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all duration-300 min-h-[36px] whitespace-nowrap cursor-pointer hover:border-emerald-300 dark:hover:border-emerald-600"
              >
                <option value="All">All</option>
                <option value="Free">Free</option>
                <option value="Freemium">Freemium</option>
                <option value="Free Trial">Free Trial</option>
                <option value="Paid">Paid</option>
                <option value="Open Source">Open Source</option>
              </select>
            </div>

            {/* Skill Level Filter - Button Group */}
            <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide px-2 sm:px-0">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 whitespace-nowrap">Skill:</span>
              <div className="flex gap-1.5">
                {['beginner', 'intermediate', 'advanced'].map((level) => {
                  const isActive = selectedSkillLevels.includes(level);
                  const labels: Record<string, string> = {
                    beginner: '🌱 Beginner',
                    intermediate: '🔥 Intermediate',
                    advanced: '⚡ Advanced'
                  };
                  return (
                    <button
                      key={level}
                      onClick={() => {
                        setSelectedSkillLevels(prev => 
                          prev.includes(level) 
                            ? prev.filter(l => l !== level)
                            : [...prev, level]
                        );
                      }}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 ease-out min-h-[36px] whitespace-nowrap focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none ${
                        isActive
                          ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/25'
                          : 'bg-gray-100 dark:bg-gray-800 text-slate-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      {labels[level]}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Best For Filter - Quick Select */}
            <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide px-2 sm:px-0">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 whitespace-nowrap">Best For:</span>
              <div className="flex gap-1.5">
                {['Students', 'Marketers', 'Developers', 'Content Creators', 'Small Business'].map((tag) => {
                  const isActive = selectedBestFor.includes(tag);
                  return (
                    <button
                      key={tag}
                      onClick={() => {
                        setSelectedBestFor(prev => 
                          prev.includes(tag) 
                            ? prev.filter(t => t !== tag)
                            : [...prev, tag]
                        );
                      }}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 ease-out min-h-[36px] whitespace-nowrap focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none ${
                        isActive
                          ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/25'
                          : 'bg-gray-100 dark:bg-gray-800 text-slate-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Filters Display */}
            {(selectedPricing !== 'All' || selectedSkillLevels.length > 0 || selectedBestFor.length > 0) && (
              <div className="flex items-center gap-2 flex-wrap px-2 sm:px-0">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Active:</span>
                {selectedPricing !== 'All' && (
                  <button
                    onClick={() => setSelectedPricing('All')}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200 dark:hover:bg-emerald-500/30 transition-colors"
                  >
                    {selectedPricing}
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
                {selectedSkillLevels.map(level => (
                  <button
                    key={level}
                    onClick={() => setSelectedSkillLevels(prev => prev.filter(l => l !== level))}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 hover:bg-amber-200 dark:hover:bg-amber-500/30 transition-colors"
                  >
                    {level}
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                ))}
                {selectedBestFor.map(tag => (
                  <button
                    key={tag}
                    onClick={() => setSelectedBestFor(prev => prev.filter(t => t !== tag))}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-500/30 transition-colors"
                  >
                    {tag}
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                ))}
                <button
                  onClick={() => {
                    setSelectedPricing('All');
                    setSelectedSkillLevels([]);
                    setSelectedBestFor([]);
                  }}
                  className="px-2.5 py-1 rounded-full text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors"
                >
                  Clear All
                </button>
              </div>
            )}
          </div>
          
          {/* Search Result Count */}
          <div className="text-center mb-8">
            <p className={`text-base sm:text-lg font-semibold text-slate-600 dark:text-slate-300 ${
              search.trim() || selectedCategory !== 'All' || selectedPricing !== 'All' || selectedSkillLevels.length > 0 || selectedBestFor.length > 0 ? 'animate-pulse' : ''
            }`}>
              {search.trim() || selectedCategory !== 'All' || selectedPricing !== 'All' || selectedSkillLevels.length > 0 || selectedBestFor.length > 0 ? (
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

        {/* Our Products */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-3">
              🚀 Our Products
            </h2>
            <p className="text-slate-600 dark:text-gray-400">
              Affordable AI tools built for real creators with real budgets
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Use AI Writer */}
            <div className="bg-white dark:bg-gray-900 border-2 border-emerald-200 dark:border-emerald-500/20 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:shadow-emerald-500/5 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-transparent to-teal-500/5 pointer-events-none" />
              {/* Live Now Badge */}
              <div className="absolute top-3 right-3 z-10">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/25">
                  ✨ Live Now
                </span>
              </div>
              <div className="text-4xl mb-4">🖋️</div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">Use AI Writer</h3>
              <p className="text-sm text-slate-600 dark:text-gray-300 mb-4 leading-relaxed line-clamp-2">
                Write 3x faster with AI — try it free. The AI writing tool built for creators who refuse to overpay. $5/mo vs Jasper $49/mo.
              </p>
              <div className="flex items-center gap-2 mb-4">
                <span className="px-2 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">$5/mo</span>
                <span className="px-2 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">Writing</span>
              </div>
              <a
                href="https://tryaiwriter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
              >
                Try It Free →
              </a>
            </div>

            {/* Use AI Image */}
            <div className="bg-white dark:bg-gray-900 border-2 border-violet-200 dark:border-violet-500/20 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:shadow-violet-500/5 hover:-translate-y-1 transition-all duration-300">
              <div className="text-4xl mb-4">🎨</div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">Use AI Image</h3>
              <p className="text-sm text-slate-600 dark:text-gray-300 mb-4 leading-relaxed line-clamp-2">
                Create stunning visuals in seconds. Text to image, multiple art styles, commercial use allowed.
              </p>
              <div className="flex items-center gap-2 mb-4">
                <span className="px-2 py-1 rounded-full text-xs font-semibold bg-violet-100 dark:bg-violet-500/20 text-violet-700 dark:text-violet-300">$7/mo</span>
                <span className="px-2 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">Image</span>
              </div>
              <Link
                href="/image"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-semibold rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
              >
                Learn More →
              </Link>
            </div>

            {/* Mobile App */}
            <div className="bg-white dark:bg-gray-900 border-2 border-slate-200 dark:border-slate-500/20 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-3 right-3">
                <span className="px-2 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">Coming Soon</span>
              </div>
              <div className="text-4xl mb-4">📱</div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">Mobile App</h3>
              <p className="text-sm text-slate-600 dark:text-gray-300 mb-4 leading-relaxed line-clamp-2">
                Your favorite AI tools, now in your pocket. Push notifications, offline access, widget support.
              </p>
              <div className="flex items-center gap-2 mb-4">
                <span className="px-2 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">Free</span>
                <span className="px-2 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">iOS & Android</span>
              </div>
              <Link
                href="/mobile"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-slate-800 dark:bg-slate-700 text-white font-semibold rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 opacity-70"
              >
                Join Waitlist →
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Blog Posts */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-2">
                📝 Recent Blog Posts
              </h2>
              <p className="text-slate-600 dark:text-gray-400">
                Guides, comparisons, and tips to get the most out of AI tools
              </p>
            </div>
            <Link href="/blog" className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 rounded-full hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-all duration-300">
              View All →
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {[...blogPosts]
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .slice(0, 5)
              .map((post, index) => {
                const getCategoryColors = (category: string) => {
                  switch (category) {
                    case 'Writing': return { bg: 'bg-blue-500', text: 'text-blue-500' };
                    case 'Image': return { bg: 'bg-violet-500', text: 'text-violet-500' };
                    case 'Video': return { bg: 'bg-indigo-500', text: 'text-indigo-500' };
                    case 'Audio': return { bg: 'bg-pink-500', text: 'text-pink-500' };
                    case 'Productivity': return { bg: 'bg-teal-500', text: 'text-teal-500' };
                    default: return { bg: 'bg-slate-500', text: 'text-slate-500' };
                  }
                };
                const colors = getCategoryColors(post.category);
                return (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="group bg-white dark:bg-gray-900 border border-slate-200/60 dark:border-gray-800 rounded-2xl p-5 shadow-sm hover:shadow-xl hover:shadow-emerald-500/5 hover:-translate-y-1 transition-all duration-300 ease-out animate-fade-in-up"
                    style={{ 
                      animationDelay: `${index * 50}ms`,
                      opacity: 0,
                      animationFillMode: 'forwards'
                    }}
                  >
                    {post.images?.[0] && (
                      <img
                        src={post.images[0].url}
                        alt={post.images[0].alt}
                        className="w-full h-40 object-cover rounded-xl mb-4"
                        loading="lazy"
                      />
                    )}
                    <div className="flex items-center gap-2 mb-3">
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {post.category}
                      </span>
                      <span className="text-xs text-slate-400 dark:text-gray-500">
                        {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-gray-300 leading-relaxed line-clamp-2 mb-4">
                      {post.description}
                    </p>
                    <div className="flex items-center gap-1 font-semibold text-sm text-emerald-600 dark:text-emerald-400">
                      Read More →
                    </div>
                  </Link>
                );
              })}
          </div>
        </div>

        {/* Browse by Use Case */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-3">
              Browse by Use Case
            </h2>
            <p className="text-slate-600 dark:text-gray-400">
              Compare AI tools and find the best AI writing tools, AI image generators, and AI video tools for your workflow
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              {
                title: 'Content Creation',
                description: 'Writing & Images',
                icon: '✍️',
                href: '/category/writing',
                color: 'bg-blue-500/10 hover:bg-blue-500/20',
              },
              {
                title: 'Software Development',
                description: 'Code & Dev',
                icon: '💻',
                href: '/category/code',
                color: 'bg-orange-500/10 hover:bg-orange-500/20',
              },
              {
                title: 'Video Production',
                description: 'Video Editing',
                icon: '🎬',
                href: '/category/video',
                color: 'bg-indigo-500/10 hover:bg-indigo-500/20',
              },
              {
                title: 'Podcast & Audio',
                description: 'Voice & Sound',
                icon: '🎙️',
                href: '/category/audio',
                color: 'bg-pink-500/10 hover:bg-pink-500/20',
              },
              {
                title: 'Business & Productivity',
                description: 'Workflows',
                icon: '📊',
                href: '/category/productivity',
                color: 'bg-teal-500/10 hover:bg-teal-500/20',
              },
              {
                title: 'Student & Education',
                description: 'Learning',
                icon: '📚',
                href: '/category/writing',
                color: 'bg-purple-500/10 hover:bg-purple-500/20',
              },
            ].map((useCase) => (
              <Link
                key={useCase.title}
                href={useCase.href}
                className={`group p-5 rounded-xl ${useCase.color} border border-transparent hover:border-slate-200 dark:hover:border-gray-700 transition-all duration-300 ease-out hover:-translate-y-1`}
              >
                <div className="text-3xl mb-3">{useCase.icon}</div>
                <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {useCase.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-gray-400">
                  {useCase.description}
                </p>
              </Link>
            ))}
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
        <div ref={toolsGridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7 transition-all duration-300 ease-out">
          {filteredTools.map((tool, index) => {
            const colors = getCategoryColors(tool.category);
            const pricingColors = getPricingColors(tool.pricing);
            const isSaved = savedIds.includes(tool.id);
            const isSelectedForCompare = selectedForCompare.includes(tool.id);
            const hasAffiliate = hasAffiliateLink(tool);
            const ctaText = hasAffiliate ? ctaVariants[ctaVariant] : 'Visit Website';
            
            return (
              <div
                key={tool.id}
                className={`bg-white dark:bg-gray-900 border border-slate-200/60 dark:border-gray-800 shadow-sm rounded-2xl overflow-hidden hover:border-emerald-300 dark:hover:border-emerald-600 hover:shadow-xl hover:shadow-emerald-500/5 hover:-translate-y-1 transition-all duration-300 ease-out animate-fade-in-up focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 block relative ${hasAffiliate ? 'affiliate-card' : ''}`}
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
                      <Link
                        href={`/tools/${tool.id}`}
                        className={`w-11 h-11 rounded-xl ${colors.bg}/10 dark:${colors.bgDark} ${colors.textLight} dark:${colors.text} flex items-center justify-center text-xl font-bold hover:scale-105 transition-transform duration-300 ease-out`} 
                        style={{ fontFamily: 'Playfair Display, serif' }}
                      >
                        {tool.name.charAt(0)}
                      </Link>
                      <div>
                        <Link href={`/tools/${tool.id}`} className="inline-block">
                          <h3 className="font-semibold text-lg text-slate-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                            {highlightText(tool.name, search)}
                          </h3>
                        </Link>
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

                  {/* Description - linkable to tool page */}
                  <Link href={`/tools/${tool.id}`} className="block">
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed mt-4 mb-4 line-clamp-2 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
                      {highlightText(tool.description, search)}
                    </p>
                  </Link>

                  {/* Star Rating */}
                  <div className="flex items-center gap-2 mb-4">
                    <StarRating 
                      rating={tool.rating || 4.0} 
                      count={tool.rating_count || 0}
                      size="sm"
                    />
                  </div>

                  {/* Skill Level & Best For Tags */}
                  <div className="mb-4 space-y-2">
                    {tool.skill_level && (
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${getSkillLevelColors(tool.skill_level).bg} ${getSkillLevelColors(tool.skill_level).text}`}>
                        {getSkillLevelColors(tool.skill_level).label}
                      </span>
                    )}
                    <div className="flex flex-wrap gap-1.5">
                      {tool.best_for?.slice(0, 3).map((tag, i) => (
                        <span 
                          key={i} 
                          className="inline-flex items-center px-2 py-1 rounded-full text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between gap-3">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${colors.bg} text-white dark:${colors.bgDark} dark:${colors.text} whitespace-nowrap`}>
                      {tool.category}
                    </span>
                    
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <button
                        onClick={() => router.push(`/compare?tool=${tool.id}`)}
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
                      </button>
                      <a
                        href={getAffiliateLink(tool) || tool.url}
                        target="_blank"
                        rel="noopener noreferrer sponsored"
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
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredTools.length === 0 && (
          <div className="text-center py-16">
            {/* Empty illustration */}
            <div className="mx-auto w-24 h-24 mb-6 bg-slate-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-12 h-12 text-slate-400 dark:text-slate-500" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            
            {/* Friendly message */}
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
              No tools match your filters
            </h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-md mx-auto">
              Try adjusting one or more criteria to see more results.
            </p>
            
            {/* Active filters display */}
            {(selectedPricing !== 'All' || selectedSkillLevels.length > 0 || selectedBestFor.length > 0) && (
              <div className="flex flex-wrap justify-center gap-2 mb-8">
                <span className="text-sm text-slate-500 dark:text-slate-400">Current filters:</span>
                {selectedPricing !== 'All' && (
                  <button
                    onClick={() => setSelectedPricing('All')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200 dark:hover:bg-emerald-500/30 transition-colors"
                  >
                    {selectedPricing}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
                {selectedSkillLevels.map(level => (
                  <button
                    key={level}
                    onClick={() => setSelectedSkillLevels(prev => prev.filter(l => l !== level))}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 hover:bg-amber-200 dark:hover:bg-amber-500/30 transition-colors"
                  >
                    {level}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                ))}
                {selectedBestFor.map(tag => (
                  <button
                    key={tag}
                    onClick={() => setSelectedBestFor(prev => prev.filter(t => t !== tag))}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-500/30 transition-colors"
                  >
                    {tag}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                ))}
                <button
                  onClick={() => {
                    setSelectedPricing('All');
                    setSelectedSkillLevels([]);
                    setSelectedBestFor([]);
                  }}
                  className="px-3 py-1.5 rounded-full text-sm font-medium text-rose-500 hover:text-rose-600 dark:text-rose-400 dark:hover:text-rose-300 transition-colors"
                >
                  Clear All
                </button>
              </div>
            )}
            
            {/* Popular tools recommendation */}
            <div className="mt-8">
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-4">
                Popular tools you might like:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
                {initialTools
                  .filter(t => hasAffiliateLink(t))
                  .slice(0, 3)
                  .map((tool) => {
                    const colors = getCategoryColors(tool.category);
                    const pricingColors = getPricingColors(tool.pricing);
                    return (
                      <Link
                        key={tool.id}
                        href={`/tools/${tool.id}`}
                        className="group bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-xl p-4 text-left hover:border-emerald-300 dark:hover:border-emerald-600 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`w-10 h-10 rounded-lg ${colors.bg}/10 flex items-center justify-center text-lg font-bold ${colors.textLight} dark:${colors.text}`} style={{ fontFamily: 'Playfair Display, serif' }}>
                            {tool.name.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-slate-900 dark:text-white truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                              {tool.name}
                            </h4>
                            <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${pricingColors.bg} ${pricingColors.text}`}>
                              {tool.pricing}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
                          {tool.description}
                        </p>
                      </Link>
                    );
                  })}
              </div>
            </div>
            
            {/* Quick search suggestions */}
            <div className="flex flex-wrap justify-center gap-2 mt-8">
              <span className="text-sm text-slate-400 dark:text-slate-500">Or try:</span>
              {['ChatGPT', 'Midjourney', 'GitHub Copilot'].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => {
                    setSearch(suggestion);
                    setSelectedCategory('All');
                    setSelectedPricing('All');
                    setSelectedSkillLevels([]);
                    setSelectedBestFor([]);
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
