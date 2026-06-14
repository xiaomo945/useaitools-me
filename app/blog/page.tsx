import type { Metadata } from 'next';
import { blogPosts } from '@/data/blog-posts';
import BlogListClient from './BlogListClient';
import EmailSubscribe from '@/app/components/EmailSubscribe';

export const metadata: Metadata = {
  title: 'Best AI Tools Blog 2026 – Reviews, Comparisons & Guides',
  description:
    'In-depth AI tool reviews, side-by-side comparisons, and practical guides. Updated weekly with expert insights.',
  keywords: [
    'AI tools blog',
    'best AI tools 2026',
    'AI writing tools review',
    'AI image generator comparison',
    'AI video tools guide',
    'AI coding assistant review',
    'AI productivity tools',
    'AI audio tools comparison',
    'text to speech tools',
    'AI content creation tools',
    'AI tool comparison',
    'best AI tools for writing',
    'AI tool reviews',
    'AI tools guide',
  ],
  authors: [{ name: 'Use AI Tools', url: 'https://useaitools.me' }],
  creator: 'Use AI Tools',
  publisher: 'Use AI Tools',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large' },
  },
  openGraph: {
    title: 'Best AI Tools Blog 2026 – Reviews, Comparisons & Guides',
    description:
      'In-depth AI tool reviews, side-by-side comparisons, and practical guides. Updated weekly with expert insights.',
    siteName: 'Use AI Tools',
    type: 'website',
    url: 'https://useaitools.me/blog',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Best AI Tools Blog 2026 – Reviews, Comparisons & Guides',
    description:
      'In-depth AI tool reviews, side-by-side comparisons, and practical guides. Updated weekly with expert insights.',
    site: '@useaitools',
    creator: '@useaitools',
  },
  alternates: {
    canonical: 'https://useaitools.me/blog',
  },
};

export default async function BlogPage() {
  const allPosts = blogPosts || [];

  const posts = allPosts.map((post) => ({
    id: String(post.id || Math.floor(Math.random() * 1_000_000)),
    title: post.title,
    slug: post.slug,
    excerpt: post.description || post.content.replace(/<[^>]+>/g, '').slice(0, 160) + '...',
    publishedAt: post.date,
    category: {
      name: post.category,
      slug: post.category.toLowerCase(),
    },
  }));

  const blogLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Best AI Tools Blog 2026',
    description:
      'In-depth AI tool reviews, side-by-side comparisons, and practical guides. Updated weekly with expert insights.',
    url: 'https://useaitools.me/blog',
    publisher: {
      '@type': 'Organization',
      name: 'Use AI Tools',
      logo: {
        '@type': 'ImageObject',
        url: 'https://useaitools.me/logo.png',
      },
    },
    blogPost: posts.slice(0, 10).map((post) => ({
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.excerpt,
      datePublished: post.publishedAt,
      dateModified: post.publishedAt,
      articleSection: post.category.name,
      author: {
        '@type': 'Organization',
        name: 'Use AI Tools',
      },
      publisher: {
        '@type': 'Organization',
        name: 'Use AI Tools',
        logo: {
          '@type': 'ImageObject',
          url: 'https://useaitools.me/logo.png',
        },
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `https://useaitools.me/blog/${post.slug}`,
      },
      url: `https://useaitools.me/blog/${post.slug}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogLd) }}
      />
      <BlogListClient posts={posts} />
      <EmailSubscribe source="blog-list" />
    </>
  );
}
