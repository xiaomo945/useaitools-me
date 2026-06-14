import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { blogPosts, blogPostBySlug } from '@/data/blog-posts';
import type { BlogPost } from '@/types';
import toolsData from '@/data/tools.json';
import { prisma } from '@/lib/prisma';
import BlogDetailV2 from './BlogDetailV2';
import SponsoredSlot from '@/app/components/SponsoredSlot';

type Tool = {
  id: number;
  name: string;
  description: string;
  category: string;
  pricing: string;
  url: string;
  affiliate_link: string;
};

const typedTools = toolsData as Tool[];

// Generate reasonable keywords from title + category for SEO
const generateKeywords = (post: { title: string; category: string; description?: string }): string[] => {
  const base = [
    `${post.category.toLowerCase()} ai tools`,
    `best ${post.category.toLowerCase()} ai tools`,
    `ai ${post.category.toLowerCase()}`,
    `${post.category.toLowerCase()} tools comparison`,
    `${post.category.toLowerCase()} tools 2026`,
  ];
  const titleWords = (post.title || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w: string) => w.length >= 5)
    .slice(0, 6);
  return [...base, ...titleWords].slice(0, 10);
};

// Extract tool IDs from blog content for recommendation
const extractToolIds = (content: string): number[] => {
  const toolIdRegex = /\[\[link:\/tools\/(\d+)\|/g;
  const ids: number[] = [];
  let match;
  while ((match = toolIdRegex.exec(content)) !== null) {
    ids.push(parseInt(match[1]));
  }
  return [...new Set(ids)];
};

// Enhanced related posts algorithm
const getRelatedPosts = (currentPost: BlogPost, allPosts: BlogPost[]): BlogPost[] => {
  const candidates = allPosts.filter((p) => p.slug !== currentPost.slug);
  const currentToolIds = extractToolIds(currentPost.content);
  const currentLinkedSlugs: string[] = [];
  const blogLinkRegex = /\[\[link:\/blog\/([^|\]]+)\|/g;
  let bmatch;
  while ((bmatch = blogLinkRegex.exec(currentPost.content)) !== null) {
    currentLinkedSlugs.push(bmatch[1]);
  }

  const scoredPosts = candidates
    .map((post) => {
      let score = 0;
      if (post.category === currentPost.category) score += 3;
      if (currentLinkedSlugs.includes(post.slug)) score += 2;
      const postToolIds = extractToolIds(post.content);
      const sharedTools = currentToolIds.filter((id) => postToolIds.includes(id));
      score += sharedTools.length * 1;
      const postDate = new Date(post.date);
      const curDate = new Date(currentPost.date);
      const daysDiff = Math.abs(postDate.getTime() - curDate.getTime()) / (1000 * 60 * 60 * 24);
      if (daysDiff < 30) score += 0.5;
      return { post, score };
    })
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return new Date(b.post.date).getTime() - new Date(a.post.date).getTime();
    });

  return scoredPosts.slice(0, 3).map((sp) => sp.post);
};

export async function generateStaticParams() {
  return (blogPosts || []).map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPostBySlug(slug);
  if (!post) {
    return {
      title: 'Blog Post Not Found',
      robots: { index: false, follow: false },
    };
  }

  const keywords = generateKeywords(post);
  const cleanDescription = post.description || post.title;
  const fullUrl = `https://useaitools.me/blog/${slug}`;

  return {
    title: post.title,
    description: cleanDescription,
    keywords,
    authors: [{ name: 'Use AI Tools', url: 'https://useaitools.me' }],
    creator: 'Use AI Tools',
    publisher: 'Use AI Tools',
    category: post.category,
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large' },
    },
    alternates: { canonical: fullUrl },
    openGraph: {
      type: 'article',
      url: fullUrl,
      siteName: 'Use AI Tools',
      title: post.title,
      description: cleanDescription,
      locale: 'en_US',
      publishedTime: post.date,
      modifiedTime: post.date,
      authors: ['Use AI Tools'],
      tags: [post.category, ...keywords.slice(0, 3)],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: cleanDescription,
      site: '@useaitools',
      creator: '@useaitools',
    },
  };
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // 1) 主数据源：data/blog-posts.ts 中的 JSON
  const jsonPost = blogPostBySlug(slug);

  // 2) 回退：prisma blogPost
  let dbPost: any = null;
  try {
    dbPost = await prisma.blogPost.findFirst({
      where: { slug, isPublished: true },
      include: { category: true },
    });
  } catch (_) {
    dbPost = null;
  }

  // 3) 两个源都没有 → 404
  if (!jsonPost && !dbPost) {
    notFound();
  }

  const effectivePost: BlogPost = (jsonPost as BlogPost) || {
    id: parseInt(dbPost.id),
    title: dbPost.title,
    slug: dbPost.slug,
    date: dbPost.publishedAt ? new Date(dbPost.publishedAt).toISOString().slice(0, 10) : dbPost.createdAt,
    description: dbPost.metaDescription || dbPost.excerpt || dbPost.title,
    category: dbPost.category?.name || dbPost.categoryId || 'General',
    author: 'Use AI Tools',
    reading_time: '5 min read',
    images: [],
    content: dbPost.content,
  };

  const relatedPosts = getRelatedPosts(effectivePost, blogPosts as BlogPost[]);

  const relatedTools: {
    id: number;
    name: string;
    slug: string;
    description: string;
    pricing: string;
    category: string;
  }[] = (() => {
    const toolIds = extractToolIds(effectivePost.content);
    if (toolIds.length > 0) {
      const byId = typedTools.filter((t) => toolIds.includes(t.id));
      if (byId.length > 0) {
        return byId.slice(0, 5).map((t) => ({
          id: t.id,
          name: t.name,
          slug: String(t.id),
          description: t.description,
          pricing: t.pricing,
          category: t.category,
        }));
      }
    }
    // 按分类回退
    const categoryMap: Record<string, string> = {
      writing: 'Writing',
      image: 'Image',
      video: 'Video',
      audio: 'Audio',
      code: 'Code',
      productivity: 'Productivity',
    };
    const matchedCategory = categoryMap[effectivePost.category.toLowerCase()] || '';
    const candidates = matchedCategory
      ? typedTools.filter((t) => t.category === matchedCategory)
      : typedTools;
    const shuffled = [...candidates].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 5).map((t) => ({
      id: t.id,
      name: t.name,
      slug: String(t.id),
      description: t.description,
      pricing: t.pricing,
      category: t.category,
    }));
  })();

  const processedPost: BlogPost & { faq_schema?: any } = {
    ...effectivePost,
    content: effectivePost.content
      .replace(/\{\{AFFILIATE_RYTR\}\}/g, process.env.AFFILIATE_RYTR || 'https://rytr.me')
      .replace(/\{\{AFFILIATE_VEED\}\}/g, process.env.AFFILIATE_VEED || 'https://veed.io')
      .replace(/\{\{AFFILIATE_MURF\}\}/g, process.env.AFFILIATE_MURF || 'https://murf.ai')
      .replace(/\{\{AFFILIATE_PICTORY\}\}/g, process.env.AFFILIATE_PICTORY || 'https://pictory.ai')
      .replace(
        /\{\{AFFILIATE_ELEVENLABS\}\}/g,
        process.env.AFFILIATE_ELEVENLABS || 'https://elevenlabs.io',
      ),
    faq_schema: (jsonPost as any)?.faq_schema,
  };

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://useaitools.me' },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://useaitools.me/blog' },
      {
        '@type': 'ListItem',
        position: 3,
        name: processedPost.title,
        item: `https://useaitools.me/blog/${slug}`,
      },
    ],
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: processedPost.title,
    description: processedPost.description,
    datePublished: processedPost.date,
    dateModified: processedPost.date,
    author: { '@type': 'Organization', name: 'Use AI Tools' },
    publisher: {
      '@type': 'Organization',
      name: 'Use AI Tools',
      logo: { '@type': 'ImageObject', url: 'https://useaitools.me/logo.png' },
    },
    url: `https://useaitools.me/blog/${slug}`,
  };

  // FAQ schema（如果文章提供 faq_schema）
  const faqLd = processedPost.faq_schema?.mainEntity?.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: processedPost.faq_schema.mainEntity,
      }
    : null;

  return (
    <>
      {/* Breadcrumb Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      {/* Article Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* FAQ Schema (if present) */}
      {faqLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
        />
      )}
      {/* Article Content */}
      <BlogDetailV2 post={processedPost} slug={slug} relatedPosts={relatedPosts} relatedTools={relatedTools} />
      {/* Sponsored Slot */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <SponsoredSlot slotName="blog-bottom" />
      </div>
    </>
  );
}
