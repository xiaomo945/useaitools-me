'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Sparkles, TrendingUp, Heart, LogIn, ExternalLink } from 'lucide-react';
import Footer from '@/app/components/Footer';
import Breadcrumbs from '@/app/components/Breadcrumbs';

interface Tool {
  id: number;
  name: string;
  category: string;
  rating: number;
  rating_count: number;
}

interface RecommendationData {
  recentViews: Tool[];
  bookmarkedTools: Tool[];
  recommendedTools: Tool[];
  categoryPreferences: Record<string, number>;
}

export default function RecommendationsPage() {
  const { data: session, status } = useSession();
  const [data, setData] = useState<RecommendationData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'authenticated') {
      loadRecommendations();
    } else if (status === 'unauthenticated') {
      setLoading(false);
    }
  }, [status]);

  const loadRecommendations = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/recommendations');
      if (res.ok) {
        const result = await res.json();
        setData(result);
      }
    } catch (error) {
      console.error('加载推荐数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColors = (category: string) => {
    switch (category) {
      case 'Writing':
        return { bg: 'bg-blue-500', text: 'text-blue-600' };
      case 'Image':
        return { bg: 'bg-violet-500', text: 'text-violet-600' };
      case 'Productivity':
        return { bg: 'bg-teal-500', text: 'text-teal-600' };
      case 'Code':
        return { bg: 'bg-orange-500', text: 'text-orange-600' };
      case 'Audio':
        return { bg: 'bg-pink-500', text: 'text-pink-600' };
      case 'Video':
        return { bg: 'bg-indigo-500', text: 'text-indigo-600' };
      default:
        return { bg: 'bg-slate-500', text: 'text-slate-600' };
    }
  };

  const ToolCard = ({ tool }: { tool: Tool }) => {
    const colors = getCategoryColors(tool.category);
    return (
      <Link
        href={`/tools/${tool.id}`}
        className="group flex items-center gap-4 p-4 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-xl hover:border-emerald-300 dark:hover:border-emerald-700 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-300"
      >
        <div className={`w-12 h-12 rounded-xl ${colors.bg}/10 flex items-center justify-center text-xl font-bold ${colors.text} font-serif`}>
          {tool.name.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors truncate">
            {tool.name}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${colors.bg}/10 ${colors.text}`}>
              {tool.category}
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-500">
              ⭐ {tool.rating.toFixed(1)} ({tool.rating_count})
            </span>
          </div>
        </div>
        <ExternalLink className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
      </Link>
    );
  };

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-gray-950 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <Breadcrumbs 
            items={[
              { label: 'Home', href: '/' },
              { label: 'Recommendations', href: '/recommendations', current: true }
            ]} 
          />

          <div className="text-center py-20">
            <div className="mx-auto w-20 h-20 mb-6 text-slate-300 dark:text-slate-600">
              <LogIn className="w-full h-full" />
            </div>
            <p className="text-slate-500 dark:text-slate-500 text-lg font-medium mb-4">
              Please log in to see personalized recommendations.
            </p>
            <Link
              href="/api/auth/signin"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 hover:-translate-y-0.5 transition-all duration-300"
            >
              Sign In →
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <Breadcrumbs 
          items={[
            { label: 'Home', href: '/' },
            { label: 'Recommendations', href: '/recommendations', current: true }
          ]} 
        />

        {/* Page Header */}
        <div className="mb-10">
          <div className="bg-gradient-to-br from-purple-50/80 via-white to-pink-50/80 dark:from-purple-950/60 dark:via-gray-900 dark:to-pink-950/60 backdrop-blur-xl border border-white/60 dark:border-purple-500/10 shadow-xl shadow-purple-500/5 dark:shadow-2xl dark:shadow-purple-500/5 rounded-3xl p-8 sm:p-12">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                  Personalized for You
                </h1>
                <p className="text-base sm:text-lg text-gray-500 dark:text-gray-400 mt-1">
                  AI tools curated based on your preferences and activity
                </p>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="space-y-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-4">
                <div className="h-8 bg-slate-200 dark:bg-gray-700 rounded w-1/4 animate-pulse" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[...Array(4)].map((_, j) => (
                    <div key={j} className="animate-pulse flex items-center gap-4 p-4 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-xl">
                      <div className="w-12 h-12 bg-slate-200 dark:bg-gray-700 rounded-xl" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-slate-200 dark:bg-gray-700 rounded w-1/2" />
                        <div className="h-3 bg-slate-200 dark:bg-gray-700 rounded w-1/4" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : !data ? (
          <div className="text-center py-20">
            <p className="text-slate-500 dark:text-slate-500 text-lg">
              Failed to load recommendations. Please try again later.
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Category Preferences */}
            {Object.keys(data.categoryPreferences).length > 0 && (
              <section className="animate-fade-in-up">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Your Interests
                  </h2>
                </div>
                <div className="flex flex-wrap gap-3">
                  {Object.entries(data.categoryPreferences)
                    .sort((a, b) => b[1] - a[1])
                    .map(([category, count]) => {
                      const colors = getCategoryColors(category);
                      return (
                        <div
                          key={category}
                          className={`px-4 py-2 rounded-full ${colors.bg}/10 ${colors.text} font-semibold text-sm flex items-center gap-2`}
                        >
                          {category}
                          <span className="text-xs opacity-70">({count})</span>
                        </div>
                      );
                    })}
                </div>
              </section>
            )}

            {/* Recommended Tools */}
            {data.recommendedTools.length > 0 && (
              <section className="animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Recommended for You
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {data.recommendedTools.map(tool => (
                    <ToolCard key={tool.id} tool={tool} />
                  ))}
                </div>
              </section>
            )}

            {/* Recently Viewed */}
            {data.recentViews.length > 0 && (
              <section className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Recently Viewed
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {data.recentViews.slice(0, 6).map(tool => (
                    <ToolCard key={tool.id} tool={tool} />
                  ))}
                </div>
              </section>
            )}

            {/* Bookmarked Tools */}
            {data.bookmarkedTools.length > 0 && (
              <section className="animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center">
                    <Heart className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Your Favorites
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {data.bookmarkedTools.slice(0, 6).map(tool => (
                    <ToolCard key={tool.id} tool={tool} />
                  ))}
                </div>
              </section>
            )}

            {/* Empty State */}
            {data.recommendedTools.length === 0 && data.recentViews.length === 0 && data.bookmarkedTools.length === 0 && (
              <div className="text-center py-20">
                <div className="mx-auto w-20 h-20 mb-6 text-slate-300 dark:text-slate-600">
                  <Sparkles className="w-full h-full" />
                </div>
                <p className="text-slate-500 dark:text-slate-500 text-lg font-medium mb-4">
                  Start exploring tools to get personalized recommendations!
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 hover:-translate-y-0.5 transition-all duration-300"
                >
                  Explore Tools →
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
