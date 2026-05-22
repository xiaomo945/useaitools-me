import type { Metadata } from "next";
import tools from '@/data/tools.json';
import Footer from '@/app/components/Footer';
import HomeClient from '@/app/components/HomeClient';

export const metadata: Metadata = {
  title: 'Best AI Tools Directory 2026 – Discover & Compare 80+ AI Tools',
  description: 'Find and compare the best AI tools for writing, image generation, video creation, coding, and more. Curated directory updated weekly. Start exploring now.',
  keywords: ['AI tools', 'best AI tools', 'AI tools 2026', 'AI tools comparison', 'AI writing tools', 'AI image generators', 'free AI tools'],
  openGraph: {
    title: 'Best AI Tools Directory 2026 – Discover & Compare 80+ AI Tools',
    description: 'Find and compare the best AI tools for writing, image generation, video creation, coding, and more. Curated directory updated weekly.',
    type: 'website',
    url: 'https://useaitools.me',
    siteName: 'Use AI Tools',
  },
};

type Tool = (typeof tools)[0];

// Helper function to get affiliate link from environment variable or fallback to JSON
function getAffiliateLink(tool: Tool): string {
  const envVarName = `AFFILIATE_${tool.name.toUpperCase().replace(/\s+/g, '_')}`;
  let shortEnvVarName = '';
  if (tool.name === 'Rytr') {
    shortEnvVarName = 'AFFILIATE_RYTR';
  } else if (tool.name === 'VEED.io') {
    shortEnvVarName = 'AFFILIATE_VEED';
  } else if (tool.name === 'Murf AI') {
    shortEnvVarName = 'AFFILIATE_MURF';
  } else if (tool.name === 'Pictory') {
    shortEnvVarName = 'AFFILIATE_PICTORY';
  }
  const envLink = (shortEnvVarName && process.env[shortEnvVarName]) || process.env[envVarName];
  return envLink || tool.affiliate_link;
}

export default function Home() {
  // Enrich tools with affiliate links from environment variables
  const enrichedTools = tools.map(tool => ({
    ...tool,
    affiliate_link: getAffiliateLink(tool)
  }));

  // Select featured tools on server to prevent hydration mismatch
  // Prioritize Chinese tools first, then mix with others
  const chineseTools = enrichedTools.filter(tool => !tool.needs_vpn);
  const allTools = [...enrichedTools];
  
  // Use deterministic selection based on tool IDs
  const selected: typeof enrichedTools = [];
  
  // Select top 2 Chinese tools first (deterministic)
  const topChineseTools = chineseTools
    .sort((a, b) => a.id - b.id)
    .slice(0, 2);
  selected.push(...topChineseTools);
  
  // Select remaining from other tools
  const remaining = allTools.filter(t => !selected.some(s => s.id === t.id));
  const topRemainingTools = remaining
    .sort((a, b) => a.id - b.id)
    .slice(0, 3 - selected.length);
  selected.push(...topRemainingTools);

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
      <HomeClient initialTools={enrichedTools} featuredTools={selected} />
      <Footer />
    </>
  );
}
