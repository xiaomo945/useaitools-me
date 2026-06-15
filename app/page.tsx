import tools from '@/data/tools.json';
import { blogPosts } from '@/data/blog-posts';
import Footer from '@/app/components/Footer';
import HomeClient from '@/app/components/HomeClient';
import FeaturedTools from '@/app/components/FeaturedTools';
import TrendingTools from '@/app/components/TrendingTools';
import StatsBanner from '@/app/components/StatsBanner';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import type { Tool } from '@/types';
import type { Metadata } from 'next';

const SceneExplorer = dynamic(() => import('@/app/components/SceneExplorer'), {
  loading: () => <div className="h-64 animate-pulse bg-slate-100 dark:bg-gray-800 rounded-2xl" />,
});

const StoryCard = dynamic(() => import('@/app/components/StoryCard'), {
  loading: () => <div className="h-48 animate-pulse bg-slate-100 dark:bg-gray-800 rounded-2xl" />,
});

export const metadata: Metadata = {
  title: 'Use AI Tools — Discover, Compare & Choose the Best AI Tools in 2026',
  description: 'Curated directory of the best AI tools. Browse 1,300+ tools across Writing, Image, Video, Audio, Code & Productivity. Find your perfect AI tool in seconds.',
  metadataBase: new URL('https://useaitools.me'),
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Use AI Tools — Discover, Compare & Choose the Best AI Tools in 2026',
    description: 'Curated directory of the best AI tools. Browse 1,300+ tools across 6 categories.',
    url: 'https://useaitools.me',
    siteName: 'Use AI Tools',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Use AI Tools — Discover the Best AI Tools',
    description: 'Curated directory of the best AI tools. Browse 1,300+ tools across 6 categories.',
  },
};

// Helper function to get affiliate link from environment variable or fallback to JSON
function getAffiliateLink(tool: any): string {
  const envVarName = `AFFILIATE_${tool.name.toUpperCase().replace(/\s+/g, '_')}`;
  let shortEnvVarName = '';
  if (tool.name.includes('Rytr')) {
    shortEnvVarName = 'AFFILIATE_RYTR';
  } else if (tool.name.includes('VEED')) {
    shortEnvVarName = 'AFFILIATE_VEED';
  } else if (tool.name.includes('Murf')) {
    shortEnvVarName = 'AFFILIATE_MURF';
  } else if (tool.name.includes('Pictory')) {
    shortEnvVarName = 'AFFILIATE_PICTORY';
  } else if (tool.name.includes('Grammarly')) {
    shortEnvVarName = 'AFFILIATE_GRAMMARLY';
  }
  const envLink = (shortEnvVarName && process.env[shortEnvVarName]) || process.env[envVarName];
  return envLink || tool.affiliate_link;
}

export default function Home() {
  // Enrich tools with affiliate links from environment variables
  const enrichedTools = tools.map(tool => ({
    ...tool,
    affiliate_link: getAffiliateLink(tool)
  })) as Tool[];

  // Sort tools by rating + rating_count for featured selection
  const sortedTools = [...enrichedTools].sort((a, b) => {
    const scoreA = (a.rating || 4.0) * 100 + (a.rating_count || 0);
    const scoreB = (b.rating || 4.0) * 100 + (b.rating_count || 0);
    return scoreB - scoreA;
  });

  // Only pass first 12 tools to client for initial load (reduced from 20)
  const initialTools = sortedTools.slice(0, 12);

  // Select featured tools on server to prevent hydration mismatch
  const selected: Tool[] = initialTools
    .filter(t => t.rating && t.rating >= 4.5)
    .slice(0, 3);

  // WebSite Schema with SearchAction
  const webSiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    'name': 'Use AI Tools',
    'description': 'Discover, compare & choose the best AI tools for every task. Curated weekly.',
    'url': 'https://useaitools.me',
    'publisher': {
      '@type': 'Organization',
      'name': 'Use AI Tools',
      'logo': {
        '@type': 'ImageObject',
        'url': 'https://useaitools.me/logo.png'
      }
    },
    'author': {
      '@type': 'Organization',
      'name': 'Use AI Tools'
    },
    'potentialAction': {
      '@type': 'SearchAction',
      'target': {
        '@type': 'EntryPoint',
        'urlTemplate': 'https://useaitools.me/?q={search_term_string}'
      },
      'query-input': 'required name=search_term_string'
    }
  };

  // FAQPage Schema
  const faqPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': [
      {
        '@type': 'Question',
        'name': 'What is Use AI Tools?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'Use AI Tools is a curated directory of the best AI tools available today. We organize tools into categories like Writing, Image, Productivity, Code, Audio, and Video to help you find the perfect tool for your needs.'
        }
      },
      {
        '@type': 'Question',
        'name': 'How do I choose the right AI tool?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'You can browse by category, use our search function, or read our detailed comparison guides. Each tool includes a description, pricing information, and a link to the official website.'
        }
      },
      {
        '@type': 'Question',
        'name': 'Are the AI tools listed here free?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'We include both free and paid AI tools. Many tools offer free tiers or trials, while others require a subscription. We clearly label each tool with its pricing model for easy comparison.'
        }
      }
    ]
  };

  // CollectionPage Schema
  const collectionPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    'name': 'AI Tools Directory — Use AI Tools',
    'description': 'Curated collection of the best AI tools across Writing, Image, Productivity, Code, Audio, and Video categories.',
    'url': 'https://useaitools.me',
    'publisher': {
      '@type': 'Organization',
      'name': 'Use AI Tools',
      'logo': {
        '@type': 'ImageObject',
        'url': 'https://useaitools.me/logo.png',
      },
    },
    'about': {
      '@type': 'Thing',
      'name': 'Artificial Intelligence Tools',
    },
    'numberOfItems': enrichedTools.length,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageSchema) }}
      />
      <HomeClient
        initialTools={initialTools}
        blogPosts={blogPosts}
        totalCount={enrichedTools.length}
      />
      <FeaturedTools tools={selected} />
      <TrendingTools tools={sortedTools} />
      <StatsBanner />
      <SceneExplorer />
      <StoryCard />
      <Footer />
    </>
  );
}
