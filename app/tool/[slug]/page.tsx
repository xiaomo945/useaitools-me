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
  affiliate_link_id?: string;
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

function getAffiliateLinkFromEnv(tool: any): string {
  const envVarName = `AFFILIATE_${tool.name.toUpperCase().replace(/\s+/g, '_')}`;
  let shortEnvVarName = '';
  if (tool.name.includes('Rytr')) shortEnvVarName = 'AFFILIATE_RYTR';
  else if (tool.name.includes('VEED')) shortEnvVarName = 'AFFILIATE_VEED';
  else if (tool.name.includes('Murf')) shortEnvVarName = 'AFFILIATE_MURF';
  else if (tool.name.includes('Pictory')) shortEnvVarName = 'AFFILIATE_PICTORY';
  else if (tool.name.includes('Grammarly')) shortEnvVarName = 'AFFILIATE_GRAMMARLY';
  const envLink =
    (shortEnvVarName && process.env[shortEnvVarName]) ||
    process.env[envVarName];
  return envLink || '';
}

async function findToolBySlug(slug: string): Promise<{
  tool: Tool;
  affiliateLinkId?: string;
} | null> {
  const dbTool = await prisma.tool.findFirst({
    where: { slug, isActive: true },
  });

  if (!dbTool) return null;

  let affiliateLinkId: string | undefined = undefined;
  let affiliateUrl = getAffiliateLinkFromEnv(dbTool) || dbTool.affiliateUrl || '';

  // 从 AffiliateLink 表查询（优先级最高，保持向后兼容）
  try {
    const dbAffiliate = await prisma.affiliateLink.findFirst({
      where: {
        toolName: dbTool.name,
        status: 'active',
      },
      orderBy: { clickCount: 'desc' },
      take: 1,
    });
    if (dbAffiliate) {
      affiliateLinkId = dbAffiliate.id;
      affiliateUrl = dbAffiliate.affiliateUrl || affiliateUrl;
    }
  } catch (e) {
    console.error('Failed to query affiliate link for tool:', dbTool.name, e);
  }

  return {
    tool: {
      id: parseInt(dbTool.id),
      name: dbTool.name,
      description: dbTool.description,
      category: dbTool.category as Tool['category'],
      pricing: dbTool.pricing,
      url: dbTool.url,
      affiliate_link: affiliateUrl,
      affiliate_link_id: affiliateLinkId,
      icon_url: dbTool.iconUrl || '',
      needs_vpn: false,
      languages: [],
      rating: dbTool.rating,
      rating_count: dbTool.reviewCount,
      use_cases: dbTool.useCases ? JSON.parse(dbTool.useCases) : [],
    },
    affiliateLinkId,
  };
}

export async function generateStaticParams() {
  try {
    const tools = await prisma.tool.findMany({
      where: { isActive: true },
      select: { name: true },
    });

    return tools.map((tool) => ({
      slug: generateSlugFromName(tool.name),
    }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const result = await findToolBySlug(slug);

  if (!result) {
    return {
      title: 'Tool Not Found – Use AI Tools',
      description: 'The tool you are looking for could not be found.',
    };
  }

  const tool = result.tool;
  const title = `${tool.name} ${new Date().getFullYear()} – Review, Pricing & Features`;
  const description = `${tool.description.slice(0, 160)}. Category: ${tool.category}. Pricing: ${tool.pricing}.`;

  return {
    title,
    description,
    robots: { index: true, follow: true },
    alternates: { canonical: `/tool/${slug}` },
    openGraph: {
      title,
      description,
      url: `https://useaitools.me/tool/${slug}`,
      siteName: 'Use AI Tools',
      type: 'website',
      images: tool.icon_url ? [tool.icon_url] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      creator: '@useaitools',
      images: tool.icon_url ? [tool.icon_url] : undefined,
    },
  };
}

export default async function ToolSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const result = await findToolBySlug(slug);

  if (!result) {
    notFound();
  }

  const enrichedTool = {
    ...result.tool,
    affiliate_link:
      result.tool.affiliate_link || getAffiliateLinkFromEnv(result.tool),
    affiliate_link_id: result.affiliateLinkId,
  };

  const dbRelatedTools = await prisma.tool.findMany({
    where: {
      category: result.tool.category,
      isActive: true,
      slug: { not: slug },
    },
    take: 5,
  });

  const relatedTools: Tool[] = await Promise.all(
    dbRelatedTools.map(async (t) => {
      let relatedAffiliateId: string | undefined = undefined;
      let relatedAffiliateUrl =
        getAffiliateLinkFromEnv(t) || t.affiliateUrl || '';
      try {
        const relAff = await prisma.affiliateLink.findFirst({
          where: { toolName: t.name, status: 'active' },
          orderBy: { clickCount: 'desc' },
          take: 1,
        });
        if (relAff) {
          relatedAffiliateId = relAff.id;
          relatedAffiliateUrl = relAff.affiliateUrl || relatedAffiliateUrl;
        }
      } catch {
        // 忽略
      }
      return {
        id: parseInt(t.id),
        name: t.name,
        description: t.description,
        category: t.category as Tool['category'],
        pricing: t.pricing,
        url: t.url,
        affiliate_link: relatedAffiliateUrl,
        affiliate_link_id: relatedAffiliateId,
        icon_url: t.iconUrl || '',
        needs_vpn: false,
        languages: [],
        rating: t.rating,
        rating_count: t.reviewCount,
      };
    })
  );

  const relatedArticles = blogPosts
    .filter((post) => {
      const postCategory = (post as any).category?.toLowerCase() || '';
      const toolCategory = result.tool.category.toLowerCase();
      return postCategory === toolCategory || postCategory.includes(toolCategory);
    })
    .sort((a, b) => {
      const da = new Date((a as any).date || 0).getTime();
      const db = new Date((b as any).date || 0).getTime();
      return db - da;
    })
    .slice(0, 5);

  const pageJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: result.tool.name,
    description: result.tool.description,
    applicationCategory: `https://schema.org/${result.tool.category}Application`,
    operatingSystem: 'Web',
    url: `https://useaitools.me/tool/${slug}`,
    offers: {
      '@type': 'Offer',
      price: ['Free', 'Freemium', 'Open Source'].includes(
        result.tool.pricing
      )
        ? '0'
        : '9.99',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: result.tool.rating ? String(result.tool.rating) : '4.5',
      ratingCount: result.tool.rating_count
        ? String(result.tool.rating_count)
        : '100',
      bestRating: '5',
      worstRating: '1',
    },
    author: { '@type': 'Organization', name: 'Use AI Tools' },
    publisher: {
      '@type': 'Organization',
      name: 'Use AI Tools',
      logo: { '@type': 'ImageObject', url: 'https://useaitools.me/logo.png' },
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
