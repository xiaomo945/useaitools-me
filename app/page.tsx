import { prisma } from '@/lib/prisma';
import { blogPosts } from '@/data/blog-posts';
import Footer from '@/app/components/Footer';
import HomeClient from '@/app/components/HomeClient';
import SceneExplorer from '@/app/components/SceneExplorer';
import StoryCard from '@/app/components/StoryCard';
import type { Tool } from '@/types';
import type { Metadata } from 'next';

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
  return envLink || tool.affiliateUrl || '';
}

export default async function Home() {
  // 从数据库加载工具数据
  const dbTools = await prisma.tool.findMany({
    where: { isActive: true },
    orderBy: { rating: 'desc' },
  });

  // 转换为前端需要的格式
  const tools: Tool[] = dbTools.map(tool => ({
    id: parseInt(tool.id),
    name: tool.name,
    description: tool.description,
    category: tool.category as Tool['category'],
    pricing: tool.pricing,
    url: tool.url,
    affiliate_link: getAffiliateLink(tool),
    icon_url: tool.iconUrl || '',
    needs_vpn: false, // 数据库中没有这个字段，默认为 false
    languages: [], // 数据库中没有这个字段，默认为空数组
    rating: tool.rating,
    rating_count: tool.reviewCount,
  }));

  // Sort tools by rating + rating_count for featured selection
  const sortedTools = [...tools].sort((a, b) => {
    const scoreA = (a.rating || 4.0) * 100 + (a.rating_count || 0);
    const scoreB = (b.rating || 4.0) * 100 + (b.rating_count || 0);
    return scoreB - scoreA;
  });

  // Only pass first 20 tools to client for initial load
  const initialTools = sortedTools.slice(0, 20);

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
    'numberOfItems': tools.length,
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
        featuredTools={selected}
        blogPosts={blogPosts}
        totalCount={tools.length}
      />
      <SceneExplorer />
      <StoryCard />
      <TopPicksSection />
      <Footer />
    </>
  );
}

function TopPicksSection() {
  return (
    <section className="py-14 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-emerald-50/60 via-white to-teal-50/60 dark:from-gray-950 dark:via-gray-900 dark:to-emerald-950/20 border-t border-b border-emerald-100/60 dark:border-emerald-900/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-block px-4 py-1.5 rounded-full bg-emerald-100/70 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-sm font-semibold mb-4">
            ⭐ Editor&apos;s Choice
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-600 bg-clip-text text-transparent mb-3">
            📊 Top 推荐工具
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
            根据评分和用户评价精选的最佳 AI 工具，帮助你快速找到合适的解决方案
          </p>
        </div>
        <TopPicksGrid />
      </div>
    </section>
  );
}

async function TopPicksGrid() {
  try {
    const picks = await prisma.tool.findMany({
      where: { isActive: true },
      orderBy: [
        { rating: 'desc' },
        { reviewCount: 'desc' },
      ],
      take: 6,
    });

    if (!picks || picks.length === 0) {
      return null;
    }

    const getSlug = (name: string) =>
      name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {picks.map((tool, idx) => {
          const rating = tool.rating || 4.5;
          const slug = getSlug(tool.name);
          return (
            <a
              key={tool.id}
              href={`/tool/${slug}`}
              className="group relative block bg-white dark:bg-gray-900 rounded-2xl border border-slate-200 dark:border-gray-800 p-5 sm:p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-500 opacity-80" />
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-emerald-500/20">
                    {tool.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-base leading-tight group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {tool.name}
                    </h3>
                    <span className="inline-block text-xs text-teal-600 dark:text-teal-400 font-semibold mt-1">
                      {tool.category}
                    </span>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-100/70 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
                  ⭐ {rating.toFixed(1)}
                </span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4 line-clamp-3">
                {tool.description}
              </p>
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-gray-800">
                <span className="text-xs text-slate-500 dark:text-slate-500 font-medium">
                  #{idx + 1} 推荐
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 group-hover:translate-x-1 transition-transform">
                  查看详情 →
                </span>
              </div>
            </a>
          );
        })}
      </div>
    );
  } catch (err) {
    console.error('Failed to load top picks:', err);
    return null;
  }
}
