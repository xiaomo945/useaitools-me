'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { User, Award, Star, Bookmark, MessageSquare, Calendar, LogIn, TrendingUp } from 'lucide-react';
import Footer from '@/app/components/Footer';
import Breadcrumbs from '@/app/components/Breadcrumbs';

interface UserStats {
  totalReviews: number;
  totalBookmarks: number;
  totalSubmissions: number;
  points: number;
  level: number;
}

interface FavoriteTool {
  id: number;
  name: string;
  category: string;
  rating: number;
  review: string;
}

interface Activity {
  type: 'review' | 'bookmark' | 'submission';
  toolName: string;
  toolId: number | null;
  date: string;
  rating?: number;
  status?: string;
}

interface ProfileData {
  user: {
    id: string;
    name: string;
    email: string;
    image: string;
    role: string;
    createdAt: string;
  };
  stats: UserStats;
  categoryPreferences: Record<string, number>;
  favoriteTools: FavoriteTool[];
  recentActivity: Activity[];
  bookmarkedTools: any[];
  reviewedTools: any[];
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/profile');
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
      }
    } catch (error) {
      console.error('加载用户画像失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'authenticated') {
      loadProfile();
    } else if (status === 'unauthenticated') {
      setLoading(false);
    }
  }, [status]); // eslint-disable-line react-hooks/exhaustive-deps

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'review':
        return <MessageSquare className="w-4 h-4" />;
      case 'bookmark':
        return <Bookmark className="w-4 h-4" />;
      case 'submission':
        return <Star className="w-4 h-4" />;
      default:
        return <TrendingUp className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'review':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400';
      case 'bookmark':
        return 'bg-rose-500/10 text-rose-600 dark:text-rose-400';
      case 'submission':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400';
      default:
        return 'bg-slate-500/10 text-slate-600 dark:text-slate-400';
    }
  };

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-gray-950 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <Breadcrumbs 
            items={[
              { label: 'Home', href: '/' },
              { label: 'Profile', href: '/profile', current: true }
            ]} 
          />

          <div className="text-center py-20">
            <div className="mx-auto w-20 h-20 mb-6 text-slate-300 dark:text-slate-600">
              <LogIn className="w-full h-full" />
            </div>
            <p className="text-slate-500 dark:text-slate-500 text-lg font-medium mb-4">
              Please log in to view your profile.
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
            { label: 'Profile', href: '/profile', current: true }
          ]} 
        />

        {loading ? (
          <div className="space-y-8">
            {/* Profile Header Skeleton */}
            <div className="animate-pulse bg-gradient-to-br from-emerald-50/80 via-white to-teal-50/80 dark:from-emerald-950/60 dark:via-gray-900 dark:to-teal-950/60 backdrop-blur-xl border border-white/60 dark:border-emerald-500/10 shadow-xl rounded-3xl p-8 sm:p-12">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 bg-slate-200 dark:bg-gray-700 rounded-full" />
                <div className="flex-1 space-y-3">
                  <div className="h-8 bg-slate-200 dark:bg-gray-700 rounded w-1/4" />
                  <div className="h-4 bg-slate-200 dark:bg-gray-700 rounded w-1/3" />
                </div>
              </div>
            </div>

            {/* Stats Skeleton */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-xl p-6">
                  <div className="h-8 bg-slate-200 dark:bg-gray-700 rounded w-1/2 mb-2" />
                  <div className="h-4 bg-slate-200 dark:bg-gray-700 rounded w-3/4" />
                </div>
              ))}
            </div>
          </div>
        ) : !profile ? (
          <div className="text-center py-20">
            <p className="text-slate-500 dark:text-slate-500 text-lg">
              Failed to load profile. Please try again later.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Profile Header */}
            <div className="bg-gradient-to-br from-emerald-50/80 via-white to-teal-50/80 dark:from-emerald-950/60 dark:via-gray-900 dark:to-teal-950/60 backdrop-blur-xl border border-white/60 dark:border-emerald-500/10 shadow-xl shadow-emerald-500/5 dark:shadow-2xl dark:shadow-emerald-500/5 rounded-3xl p-8 sm:p-12 animate-fade-in-up">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                {profile.user.image ? (
                  <img
                    src={profile.user.image}
                    alt={profile.user.name}
                    className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-800 shadow-lg"
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white text-3xl font-bold border-4 border-white dark:border-gray-800 shadow-lg">
                    {profile.user.name?.charAt(0) || 'U'}
                  </div>
                )}
                <div className="flex-1 text-center sm:text-left">
                  <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-2">
                    {profile.user.name || 'User'}
                  </h1>
                  <p className="text-base text-gray-500 dark:text-gray-400 mb-3">
                    {profile.user.email}
                  </p>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 capitalize">
                      {profile.user.role}
                    </span>
                    <span className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                      <Calendar className="w-4 h-4" />
                      Joined {formatDate(profile.user.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
              <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-xl p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <Award className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                      {profile.stats.level}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Level</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-xl p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                      {profile.stats.points}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Points</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-xl p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                      {profile.stats.totalReviews}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Reviews</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-xl p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center">
                    <Bookmark className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                      {profile.stats.totalBookmarks}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Bookmarks</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-xl p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center">
                    <Star className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                      {profile.stats.totalSubmissions}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Submissions</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Category Preferences */}
            {Object.keys(profile.categoryPreferences).length > 0 && (
              <section className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                  <TrendingUp className="w-6 h-6 text-emerald-500" />
                  Favorite Categories
                </h2>
                <div className="flex flex-wrap gap-3">
                  {Object.entries(profile.categoryPreferences)
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

            {/* Favorite Tools */}
            {profile.favoriteTools.length > 0 && (
              <section className="animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                  <Star className="w-6 h-6 text-amber-500" />
                  Top Rated Tools
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profile.favoriteTools.map(tool => {
                    const colors = getCategoryColors(tool.category);
                    return (
                      <Link
                        key={tool.id}
                        href={`/tools/${tool.id}`}
                        className="group p-4 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-xl hover:border-emerald-300 dark:hover:border-emerald-700 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-300"
                      >
                        <div className="flex items-start gap-4">
                          <div className={`w-12 h-12 rounded-xl ${colors.bg}/10 flex items-center justify-center text-xl font-bold ${colors.text} flex-shrink-0`} style={{ fontFamily: 'Playfair Display, serif' }}>
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
                              <span className="text-xs text-amber-500">
                                {'⭐'.repeat(tool.rating)}
                              </span>
                            </div>
                            {tool.review && (
                              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 line-clamp-2">
                                {tool.review}
                              </p>
                            )}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Recent Activity */}
            {profile.recentActivity.length > 0 && (
              <section className="animate-fade-in-up" style={{ animationDelay: '400ms' }}>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                  <TrendingUp className="w-6 h-6 text-blue-500" />
                  Recent Activity
                </h2>
                <div className="space-y-3">
                  {profile.recentActivity.map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-4 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-xl hover:border-slate-300 dark:hover:border-gray-700 transition-all"
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${getActivityColor(activity.type)}`}>
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-slate-900 dark:text-white font-medium">
                          {activity.type === 'review' && `Reviewed ${activity.toolName}`}
                          {activity.type === 'bookmark' && `Bookmarked ${activity.toolName}`}
                          {activity.type === 'submission' && `Submitted ${activity.toolName}`}
                        </p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            {formatDate(activity.date)}
                          </span>
                          {activity.rating && (
                            <span className="text-xs text-amber-500">
                              {'⭐'.repeat(activity.rating)}
                            </span>
                          )}
                          {activity.status && (
                            <span className="text-xs text-slate-400 dark:text-slate-500 capitalize">
                              {activity.status}
                            </span>
                          )}
                        </div>
                      </div>
                      {activity.toolId && (
                        <Link
                          href={`/tools/${activity.toolId}`}
                          className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline"
                        >
                          View →
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
