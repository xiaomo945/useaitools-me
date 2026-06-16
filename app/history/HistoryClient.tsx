'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Home, Clock, Trash2, ExternalLink, LogIn } from 'lucide-react';
import Footer from '@/app/components/Footer';
import Breadcrumbs from '@/app/components/Breadcrumbs';

interface Tool {
  id: number;
  name: string;
  description: string;
  category: string;
  url: string;
  affiliate_link?: string;
  icon_url?: string;
  rating: number;
  rating_count: number;
}

interface HistoryItem {
  id: number;
  name: string;
  category: string;
  description: string;
  url: string;
  affiliate_link: string;
  icon_url: string;
  rating: number;
  rating_count: number;
  lastAccessed: string;
  accessType: 'bookmarked' | 'reviewed';
}

export default function HistoryClient() {
  const { data: session, status } = useSession();
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingItem, setDeletingItem] = useState<number | null>(null);

  const loadHistory = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/history');
      if (res.ok) {
        const data = await res.json();
        setHistoryItems(data.history || []);
      }
    } catch (error) {
      console.error('加载历史记录失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 从数据库加载历史记录
  useEffect(() => {
    if (status === 'authenticated') {
      loadHistory();
    } else if (status === 'unauthenticated') {
      setLoading(false);
    }
  }, [status]);

  // 获取分类颜色
  const getCategoryColors = (category: string) => {
    switch (category) {
      case 'Writing':
        return { bg: 'bg-blue-500', textLight: 'text-blue-600', text: 'text-blue-300' };
      case 'Image':
        return { bg: 'bg-violet-500', textLight: 'text-violet-600', text: 'text-violet-300' };
      case 'Productivity':
        return { bg: 'bg-teal-500', textLight: 'text-teal-600', text: 'text-teal-300' };
      case 'Code':
        return { bg: 'bg-orange-500', textLight: 'text-orange-600', text: 'text-orange-300' };
      case 'Audio':
        return { bg: 'bg-pink-500', textLight: 'text-pink-600', text: 'text-pink-300' };
      case 'Video':
        return { bg: 'bg-indigo-500', textLight: 'text-indigo-600', text: 'text-indigo-300' };
      default:
        return { bg: 'bg-slate-500', textLight: 'text-slate-600', text: 'text-slate-300' };
    }
  };

  // 格式化时间
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`;
    return date.toLocaleDateString();
  };

  // 按日期分组
  const getGroupedHistory = () => {
    const groups: Record<string, HistoryItem[]> = {};
    
    historyItems.forEach((item) => {
      const date = new Date(item.lastAccessed);
      const dateKey = date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
      });
      
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(item);
    });
    
    return groups;
  };

  const groupedHistory = getGroupedHistory();

  // 未登录状态
  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-gray-950 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <Breadcrumbs 
            items={[
              { label: 'Home', href: '/' },
              { label: 'Browsing History', href: '/history', current: true }
            ]} 
          />

          <div className="text-center py-20">
            <div className="mx-auto w-20 h-20 mb-6 text-slate-300 dark:text-slate-600">
              <LogIn className="w-full h-full" />
            </div>
            <p className="text-slate-500 dark:text-slate-500 text-lg font-medium mb-4">
              Please log in to view your browsing history.
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
        {/* Breadcrumbs */}
        <Breadcrumbs 
          items={[
            { label: 'Home', href: '/' },
            { label: 'Browsing History', href: '/history', current: true }
          ]} 
        />

        {/* Page Header */}
        <div className="mb-10">
          <div className="bg-gradient-to-br from-amber-50/80 via-white to-orange-50/80 dark:from-amber-950/60 dark:via-gray-900 dark:to-orange-950/60 backdrop-blur-xl border border-white/60 dark:border-amber-500/10 shadow-xl shadow-amber-500/5 dark:shadow-2xl dark:shadow-amber-500/5 rounded-3xl p-8 sm:p-12">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              <div>
                <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-4">
                  🕐 Browsing History
                </h1>
                <p className="text-base sm:text-lg text-gray-500 dark:text-gray-400">
                  Track the AI tools you've recently explored.
                </p>
              </div>
              {historyItems.length > 0 && (
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  {historyItems.length} {historyItems.length === 1 ? 'tool' : 'tools'} in history
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse flex items-center gap-4 p-4 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-xl">
                <div className="w-12 h-12 bg-slate-200 dark:bg-gray-700 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-200 dark:bg-gray-700 rounded w-1/4" />
                  <div className="h-3 bg-slate-200 dark:bg-gray-700 rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : historyItems.length === 0 ? (
          /* Empty State */
          <div className="text-center py-20">
            <div className="mx-auto w-20 h-20 mb-6 text-slate-300 dark:text-slate-600">
              <Clock className="w-full h-full" />
            </div>
            <p className="text-slate-500 dark:text-slate-500 text-lg font-medium mb-4">
              No browsing history yet. Start exploring AI tools!
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 hover:-translate-y-0.5 transition-all duration-300"
            >
              Explore Tools →
            </Link>
          </div>
        ) : (
          /* History Timeline */
          <div className="space-y-8">
            {Object.entries(groupedHistory).map(([date, items]) => (
              <div key={date} className="animate-fade-in-up">
                <h2 className="text-sm font-semibold text-slate-500 dark:text-gray-400 mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-slate-400 dark:bg-gray-500" />
                  {date}
                </h2>
                
                <div className="space-y-3">
                  {items.map((item, index) => {
                    const colors = getCategoryColors(item.category);
                    
                    return (
                      <div
                        key={item.id}
                        className={`group flex items-center gap-4 p-4 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-xl hover:border-slate-300 dark:hover:border-gray-700 transition-all duration-300 ${
                          deletingItem === item.id ? 'opacity-0 scale-95' : ''
                        }`}
                        style={{ animationDelay: `${index * 30}ms` }}
                      >
                        {/* Tool Icon */}
                        <div className={`w-12 h-12 rounded-xl ${colors.bg}/10 flex items-center justify-center text-xl font-bold ${colors.textLight} dark:${colors.text}`} style={{ fontFamily: 'Playfair Display, serif' }}>
                          {item.name.charAt(0)}
                        </div>
                        
                        {/* Tool Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <Link
                              href={`/tools/${item.id}`}
                              className="font-semibold text-slate-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors truncate"
                            >
                              {item.name}
                            </Link>
                            <a
                              href={item.url}
                              target="_blank" rel="noopener noreferrer"
                              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </div>
                          <p className="text-sm text-slate-500 dark:text-gray-400 truncate mt-1">
                            {item.description}
                          </p>
                          <div className="flex items-center gap-3 mt-2">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${colors.bg}/10 ${colors.textLight} dark:${colors.text}`}>
                              {item.category}
                            </span>
                            <span className="text-xs text-slate-400 dark:text-gray-500">
                              {formatTime(item.lastAccessed)}
                            </span>
                            <span className="text-xs text-slate-400 dark:text-gray-500 capitalize">
                              via {item.accessType}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
