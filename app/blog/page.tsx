'use client';

import Link from 'next/link';
import blogPosts from '@/data/blog-posts.json';
import { Home } from 'lucide-react';
import Footer from '@/app/components/Footer';

type BlogPost = (typeof blogPosts)[0];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 py-12 sm:py-16 grid-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Back to Home Link */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white transition-colors duration-300"
          >
            <Home className="w-5 h-5" />
            <span className="font-medium">Back to Home</span>
          </Link>
        </div>

        {/* Blog Header */}
        <div className="mb-10">
          <div className="bg-gradient-to-br from-purple-50/80 via-white to-indigo-50/80 dark:from-purple-950/60 dark:via-gray-900 dark:to-indigo-950/60 backdrop-blur-xl border border-white/60 dark:border-purple-500/10 shadow-xl shadow-purple-500/5 dark:shadow-2xl dark:shadow-purple-500/5 rounded-3xl p-8 sm:p-12">
            <div className="text-center">
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-4">
                AI Tools Blog
              </h1>
              <p className="text-base sm:text-lg text-gray-500 dark:text-gray-400">
                In-depth comparisons, reviews, and guides for AI tools.
              </p>
            </div>
          </div>
        </div>

        {/* Blog Posts List */}
        <div className="space-y-6">
          {blogPosts.map((post) => (
            <div
              key={post.id}
              className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-3xl p-8 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-out"
            >
              <div className="flex flex-col gap-3">
                <span className="text-sm font-medium text-slate-500 dark:text-gray-400">
                  {post.date}
                </span>
                <Link href={`/blog/${post.slug}`}>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300">
                    {post.title}
                  </h2>
                </Link>
                <p className="text-slate-600 dark:text-gray-300 leading-relaxed">
                  {post.description}
                </p>
                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors duration-300"
                >
                  Read More →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
