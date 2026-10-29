import type { Metadata } from 'next';
import Link from 'next/link';
import { blogPosts } from '@/data/blog-posts';
import { Calendar, Tag, Sparkles, Rss } from 'lucide-react';
import {
  ArchiveCard,
  ArchivePager,
  POSTS_PER_PAGE,
  categoryColors,
  clampPage,
  formatDate,
  toArchivePost,
  type ArchivePost,
} from './ArchiveUI';

export const BLOG_META = {
  title: 'AI Tools Blog – Reviews, Comparisons & How-To Guides',
  description:
    'In-depth reviews, side-by-side comparisons, and practical guides for AI tools. Discover the best AI tools for writing, image generation, video creation, coding, and more.',
} as const;

/**
 * Metadata for one archive page.
 *
 * Every page self-canonicalises. The old build canonicalised `?page=2` back to
 * `/blog`, which is the right answer for a query-string duplicate but the wrong
 * one for a real, separately addressable page — and `/blog/page/2` is real now,
 * so it points at itself. The title carries the page number so the pages do not
 * compete with each other on an identical `<title>`.
 */
export function blogIndexMetadata(page: number): Metadata {
  const canonical =
    page <= 1 ? 'https://useaitools.me/blog' : `https://useaitools.me/blog/page/${page}`;
  const title = page <= 1 ? BLOG_META.title : `${BLOG_META.title} – Page ${page}`;

  return {
    title,
    description: BLOG_META.description,
    openGraph: {
      title,
      description: 'In-depth reviews, comparisons, and practical guides for AI tools. Updated weekly.',
      type: 'website',
      url: canonical,
      siteName: 'Use AI Tools',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: 'In-depth AI tool reviews and practical guides. Updated weekly.',
    },
    alternates: { canonical },
  };
}

/**
 * The blog archive, rendered entirely on the server.
 *
 * Two things are deliberate here and should not be "simplified" back:
 *
 * 1. The list is server-rendered with plain <Link> elements. It used to hand the
 *    post list to a client component that read `useSearchParams()`, which makes
 *    React defer the whole subtree: the HTML Google received was a loading
 *    skeleton with no links in it, and paging ran on `router.push()` so there
 *    were no anchors to follow either. That left most of the archive with no
 *    crawlable path in from anywhere.
 *
 * 2. The page number arrives as a prop, not from `searchParams`. Reading
 *    `searchParams` forces per-request rendering and a `no-store` response, so
 *    the CDN could not cache the archive at all. See `archivePageHref`.
 */
export function BlogIndexView({ page }: { page: number }) {
  const all: ArchivePost[] = blogPosts.map(toArchivePost);

  const categoryCounts = all.reduce<Record<string, number>>((acc, post) => {
    acc[post.category.slug] = (acc[post.category.slug] || 0) + 1;
    return acc;
  }, {});

  const totalPages = Math.max(1, Math.ceil(all.length / POSTS_PER_PAGE));
  const currentPage = clampPage(page, totalPages);

  const startIdx = (currentPage - 1) * POSTS_PER_PAGE;
  const pagePosts = all.slice(startIdx, startIdx + POSTS_PER_PAGE);

  const featuredPost = currentPage === 1 ? pagePosts[0] : null;
  const restPosts = featuredPost ? pagePosts.slice(1) : pagePosts;

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
    blogPost: pagePosts.map((post) => ({
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.excerpt,
      datePublished: post.publishedAt,
      dateModified: post.publishedAt,
      articleSection: post.category.name,
      author: { '@type': 'Person', name: 'xiaomo' },
      publisher: {
        '@type': 'Organization',
        name: 'Use AI Tools',
        logo: { '@type': 'ImageObject', url: 'https://useaitools.me/logo.png' },
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `https://useaitools.me/blog/${post.slug}`,
      },
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
        <div className="absolute -top-20 right-10 w-[400px] h-[400px] bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-4 py-14 sm:py-16">
          <div className="text-xs uppercase tracking-wider font-bold text-emerald-600 dark:text-emerald-400 mb-4">
            <Sparkles className="inline w-4 h-4 mr-1.5" />
            AI Tools Blog
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white mb-5 leading-tight">
            Reviews, comparisons, and practical guides
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed mb-6">
            Hands-on reviews and data-driven comparisons for AI tools across writing,
            image generation, video creation, code assistance, and productivity.
          </p>

          <div className="flex flex-wrap items-center gap-3 mb-8">
            <div className="inline-flex items-center gap-2 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 px-4 py-2 rounded-full shadow-sm">
              <span className="text-emerald-500 font-bold text-lg">{all.length}</span>
              <span className="text-sm text-slate-600 dark:text-slate-400">published articles</span>
            </div>
            <div className="inline-flex items-center gap-2 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 px-4 py-2 rounded-full shadow-sm">
              <Calendar className="w-4 h-4 text-slate-500" />
              <span className="text-sm text-slate-600 dark:text-slate-400">Updated weekly</span>
            </div>
            <Link
              href="/rss.xml"
              className="inline-flex items-center gap-2 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 px-4 py-2 rounded-full shadow-sm text-sm text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            >
              <Rss className="w-4 h-4 text-slate-500" />
              RSS feed
            </Link>
          </div>

          {/* Category filter as real links so each category page is crawlable. */}
          <nav aria-label="Filter by category" className="flex flex-wrap gap-2">
            <Link
              href="/blog"
              aria-current={currentPage === 1 ? 'page' : undefined}
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm border transition-colors shadow-sm ${
                currentPage === 1
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-transparent'
                  : 'bg-white dark:bg-gray-900 border-slate-200 dark:border-gray-800 text-slate-700 dark:text-slate-300 hover:text-emerald-600 hover:border-emerald-300 dark:hover:text-emerald-400'
              }`}
            >
              <span className="font-medium">All topics</span>
              <span className="opacity-70">({all.length})</span>
            </Link>
            {CATEGORY_CHIPS.map((cat) => {
              const slug = cat.name.toLowerCase();
              const count = categoryCounts[slug] || 0;
              if (count === 0) return null;
              return (
                <Link
                  key={cat.name}
                  href={`/blog/category/${slug}`}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm border transition-colors shadow-sm bg-white dark:bg-gray-900 border-slate-200 dark:border-gray-800 text-slate-700 dark:text-slate-300 hover:text-emerald-600 hover:border-emerald-300 dark:hover:text-emerald-400"
                >
                  <span>{cat.icon}</span>
                  <span className="font-medium">{cat.name}</span>
                  <span className="opacity-70">({count})</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Featured article */}
      {featuredPost && (
        <div className="max-w-6xl mx-auto px-4 pt-10 sm:pt-12">
          <div className="flex items-center gap-2 mb-4">
            <Tag className="w-4 h-4 text-emerald-500" />
            <span className="text-xs uppercase tracking-wider font-bold text-emerald-600 dark:text-emerald-400">
              Featured article
            </span>
          </div>

          <Link
            href={`/blog/${featuredPost.slug}`}
            className="block group bg-white dark:bg-gray-900 rounded-2xl border border-slate-200 dark:border-gray-800 shadow-sm hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-300 ease-out overflow-hidden"
          >
            <div className="p-8 sm:p-10">
              <div
                className={`inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider mb-4 ${categoryColors(featuredPost.category.slug).text}`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${categoryColors(featuredPost.category.slug).bar}`}
                />
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
                  {formatDate(featuredPost.publishedAt)}
                </span>
                <span className="inline-flex items-center gap-2 font-semibold text-emerald-600 dark:text-emerald-400 group-hover:gap-3 transition-all duration-300">
                  Read the full article →
                </span>
              </div>
            </div>
          </Link>
        </div>
      )}

      {/* Article grid */}
      <div className="max-w-6xl mx-auto px-4 py-10 sm:py-12">
        {restPosts.length > 0 && (
          <>
            <div className="flex items-baseline gap-3 mb-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                {currentPage === 1 ? 'Latest articles' : `Articles — page ${currentPage}`}
              </h2>
              <span className="text-sm text-slate-500 dark:text-slate-500">
                ({restPosts.length} on this page)
              </span>
            </div>

            <div className="grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {restPosts.map((post) => (
                <ArchiveCard key={post.id} post={post} />
              ))}
            </div>

            <ArchivePager
              current={currentPage}
              total={totalPages}
              totalPosts={all.length}
              base="/blog"
            />
          </>
        )}

        {all.length === 0 && (
          <div className="text-center py-24">
            <p className="text-slate-600 dark:text-slate-400 text-lg mb-3">
              No articles found.
            </p>
            <Link
              href="/blog"
              className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              ← Back to all articles
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

const CATEGORY_CHIPS = [
  { name: 'Writing', icon: '✍️' },
  { name: 'Image', icon: '🎨' },
  { name: 'Video', icon: '🎬' },
  { name: 'Audio', icon: '🎵' },
  { name: 'Code', icon: '💻' },
  { name: 'Productivity', icon: '⚡' },
];
