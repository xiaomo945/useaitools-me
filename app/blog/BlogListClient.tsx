'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Calendar, Clock, Tag, Rss, Sparkles } from 'lucide-react';

interface BlogListPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  publishedAt: string;
  category: {
    name: string;
    slug: string;
  };
}

interface BlogListClientProps {
  posts: BlogListPost[];
}

const CATEGORY_COLORS: Record<string, { bg: string; text: string; light: string; border: string; glow: string }> = {
  writing: { bg: 'bg-blue-500', text: 'text-blue-600', light: 'bg-blue-50 dark:bg-blue-500/10', border: 'border-blue-200 dark:border-blue-900/50', glow: 'shadow-blue-500/20' },
  image: { bg: 'bg-violet-500', text: 'text-violet-600', light: 'bg-violet-50 dark:bg-violet-500/10', border: 'border-violet-200 dark:border-violet-900/50', glow: 'shadow-violet-500/20' },
  video: { bg: 'bg-indigo-500', text: 'text-indigo-600', light: 'bg-indigo-50 dark:bg-indigo-500/10', border: 'border-indigo-200 dark:border-indigo-900/50', glow: 'shadow-indigo-500/20' },
  audio: { bg: 'bg-pink-500', text: 'text-pink-600', light: 'bg-pink-50 dark:bg-pink-500/10', border: 'border-pink-200 dark:border-pink-900/50', glow: 'shadow-pink-500/20' },
  code: { bg: 'bg-orange-500', text: 'text-orange-600', light: 'bg-orange-50 dark:bg-orange-500/10', border: 'border-orange-200 dark:border-orange-900/50', glow: 'shadow-orange-500/20' },
  productivity: { bg: 'bg-teal-500', text: 'text-teal-600', light: 'bg-teal-50 dark:bg-teal-500/10', border: 'border-teal-200 dark:border-teal-900/50', glow: 'shadow-teal-500/20' },
};

function getCategoryColor(slug: string) {
  return CATEGORY_COLORS[slug] || {
    bg: 'bg-slate-500',
    text: 'text-slate-600',
    light: 'bg-slate-50 dark:bg-slate-500/10',
    border: 'border-slate-200 dark:border-slate-800',
    glow: 'shadow-slate-500/20',
  };
}

export default function BlogListClient({ posts }: BlogListClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', ...Array.from(new Set(posts.map((post) => post.category.slug)))];
  const categoryNameMap: Record<string, { name: string; count: number }> = posts.reduce(
    (acc, post) => {
      if (!acc[post.category.slug]) {
        acc[post.category.slug] = { name: post.category.name, count: 0 };
      }
      acc[post.category.slug].count++;
      return acc;
    },
    {} as Record<string, { name: string; count: number }>,
  );

  const filteredPosts =
    selectedCategory === 'all' ? posts : posts.filter((post) => post.category.slug === selectedCategory);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

  const featuredPosts = filteredPosts.slice(0, 3);
  const restPosts = filteredPosts.slice(3);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950">
      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-slate-200 dark:border-gray-800 bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-emerald-950/10">
        {/* Decorative glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 left-1/4 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-3xl" />
          <div className="absolute top-20 right-1/4 w-[400px] h-[400px] bg-teal-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 py-16 sm:py-24 text-center">
          <Link
            href="/rss.xml"
            className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-100/60 dark:bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-200/60 dark:border-emerald-800/40 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-colors mb-8"
          >
            <Rss className="w-3 h-3" />
            RSS Feed · {posts.length} articles
          </Link>

          <div className="inline-flex items-center gap-2 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm border border-slate-200 dark:border-gray-800 px-3 py-1.5 rounded-full text-xs text-slate-600 dark:text-slate-400 mb-6">
            <Sparkles className="w-3 h-3 text-emerald-500" />
            Updated weekly · {posts.length} in-depth articles
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-slate-900 via-emerald-800 to-slate-900 dark:from-white dark:via-emerald-200 dark:to-white bg-clip-text text-transparent mb-6 leading-[1.1] tracking-tight">
            AI Tools Blog
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed mb-8">
            In-depth comparisons, hands-on reviews, and practical guides for AI tools that matter.
            Updated weekly with expert insights.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-slate-500 dark:text-slate-500">
            <span className="inline-flex items-center gap-1.5 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 px-3 py-1.5 rounded-full shadow-sm">
              <span className="text-slate-500">📝</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">Comparisons</span>
              <span className="text-slate-400 ml-1">vs format</span>
            </span>
            <span className="inline-flex items-center gap-1.5 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 px-3 py-1.5 rounded-full shadow-sm">
              <span className="text-slate-500">🎯</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">Tool Reviews</span>
              <span className="text-slate-400 ml-1">Honest &amp; detailed</span>
            </span>
            <span className="inline-flex items-center gap-1.5 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 px-3 py-1.5 rounded-full shadow-sm">
              <span className="text-slate-500">📚</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">How-to Guides</span>
              <span className="text-slate-400 ml-1">Step-by-step</span>
            </span>
          </div>
        </div>
      </div>

      {/* Category Filters */}
      <div className="max-w-6xl mx-auto px-4 -mt-6 mb-10">
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-slate-200 dark:border-gray-800 shadow-lg p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Browse by category</h2>
            <span className="text-xs text-slate-400">{filteredPosts.length} articles</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const isActive = selectedCategory === category;
              const name = category === 'all' ? 'All Topics' : categoryNameMap[category]?.name || category;
              const count = category === 'all' ? posts.length : categoryNameMap[category]?.count || 0;
              const color = category === 'all' ? null : getCategoryColor(category);

              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`group relative inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? `${category === 'all' ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25' : `${color?.bg} text-white shadow-lg ${color?.glow}`}`
                      : 'bg-slate-100 dark:bg-gray-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-gray-700'
                  }`}
                >
                  <span className="leading-none">{name}</span>
                  <span
                    className={`inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[10px] rounded-full font-bold ${
                      isActive ? 'bg-white/25 text-white' : 'bg-white dark:bg-gray-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Featured Posts (Top 3) */}
      {featuredPosts.length > 0 && selectedCategory === 'all' && (
        <div className="max-w-6xl mx-auto px-4 mb-14">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Featured Articles</h2>
            <span className="text-xs text-slate-400">Top 3 this week</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredPosts.map((post, index) => {
              const color = getCategoryColor(post.category.slug);
              return (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className={`group relative bg-white dark:bg-gray-900 rounded-2xl border border-slate-200 dark:border-gray-800 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-out ${color.glow}`}
                >
                  {/* Header accent */}
                  <div className={`h-1.5 ${color.bg}`} />
                  <div className="p-6">
                    {/* Category */}
                    <div className="flex items-center gap-2 mb-4">
                      <span
                        className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${color.light} ${color.text} border ${color.border}`}
                      >
                        <Tag className="w-2.5 h-2.5" />
                        {post.category.name}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 leading-snug group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors line-clamp-3">
                      {post.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-5 leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>

                    {/* Meta */}
                    <div className="flex items-center gap-3 text-xs text-slate-400 pt-4 border-t border-slate-100 dark:border-gray-800">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(post.publishedAt)}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        5 min
                      </span>
                    </div>

                    {/* Read more arrow */}
                    <div className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600 dark:text-emerald-400 group-hover:gap-2.5 transition-all duration-200">
                      Read article
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Rest of posts */}
      {restPosts.length > 0 && (
        <div className="max-w-6xl mx-auto px-4 pb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {selectedCategory === 'all' ? 'Latest Articles' : `${posts[0]?.category.name} Articles`}
            </h2>
            <span className="text-xs text-slate-400">{restPosts.length} more</span>
          </div>
          <div className="grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {restPosts.map((post) => {
              const color = getCategoryColor(post.category.slug);
              return (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group bg-white dark:bg-gray-900 rounded-2xl border border-slate-200 dark:border-gray-800 overflow-hidden hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 ease-out"
                >
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <span
                        className={`inline-flex items-center text-[10px] font-bold px-2 py-1 rounded-full ${color.light} ${color.text}`}
                      >
                        {post.category.name}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3 leading-snug group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors line-clamp-3">
                      {post.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-4 leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-gray-800 text-[11px] text-slate-400">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(post.publishedAt)}
                      </span>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400 group-hover:translate-x-0.5 transition-transform">
                        Read →
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty state */}
      {filteredPosts.length === 0 && (
        <div className="text-center py-24">
          <p className="text-slate-600 dark:text-slate-400 text-lg">No blog posts found in this category.</p>
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400 mt-4 hover:underline">
            ← Back to all articles
          </Link>
        </div>
      )}
    </div>
  );
}
