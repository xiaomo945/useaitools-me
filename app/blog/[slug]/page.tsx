import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import blogIndex from '@/data/blog-index.json';
import fs from 'fs/promises';
import path from 'path';
import ClientBlogDetail from './ClientBlogDetail';

// Get the full blog post by slug
async function getBlogPostBySlug(slug: string) {
  // Find the post in index first to get the id
  const indexEntry = blogIndex.find((p) => p.slug === slug);
  
  if (!indexEntry) {
    return null;
  }
  
  // Read the full post file
  const filePath = path.join(process.cwd(), 'data', 'blog-posts', `${indexEntry.id}.json`);
  try {
    const content = await fs.readFile(filePath, 'utf8');
    return JSON.parse(content);
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    return {
      title: 'Blog Post Not Found',
    };
  }

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      siteName: 'Use AI Tools',
      type: 'article',
      url: `https://useaitools.me/blog/${slug}`,
      publishedTime: post.date,
      modifiedTime: post.date,
      authors: ['Use AI Tools'],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
    },
  };
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = blogIndex
    .filter((p) => p.slug !== slug && p.category === post.category)
    .slice(0, 3);

  const processedPost = {
    ...post,
    content: post.content
      .replace(/\{\{AFFILIATE_RYTR\}\}/g, process.env.AFFILIATE_RYTR || 'https://rytr.me')
      .replace(/\{\{AFFILIATE_VEED\}\}/g, process.env.AFFILIATE_VEED || 'https://veed.io')
      .replace(/\{\{AFFILIATE_MURF\}\}/g, process.env.AFFILIATE_MURF || 'https://murf.ai')
      .replace(/\{\{AFFILIATE_PICTORY\}\}/g, process.env.AFFILIATE_PICTORY || 'https://pictory.ai')
      .replace(/\{\{AFFILIATE_ELEVENLABS\}\}/g, process.env.AFFILIATE_ELEVENLABS || 'https://elevenlabs.io'),
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
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
    url: `https://useaitools.me/blog/${slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ClientBlogDetail post={processedPost} slug={slug} relatedPosts={relatedPosts} />
    </>
  );
}
