import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import tools from '@/data/tools.json';
import { blogPosts } from '@/types';
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

const typedTools = tools as Tool[];

export function generateSlugFromName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function getAffiliateLink(tool: Tool): string {
  const envVarName = `AFFILIATE_${tool.name.toUpperCase().replace(/\s+/g, '_')}`;
  let shortEnvVarName = '';
  if (tool.name === 'Rytr') shortEnvVarName = 'AFFILIATE_RYTR';
  else if (tool.name === 'VEED.io') shortEnvVarName = 'AFFILIATE_VEED';
  else if (tool.name === 'Murf AI') shortEnvVarName = 'AFFILIATE_MURF';
  else if (tool.name === 'Pictory') shortEnvVarName = 'AFFILIATE_PICTORY';
  const envLink = (shortEnvVarName && process.env[shortEnvVarName]) || process.env[envVarName];
  return envLink || tool.affiliate_link || '';
}

function findToolBySlug(slug: string): Tool | undefined {
  return typedTools.find(t => generateSlugFromName(t.name) === slug);
}

export async function generateStaticParams() {
  return typedTools.map(tool => ({
    slug: generateSlugFromName(tool.name),
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const tool = findToolBySlug(slug);

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
  const tool = findToolBySlug(slug);

  if (!tool) {
    notFound();
  }

  const enrichedTool = {
    ...tool,
    affiliate_link: getAffiliateLink(tool),
  };

  const relatedTools = typedTools
    .filter(t => t.id !== tool.id && t.category === tool.category)
    .sort(() => Math.random() - 0.5)
    .slice(0, 5)
    .map(t => ({ ...t, affiliate_link: getAffiliateLink(t) }));

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
