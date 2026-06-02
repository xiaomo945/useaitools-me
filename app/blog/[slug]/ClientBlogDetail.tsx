'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Home, Share2, Copy, ChevronRight, List } from 'lucide-react';
import Footer from '@/app/components/Footer';
import Breadcrumbs from '@/app/components/Breadcrumbs';
import ReadingProgress from '@/app/components/ReadingProgress';

type BlogImage = {
  url: string;
  alt: string;
  caption?: string;
};

type BlogPost = {
  id: number;
  title: string;
  slug: string;
  date: string;
  description: string;
  content: string;
  category?: string;
  images?: BlogImage[];
};

interface TocItem {
  id: string;
  text: string;
}

// Extract H2 headings from content for Table of Contents
const extractHeadings = (content: string): TocItem[] => {
  const headingRegex = /^## (.*?)$/gm;
  const headings: TocItem[] = [];
  let match;
  
  while ((match = headingRegex.exec(content)) !== null) {
    const text = match[1].trim();
    // Generate a slug-like ID from the heading text
    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    headings.push({ id, text });
  }
  
  return headings;
};

// Calculate estimated reading time
const calculateReadTime = (content: string): { minutes: number; display: string } => {
  const wordsPerMinute = 200;
  // Strip HTML tags and markdown
  const plainText = content
    .replace(/<[^>]*>/g, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\[\[link:[^\|]+\|([^\]]+)\]\]/g, '$1');
  const wordCount = plainText.trim().split(/\s+/).length;
  const readTime = Math.ceil(wordCount / wordsPerMinute);
  return {
    minutes: readTime,
    display: `⏱️ ${readTime} min read`
  };
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

// Helper function to render a single blog image
const renderBlogImage = (image: BlogImage, index: number) => {
  return `<figure class="relative my-8">
    <img
      src="${image.url}"
      alt="${image.alt}"
      class="w-full max-w-full h-auto rounded-xl shadow-lg"
      loading="lazy"
      decoding="async"
    />
    ${image.caption ? `<figcaption class="mt-3 text-center text-sm text-slate-500 dark:text-gray-400 italic">${image.caption}</figcaption>` : ''}
  </figure>`;
};

// Simple function to parse basic markdown-like content and insert images at appropriate positions
const renderContentWithImages = (content: string, images: BlogImage[] = []) => {
  let html = content;

  // Internal links first - format: [[link:/path|text]]
  html = html.replace(/\[\[link:([^\|]+)\|([^\]]+)\]\]/g, '<a href="$1" class="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 underline font-medium transition-colors duration-300">$2</a>');

  // Headings - add id for TOC navigation
  html = html.replace(/^## (.*?)$/gm, (match, headingText) => {
    const id = headingText.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return `<h2 id="${id}" class="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-12 mb-5 sm:mb-7 scroll-mt-24">${headingText}</h2>`;
  });
  html = html.replace(/^# (.*?)$/gm, '<h1 class="text-4xl font-bold text-slate-900 dark:text-white mb-8">$1</h1>');

  // Paragraphs - optimized for readability (enhanced for mobile and desktop)
  html = html.replace(/^(?!<h[12])(.*?)$/gm, (match, p1) => {
    if (p1.trim() && p1.trim() !== '---') {
      return `<p class="text-slate-600 dark:text-gray-300 leading-relaxed mb-6 text-base lg:text-lg max-w-prose">${p1}</p>`;
    } else if (p1.trim() === '---') {
      return '<hr class="border-t border-slate-200 dark:border-gray-800 my-10 sm:my-12" />';
    }
    return match;
  });

  // Bold text
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-slate-900 dark:text-white">$1</strong>');

  // External links
  html = html.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 underline transition-colors duration-300">$1</a>');

  // Insert images at appropriate positions
  const paragraphs = html.split(/(?=<p|<h2|<hr)/g);
  
  if (paragraphs.length > 0 && images.length > 0) {
    let contentWithImages = '';
    
    // Add header image (images[0]) at the beginning
    if (images[0]) {
      contentWithImages += renderBlogImage(images[0], 0);
    }
    
    // Add paragraphs up to halfway point
    const halfwayPoint = Math.floor(paragraphs.length / 2);
    for (let i = 0; i < halfwayPoint; i++) {
      contentWithImages += paragraphs[i];
    }
    
    // Add middle image (images[1]) at halfway point
    if (images[1]) {
      contentWithImages += renderBlogImage(images[1], 1);
    }
    
    // Add remaining paragraphs
    for (let i = halfwayPoint; i < paragraphs.length; i++) {
      contentWithImages += paragraphs[i];
    }
    
    // Add CTA image (images[2]) at the end
    if (images[2]) {
      contentWithImages += renderBlogImage(images[2], 2);
    }
    
    return contentWithImages;
  }
  
  return html;
};

type RelatedTool = {
  id: number;
  name: string;
  slug: string;
  description: string;
  pricing: string;
  category: string;
};

export default function ClientBlogDetail({
  post,
  slug,
  relatedPosts = [],
  relatedTools = [],
}: {
  post: BlogPost;
  slug: string;
  relatedPosts?: BlogPost[];
  relatedTools?: RelatedTool[];
}) {
  const [copied, setCopied] = useState(false);
  const [activeHeading, setActiveHeading] = useState('');
  const [showToc, setShowToc] = useState(false);
  const url = `https://useaitools.me/blog/${slug}`;
  const encodedTitle = encodeURIComponent(post.title);
  const { display: readTime } = calculateReadTime(post.content);
  const relativeDate = formatRelativeDate(post.date);
  const tocItems = extractHeadings(post.content);

  // Scroll to heading when clicking TOC item
  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveHeading(id);
      setShowToc(false);
    }
  };

  // Highlight active heading based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const headings = tocItems.map(item => document.getElementById(item.id)).filter(Boolean);
      let currentHeading = '';
      
      headings.forEach((heading) => {
        if (heading) {
          const rect = heading.getBoundingClientRect();
          if (rect.top <= 100) {
            currentHeading = heading.id;
          }
        }
      });
      
      setActiveHeading(currentHeading);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [tocItems]);

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
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 py-10 sm:py-16 grid-background">
      <ReadingProgress />
      <div className="max-w-6xl mx-auto px-3 sm:px-6">
        {/* Breadcrumbs */}
        <Breadcrumbs 
          items={[
            { label: 'Home', href: '/' },
            { label: 'Blog', href: '/blog' },
            { label: post.title, href: `/blog/${slug}`, current: true }
          ]} 
        />

        {/* Post Header */}
        <div className="mb-8 max-w-4xl">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs sm:text-sm font-medium text-slate-500 dark:text-gray-400">
              {relativeDate}
            </span>
            <span className="text-xs sm:text-sm font-medium text-emerald-600 dark:text-emerald-400">
              {readTime}
            </span>
          </div>
          <h1 className="text-2.5xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-4">
            {post.title}
          </h1>
          
          {/* Mobile TOC Button */}
          {tocItems.length > 0 && (
            <button
              onClick={() => setShowToc(!showToc)}
              className="flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-gray-800 hover:bg-slate-200 dark:hover:bg-gray-700 rounded-lg text-slate-700 dark:text-gray-300 font-medium transition-colors duration-300 lg:hidden"
            >
              <List className="w-4 h-4" />
              Table of Contents
              <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${showToc ? 'rotate-90' : ''}`} />
            </button>
          )}
        </div>

        {/* Desktop Layout: TOC Sidebar + Content */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8 lg:gap-10">
          {/* Post Content - First on mobile, side by side on desktop */}
          <div className="order-2 lg:order-1">
            <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-3xl p-5 sm:p-8 lg:p-10 shadow-xl mb-8 max-w-3xl mx-auto">
              <article
                className="prose prose-slate dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: renderContentWithImages(post.content, post.images) }}
              />
            </div>
          </div>

          {/* Table of Contents (Desktop) */}
          {tocItems.length > 0 && (
            <div className="hidden lg:block order-1 lg:order-2">
              <div className="sticky top-6 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-2xl p-5 shadow-lg">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <List className="w-4 h-4 text-emerald-500" />
                  Table of Contents
                </h3>
                <nav className="space-y-2 overflow-x-hidden">
                  {tocItems.map((item, index) => (
                    <button
                      key={item.id}
                      onClick={() => scrollToHeading(item.id)}
                      className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 pr-2 ${
                        activeHeading === item.id
                          ? 'bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-medium'
                          : 'text-slate-600 dark:text-gray-400 hover:bg-slate-50 dark:hover:bg-gray-800'
                      }`}
                      style={{ wordBreak: 'break-word', overflowWrap: 'break-word', maxWidth: '100%' }}
                    >
                      <span className="inline-flex items-start gap-2 w-full">
                        <span className="text-xs text-slate-400 dark:text-gray-500 flex-shrink-0 mt-0.5">{index + 1}.</span>
                        <span className="flex-1 break-words hyphens-auto whitespace-normal">{item.text}</span>
                      </span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          )}

          {/* Mobile TOC Dropdown */}
          {tocItems.length > 0 && showToc && (
            <div className="lg:hidden bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-2xl p-5 shadow-lg mb-6 order-1 lg:order-none">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <List className="w-4 h-4 text-emerald-500" />
                Table of Contents
              </h3>
              <nav className="space-y-2 overflow-x-hidden">
                {tocItems.map((item, index) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToHeading(item.id)}
                    className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                      activeHeading === item.id
                        ? 'bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-medium'
                        : 'text-slate-600 dark:text-gray-400 hover:bg-slate-50 dark:hover:bg-gray-800'
                    }`}
                    style={{ wordBreak: 'break-word', overflowWrap: 'break-word', maxWidth: '100%' }}
                  >
                    <span className="inline-flex items-start gap-2 w-full">
                      <span className="text-xs text-slate-400 dark:text-gray-500 flex-shrink-0 mt-0.5">{index + 1}.</span>
                      <span className="flex-1 break-words hyphens-auto whitespace-normal">{item.text}</span>
                    </span>
                  </button>
                ))}
              </nav>
            </div>
          )}
        </div>

        {/* Share Buttons */}
        <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-3xl p-6 shadow-lg">
          <div className="flex items-center gap-4 mb-4">
            <Share2 className="w-5 h-5 text-slate-500 dark:text-gray-400" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Share this article</h3>
          </div>
          <div className="flex flex-wrap gap-4">
            <a
              href={`https://x.com/intent/tweet?text=${encodedTitle}&url=${encodeURIComponent(url)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-black hover:bg-gray-800 text-white font-medium rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              X
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

        {/* Related Tools Recommendation */}
        {relatedTools.length > 0 && (
          <div className="mt-12 bg-gradient-to-br from-emerald-50/50 to-teal-50/30 dark:from-gray-900 dark:to-emerald-900/10 border border-slate-200 dark:border-gray-800 rounded-3xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/25">
                <span className="text-white text-lg">🛠️</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Related Tools</h3>
                <p className="text-sm text-slate-500 dark:text-gray-400">AI tools mentioned or related to this article</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {relatedTools.map((tool) => {
                const getCategoryColor = (cat: string) => {
                  switch (cat) {
                    case 'Writing': return 'bg-blue-500';
                    case 'Image': return 'bg-violet-500';
                    case 'Video': return 'bg-indigo-500';
                    case 'Audio': return 'bg-pink-500';
                    case 'Code': return 'bg-orange-500';
                    case 'Productivity': return 'bg-teal-500';
                    default: return 'bg-slate-500';
                  }
                };
                return (
                  <Link
                    key={tool.id}
                    href={`/tool/${tool.slug}`}
                    className="group bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-xl p-4 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-out"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-9 h-9 rounded-lg ${getCategoryColor(tool.category)}/10 flex items-center justify-center text-sm font-bold`}>
                        {tool.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm text-slate-900 dark:text-white truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                          {tool.name}
                        </h4>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-xs text-slate-500 dark:text-gray-400">{tool.category}</span>
                          <span className="text-xs text-slate-400 dark:text-gray-500">·</span>
                          <span className="text-xs text-slate-500 dark:text-gray-400">{tool.pricing}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-gray-400 line-clamp-2">
                      {tool.description.slice(0, 100)}...
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Related Articles - Next Read Recommendations */}
        {relatedPosts.length > 0 && (
          <div className="mt-12 bg-gradient-to-br from-slate-50 to-indigo-50/30 dark:from-gray-900 dark:to-indigo-900/10 border border-slate-200 dark:border-gray-800 rounded-3xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
                <span className="text-white text-lg">📚</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Next Read</h3>
                <p className="text-sm text-slate-500 dark:text-gray-400">Continue exploring related content</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {relatedPosts.map((relatedPost) => {
                const postDate = new Date(relatedPost.date);
                const formattedDate = postDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                return (
                  <Link
                    key={relatedPost.id}
                    href={`/blog/${relatedPost.slug}`}
                    className="group bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-xl p-4 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-out"
                  >
                    {relatedPost.images?.[0] && (
                      <img
                        src={relatedPost.images[0].url}
                        alt={relatedPost.images[0].alt}
                        className="w-full h-32 object-cover rounded-lg mb-3"
                        loading="lazy"
                        decoding="async"
                      />
                    )}
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-500/20 px-2 py-0.5 rounded-full">
                        {relatedPost.category}
                      </span>
                      <span className="text-xs text-slate-400 dark:text-gray-500">{formattedDate}</span>
                    </div>
                    <h4 className="font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2 mb-2 text-sm">
                      {relatedPost.title}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-gray-400 line-clamp-2">
                      {relatedPost.description}
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
