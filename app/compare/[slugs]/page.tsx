import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import ToolComparison from '@/app/components/ToolComparison';
import { COMPARISON_SLUGS, resolveComparison } from '@/lib/comparisons';
import { generateSlugFromName } from '@/lib/slug';

interface ComparePageProps {
  params: Promise<{ slugs: string }>;
}

// 生成静态路径
export async function generateStaticParams() {
  return COMPARISON_SLUGS.map((slugs) => ({ slugs }));
}

// 生成元数据
export async function generateMetadata({ params }: ComparePageProps): Promise<Metadata> {
  const { slugs } = await params;
  const pair = resolveComparison(slugs);

  if (!pair) {
    return {
      title: 'Comparison Not Found – Use AI Tools',
      description: 'The comparison you are looking for does not exist.',
      robots: { index: false, follow: true },
    };
  }

  const [tool1, tool2] = pair;

  return {
    title: `${tool1.name} vs ${tool2.name}: Which is Best in 2026? – Use AI Tools`,
    description: `Compare ${tool1.name} and ${tool2.name} side-by-side. Features, pricing, pros & cons. Find the right ${tool1.category.toLowerCase()} AI tool for your needs.`,
    alternates: {
      canonical: `https://useaitools.me/compare/${slugs}`,
    },
    openGraph: {
      title: `${tool1.name} vs ${tool2.name}: Comprehensive Comparison`,
      description: `Compare ${tool1.name} and ${tool2.name} side-by-side. Features, pricing, pros & cons.`,
      type: 'article',
      url: `https://useaitools.me/compare/${slugs}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${tool1.name} vs ${tool2.name}: Which is Best?`,
      description: `Compare ${tool1.name} and ${tool2.name} side-by-side.`,
    },
  };
}

export default async function CompareDetailPage({ params }: ComparePageProps) {
  const { slugs } = await params;
  const pair = resolveComparison(slugs);

  if (!pair) {
    notFound();
  }

  const [tool1, tool2] = pair;

  // 转换为 ComparisonTool 类型
  const comparisonTool1 = {
    id: tool1.id,
    name: tool1.name,
    // Canonical slug, so links back into /compare/<a>-vs-<b> keep resolving.
    slug: generateSlugFromName(tool1.name),
    description: tool1.description,
    category: tool1.category,
    pricing: tool1.pricing,
    rating: tool1.rating,
    rating_count: tool1.rating_count,
    icon_url: tool1.icon_url,
    affiliate_link: tool1.affiliate_link,
    url: tool1.url,
    pros_cons: tool1.pros_cons,
    best_for: tool1.best_for,
    features: tool1.use_cases?.map(uc => uc.title),
  };

  const comparisonTool2 = {
    id: tool2.id,
    name: tool2.name,
    slug: generateSlugFromName(tool2.name),
    description: tool2.description,
    category: tool2.category,
    pricing: tool2.pricing,
    rating: tool2.rating,
    rating_count: tool2.rating_count,
    icon_url: tool2.icon_url,
    affiliate_link: tool2.affiliate_link,
    url: tool2.url,
    pros_cons: tool2.pros_cons,
    best_for: tool2.best_for,
    features: tool2.use_cases?.map(uc => uc.title),
  };

  // 稳定的发布日期（避免每次构建都变，利于 SEO）
  const publishedDate = '2026-01-01T00:00:00.000Z';
  const modifiedDate = '2026-06-01T00:00:00.000Z';
  const pageUrl = `https://useaitools.me/compare/${slugs}`;

  // JSON-LD: Article + BreadcrumbList + FAQPage
  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${tool1.name} vs ${tool2.name}: Comprehensive Comparison`,
    description: `Compare ${tool1.name} and ${tool2.name} side-by-side. Features, pricing, pros & cons.`,
    articleBody: `Detailed comparison between ${tool1.name} and ${tool2.name} including features, pricing, user ratings, and expert recommendations.`,
    datePublished: publishedDate,
    dateModified: modifiedDate,
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
      '@id': pageUrl,
    },
  };

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://useaitools.me' },
      { '@type': 'ListItem', position: 2, name: 'Compare', item: 'https://useaitools.me/compare' },
      { '@type': 'ListItem', position: 3, name: `${tool1.name} vs ${tool2.name}`, item: pageUrl },
    ],
  };

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `What is the difference between ${tool1.name} and ${tool2.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${tool1.name} and ${tool2.name} are both ${tool1.category} AI tools, but they differ in features, pricing, and target users. ${tool1.name} ${tool1.description} ${tool2.name} ${tool2.description}`,
        },
      },
      {
        '@type': 'Question',
        name: `Which is better: ${tool1.name} or ${tool2.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `The better choice depends on your needs. ${tool1.name} has a rating of ${tool1.rating || 'N/A'}/5, while ${tool2.name} has a rating of ${tool2.rating || 'N/A'}/5. Compare their features, pricing (${tool1.pricing} vs ${tool2.pricing}), and use cases to decide.`,
        },
      },
      {
        '@type': 'Question',
        name: `Is ${tool1.name} free to use?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${tool1.name} pricing model: ${tool1.pricing}. Check the official website for the latest pricing details.`,
        },
      },
      {
        '@type': 'Question',
        name: `Is ${tool2.name} free to use?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${tool2.name} pricing model: ${tool2.pricing}. Check the official website for the latest pricing details.`,
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
      <ToolComparison tool1={comparisonTool1} tool2={comparisonTool2} />
    </>
  );
}
