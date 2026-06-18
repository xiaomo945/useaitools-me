import type { Metadata } from 'next';
import Link from 'next/link';
import { blogPosts } from '@/data/blog-posts';
import BlogListClient from './BlogListClient';
import { Calendar, Tag, Sparkles, Rss } from 'lucide-react';

export const metadata: Metadata = {
  title: 'AI Tools Blog – Reviews, Comparisons & How-To Guides',
  description:
    'In-depth reviews, side-by-side comparisons, and practical guides for AI tools. Discover the best AI tools for writing, image generation, video creation, coding, and more.',
  keywords: [
    'AI tools blog',
    'AI tool reviews',
    'AI tool comparisons',
    'best AI tools',
    'AI how-to guides',
    'AI writing tools',
    'AI image generators',
    'AI video tools',
  ],
  openGraph: {
    title: 'AI Tools Blog – Reviews, Comparisons & How-To Guides',
    description:
      'In-depth reviews, comparisons, and practical guides for AI tools. Updated weekly.',
    type: 'website',
    url: 'https://useaitools.me/blog',
    siteName: 'Use AI Tools',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Tools Blog – Reviews, Comparisons & How-To Guides',
    description: 'In-depth AI tool reviews and practical guides. Updated weekly.',
  },
  alternates: { canonical: 'https://useaitools.me/blog' },
};

const CATEGORY_STATS = [
  { name: 'Writing', icon: '✍️', color: 'from-blue-500 to-blue-600' },
  { name: 'Image', icon: '🎨', color: 'from-violet-500 to-violet-600' },
  { name: 'Video', icon: '🎬', color: 'from-indigo-500 to-indigo-600' },
  { name: 'Audio', icon: '🎵', color: 'from-pink-500 to-pink-600' },
  { name: 'Code', icon: '💻', color: 'from-orange-500 to-orange-600' },
  { name: 'Productivity', icon: '⚡', color: 'from-teal-500 to-teal-600' },
];

export default function BlogPage() {
  const totalPosts = blogPosts.length;

  const clientPosts = blogPosts.map((post) => ({
    id: String(post.id),
    title: post.title,
    slug: post.slug,
    excerpt: post.description,
    publishedAt: post.date,
    category: {
      name: post.category,
      slug: post.category.toLowerCase(),
    },
  }));

  const categoryCounts = clientPosts.reduce<Record<string, number>>((acc, post) => {
    const slug = post.category.slug;
    acc[slug] = (acc[slug] || 0) + 1;
    return acc;
  }, {});

  const featuredPost = clientPosts[0];
  const restPosts = clientPosts.slice(1);

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://useaitools.me' },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://useaitools.me/blog' },
    ],
  };

  const blogLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Use AI Tools Blog',
    description:
      'In-depth reviews, comparisons, and practical guides for AI tools across Writing, Image, Video, Audio, Code, and Productivity categories.',
    url: 'https://useaitools.me/blog',
    blogPost: clientPosts.slice(0, 20).map((post) => ({
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.excerpt,
      datePublished: post.publishedAt,
      dateModified: post.publishedAt,
      articleSection: post.category.name,
      author: {
        '@type': 'Person',
        name: 'xiaomo',
      },
      publisher: {
        '@type': 'Organization',
        name: 'Use AI Tools',
        logo: { '@type': 'ImageObject', url: 'https://useaitools.me/logo.png' },
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `https://useaitools.me/blog/${post.slug}`,
      },
      keywords: `${post.category.name} AI tools, best ${post.category.name.toLowerCase()} AI tools`,
    })),
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogLd) }}
      />

      {/* Hero */}
      <div className="relative overflow-hidden border-b border-slate-200 dark:border-gray-800 bg-gradient-to-br from-white via-white to-slate-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <div className="absolute -top-40 left-1/3 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-20 right-10 w-[400px] h-[400px] bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-4 py-14 sm:py-16">
          <div className="text-xs uppercase tracking-wider font-bold text-emerald-600 dark:text-emerald-400 mb-4">
            <Sparkles className="inline w-4 h-4 mr-1.5" />
            AI Tools Blog
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white mb-5 leading-tight">
            Reviews, comparisons, and practical guides
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed mb-6">
            Hands-on reviews and data-driven comparisons for AI tools across writing, image generation, video creation, code assistance, and productivity.
          </p>

          <div className="flex flex-wrap items-center gap-3 mb-8">
            <div className="inline-flex items-center gap-2 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 px-4 py-2 rounded-full shadow-sm">
              <span className="text-emerald-500 font-bold text-lg">{totalPosts}</span>
              <span className="text-sm text-slate-600 dark:text-slate-400">published articles</span>
            </div>
            <div className="inline-flex items-center gap-2 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 px-4 py-2 rounded-full shadow-sm">
              <Calendar className="w-4 h-4 text-slate-500" />
              <span className="text-sm text-slate-600 dark:text-slate-400">Updated weekly</span>
            </div>
            <div className="inline-flex items-center gap-2 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 px-4 py-2 rounded-full shadow-sm">
              <Rss className="w-4 h-4 text-slate-500" />
              <span className="text-sm text-slate-600 dark:text-slate-400">Follow RSS feed</span>
            </div>
          </div>

          {/* Category chips */}
          <div className="flex flex-wrap gap-2">
            {CATEGORY_STATS.map((cat) => {
              const count = categoryCounts[cat.name.toLowerCase()] || 0;
              if (count === 0) return null;
              return (
                <Link
                  key={cat.name}
                  href={`/blog/category/${cat.name.toLowerCase()}`}
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-full text-sm text-slate-700 dark:text-slate-300 hover:text-emerald-600 hover:border-emerald-300 dark:hover:text-emerald-400 transition-colors shadow-sm"
                >
                  <span>{cat.icon}</span>
                  <span className="font-medium">{cat.name}</span>
                  <span className="text-slate-400">({count})</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Featured Article */}
      {featuredPost && (
        <div className="max-w-6xl mx-auto px-4 pt-10 sm:pt-12">
          <div className="flex items-center gap-2 mb-4">
            <Tag className="w-4 h-4 text-emerald-500" />
            <span className="text-xs uppercase tracking-wider font-bold text-emerald-600 dark:text-emerald-400">Featured Article</span>
          </div>

          <Link
            href={`/blog/${featuredPost.slug}`}
            className="block group bg-white dark:bg-gray-900 rounded-2xl border border-slate-200 dark:border-gray-800 shadow-sm hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-300 ease-out overflow-hidden"
          >
            <div className="p-8 sm:p-10">
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-4">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                {featuredPost.category.name}
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-4 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors leading-tight">
                {featuredPost.title}
              </h2>

              <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                {featuredPost.excerpt}
              </p>

              <div className="flex items-center gap-4 text-sm text-slate-500">
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  {featuredPost.publishedAt}
                </span>
                <span className="inline-flex items-center gap-2 font-semibold text-emerald-600 dark:text-emerald-400 group-hover:gap-3 transition-all duration-300">
                  Read the full article →
                </span>
              </div>
            </div>
          </Link>
        </div>
      )}

      {/* Rest of articles */}
      {restPosts.length > 0 && (
        <div className="max-w-6xl mx-auto px-4 py-10 sm:py-12">
          <div className="flex items-baseline gap-3 mb-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Latest articles</h2>
            <span className="text-sm text-slate-500 dark:text-slate-500">
              ({restPosts.length} more)
            </span>
          </div>
          <BlogListClient posts={restPosts} />
        </div>
      )}
    </div>
  );
}
