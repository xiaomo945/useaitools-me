import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { blogPosts } from '@/data/blog-posts';
import type { BlogPost } from '@/types';
import toolsData from '@/data/tools.json';
import ClientBlogDetail from './ClientBlogDetail';

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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    return {
      title: 'Blog Post Not Found',
    };
  }

  // Use canonical_slug if it exists (for duplicate posts), otherwise use current slug
  const canonicalSlug = post.canonical_slug || slug;
  
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
      locale: 'en_US',
      alternateLocale: 'zh_CN',
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
    },
    alternates: {
      canonical: `https://useaitools.me/blog/${canonicalSlug}`,
      languages: {
        'en': `/blog/${slug}`,
        'zh': `/blog/${slug}?lang=zh`,
      },
    },
  };
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

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
    content: post.content
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
        'name': post.title,
        'item': `https://useaitools.me/blog/${slug}`,
      },
    ],
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    image: post.images && post.images.length > 0 ? post.images[0].url : 'https://useaitools.me/logo.png',
    datePublished: post.date,
    dateModified: post.date,
    author: {
      '@type': 'Person',
      name: post.author || 'xiaomo',
      url: 'https://useaitools.me/about',
      jobTitle: 'Indie Maker',
      worksFor: {
        '@type': 'Organization',
        name: 'Use AI Tools'
      }
    },
    publisher: {
      '@type': 'Organization',
      name: 'Use AI Tools',
      logo: {
        '@type': 'ImageObject',
        url: 'https://useaitools.me/logo.png',
        width: 200,
        height: 200
      }
    },
    url: `https://useaitools.me/blog/${slug}`,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://useaitools.me/blog/${slug}`
    },
    keywords: `${post.category}, AI tools, ${post.category.toLowerCase()} tools, best AI tools 2026`,
    inLanguage: 'en',
    copyrightHolder: {
      '@type': 'Organization',
      name: 'Use AI Tools'
    },
    copyrightYear: new Date(post.date).getFullYear()
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
    </>
  );
}
