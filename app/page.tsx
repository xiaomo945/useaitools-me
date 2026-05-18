import tools from '@/data/tools.json';
import Footer from '@/app/components/Footer';
import HomeClient from '@/app/components/HomeClient';

type Tool = (typeof tools)[0];

// Helper function to get affiliate link from environment variable or fallback to JSON
function getAffiliateLink(tool: Tool): string {
  const envVarName = `AFFILIATE_${tool.name.toUpperCase().replace(/\s+/g, '_')}`;
  let shortEnvVarName = '';
  if (tool.name === 'VEED.io') {
    shortEnvVarName = 'AFFILIATE_VEED';
  } else if (tool.name === 'Murf AI') {
    shortEnvVarName = 'AFFILIATE_MURF';
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
      <HomeClient initialTools={enrichedTools} />
      <Footer />
    </>
  );
}
