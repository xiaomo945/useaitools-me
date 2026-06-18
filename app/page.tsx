import tools from '@/data/tools.json';
import { blogPosts } from '@/data/blog-posts';
import Footer from '@/app/components/Footer';
import HomeClient from '@/app/components/HomeClient';
import FeaturedTools from '@/app/components/FeaturedTools';
import TrendingTools from '@/app/components/TrendingTools';
import StatsBanner from '@/app/components/StatsBanner';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { Tool } from '@/types';
import type { Metadata } from 'next';
import { getAffiliateLink } from '@/lib/affiliate';

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
  alternates: {
    canonical: '/',
    languages: {
      'en': '/',
      'zh': '/?lang=zh',
    },
  },
  openGraph: {
    title: 'Use AI Tools — Discover, Compare & Choose the Best AI Tools in 2026',
    description: 'Curated directory of the best AI tools. Browse 1,300+ tools across 6 categories.',
    url: 'https://useaitools.me',
    siteName: 'Use AI Tools',
    type: 'website',
    locale: 'en_US',
    alternateLocale: 'zh_CN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Use AI Tools — Discover the Best AI Tools',
    description: 'Curated directory of the best AI tools. Browse 1,300+ tools across 6 categories.',
  },
};

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

  // Only pass first 12 tools to client for initial load (performance optimization)
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
      
      {/* Latest Blog Posts - Internal Linking */}
      <div className="mb-16">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📝</span>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                Latest AI Tool Guides
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                In-depth reviews and comparisons to help you choose
              </p>
            </div>
          </div>
          <Link
            href="/blog"
            className="text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors flex items-center gap-1"
          >
            View all
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.slice(0, 3).map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group bg-white dark:bg-gray-900 border border-slate-200/60 dark:border-gray-800/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              {post.images && post.images.length > 0 && (
                <div className="aspect-video overflow-hidden bg-slate-100 dark:bg-gray-800">
                  <img
                    src={post.images[0].url}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
              )}
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                    {post.category}
                  </span>
                  <span className="text-xs text-slate-400 dark:text-slate-500">
                    {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                <h3 className="font-semibold text-base text-slate-900 dark:text-white mb-2 line-clamp-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {post.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                  {post.description}
                </p>
                <div className="mt-3 flex items-center gap-1 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                  Read more
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      
      {/* Blog Entry Card */}
      <div className="mb-16">
        <Link href="/blog" className="block">
          <div className="bg-gradient-to-br from-emerald-50/90 via-white to-teal-50/90 dark:from-emerald-950/70 dark:via-gray-900 dark:to-teal-950/70 backdrop-blur-xl border border-emerald-200/60 dark:border-emerald-500/10 shadow-xl shadow-emerald-500/5 dark:shadow-2xl dark:shadow-emerald-500/5 rounded-3xl p-8 sm:p-10 hover:shadow-2xl hover:shadow-emerald-500/10 hover:-translate-y-1 transition-all duration-300 ease-out">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl mb-3">📝</div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-3">
                AI Tool Comparisons & Guides
              </h2>
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
                In-depth reviews to help you choose the perfect tool
              </p>
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 hover:-translate-y-0.5 transition-all duration-300">
                Explore Blog →
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>
          </div>
        </Link>
      </div>
      <SceneExplorer />
      <StoryCard />
      <Footer />
    </>
  );
}
