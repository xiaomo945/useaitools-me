import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import BlogListClient from './BlogListClient';
import EmailSubscribe from '@/app/components/EmailSubscribe';

export const metadata: Metadata = {
  title: 'Best AI Tools Blog 2026 – Reviews, Comparisons & Guides',
  description:
    'In-depth AI tool reviews, side-by-side comparisons, and practical guides. Updated weekly with expert insights.',
  openGraph: {
    title: 'Best AI Tools Blog 2026 – Reviews, Comparisons & Guides',
    description:
      'In-depth AI tool reviews, side-by-side comparisons, and practical guides. Updated weekly with expert insights.',
    siteName: 'Use AI Tools',
    type: 'website',
    url: 'https://useaitools.me/blog',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Best AI Tools Blog 2026 – Reviews, Comparisons & Guides',
    description:
      'In-depth AI tool reviews, side-by-side comparisons, and practical guides. Updated weekly with expert insights.',
  },
  alternates: {
    canonical: 'https://useaitools.me/blog',
  },
};

interface ClientPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  publishedAt: string;
  category: {
    name: string;
    slug: string;
  };
}

export default async function BlogPage() {
  const rawPosts = await prisma.blogPost
    .findMany({
      where: { isPublished: true },
      orderBy: { publishedAt: 'desc' },
      include: { category: true },
    })
    .catch(() => []);

  const posts: ClientPost[] = rawPosts
    .filter((post: any) => post.publishedAt)
    .map((post: any) => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      publishedAt: post.publishedAt!.toISOString(),
      category: {
        name: post.category.name,
        slug: post.category.slug,
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
    blogPost: posts.slice(0, 10).map((post: any) => ({
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
