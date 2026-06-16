import type { Metadata } from 'next';
import Link from 'next/link';
import { blogPosts } from '@/data/blog-posts';
import BlogListClient from '../../BlogListClient';
import { ArrowLeft } from 'lucide-react';

const CATEGORY_META: Record<
  string,
  { title: string; description: string; keywords: string[]; icon: string }
> = {
  writing: {
    title: 'AI Writing Tools Blog – Reviews & Comparisons',
    description:
      'In-depth reviews, comparisons, and practical guides for AI writing tools. Discover the best AI writers, copywriting assistants, and content generators.',
    keywords: ['AI writing tools', 'best AI writers', 'copywriting AI', 'content generators', 'AI blog writing'],
    icon: '✍️',
  },
  image: {
    title: 'AI Image Generation Blog – Reviews & Tutorials',
    description:
      'Expert reviews and practical guides for AI image generators. Compare Midjourney, DALL-E, Stable Diffusion, and more. Updated weekly.',
    keywords: ['AI image generator', 'Midjourney', 'DALL-E', 'Stable Diffusion', 'AI art tools'],
    icon: '🎨',
  },
  video: {
    title: 'AI Video Tools Blog – Reviews & Creation Guides',
    description:
      'Everything you need to know about AI video generation and editing tools. Reviews of Runway, Pika, Sora, and practical how-to guides.',
    keywords: ['AI video generator', 'text-to-video', 'Runway ML', 'Pika Labs', 'AI video editing'],
    icon: '🎬',
  },
  audio: {
    title: 'AI Audio & Music Blog – Reviews & Tools',
    description:
      'Reviews and guides for AI audio tools: text-to-speech, voice cloning, AI music generators, podcast tools, and speech-to-text solutions.',
    keywords: ['AI audio tools', 'text to speech', 'AI music generator', 'ElevenLabs', 'Suno AI'],
    icon: '🎵',
  },
  code: {
    title: 'AI Coding Tools Blog – Reviews & Tutorials',
    description:
      'Stay ahead with reviews of AI coding assistants like GitHub Copilot, Cursor, CodeLlama, and SWE-bench leaders. Learn how developers work with AI.',
    keywords: ['AI coding assistant', 'GitHub Copilot', 'Cursor IDE', 'Code generation', 'AI for developers'],
    icon: '💻',
  },
  productivity: {
    title: 'AI Productivity Blog – Work Smarter with AI',
    description:
      'Practical guides and reviews for AI productivity tools. Learn how to use Notion AI, Mem, task managers, and AI assistants to boost output.',
    keywords: ['AI productivity tools', 'Notion AI', 'AI assistants', 'automation', 'AI for work'],
    icon: '⚡',
  },
};

export async function generateStaticParams() {
  const slugs = Array.from(new Set(blogPosts.map((p) => p.category.toLowerCase())));
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const meta = CATEGORY_META[slug] || {
    title: `${slug} AI Tools Blog – Reviews & Guides`,
    description: 'AI tool reviews, comparisons, and how-to guides for this category.',
    keywords: [],
    icon: '📖',
  };

  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
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

export default async function BlogCategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const meta = CATEGORY_META[slug] || {
    title: `${slug} articles`,
    icon: '📖',
    description: '',
    keywords: [],
  };

  const filteredPosts = blogPosts.filter(
    (post) => post.category.toLowerCase() === slug,
  );

  const clientPosts = filteredPosts.map((post, index) => ({
    id: String(post.id || `post-${index}`),
    title: post.title,
    slug: post.slug,
    excerpt:
      post.description ||
      post.content.replace(/<[^>]+>/g, '').slice(0, 160) + '...',
    publishedAt: post.date,
    category: {
      name: post.category,
      slug: post.category.toLowerCase(),
    },
  }));

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
                {clientPosts[0]?.category.name || slug.charAt(0).toUpperCase() + slug.slice(1)}
              </h1>
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
                {meta.description}
              </p>

              <div className="mt-6 inline-flex items-center gap-2 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-600 dark:text-slate-300 shadow-sm">
                <span className="text-emerald-500">{clientPosts.length}</span>
                <span>articles in this category</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Articles */}
      <div className="max-w-6xl mx-auto px-4 py-10 sm:py-12">
        {clientPosts.length > 0 ? (
          <BlogListClient posts={clientPosts} />
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
