'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Calendar, Clock, Tag } from 'lucide-react';

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

export default function BlogListClient({ posts }: BlogListClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', ...Array.from(new Set(posts.map((post) => post.category.slug)))];

  const categoryNameMap: Record<string, string> = posts.reduce(
    (acc, post) => {
      acc[post.category.slug] = post.category.name;
      return acc;
    },
    {} as Record<string, string>
  );

  const filteredPosts =
    selectedCategory === 'all' ? posts : posts.filter((post) => post.category.slug === selectedCategory);

  const getCategoryCount = (category: string) => {
    if (category === 'all') return posts.length;
    return posts.filter((post) => post.category.slug === category).length;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4 font-playfair">
            AI Tools Blog
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            In-depth comparisons, reviews, and guides for AI tools.
          </p>
        </div>

        <div className="mb-8 flex flex-wrap gap-2 justify-center">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedCategory === category
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30'
                  : 'bg-slate-100 dark:bg-gray-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-gray-700'
              }`}
            >
              {category === 'all' ? 'All' : categoryNameMap[category] || category} ({getCategoryCount(category)})
            </button>
          ))}
        </div>

        <div className="grid gap-8">
          {filteredPosts.map((post, index) => (
            <article
              key={post.id}
              className="group bg-white dark:bg-gray-900 rounded-2xl border border-slate-200 dark:border-gray-800 shadow-sm hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-300 ease-out hover:-translate-y-1 overflow-hidden"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <Link href={`/blog/${post.slug}`} className="block">
                <div className="p-6 md:p-8">
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                      <Calendar className="w-3 h-3" />
                      {formatDate(post.publishedAt)}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                      <Clock className="w-3 h-3" />
                      {Math.max(3, Math.ceil(post.excerpt.length / 500))} min read
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                      <Tag className="w-3 h-3" />
                      {post.category.name}
                    </span>
                  </div>

                  <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-3 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors font-playfair">
                    {post.title}
                  </h2>

                  <p className="text-slate-600 dark:text-slate-400 mb-4">{post.excerpt}</p>

                  <div className="flex items-center text-emerald-600 dark:text-emerald-400 font-semibold group-hover:gap-3 transition-all duration-300">
                    Read more
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-slate-600 dark:text-slate-400 text-lg">No blog posts found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}
