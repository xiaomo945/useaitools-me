'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { MessageSquare, Plus, Eye, Pin, Lock, TrendingUp, Clock, Filter } from 'lucide-react';
import Footer from '@/app/components/Footer';
import Breadcrumbs from '@/app/components/Breadcrumbs';

interface Discussion {
  id: string;
  title: string;
  content: string;
  category: string;
  viewCount: number;
  commentCount: number;
  likeCount: number;
  isPinned: boolean;
  isLocked: boolean;
  createdAt: string;
  user: {
    id: string;
    name: string;
    image: string;
  };
  tool?: {
    id: string;
    name: string;
    slug: string;
  } | null;
}

export default function CommunityPage() {
  const { data: session } = useSession();
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState('latest');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadDiscussions();
  }, [category, sortBy, page]);

  const loadDiscussions = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (category !== 'all') params.set('category', category);
      params.set('sortBy', sortBy);
      params.set('page', page.toString());
      params.set('limit', '20');

      const res = await fetch(`/api/discussions?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setDiscussions(data.discussions || []);
        setTotalPages(data.pagination?.totalPages || 1);
      }
    } catch (error) {
      console.error('加载讨论失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'general':
        return 'General';
      case 'tool-review':
        return 'Tool Review';
      case 'feature-request':
        return 'Feature Request';
      case 'help':
        return 'Help';
      default:
        return cat;
    }
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'general':
        return 'bg-slate-500/10 text-slate-600 dark:text-slate-400';
      case 'tool-review':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400';
      case 'feature-request':
        return 'bg-purple-500/10 text-purple-600 dark:text-purple-400';
      case 'help':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400';
      default:
        return 'bg-slate-500/10 text-slate-600 dark:text-slate-400';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <Breadcrumbs 
          items={[
            { label: 'Home', href: '/' },
            { label: 'Community', href: '/community', current: true }
          ]} 
        />

        {/* Page Header */}
        <div className="mb-10">
          <div className="bg-gradient-to-br from-blue-50/80 via-white to-cyan-50/80 dark:from-blue-950/60 dark:via-gray-900 dark:to-cyan-950/60 backdrop-blur-xl border border-white/60 dark:border-blue-500/10 shadow-xl shadow-blue-500/5 dark:shadow-2xl dark:shadow-blue-500/5 rounded-3xl p-8 sm:p-12">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <MessageSquare className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                    Community
                  </h1>
                  <p className="text-base sm:text-lg text-gray-500 dark:text-gray-400 mt-1">
                    Discuss AI tools, share experiences, and get help
                  </p>
                </div>
              </div>
              {session && (
                <Link
                  href="/community/new"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 hover:-translate-y-0.5 transition-all duration-300"
                >
                  <Plus className="w-5 h-5" />
                  New Discussion
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-5 h-5 text-slate-500 dark:text-slate-400" />
            {['all', 'general', 'tool-review', 'feature-request', 'help'].map(cat => (
              <button
                key={cat}
                onClick={() => {
                  setCategory(cat);
                  setPage(1);
                }}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                  category === cat
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25'
                    : 'bg-white dark:bg-gray-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-gray-800 hover:border-emerald-300 dark:hover:border-emerald-700'
                }`}
              >
                {getCategoryLabel(cat)}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 sm:ml-auto">
            <button
              onClick={() => {
                setSortBy('latest');
                setPage(1);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                sortBy === 'latest'
                  ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                  : 'bg-white dark:bg-gray-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-700'
              }`}
            >
              <Clock className="w-4 h-4" />
              Latest
            </button>
            <button
              onClick={() => {
                setSortBy('popular');
                setPage(1);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                sortBy === 'popular'
                  ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/25'
                  : 'bg-white dark:bg-gray-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-gray-800 hover:border-purple-300 dark:hover:border-purple-700'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              Popular
            </button>
          </div>
        </div>

        {/* Discussions List */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="animate-pulse bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-slate-200 dark:bg-gray-700 rounded-full" />
                  <div className="flex-1 space-y-3">
                    <div className="h-6 bg-slate-200 dark:bg-gray-700 rounded w-3/4" />
                    <div className="h-4 bg-slate-200 dark:bg-gray-700 rounded w-full" />
                    <div className="flex gap-4">
                      <div className="h-3 bg-slate-200 dark:bg-gray-700 rounded w-20" />
                      <div className="h-3 bg-slate-200 dark:bg-gray-700 rounded w-20" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : discussions.length === 0 ? (
          <div className="text-center py-20">
            <div className="mx-auto w-20 h-20 mb-6 text-slate-300 dark:text-slate-600">
              <MessageSquare className="w-full h-full" />
            </div>
            <p className="text-slate-500 dark:text-slate-500 text-lg font-medium mb-4">
              No discussions yet. Start the conversation!
            </p>
            {session && (
              <Link
                href="/community/new"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 hover:-translate-y-0.5 transition-all duration-300"
              >
                <Plus className="w-5 h-5" />
                Create Discussion
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {discussions.map((discussion, index) => (
              <Link
                key={discussion.id}
                href={`/community/${discussion.id}`}
                className="group block bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-xl p-6 hover:border-blue-300 dark:hover:border-blue-700 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <div className="flex items-start gap-4">
                  {discussion.user.image ? (
                    <img
                      src={discussion.user.image}
                      alt={discussion.user.name}
                      className="w-12 h-12 rounded-full flex-shrink-0"
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                      {discussion.user.name?.charAt(0) || 'U'}
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      {discussion.isPinned && (
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400">
                          <Pin className="w-3 h-3" />
                          Pinned
                        </span>
                      )}
                      {discussion.isLocked && (
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-500/10 text-slate-600 dark:text-slate-400">
                          <Lock className="w-3 h-3" />
                          Locked
                        </span>
                      )}
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getCategoryColor(discussion.category)}`}>
                        {getCategoryLabel(discussion.category)}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2 line-clamp-2">
                      {discussion.title}
                    </h3>

                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">
                      {discussion.content}
                    </p>

                    <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                      <span>{discussion.user.name}</span>
                      <span>•</span>
                      <span>{formatDate(discussion.createdAt)}</span>
                      {discussion.tool && (
                        <>
                          <span>•</span>
                          <span className="text-blue-600 dark:text-blue-400">
                            {discussion.tool.name}
                          </span>
                        </>
                      )}
                      <div className="flex items-center gap-4 ml-auto">
                        <span className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {discussion.viewCount}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="w-4 h-4" />
                          {discussion.commentCount}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-lg font-semibold text-sm text-slate-600 dark:text-slate-400 hover:border-blue-300 dark:hover:border-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-sm text-slate-600 dark:text-slate-400">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-lg font-semibold text-sm text-slate-600 dark:text-slate-400 hover:border-blue-300 dark:hover:border-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Next
            </button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
