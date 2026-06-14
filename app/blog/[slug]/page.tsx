import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { blogPosts } from '@/data/blog-posts';
import type { BlogPost } from '@/types';
import toolsData from '@/data/tools.json';
import { prisma } from '@/lib/prisma';
import ClientBlogDetail from './ClientBlogDetail';
import EmailSubscribe from '@/app/components/EmailSubscribe';

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

function generateSlugFromName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

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

// Extract blog slugs from content for cross-linking
const extractBlogSlugs = (content: string): string[] => {
  const blogLinkRegex = /\[\[link:\/blog\/([^|\]]+)\|/g;
  const slugs: string[] = [];
  let match;
  while ((match = blogLinkRegex.exec(content)) !== null) {
    slugs.push(match[1]);
  }
  return [...new Set(slugs)];
};

// Enhanced related posts algorithm
const getRelatedPosts = (currentPost: BlogPost, allPosts: BlogPost[]): BlogPost[] => {
  const candidates = allPosts.filter(p => p.slug !== currentPost.slug);
  const currentToolIds = extractToolIds(currentPost.content);
  const currentLinkedSlugs = extractBlogSlugs(currentPost.content);
  
  const scoredPosts = candidates.map(post => {
    let score = 0;
    
    // Same category: +3 points
    if (post.category === currentPost.category) {
      score += 3;
    }
    
    // Linked in current post: +2 points (high cross-reference value)
    if (currentLinkedSlugs.includes(post.slug)) {
      score += 2;
    }
    
    // Cross-links to current post: +1.5 points
    const postLinkedSlugs = extractBlogSlugs(post.content);
    if (postLinkedSlugs.includes(currentPost.slug)) {
      score += 1.5;
    }
    
    // Common tools referenced: +1 point per shared tool
    const postToolIds = extractToolIds(post.content);
    const sharedTools = currentToolIds.filter(id => postToolIds.includes(id));
    score += sharedTools.length * 1;
    
    // Recency bonus: newer posts get slight boost
    const currentDate = new Date(currentPost.date);
    const postDate = new Date(post.date);
    const daysDiff = Math.abs(currentDate.getTime() - postDate.getTime()) / (1000 * 60 * 60 * 24);
    if (daysDiff < 30) score += 0.5;
    if (daysDiff < 7) score += 0.5;
    
    return { post, score };
  });
  
  // Sort by score descending, then by date descending for same scores
  scoredPosts.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return new Date(b.post.date).getTime() - new Date(a.post.date).getTime();
  });
  
  return scoredPosts.slice(0, 3).map(sp => sp.post);
};

function parseTags(tagsStr: string | null | undefined): string[] {
  if (!tagsStr) return [];
  try {
    const parsed = JSON.parse(tagsStr);
    if (Array.isArray(parsed)) {
      return parsed.filter((t): t is string => typeof t === 'string');
    }
    return [];
  } catch {
    return tagsStr.split(',').map((t) => t.trim()).filter(Boolean);
  }
}

function generateKeywords(title: string, category: string, tags: string[]): string[] {
  const keywords: string[] = [];
  if (tags.length > 0) {
    keywords.push(...tags);
  } else {
    const titleWords = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 3);
    keywords.push(...titleWords.slice(0, 5));
    if (category) keywords.push(category.toLowerCase());
  }
  return Array.from(new Set(keywords)).slice(0, 10);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  let postTitle = '';
  let postDescription = '';
  let postDatePublished: string | undefined;
  let postDateModified: string | undefined;
  let postTags: string[] = [];
  let postCategory = '';
  let postImage: string | undefined;
  let postImageAlt: string | undefined;
  let foundPost: BlogPost | null = null;
  let foundDb: any = null;

  try {
    foundDb = await prisma.blogPost.findFirst({
      where: { slug, isPublished: true },
    });
  } catch {
    foundDb = null;
  }

  if (foundDb) {
    postTitle = foundDb.metaTitle || foundDb.title;
    postDescription = foundDb.metaDescription || foundDb.excerpt;
    postDatePublished = foundDb.publishedAt
      ? new Date(foundDb.publishedAt).toISOString()
      : new Date(foundDb.createdAt).toISOString();
    postDateModified = new Date(foundDb.updatedAt).toISOString();
    postTags = parseTags(foundDb.tags);
    postCategory = foundDb.categoryId || '';
    postImage = foundDb.coverImage || undefined;
    postImageAlt = foundDb.coverImageAlt || undefined;
  } else {
    foundPost = blogPosts.find((p) => p.slug === slug) || null;
    if (!foundPost) {
      return {
        title: 'Blog Post Not Found',
      };
    }
    postTitle = foundPost.title;
    postDescription = foundPost.description;
    postDatePublished = foundPost.date;
    postDateModified = foundPost.date;
    postCategory = foundPost.category;
    postTags = [];
  }

  const finalTitle = `${postTitle} – Use AI Tools`;
  const keywords = generateKeywords(postTitle, postCategory, postTags);

  const metadata: Metadata = {
    title: finalTitle,
    description: postDescription,
    keywords,
    openGraph: {
      title: finalTitle,
      description: postDescription,
      siteName: 'Use AI Tools',
      type: 'article',
      url: `https://useaitools.me/blog/${slug}`,
      publishedTime: postDatePublished,
      modifiedTime: postDateModified,
      authors: ['Use AI Tools'],
      tags: postTags.length > 0 ? postTags : undefined,
      images: postImage
        ? [{ url: postImage, alt: postImageAlt || postTitle }]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: finalTitle,
      description: postDescription,
      images: postImage ? [postImage] : undefined,
    },
    alternates: {
      canonical: `https://useaitools.me/blog/${slug}`,
    },
  };

  return metadata;
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let effectivePost: BlogPost | null = null;
  let dbPost: any = null;

  try {
    dbPost = await prisma.blogPost.findFirst({
      where: { slug, isPublished: true },
    });
  } catch {
    dbPost = null;
  }

  let displayTitle = '';
  let displayDescription = '';
  let displayDate = '';
  let displayCategory = '';
  let displayContent = '';
  let displayTags: string[] = [];

  if (dbPost) {
    displayTitle = dbPost.metaTitle || dbPost.title;
    displayDescription = dbPost.metaDescription || dbPost.excerpt;
    displayDate = dbPost.publishedAt
      ? new Date(dbPost.publishedAt).toISOString().split('T')[0]
      : new Date(dbPost.createdAt).toISOString().split('T')[0];
    displayCategory = (dbPost as any).category?.name || dbPost.categoryId || '';
    displayContent = dbPost.content;
    displayTags = parseTags(dbPost.tags);

    effectivePost = {
      id: 0,
      title: displayTitle,
      slug,
      date: displayDate,
      description: displayDescription,
      category: displayCategory,
      images: [],
      content: displayContent,
    };
  } else {
    effectivePost = blogPosts.find((p) => p.slug === slug) || null;
    if (!effectivePost) {
      notFound();
    }
    displayTitle = effectivePost.title;
    displayDescription = effectivePost.description;
    displayDate = effectivePost.date;
    displayCategory = effectivePost.category;
    displayContent = effectivePost.content;
  }

  const post = effectivePost as BlogPost;

  const relatedPosts = getRelatedPosts(post, blogPosts);

  const getRelatedToolsForBlog = (blogPost: BlogPost): { id: number; name: string; slug: string; description: string; pricing: string; category: string }[] => {
    const blogCategory = blogPost.category?.toLowerCase() || '';
    const categoryMap: Record<string, string> = {
      'writing': 'Writing',
      'image': 'Image',
      'video': 'Video',
      'audio': 'Audio',
      'code': 'Code',
      'productivity': 'Productivity',
    };
    const matchedCategory = categoryMap[blogCategory] || '';
    const candidates = matchedCategory
      ? typedTools.filter(t => t.category === matchedCategory)
      : typedTools;
    const shuffled = [...candidates].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 5).map(t => ({
      id: t.id,
      name: t.name,
      slug: generateSlugFromName(t.name),
      description: t.description,
      pricing: t.pricing,
      category: t.category,
    }));
  };

  const relatedTools = getRelatedToolsForBlog(post);

  const processedPost = {
    ...post,
    title: displayTitle,
    description: displayDescription,
    date: displayDate,
    category: displayCategory,
    tags: displayTags,
    content: displayContent
      .replace(/\{\{AFFILIATE_RYTR\}\}/g, process.env.AFFILIATE_RYTR || 'https://rytr.me')
      .replace(/\{\{AFFILIATE_VEED\}\}/g, process.env.AFFILIATE_VEED || 'https://veed.io')
      .replace(/\{\{AFFILIATE_MURF\}\}/g, process.env.AFFILIATE_MURF || 'https://murf.ai')
      .replace(/\{\{AFFILIATE_PICTORY\}\}/g, process.env.AFFILIATE_PICTORY || 'https://pictory.ai')
      .replace(/\{\{AFFILIATE_ELEVENLABS\}\}/g, process.env.AFFILIATE_ELEVENLABS || 'https://elevenlabs.io'),
  };

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': 'Home',
        'item': 'https://useaitools.me',
      },
      {
        '@type': 'ListItem',
        'position': 2,
        'name': 'Blog',
        'item': 'https://useaitools.me/blog',
      },
      {
        '@type': 'ListItem',
        'position': 3,
        'name': displayTitle,
        'item': `https://useaitools.me/blog/${slug}`,
      },
    ],
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: displayTitle,
    description: displayDescription,
    datePublished: displayDate,
    dateModified: displayDate,
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ClientBlogDetail post={processedPost} slug={slug} relatedPosts={relatedPosts} relatedTools={relatedTools} />
      <EmailSubscribe source="blog-detail" />
    </>
  );
}
