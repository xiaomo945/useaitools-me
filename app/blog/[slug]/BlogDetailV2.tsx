'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import toolsData from '@/data/tools.json';
import { Share2, Copy, List, ArrowRight, Sparkles, Calendar, Clock, Tag } from 'lucide-react';
import Breadcrumbs from '@/app/components/Breadcrumbs';
import ReadingProgress from '@/app/components/ReadingProgress';
import NewsletterSignup from '@/app/components/NewsletterSignup';
import Footer from '@/app/components/Footer';
import SocialShare from '@/app/components/SocialShare';
import { formatDate } from '@/lib/format';

type BlogPost = {
  id: number;
  title: string;
  slug: string;
  date: string;
  description: string;
  content: string;
  category?: string;
  images?: { url: string; alt: string; caption?: string }[];
  tldr?: string;
};

interface TocItem {
  id: string;
  text: string;
}

const CATEGORY_COLORS: Record<string, { bg: string; lightBg: string; text: string; glow: string; accent: string }> = {
  writing: { bg: 'from-blue-500 to-indigo-500', lightBg: 'bg-blue-50 dark:bg-blue-500/10', text: 'text-blue-600 dark:text-blue-400', glow: 'shadow-blue-500/20', accent: 'border-blue-200 dark:border-blue-900/50' },
  image: { bg: 'from-violet-500 to-fuchsia-500', lightBg: 'bg-violet-50 dark:bg-violet-500/10', text: 'text-violet-600 dark:text-violet-400', glow: 'shadow-violet-500/20', accent: 'border-violet-200 dark:border-violet-900/50' },
  video: { bg: 'from-indigo-500 to-blue-500', lightBg: 'bg-indigo-50 dark:bg-indigo-500/10', text: 'text-indigo-600 dark:text-indigo-400', glow: 'shadow-indigo-500/20', accent: 'border-indigo-200 dark:border-indigo-900/50' },
  audio: { bg: 'from-pink-500 to-rose-500', lightBg: 'bg-pink-50 dark:bg-pink-500/10', text: 'text-pink-600 dark:text-pink-400', glow: 'shadow-pink-500/20', accent: 'border-pink-200 dark:border-pink-900/50' },
  code: { bg: 'from-orange-500 to-amber-500', lightBg: 'bg-orange-50 dark:bg-orange-500/10', text: 'text-orange-600 dark:text-orange-400', glow: 'shadow-orange-500/20', accent: 'border-orange-200 dark:border-orange-900/50' },
  productivity: { bg: 'from-teal-500 to-emerald-500', lightBg: 'bg-teal-50 dark:bg-teal-500/10', text: 'text-teal-600 dark:text-teal-400', glow: 'shadow-teal-500/20', accent: 'border-teal-200 dark:border-teal-900/50' },
};

function getCategoryColor(cat?: string) {
  const key = (cat || '').toLowerCase();
  return CATEGORY_COLORS[key] || {
    bg: 'from-slate-500 to-gray-500',
    lightBg: 'bg-slate-50 dark:bg-slate-500/10',
    text: 'text-slate-600 dark:text-slate-400',
    glow: 'shadow-slate-500/20',
    accent: 'border-slate-200 dark:border-slate-800',
  };
}

function extractHeadings(content: string): TocItem[] {
  const headingRegex = /^## (.*?)$/gm;
  const headings: TocItem[] = [];
  let match;
  while ((match = headingRegex.exec(content)) !== null) {
    const text = match[1].trim();
    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    headings.push({ id, text });
  }
  return headings;
}

function calculateReadTime(content: string): number {
  const plainText = content.replace(/<[^>]*>/g, '').replace(/\*\*(.*?)\*\*/g, '$1');
  const wordCount = plainText.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / 200));
}

function renderContentWithImages(content: string, images?: { url: string; alt: string }[], highlightTerm?: string | null): string {
  let html = content;

  // Internal links
  html = html.replace(/\[\[link:([^\|]+)\|([^\]]+)\]\]/g,
    '<a href="$1" class="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 underline font-medium transition-colors">$2</a>');

  // Headings - add id for TOC navigation
  html = html.replace(/^## (.*?)$/gm, (_, headingText) => {
    const id = headingText.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return `<h2 id="${id}" class="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-12 mb-5 scroll-mt-24 tracking-tight">${headingText}</h2>`;
  });
  html = html.replace(/^# (.*?)$/gm, '<h1 class="text-4xl font-bold text-slate-900 dark:text-white mb-8">$1</h1>');

  // Paragraphs
  html = html.replace(/^(?!<h[12]|<hr)(.*?)$/gm, (_, p1) => {
    if (p1.trim()) {
      return `<p class="text-slate-700 dark:text-slate-300 leading-[1.85] mb-6 text-[15px] lg:text-base max-w-prose">${p1}</p>`;
    }
    return '';
  });

  // Bold text
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-slate-900 dark:text-white">$1</strong>');

  // External links
  html = html.replace(/(https?:\/\/[^\s<]+)/g,
    '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 underline transition-colors">$1</a>');

  // Highlight search terms
  if (highlightTerm) {
    const escaped = highlightTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(?<=>[^<]*)(${escaped})(?=[^<]*<)`, 'gi');
    html = html.replace(regex, '<mark class="bg-emerald-100 dark:bg-emerald-900/50 text-emerald-900 dark:text-emerald-200 rounded px-1">$1</mark>');
  }

  // Code blocks with copy button
  html = html.replace(/<pre><code(?:\s+class="language-(\w+)")?>([\s\S]*?)<\/code><\/pre>/g,
    (_, lang, code) => {
      const language = lang || 'Code';
      return `<div class="code-block-wrapper relative my-6 rounded-2xl overflow-hidden border border-slate-200 dark:border-gray-800 bg-slate-900">
        <div class="code-block-header flex items-center justify-between px-4 py-2.5 bg-slate-800/80 border-b border-slate-700">
          <span class="text-xs font-mono text-slate-400 uppercase tracking-wide">${language}</span>
          <button class="code-copy-btn flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors px-2 py-1 rounded hover:bg-slate-700" data-code="${encodeURIComponent(code)}">
            <Copy class="w-3.5 h-3.5" />
            <span class="code-copy-label">Copy</span>
          </button>
        </div>
        <pre class="!mt-0 !mb-0 !rounded-none !border-0 overflow-x-auto"><code class="!bg-transparent">${code}</code></pre>
      </div>`;
    });

  return html;
}

export default function BlogDetailV2({
  post,
  slug,
  relatedPosts = [],
  relatedTools = [],
}: {
  post: BlogPost;
  slug: string;
  relatedPosts?: BlogPost[];
  relatedTools?: { id: number; name: string; slug: string; description: string; pricing: string; category: string }[];
}) {
  const [activeHeading, setActiveHeading] = useState('');
  const [copied, setCopied] = useState(false);
  const [showTocMobile, setShowTocMobile] = useState(false);
  const [highlightTerm, setHighlightTerm] = useState<string | null>(null);

  const url = `https://useaitools.me/blog/${slug}`;
  const encodedTitle = encodeURIComponent(post.title);
  const readTime = calculateReadTime(post.content);
  const tocItems = extractHeadings(post.content);
  const categoryColor = getCategoryColor(post.category);

  // Highlight active heading on scroll
  useEffect(() => {
    const handleScroll = () => {
      const headings = tocItems
        .map((item) => document.getElementById(item.id))
        .filter(Boolean) as HTMLElement[];
      let current = '';
      headings.forEach((h) => {
        const rect = h.getBoundingClientRect();
        if (rect.top <= 120) current = h.id;
      });
      setActiveHeading(current);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [tocItems]);

  // Check highlight query param
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const term = params.get('highlight');
    if (term) setTimeout(() => setHighlightTerm(term), 0);
  }, []);

  // Copy button handler
  useEffect(() => {
    const handleClick = (e: Event) => {
      const target = e.target as HTMLElement;
      const btn = target.closest('.code-copy-btn') as HTMLElement;
      if (!btn) return;
      const encodedCode = btn.getAttribute('data-code');
      if (!encodedCode) return;
      try {
        const code = decodeURIComponent(encodedCode);
        navigator.clipboard.writeText(code.replace(/<[^>]*>/g, ''));
        const label = btn.querySelector('.code-copy-label');
        if (label) label.textContent = 'Copied!';
        btn.classList.add('text-emerald-400');
        setTimeout(() => {
          if (label) label.textContent = 'Copy';
          btn.classList.remove('text-emerald-400');
        }, 1500);
      } catch {
        /* ignore */
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  const handleNativeShare = async () => {
    if ((navigator as any).share) {
      try {
        await (navigator as any).share({ title: post.title, text: post.description, url });
      } catch {
        /* user cancelled */
      }
    } else {
      handleCopyLink();
    }
  };

  // Get mentioned tools
  const mentionedToolIds: { id: number; name: string }[] = [];
  const toolLinkRegex = /\[\[link:\/tools\/(\d+)\|([^\]]+)\]\]/g;
  let m: RegExpExecArray | null;
  while ((m = toolLinkRegex.exec(post.content)) !== null) {
    const id = parseInt(m[1], 10);
    if (!mentionedToolIds.find((t) => t.id === id)) {
      mentionedToolIds.push({ id, name: m[2] });
    }
  }
  const mentionedTools = mentionedToolIds
    .map((item) => {
      const t = (toolsData as any[]).find((td: any) => td.id === item.id);
      return t ? { ...t, linkName: item.name } : null;
    })
    .filter(Boolean);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950">
      <ReadingProgress />

      {/* Hero / Header Section */}
      <div className="relative overflow-hidden border-b border-slate-200 dark:border-gray-800 bg-gradient-to-br from-white via-white to-slate-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <div className="absolute inset-0 pointer-events-none">
          <div className={`absolute -top-40 left-1/4 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-3xl`} />
          <div className="absolute top-10 right-1/4 w-[400px] h-[400px] bg-teal-500/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Blog', href: '/blog' },
              { label: post.title, href: `/blog/${slug}`, current: true },
            ]}
          />

          <div className="mt-6 flex items-center gap-2.5 mb-6">
            <Link
              href={`/blog/category/${post.category?.toLowerCase()}`}
              className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full ${categoryColor.lightBg} ${categoryColor.text} border ${categoryColor.accent} hover:scale-[1.03] transition-transform`}
            >
              <Tag className="w-3 h-3" />
              {post.category}
            </Link>
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 px-2.5 py-1.5 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-full">
              <Sparkles className="w-3 h-3 text-emerald-500" />
              Use AI Tools
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1] mb-6">
            {post.title}
          </h1>

          {post.description && (
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl">
              {post.description}
            </p>
          )}

          {/* Meta info */}
          <div className="mt-8 flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {formatDate(post.date)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {readTime} min read
            </span>
            {mentionedTools.length > 0 && (
              <span className="inline-flex items-center gap-1.5">
                <span>🛠️</span>
                {mentionedTools.length} tools covered
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Content with TOC sidebar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_280px] gap-10 lg:gap-14">
          {/* Left: Article content */}
          <article className="min-w-0">
            {/* Mentioned Tools Quick Access */}
            {mentionedTools.length > 0 && (
              <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-2xl p-5 sm:p-6 mb-8 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-lg">🛠️</span>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">
                    Tools Covered in This Guide
                  </h3>
                  <span className="text-xs text-slate-400 ml-auto">
                    {mentionedTools.length} tools
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {mentionedTools.slice(0, 8).map((tool: any) => {
                    const color = getCategoryColor(tool.category);
                    return (
                      <Link
                        key={tool.id}
                        href={`/tools/${tool.id}`}
                        className="group flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-gray-800/60 hover:bg-white dark:hover:bg-gray-800 border border-slate-200 dark:border-gray-800 hover:border-slate-300 dark:hover:border-gray-700 transition-all"
                      >
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${color.bg} flex items-center justify-center text-white text-xs font-bold shadow-sm`}>
                          {(tool.linkName || tool.name).charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm text-slate-900 dark:text-white truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                            {tool.linkName || tool.name}
                          </p>
                          <p className="text-[10px] text-slate-500 dark:text-slate-500 uppercase tracking-wide">
                            {tool.category}
                          </p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-emerald-500 group-hover:translate-x-0.5 transition-all" />
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Article Body */}
            <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-3xl p-6 sm:p-10 lg:p-12 shadow-sm">
              <div
                className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-extrabold prose-headings:tracking-tight prose-a:text-emerald-600 dark:prose-a:text-emerald-400 prose-strong:text-slate-900 dark:prose-strong:text-white prose-code:text-sm prose-code:bg-slate-100 dark:prose-code:bg-gray-800 prose-code:rounded prose-code:px-1.5 prose-code:py-0.5 prose-code:font-mono prose-code:before:content-none prose-code:after:content-none prose-pre:p-0 prose-pre:rounded-2xl prose-pre:border prose-pre:border-slate-200 dark:prose-pre:border-gray-800 prose-blockquote:border-emerald-500 prose-blockquote:bg-emerald-50/50 dark:prose-blockquote:bg-emerald-500/5 prose-blockquote:rounded-xl prose-blockquote:not-italic"
                dangerouslySetInnerHTML={{ __html: renderContentWithImages(post.content, post.images, highlightTerm) }}
              />
            </div>

            {/* Share section */}
            <div className="mt-8 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-2xl p-5 sm:p-6 shadow-sm">
              <SocialShare
                title={post.title}
                url={url}
                description={post.description}
              />
            </div>
          </article>

          {/* Right: Sidebar - TOC + Related */}
          <aside className="order-first lg:order-last">
            <div className="lg:sticky lg:top-6 space-y-6">
              {/* TOC */}
              {tocItems.length > 0 && (
                <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-2xl shadow-sm">
                  <div className="lg:hidden">
                    <button
                      onClick={() => setShowTocMobile(!showTocMobile)}
                      className="w-full flex items-center justify-between px-5 py-4 font-semibold text-slate-900 dark:text-white"
                    >
                      <span className="inline-flex items-center gap-2">
                        <List className="w-4 h-4 text-emerald-500" />
                        Table of Contents
                      </span>
                      <ArrowRight className={`w-4 h-4 text-slate-400 transition-transform ${showTocMobile ? 'rotate-90' : ''}`} />
                    </button>
                    {showTocMobile && (
                      <div className="px-5 pb-5 space-y-1">
                        {tocItems.map((item, index) => (
                          <a
                            key={item.id}
                            href={`#${item.id}`}
                            onClick={(e) => {
                              e.preventDefault();
                              const el = document.getElementById(item.id);
                              el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                              setShowTocMobile(false);
                            }}
                            className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                              activeHeading === item.id
                                ? 'bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-medium'
                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-gray-800'
                            }`}
                          >
                            <span className="inline-flex items-start gap-2">
                              <span className="text-xs text-slate-400 dark:text-slate-500 flex-shrink-0 mt-0.5 font-mono">
                                {String(index + 1).padStart(2, '0')}
                              </span>
                              <span className="leading-snug">{item.text}</span>
                            </span>
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="hidden lg:block p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <List className="w-4 h-4 text-emerald-500" />
                      <h3 className="font-bold text-slate-900 dark:text-white text-sm">Table of Contents</h3>
                    </div>
                    <nav className="space-y-1">
                      {tocItems.map((item, index) => (
                        <a
                          key={item.id}
                          href={`#${item.id}`}
                          onClick={(e) => {
                            e.preventDefault();
                            const el = document.getElementById(item.id);
                            el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          }}
                          className={`block px-3 py-2 rounded-lg text-sm transition-all ${
                            activeHeading === item.id
                              ? 'bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-semibold shadow-sm'
                              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-gray-800'
                          }`}
                        >
                          <span className="inline-flex items-start gap-2">
                            <span className="text-[10px] text-slate-400 dark:text-slate-500 flex-shrink-0 mt-0.5 font-mono tabular-nums">
                              {String(index + 1).padStart(2, '0')}
                            </span>
                            <span className="leading-snug">{item.text}</span>
                          </span>
                        </a>
                      ))}
                    </nav>
                  </div>
                </div>
              )}

              {/* Related Tools Card */}
              {relatedTools.length > 0 && (
                <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-2xl shadow-sm p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-base">🛠️</span>
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm">Related Tools</h3>
                  </div>
                  <div className="space-y-2.5">
                    {relatedTools.slice(0, 5).map((tool) => {
                      const color = getCategoryColor(tool.category);
                      return (
                        <Link
                          key={tool.id}
                          href={`/tool/${tool.slug}`}
                          className="group block p-3 rounded-xl bg-slate-50 dark:bg-gray-800/60 hover:bg-white dark:hover:bg-gray-800 border border-slate-200 dark:border-gray-800 hover:border-slate-300 dark:hover:border-gray-700 transition-all"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${color.bg} flex items-center justify-center text-white text-xs font-bold shadow-sm`}>
                              {tool.name.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-sm text-slate-900 dark:text-white truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                {tool.name}
                              </p>
                              <p className="text-[10px] text-slate-500 dark:text-slate-500 uppercase tracking-wide">
                                {tool.category} · {tool.pricing}
                              </p>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Category Link */}
              <Link
                href={`/blog/category/${post.category?.toLowerCase()}`}
                className="block bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-2xl shadow-sm p-5 hover:shadow-md hover:-translate-y-0.5 transition-all"
              >
                <div className="text-xs text-slate-500 dark:text-slate-500 mb-1">More from</div>
                <div className={`font-bold text-base mb-1 ${categoryColor.text}`}>
                  {post.category} Articles
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Browse all posts in this category →
                </p>
              </Link>
            </div>
          </aside>
        </div>

        {/* Next Read: Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-20">
            <div className="text-center mb-10">
              <div className="inline-block px-3 py-1 rounded-full bg-slate-100 dark:bg-gray-800 text-slate-600 dark:text-slate-300 text-xs font-semibold mb-3">
                Keep Reading
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-2 tracking-tight">
                Next Read
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
                Handpicked articles you may find interesting
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {relatedPosts.map((rp) => {
                const rpColor = getCategoryColor(rp.category);
                return (
                  <Link
                    key={rp.id}
                    href={`/blog/${rp.slug}`}
                    className={`group relative bg-white dark:bg-gray-900 rounded-2xl border border-slate-200 dark:border-gray-800 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-out ${rpColor.glow}`}
                  >
                    <div className={`h-1.5 bg-gradient-to-r ${rpColor.bg}`} />
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <span className={`inline-flex items-center text-[10px] font-bold px-2.5 py-1 rounded-full ${rpColor.lightBg} ${rpColor.text}`}>
                          {rp.category}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 leading-snug group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors line-clamp-3">
                        {rp.title}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-5 leading-relaxed line-clamp-3">
                        {rp.description}
                      </p>
                      <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-gray-800">
                        <span className="inline-flex items-center gap-1.5 text-xs text-slate-400">
                          <Calendar className="w-3 h-3" />
                          {formatDate(rp.date)}
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600 dark:text-emerald-400 group-hover:gap-2.5 transition-all">
                          Read <ArrowRight className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        <div className="mt-16">
          <NewsletterSignup />
        </div>
      </div>

      <Footer />
    </div>
  );
}
