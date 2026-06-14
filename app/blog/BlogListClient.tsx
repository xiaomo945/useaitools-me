'use client';

import { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowRight, Calendar, Tag, Rss, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';

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

const POSTS_PER_PAGE = 24;

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

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function Pagination({
  currentPage,
  totalPages,
  totalPosts,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  totalPosts: number;
  onPageChange: (page: number) => void;
}) {
  const getPageNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }
    pages.push(1);
    if (currentPage > 3) pages.push('...');
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (currentPage < totalPages - 2) pages.push('...');
    pages.push(totalPages);
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="mt-12 flex flex-col items-center gap-4">
      <div className="text-xs text-slate-500 dark:text-slate-400">
        Showing page <span className="font-semibold text-slate-700 dark:text-slate-300">{currentPage}</span> of{' '}
        <span className="font-semibold text-slate-700 dark:text-slate-300">{totalPages}</span> ({totalPosts} articles total)
      </div>
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="inline-flex items-center gap-1 px-3 py-2 text-sm font-semibold rounded-full bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          <ChevronLeft className="w-4 h-4" /> Prev
        </button>
        {getPageNumbers().map((page, idx) =>
          typeof page === 'number' ? (
            <button
              key={idx}
              onClick={() => onPageChange(page)}
              className={`min-w-[40px] h-10 px-3 text-sm font-semibold rounded-full transition-all ${
                page === currentPage
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/25'
                  : 'bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-gray-800'
              }`}
            >
              {page}
            </button>
          ) : (
            <span key={idx} className="px-2 text-slate-400 dark:text-slate-500 text-sm font-semibold">
              {page}
            </span>
          ),
        )}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="inline-flex items-center gap-1 px-3 py-2 text-sm font-semibold rounded-full bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          Next <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default function BlogListClient({ posts }: BlogListClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialCategory = searchParams.get('category') || 'all';
  const initialPage = parseInt(searchParams.get('page') || '1', 10);

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [currentPage, setCurrentPage] = useState<number>(initialPage);

  useEffect(() => {
    setSelectedCategory(initialCategory);
    setCurrentPage(initialPage || 1);
  }, [initialCategory, initialPage]);

  const categories = useMemo(() => {
    const uniqueCategories = new Map<string, { name: string; count: number }>();
    posts.forEach((post) => {
      if (!uniqueCategories.has(post.category.slug)) {
        uniqueCategories.set(post.category.slug, { name: post.category.name, count: 0 });
      }
      uniqueCategories.get(post.category.slug)!.count++;
    });
    return Array.from(uniqueCategories.entries())
      .sort((a, b) => b[1].count - a[1].count)
      .map(([slug, data]) => ({ slug, ...data }));
  }, [posts]);

  const filteredPosts = useMemo(() => {
    if (selectedCategory === 'all') return posts;
    return posts.filter((post) => post.category.slug === selectedCategory);
  }, [posts, selectedCategory]);

  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / POSTS_PER_PAGE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIdx = (safeCurrentPage - 1) * POSTS_PER_PAGE;
  const pagePosts = filteredPosts.slice(startIdx, startIdx + POSTS_PER_PAGE);
  const featuredPosts = selectedCategory === 'all' && safeCurrentPage === 1 ? pagePosts.slice(0, 3) : [];
  const restPosts = featuredPosts.length > 0 ? pagePosts.slice(3) : pagePosts;

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
    const params = new URLSearchParams();
    if (category !== 'all') params.set('category', category);
    const qs = params.toString();
    router.push(qs ? `/blog?${qs}` : '/blog', { scroll: true });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    const params = new URLSearchParams();
    if (selectedCategory !== 'all') params.set('category', selectedCategory);
    if (page !== 1) params.set('page', String(page));
    const qs = params.toString();
    router.push(qs ? `/blog?${qs}` : '/blog', { scroll: true });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950">
      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-slate-200 dark:border-gray-800 bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-emerald-950/10">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 left-1/4 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-3xl" />
          <div className="absolute top-20 right-1/4 w-[400px] h-[400px] bg-teal-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 py-14 sm:py-20 text-center">
          <Link
            href="/rss.xml"
            className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-100/60 dark:bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-200/60 dark:border-emerald-800/40 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-colors mb-8"
          >
            <Rss className="w-3 h-3" />
            RSS Feed · {posts.length} articles
          </Link>

          <div className="inline-flex items-center gap-2 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm border border-slate-200 dark:border-gray-800 px-3 py-1.5 rounded-full text-xs text-slate-600 dark:text-slate-400 mb-5">
            <Sparkles className="w-3 h-3 text-emerald-500" />
            Updated weekly · {posts.length} in-depth articles
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-slate-900 via-emerald-800 to-slate-900 dark:from-white dark:via-emerald-200 dark:to-white bg-clip-text text-transparent mb-5 leading-[1.1] tracking-tight">
            AI Tools Blog
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed mb-8">
            In-depth comparisons, hands-on reviews, and practical guides for AI tools that matter.
          </p>
        </div>
      </div>

      {/* Category Filters */}
      <div className="max-w-6xl mx-auto px-4 -mt-5 mb-10">
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-slate-200 dark:border-gray-800 shadow-lg p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Browse by category</h2>
            <span className="text-xs text-slate-400">{filteredPosts.length} articles</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleCategoryChange('all')}
              className={`group relative inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedCategory === 'all'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25'
                  : 'bg-slate-100 dark:bg-gray-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-gray-700'
              }`}
            >
              <span className="leading-none">All Topics</span>
              <span className={`inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[10px] rounded-full font-bold ${
                selectedCategory === 'all' ? 'bg-white/25 text-white' : 'bg-white dark:bg-gray-700 text-slate-600 dark:text-slate-300'
              }`}>{posts.length}</span>
            </button>
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.slug;
              const color = getCategoryColor(cat.slug);
              return (
                <button
                  key={cat.slug}
                  onClick={() => handleCategoryChange(cat.slug)}
                  className={`group relative inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    isActive ? `${color.bg} text-white shadow-lg ${color.glow}` : 'bg-slate-100 dark:bg-gray-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-gray-700'
                  }`}
                >
                  <span className="leading-none">{cat.name}</span>
                  <span className={`inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[10px] rounded-full font-bold ${
                    isActive ? 'bg-white/25 text-white' : 'bg-white dark:bg-gray-700 text-slate-600 dark:text-slate-300'
                  }`}>
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <div className="max-w-6xl mx-auto px-4 mb-14">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Featured Articles</h2>
            <span className="text-xs text-slate-400">Editor&apos;s picks</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredPosts.map((post, index) => {
              const color = getCategoryColor(post.category.slug);
              return (
                <Link
                  key={post.id + '-' + index}
                  href={`/blog/${post.slug}`}
                  className={`group relative bg-white dark:bg-gray-900 rounded-2xl border border-slate-200 dark:border-gray-800 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-out ${color.glow}`}
                >
                  <div className={`h-1.5 ${color.bg}`} />
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${color.light} ${color.text} border ${color.border}`}>
                        <Tag className="w-2.5 h-2.5" />
                        {post.category.name}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 leading-snug group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors line-clamp-3">
                      {post.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-5 leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-slate-400 pt-4 border-t border-slate-100 dark:border-gray-800">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(post.publishedAt)}
                      </span>
                    </div>
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
        <div className="max-w-6xl mx-auto px-4 pb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {selectedCategory === 'all' ? 'Latest Articles' : `${posts.find((p) => p.category.slug === selectedCategory)?.category.name} Articles`}
            </h2>
            <span className="text-xs text-slate-400">
              {safeCurrentPage > 1 && `Page ${safeCurrentPage} · `}{restPosts.length} posts
            </span>
          </div>
          <div className="grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 sm:grid-cols-2">
            {restPosts.map((post, index) => {
              const color = getCategoryColor(post.category.slug);
              return (
                <Link
                  key={post.id + '-r-' + index}
                  href={`/blog/${post.slug}`}
                  className="group bg-white dark:bg-gray-900 rounded-2xl border border-slate-200 dark:border-gray-800 overflow-hidden hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 ease-out"
                >
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`inline-flex items-center text-[10px] font-bold px-2 py-1 rounded-full ${color.light} ${color.text}`}>
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

      {/* Pagination */}
      <Pagination
        currentPage={safeCurrentPage}
        totalPages={totalPages}
        totalPosts={filteredPosts.length}
        onPageChange={handlePageChange}
      />

      {/* Empty state */}
      {filteredPosts.length === 0 && (
        <div className="text-center py-24">
          <p className="text-slate-600 dark:text-slate-400 text-lg mb-3">No blog posts found in this category.</p>
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:underline">
            ← Back to all articles
          </Link>
        </div>
      )}
    </div>
  );
}
