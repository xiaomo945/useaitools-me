'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Home, Share2, Copy } from 'lucide-react';
import Footer from '@/app/components/Footer';
import Breadcrumbs from '@/app/components/Breadcrumbs';

type BlogPost = {
  id: number;
  title: string;
  slug: string;
  date: string;
  description: string;
  content: string;
};

// Calculate estimated reading time
const calculateReadTime = (content: string): string => {
  const wordsPerMinute = 200;
  // Strip HTML tags and markdown
  const plainText = content
    .replace(/<[^>]*>/g, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\[\[link:[^\|]+\|([^\]]+)\]\]/g, '$1');
  const wordCount = plainText.trim().split(/\s+/).length;
  const readTime = Math.ceil(wordCount / wordsPerMinute);
  return `${readTime} min read`;
};

// Format relative date
const formatRelativeDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) {
    return 'yesterday';
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else if (diffDays < 14) {
    return 'last week';
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} weeks ago`;
  } else if (diffDays < 60) {
    return 'last month';
  } else {
    const months = Math.floor(diffDays / 30);
    return `${months} months ago`;
  }
};

// Simple function to parse basic markdown-like content
const renderContent = (content: string) => {
  let html = content;

  // Internal links first - format: [[link:/path|text]]
  html = html.replace(/\[\[link:([^\|]+)\|([^\]]+)\]\]/g, '<a href="$1" class="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 underline font-medium">$2</a>');

  // Headings
  html = html.replace(/^## (.*?)$/gm, '<h2 class="text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-4">$1</h2>');
  html = html.replace(/^# (.*?)$/gm, '<h1 class="text-4xl font-bold text-slate-900 dark:text-white mb-8">$1</h1>');

  // Paragraphs
  html = html.replace(/^(?!<h[12])(.*?)$/gm, (match, p1) => {
    if (p1.trim()) {
      return `<p class="text-slate-600 dark:text-gray-300 leading-relaxed mb-6">${p1}</p>`;
    }
    return match;
  });

  // Bold text
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-slate-900 dark:text-white">$1</strong>');

  // External links
  html = html.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 underline">$1</a>');

  return html;
};

export default function ClientBlogDetail({
  post,
  slug,
}: {
  post: BlogPost;
  slug: string;
}) {
  const [copied, setCopied] = useState(false);
  const url = `https://useaitools.me/blog/${slug}`;
  const encodedTitle = encodeURIComponent(post.title);
  const readTime = calculateReadTime(post.content);
  const relativeDate = formatRelativeDate(post.date);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 py-12 sm:py-16 grid-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Breadcrumbs */}
        <Breadcrumbs 
          items={[
            { label: 'Home', href: '/' },
            { label: 'Blog', href: '/blog' },
            { label: post.title, href: `/blog/${slug}`, current: true }
          ]} 
        />

        {/* Post Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-3">
            <span className="text-sm font-medium text-slate-500 dark:text-gray-400">
              {relativeDate}
            </span>
            <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
              • {readTime}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-4">
            {post.title}
          </h1>
        </div>

        {/* Post Content */}
        <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-3xl p-8 sm:p-12 shadow-xl mb-8">
          <article
            className="prose prose-slate dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: renderContent(post.content) }}
          />
        </div>

        {/* Share Buttons */}
        <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-3xl p-6 shadow-lg">
          <div className="flex items-center gap-4 mb-4">
            <Share2 className="w-5 h-5 text-slate-500 dark:text-gray-400" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Share this article</h3>
          </div>
          <div className="flex flex-wrap gap-4">
            <a
              href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodeURIComponent(url)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
              </svg>
              Twitter
            </a>
            <a
              href={`https://www.reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodedTitle}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12c-.968 0-1.754.786-1.754 1.754 0 .968.786 1.754 1.754 1.754.969 0 1.754-.786 1.754-1.754A1.754 1.754 0 0 0 9.25 12zm5.5 0c-.969 0-1.754.786-1.754 1.754 0 .968.785 1.754 1.754 1.754.968 0 1.754-.786 1.754-1.754a1.754 1.754 0 0 0-1.754-1.754zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.327 0 0 0-.232-.095z" />
              </svg>
              Reddit
            </a>
            <div className="relative">
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-2 px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-medium rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
              >
                <Copy className="w-4 h-4" />
                Copy Link
              </button>
              {copied && (
                <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-emerald-600 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg animate-pulse">
                  Link copied!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
