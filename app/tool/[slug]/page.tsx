import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { blogPosts } from '@/data/blog-posts';
import ToolSlugClient from './ToolSlugClient';

type Tool = {
  id: number;
  name: string;
  description: string;
  description_en?: string;
  category: 'Writing' | 'Image' | 'Productivity' | 'Code' | 'Audio' | 'Video';
  pricing: string;
  url: string;
  affiliate_link: string;
  icon_url: string;
  examples?: { prompt: string; image_url: string }[];
  needs_vpn: boolean;
  languages: string[];
  rating?: number;
  rating_count?: number;
  rating_breakdown?: {
    ease_of_use: { score: number; note: string };
    output_quality: { score: number; note: string };
    features: { score: number; note: string };
    value_for_money: { score: number; note: string };
    stability: { score: number; note: string };
    support: { score: number; note: string };
  };
  use_cases?: { title: string; detail: string }[];
  pros_cons?: { pros: string[]; cons: string[] };
  skill_level?: 'beginner' | 'intermediate' | 'advanced';
  best_for?: string[];
};

export function generateSlugFromName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function getAffiliateLink(tool: any): string {
  const envVarName = `AFFILIATE_${tool.name.toUpperCase().replace(/\s+/g, '_')}`;
  let shortEnvVarName = '';
  if (tool.name.includes('Rytr')) shortEnvVarName = 'AFFILIATE_RYTR';
  else if (tool.name.includes('VEED')) shortEnvVarName = 'AFFILIATE_VEED';
  else if (tool.name.includes('Murf')) shortEnvVarName = 'AFFILIATE_MURF';
  else if (tool.name.includes('Pictory')) shortEnvVarName = 'AFFILIATE_PICTORY';
  else if (tool.name.includes('Grammarly')) shortEnvVarName = 'AFFILIATE_GRAMMARLY';
  const envLink = (shortEnvVarName && process.env[shortEnvVarName]) || process.env[envVarName];
  return envLink || tool.affiliateUrl || '';
}

async function findToolBySlug(slug: string): Promise<Tool | null> {
  const dbTool = await prisma.tool.findFirst({
    where: {
      slug,
      isActive: true,
    },
  });

  if (!dbTool) return null;

  return {
    id: parseInt(dbTool.id),
    name: dbTool.name,
    description: dbTool.description,
    category: dbTool.category as Tool['category'],
    pricing: dbTool.pricing,
    url: dbTool.url,
    affiliate_link: getAffiliateLink(dbTool),
    icon_url: dbTool.iconUrl || '',
    needs_vpn: false,
    languages: [],
    rating: dbTool.rating,
    rating_count: dbTool.reviewCount,
  };
}

export async function generateStaticParams() {
  const tools = await prisma.tool.findMany({
    where: { isActive: true },
    select: { name: true },
  });

  return tools.map(tool => ({
    slug: generateSlugFromName(tool.name),
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const tool = await findToolBySlug(slug);

  if (!tool) {
    return {
      title: 'Tool Not Found – Use AI Tools',
      description: 'The tool you are looking for could not be found.',
    };
  }

  const title = `${tool.name} Review ${new Date().getFullYear()} – Use AI Tools`;
  const description = (tool.description_en || tool.description).slice(0, 160);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: tool.name,
    description: tool.description,
    applicationCategory: `https://schema.org/${tool.category}Application`,
    operatingSystem: 'Web',
    url: `https://useaitools.me/tool/${slug}`,
    offers: {
      '@type': 'Offer',
      price: ['Free', 'Freemium', 'Open Source'].includes(tool.pricing) ? '0' : '9.99',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      priceSpecification: {
        '@type': 'PriceSpecification',
        price: ['Free', 'Freemium', 'Open Source'].includes(tool.pricing) ? '0' : '9.99',
        priceCurrency: 'USD',
        description: tool.pricing,
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: tool.rating ? String(tool.rating) : '4.5',
      ratingCount: tool.rating_count ? String(tool.rating_count) : '100',
      bestRating: '5',
      worstRating: '1',
    },
    author: {
      '@type': 'Organization',
      name: 'Use AI Tools',
      url: 'https://useaitools.me',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Use AI Tools',
      logo: {
        '@type': 'ImageObject',
        url: 'https://useaitools.me/logo.png',
      },
    },
  };

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://useaitools.me/tool/${slug}`,
      siteName: 'Use AI Tools',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    other: {
      'application/ld+json': JSON.stringify(jsonLd),
    },
  };
}

export default async function ToolSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = await findToolBySlug(slug);

  if (!tool) {
    notFound();
  }

  const enrichedTool = {
    ...tool,
    affiliate_link: getAffiliateLink(tool),
  };

  // 从数据库加载同分类的相关工具
  const dbRelatedTools = await prisma.tool.findMany({
    where: {
      category: tool.category,
      isActive: true,
      slug: { not: slug },
    },
    take: 5,
  });

  const relatedTools = dbRelatedTools.map(t => ({
    id: parseInt(t.id),
    name: t.name,
    description: t.description,
    category: t.category as Tool['category'],
    pricing: t.pricing,
    url: t.url,
    affiliate_link: getAffiliateLink(t),
    icon_url: t.iconUrl || '',
    needs_vpn: false,
    languages: [],
    rating: t.rating,
    rating_count: t.reviewCount,
  }));

  const relatedArticles = blogPosts
    .filter(post => {
      const postCategory = post.category?.toLowerCase() || '';
      const toolCategory = tool.category.toLowerCase();
      return postCategory === toolCategory || postCategory.includes(toolCategory);
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const pageJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: tool.name,
    description: tool.description,
    applicationCategory: `https://schema.org/${tool.category}Application`,
    operatingSystem: 'Web',
    url: `https://useaitools.me/tool/${slug}`,
    offers: {
      '@type': 'Offer',
      price: ['Free', 'Freemium', 'Open Source'].includes(tool.pricing) ? '0' : '9.99',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      priceSpecification: {
        '@type': 'PriceSpecification',
        price: ['Free', 'Freemium', 'Open Source'].includes(tool.pricing) ? '0' : '9.99',
        priceCurrency: 'USD',
        description: tool.pricing,
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: tool.rating ? String(tool.rating) : '4.5',
      ratingCount: tool.rating_count ? String(tool.rating_count) : '100',
      bestRating: '5',
      worstRating: '1',
    },
    author: {
      '@type': 'Organization',
      name: 'Use AI Tools',
      url: 'https://useaitools.me',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Use AI Tools',
      logo: {
        '@type': 'ImageObject',
        url: 'https://useaitools.me/logo.png',
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }}
      />
      <ToolSlugClient
        tool={enrichedTool}
        relatedTools={relatedTools}
        relatedArticles={relatedArticles}
        slug={slug}
      />
    </>
  );
}
