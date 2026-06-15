'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Calendar, Clock, Tag } from 'lucide-react';
import { useToast } from '@/app/components/Toast';
import { blogPosts } from '@/data/blog-posts';
import type { BlogPost } from '@/types';

export default function BlogPage() {
  const { addToast } = useToast();
  
  // Pull to refresh state
  const [pullStartY, setPullStartY] = useState(0);
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showPullIndicator, setShowPullIndicator] = useState(false);
  const [posts, setPosts] = useState<BlogPost[]>(blogPosts);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (window.scrollY === 0 && !isRefreshing) {
      setPullStartY(e.touches[0].clientY);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (window.scrollY === 0 && !isRefreshing && pullStartY > 0) {
      const currentY = e.touches[0].clientY;
      const distance = currentY - pullStartY;
      
      if (distance > 0) {
        setPullDistance(distance);
        setShowPullIndicator(true);
      }
    }
  };

  const handleTouchEnd = () => {
    if (pullDistance > 60 && !isRefreshing) {
      setIsRefreshing(true);
      setPullDistance(60);
      
      // Simulate refresh
      setTimeout(() => {
        setPosts([...blogPosts]);
        setIsRefreshing(false);
        setPullDistance(0);
        setShowPullIndicator(false);
        addToast('✅ Page refreshed');
      }, 1000);
    } else {
      setPullDistance(0);
      setShowPullIndicator(false);
    }
  };

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      className="min-h-screen"
    >
      {/* Pull to refresh indicator */}
      {showPullIndicator && (
        <div
          className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center pt-4"
          style={{ 
            transform: `translateY(${Math.min(pullDistance / 2, 40)}px)`,
            transition: isRefreshing ? 'none' : 'transform 0.2s ease-out'
          }}
        >
          <div className={`flex flex-col items-center gap-2 ${isRefreshing ? 'animate-pulse' : ''}`}>
            <svg
              className={`w-6 h-6 text-indigo-500 ${isRefreshing ? 'animate-spin' : ''}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              {isRefreshing ? (
                <circle cx="12" cy="12" r="10" strokeLinecap="round" strokeDasharray="100" strokeDashoffset="50" />
              ) : (
                <>
                  <path d="M12 2v4" strokeLinecap="round" />
                  <path d="M18.36 5.64l-2.83 2.83" strokeLinecap="round" />
                  <path d="M22 12h-4" strokeLinecap="round" />
                  <path d="M18.36 18.36l-2.83-2.83" strokeLinecap="round" />
                  <path d="M12 18v4" strokeLinecap="round" />
                  <path d="M5.64 18.36l2.83-2.83" strokeLinecap="round" />
                  <path d="M2 12h4" strokeLinecap="round" />
                  <path d="M5.64 5.64l2.83 2.83" strokeLinecap="round" />
                </>
              )}
            </svg>
            <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
              {isRefreshing ? 'Refreshing...' : pullDistance > 60 ? 'Release to refresh' : 'Pull to refresh'}
            </span>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4 font-playfair">
            AI Tools Blog
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            In-depth comparisons, reviews, and guides for AI tools.
          </p>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid gap-8">
          {posts.map((post, index) => (
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
                      {post.date}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                      <Clock className="w-3 h-3" />
                      {post.reading_time}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                      <Tag className="w-3 h-3" />
                      {post.category}
                    </span>
                  </div>
                  
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-3 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors font-playfair">
                    {post.title}
                  </h2>
                  
                  <p className="text-slate-600 dark:text-slate-400 mb-4">
                    {post.description}
                  </p>
                  
                  <div className="flex items-center text-emerald-600 dark:text-emerald-400 font-semibold group-hover:gap-3 transition-all duration-300">
                    Read more
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
