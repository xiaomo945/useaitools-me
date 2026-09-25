import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import tools from '@/data/tools.json';
import { blogPosts } from '@/data/blog-posts';
import ToolSlugClient from './ToolSlugClient';
import { getAffiliateLink } from '@/lib/affiliate';
import { generateSlugFromName } from '@/lib/slug';
import { generateKeywords } from '@/lib/seo';

export { generateSlugFromName };

const SITE_URL = 'https://useaitools.me';

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
  use_cases?: { title: string; detail: string }[];
  pros_cons?: { pros: string[]; cons: string[] };
  skill_level?: 'beginner' | 'intermediate' | 'advanced';
  best_for?: string[];
  last_updated?: string;
};

const typedTools = tools as unknown as Tool[];

function findToolBySlug(slug: string): Tool | undefined {
  return typedTools.find(t => generateSlugFromName(t.name) === slug);
}

export async function generateStaticParams() {
  return typedTools
    .map(tool => generateSlugFromName(tool.name))
    .filter(Boolean)
    .map(slug => ({ slug }));
}

/** Real, data-derived answers — no invented claims. */
function buildFaqs(tool: Tool) {
  const isFree = ['Free', 'Freemium', 'Open Source'].includes(tool.pricing);
  const bestFor = tool.best_for?.length
    ? tool.best_for.slice(0, 3).join(', ')
    : `${tool.category.toLowerCase()} work`;
  return [
    {
      question: `What is ${tool.name}?`,
      answer: `${tool.name} is a ${tool.category.toLowerCase()} AI tool listed on Use AI Tools. ${tool.description_en || tool.description}`,
    },
    {
      question: `Is ${tool.name} free?`,
      answer: isFree
        ? `${tool.name} is listed as ${tool.pricing}. Check ${tool.url} for the current plan limits, as vendors change pricing frequently.`
        : `${tool.name} is listed as ${tool.pricing}. Visit ${tool.url} for current pricing and any available trial.`,
    },
    {
      question: `What is ${tool.name} best for?`,
      answer: `${tool.name} is commonly used for ${bestFor}. It supports ${(tool.languages || []).join(', ') || 'English'}${tool.needs_vpn ? ' and may require a VPN in some regions' : ''}.`,
    },
  ];
}

function buildJsonLd(tool: Tool, slug: string) {
  const isFree = ['Free', 'Freemium', 'Open Source'].includes(tool.pricing);
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareApplication',
        name: tool.name,
        description: (tool.description_en || tool.description).slice(0, 500),
        applicationCategory: 'BusinessApplication',
        applicationSubCategory: `${tool.category} AI`,
        operatingSystem: 'Web',
        url: tool.url,
        featureList: [
          `${tool.category} AI tool`,
          `${tool.pricing} pricing`,
          `Supports: ${(tool.languages || []).join(', ') || 'English'}`,
        ],
        offers: {
          '@type': 'Offer',
          price: isFree ? '0' : undefined,
          priceCurrency: 'USD',
          availability: 'https://schema.org/InStock',
          description: tool.pricing,
          url: tool.url,
        },
        author: { '@type': 'Organization', name: 'Use AI Tools', url: SITE_URL },
        publisher: {
          '@type': 'Organization',
          name: 'Use AI Tools',
          logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo.png` },
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          {
            '@type': 'ListItem',
            position: 2,
            name: `${tool.category} AI Tools`,
            item: `${SITE_URL}/category/${tool.category.toLowerCase()}`,
          },
          { '@type': 'ListItem', position: 3, name: tool.name, item: `${SITE_URL}/tool/${slug}` },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: buildFaqs(tool).map(faq => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: { '@type': 'Answer', text: faq.answer },
        })),
      },
    ],
  };
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const tool = findToolBySlug(slug);

  if (!tool) {
    return {
      title: 'Tool Not Found – Use AI Tools',
      description: 'The tool you are looking for could not be found.',
      robots: { index: false, follow: true },
    };
  }

  const title = `${tool.name} – ${tool.category} AI Tool (${tool.pricing})`;
  const description = (tool.description_en || tool.description).slice(0, 160);

  return {
    title,
    description,
    keywords: generateKeywords(tool.category, tool.name),
    alternates: { canonical: `${SITE_URL}/tool/${slug}` },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/tool/${slug}`,
      siteName: 'Use AI Tools',
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
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

  // Related tools: same category, most recently updated first (no fake scores involved).
  const relatedTools = typedTools
    .filter(t => t.id !== tool.id && t.category === tool.category)
    .sort((a, b) => (b.last_updated || '').localeCompare(a.last_updated || ''))
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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJsonLd(tool, slug)) }}
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
