import type { Metadata } from 'next';
import Link from 'next/link';
import { blogPosts } from '@/data/blog-posts';
import { ArrowLeft } from 'lucide-react';
import {
  ArchiveCard,
  ArchivePager,
  POSTS_PER_PAGE,
  clampPage,
  toArchivePost,
} from '../../ArchiveUI';

const CATEGORY_META: Record<
  string,
  { title: string; description: string; icon: string }
> = {
  writing: {
    title: 'AI Writing Tools Blog – Reviews & Comparisons',
    description:
      'In-depth reviews, comparisons, and practical guides for AI writing tools. Discover the best AI writers, copywriting assistants, and content generators.',
    icon: '✍️',
  },
  image: {
    title: 'AI Image Generation Blog – Reviews & Tutorials',
    description:
      'Expert reviews and practical guides for AI image generators. Compare Midjourney, DALL-E, Stable Diffusion, and more. Updated weekly.',
    icon: '🎨',
  },
  video: {
    title: 'AI Video Tools Blog – Reviews & Creation Guides',
    description:
      'Everything you need to know about AI video generation and editing tools. Reviews of Runway, Pika, Sora, and practical how-to guides.',
    icon: '🎬',
  },
  audio: {
    title: 'AI Audio & Music Blog – Reviews & Tools',
    description:
      'Reviews and guides for AI audio tools: text-to-speech, voice cloning, AI music generators, podcast tools, and speech-to-text solutions.',
    icon: '🎵',
  },
  code: {
    title: 'AI Coding Tools Blog – Reviews & Tutorials',
    description:
      'Stay ahead with reviews of AI coding assistants like GitHub Copilot, Cursor, CodeLlama, and SWE-bench leaders. Learn how developers work with AI.',
    icon: '💻',
  },
  productivity: {
    title: 'AI Productivity Blog – Work Smarter with AI',
    description:
      'Practical guides and reviews for AI productivity tools. Learn how to use Notion AI, Mem, task managers, and AI assistants to boost output.',
    icon: '⚡',
  },
};

export async function generateStaticParams() {
  const slugs = Array.from(new Set(blogPosts.map((p) => p.category.toLowerCase())));
  return slugs.map((slug) => ({ slug }));
}

// Without this, /blog/category/<anything> falls back to a generic shell and
// answers 200 with an empty list — an infinite soft-404 surface for crawlers.
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const meta = CATEGORY_META[slug] || {
    title: `${slug} AI Tools Blog – Reviews & Guides`,
    description: 'AI tool reviews, comparisons, and how-to guides for this category.',
    icon: '📖',
  };

  return {
    title: meta.title,
    description: meta.description,
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: `https://useaitools.me/blog/category/${slug}`,
      type: 'website',
      siteName: 'Use AI Tools',
    },
    alternates: { canonical: `https://useaitools.me/blog/category/${slug}` },
  };
}

/**
 * Category archive — server-rendered, same as /blog.
 *
 * This page also delegated to BlogListClient, whose `useSearchParams()` call
 * deferred the entire article list out of the server HTML: the response was a
 * skeleton containing zero links to individual posts. Every category page was
 * therefore a crawl dead end, and its posts could only be found through the
 * sitemap.
 */
export default async function BlogCategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ page?: string }>;
}) {
  const { slug } = await params;
  // searchParams is a Promise in Next 15 — awaiting it is what makes `?page=2`
  // actually page the archive instead of re-serving page 1.
  const sp = (searchParams ? await searchParams : {}) as { page?: string };
  const meta = CATEGORY_META[slug] || {
    title: `${slug} articles`,
    icon: '📖',
    description: '',
  };

  const filteredPosts = blogPosts
    .filter((post) => post.category.toLowerCase() === slug)
    .map(toArchivePost);

  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / POSTS_PER_PAGE));
  const currentPage = clampPage(sp.page ? Number(sp.page) : 1, totalPages);

  const startIdx = (currentPage - 1) * POSTS_PER_PAGE;
  const pagePosts = filteredPosts.slice(startIdx, startIdx + POSTS_PER_PAGE);

  const categoryName =
    filteredPosts[0]?.category.name ||
    slug.charAt(0).toUpperCase() + slug.slice(1);

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://useaitools.me' },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://useaitools.me/blog' },
      {
        '@type': 'ListItem',
        position: 3,
        name: meta.title,
        item: `https://useaitools.me/blog/category/${slug}`,
      },
    ],
  };

  const collectionLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: meta.title,
    description: meta.description,
    url: `https://useaitools.me/blog/category/${slug}`,
    publisher: {
      '@type': 'Organization',
      name: 'Use AI Tools',
      logo: { '@type': 'ImageObject', url: 'https://useaitools.me/logo.png' },
    },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: pagePosts.length,
      itemListElement: pagePosts.map((post, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `https://useaitools.me/blog/${post.slug}`,
        name: post.title,
      })),
    },
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionLd) }}
      />

      {/* Category header */}
      <div className="relative overflow-hidden border-b border-slate-200 dark:border-gray-800 bg-gradient-to-br from-white via-white to-slate-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <div className="absolute -top-40 left-1/3 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-4 py-14 sm:py-16">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to all articles
          </Link>

          <div className="flex items-start gap-4">
            <div className="text-5xl sm:text-6xl">{meta.icon}</div>
            <div className="flex-1">
              <div className="text-xs uppercase tracking-wider font-bold text-emerald-600 dark:text-emerald-400 mb-2">
                Category
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white mb-4 leading-tight">
                {categoryName}
              </h1>
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
                {meta.description}
              </p>

              <div className="mt-6 inline-flex items-center gap-2 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-600 dark:text-slate-300 shadow-sm">
                <span className="text-emerald-500">{filteredPosts.length}</span>
                <span>articles in this category</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Articles */}
      <div className="max-w-6xl mx-auto px-4 py-10 sm:py-12">
        {pagePosts.length > 0 ? (
          <>
            <div className="flex items-baseline gap-3 mb-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                {currentPage === 1 ? 'All articles' : `Articles — page ${currentPage}`}
              </h2>
              <span className="text-sm text-slate-500 dark:text-slate-500">
                ({pagePosts.length} on this page)
              </span>
            </div>

            <div className="grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {pagePosts.map((post) => (
                <ArchiveCard key={post.id} post={post} />
              ))}
            </div>

            <ArchivePager
              current={currentPage}
              total={totalPages}
              totalPosts={filteredPosts.length}
              category={null}
              base={`/blog/category/${slug}`}
            />
          </>
        ) : (
          <div className="text-center py-20">
            <p className="text-slate-600 dark:text-slate-400 text-lg mb-4">
              No articles in this category yet.
            </p>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              ← Browse all categories
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
