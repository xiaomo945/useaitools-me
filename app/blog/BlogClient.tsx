'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, User, Tag, Eye } from 'lucide-react';
import Footer from '@/app/components/Footer';
import Breadcrumbs from '@/app/components/Breadcrumbs';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string | null;
  publishedAt: string;
  viewCount: number;
  author: {
    name: string;
    image: string | null;
  };
  category: {
    name: string;
    slug: string;
  };
  tags: string[];
}

interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  postCount: number;
}

export default function BlogClient() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/blog-categories');
      if (res.ok) {
        const data = await res.json();
        setCategories(data.categories);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== 'all') {
        params.set('category', selectedCategory);
      }
      params.set('page', page.toString());
      params.set('limit', '12');

      const res = await fetch(`/api/blog?${params}`);
      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts);
        setTotalPages(data.pagination.totalPages);
      }
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [selectedCategory, page]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Breadcrumbs items={[{ label: 'Blog', href: '/blog' }]} />

        <div className="mb-12">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            AI Tools Blog
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            In-depth reviews, comparisons, and insights about the best AI tools
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-8 flex flex-wrap gap-2">
          <button
            onClick={() => {
              setSelectedCategory('all');
              setPage(1);
            }}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedCategory === 'all'
                ? 'bg-emerald-500 text-white'
                : 'bg-white dark:bg-gray-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-gray-800'
            }`}
          >
            All Posts
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => {
                setSelectedCategory(category.slug);
                setPage(1);
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedCategory === category.slug
                  ? 'bg-emerald-500 text-white'
                  : 'bg-white dark:bg-gray-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-gray-800'
              }`}
            >
              {category.name} ({category.postCount})
            </button>
          ))}
        </div>

        {/* Posts Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-sm animate-pulse">
                <div className="h-48 bg-slate-200 dark:bg-gray-700" />
                <div className="p-6 space-y-3">
                  <div className="h-4 bg-slate-200 dark:bg-gray-700 rounded w-1/4" />
                  <div className="h-6 bg-slate-200 dark:bg-gray-700 rounded" />
                  <div className="h-4 bg-slate-200 dark:bg-gray-700 rounded" />
                  <div className="h-4 bg-slate-200 dark:bg-gray-700 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-slate-500 dark:text-slate-400 text-lg">
              No blog posts found
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
                >
                  {post.coverImage ? (
                    <div className="h-48 overflow-hidden">
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  ) : (
                    <div className="h-48 bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                      <span className="text-6xl text-white/20 font-bold">
                        {post.title.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-3">
                      <span className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded text-xs font-medium">
                        {post.category.name}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {post.viewCount}
                      </span>
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-2">
                        {post.author.image ? (
                          <img
                            src={post.author.image}
                            alt={post.author.name}
                            className="w-6 h-6 rounded-full"
                            loading="lazy"
                            decoding="async"
                          />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-gray-700 flex items-center justify-center">
                            <User className="w-3 h-3" />
                          </div>
                        )}
                        <span>{post.author.name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(post.publishedAt)}
                      </div>
                    </div>
                    {post.tags.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {post.tags.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-slate-100 dark:bg-gray-800 text-slate-600 dark:text-slate-400 rounded text-xs"
                          >
                            <Tag className="w-3 h-3 inline mr-1" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center gap-2">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 bg-white dark:bg-gray-900 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-slate-600 dark:text-slate-400">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 bg-white dark:bg-gray-900 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}
