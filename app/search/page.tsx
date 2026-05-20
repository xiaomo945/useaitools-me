import Link from 'next/link';
import tools from '@/data/tools.json';
import { ArrowRight } from 'lucide-react';
import Footer from '@/app/components/Footer';
import { Metadata } from 'next';
import Breadcrumbs from '@/app/components/Breadcrumbs';

type Tool = (typeof tools)[0];

// Helper function to check if a tool has affiliate link (environment variable or JSON field)
function hasAffiliateLink(tool: Tool): boolean {
  const envVarName = `AFFILIATE_${tool.name.toUpperCase().replace(/\s+/g, '_')}`;
  let shortEnvVarName = '';
  if (tool.name === 'VEED.io') {
    shortEnvVarName = 'AFFILIATE_VEED';
  } else if (tool.name === 'Murf AI') {
    shortEnvVarName = 'AFFILIATE_MURF';
  } else if (tool.name === 'Pictory') {
    shortEnvVarName = 'AFFILIATE_PICTORY';
  }
  const envLink = (shortEnvVarName && process.env[shortEnvVarName]) || process.env[envVarName];
  return !!(envLink || tool.affiliate_link);
}

// Helper function to get affiliate link from environment variable or fallback to JSON
function getAffiliateLink(tool: Tool): string {
  const envVarName = `AFFILIATE_${tool.name.toUpperCase().replace(/\s+/g, '_')}`;
  let shortEnvVarName = '';
  if (tool.name === 'VEED.io') {
    shortEnvVarName = 'AFFILIATE_VEED';
  } else if (tool.name === 'Murf AI') {
    shortEnvVarName = 'AFFILIATE_MURF';
  } else if (tool.name === 'Pictory') {
    shortEnvVarName = 'AFFILIATE_PICTORY';
  }
  const envLink = (shortEnvVarName && process.env[shortEnvVarName]) || process.env[envVarName];
  return envLink || tool.affiliate_link;
}

const getCategoryColors = (category: string) => {
  switch (category) {
    case 'Writing':
      return {
        bg: 'bg-blue-500',
        bgDark: 'bg-blue-500/20',
        text: 'text-blue-300',
        textLight: 'text-blue-600',
        border: 'border-blue-300',
        ring: 'hover:shadow-blue-500/20',
      };
    case 'Image':
      return {
        bg: 'bg-violet-500',
        bgDark: 'bg-violet-500/20',
        text: 'text-violet-300',
        textLight: 'text-violet-600',
        border: 'border-violet-300',
        ring: 'hover:shadow-violet-500/20',
      };
    case 'Productivity':
      return {
        bg: 'bg-teal-500',
        bgDark: 'bg-teal-500/20',
        text: 'text-teal-300',
        textLight: 'text-teal-600',
        border: 'border-teal-300',
        ring: 'hover:shadow-teal-500/20',
      };
    case 'Code':
      return {
        bg: 'bg-orange-500',
        bgDark: 'bg-orange-500/20',
        text: 'text-orange-300',
        textLight: 'text-orange-600',
        border: 'border-orange-300',
        ring: 'hover:shadow-orange-500/20',
      };
    case 'Audio':
      return {
        bg: 'bg-pink-500',
        bgDark: 'bg-pink-500/20',
        text: 'text-pink-300',
        textLight: 'text-pink-600',
        border: 'border-pink-300',
        ring: 'hover:shadow-pink-500/20',
      };
    case 'Video':
      return {
        bg: 'bg-indigo-500',
        bgDark: 'bg-indigo-500/20',
        text: 'text-indigo-300',
        textLight: 'text-indigo-600',
        border: 'border-indigo-300',
        ring: 'hover:shadow-indigo-500/20',
      };
    default:
      return {
        bg: 'bg-slate-500',
        bgDark: 'bg-slate-500/20',
        text: 'text-slate-300',
        textLight: 'text-slate-600',
        border: 'border-slate-300',
        ring: 'hover:shadow-slate-500/20',
      };
  }
};

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ q?: string }> }): Promise<Metadata> {
  const { q } = await searchParams;
  const query = q || '';
  const title = query ? `Search results for "${query}" – Use AI Tools` : 'Search AI Tools – Use AI Tools';
  const description = query 
    ? `Find the best AI tools matching "${query}". Handpicked directory of AI tools to boost your workflow.`
    : 'Search our handpicked directory of AI tools to find the perfect tools for your needs.';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
  };
}

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const query = (q || '').toLowerCase().trim();

  // Enrich tools with affiliate links from environment variables
  const allTools = tools.map(t => ({ ...t, affiliate_link: getAffiliateLink(t) }));
  
  const filteredTools = query 
    ? allTools.filter(t => 
        t.name.toLowerCase().includes(query) || 
        t.description.toLowerCase().includes(query)
      )
    : allTools;

  // Schema
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SearchResultsPage',
    'name': query ? `Search Results for "${query}" - Use AI Tools` : 'Search AI Tools - Use AI Tools',
    'description': 'Search our handpicked directory of AI tools.',
    'url': `https://useaitools.me/search${query ? `?q=${encodeURIComponent(query)}` : ''}`,
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
    'mainEntity': {
      '@type': 'ItemList',
      'numberOfItems': filteredTools.length,
      'itemListElement': filteredTools.map((tool, index) => ({
        '@type': 'ListItem',
        'position': index + 1,
        'name': tool.name,
        'url': `https://useaitools.me/tools/${tool.id}`,
        'description': tool.description
      }))
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen bg-slate-50 dark:bg-gray-950 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Breadcrumbs */}
          <Breadcrumbs 
            items={[
              { label: 'Home', href: '/' },
              { label: 'Search', href: '/search', current: true }
            ]} 
          />
          
          <div className="mb-8" />

          {/* Hero */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4">
              <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
                {query ? `Search Results` : 'Search AI Tools'}
              </span>
            </h1>
            {query && (
              <p className="text-2xl sm:text-3xl font-light text-slate-700 dark:text-slate-300 mb-6">
                for "{query}"
              </p>
            )}
            <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl mx-auto">
              {filteredTools.length === 0 
                ? "No tools found. Try a different search term or browse all tools."
                : `Showing ${filteredTools.length} tool${filteredTools.length !== 1 ? 's' : ''} matching your search.`
              }
            </p>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-emerald-300 dark:via-emerald-700/40 to-transparent mb-10 mx-auto max-w-2xl" />

          {/* Empty State */}
          {filteredTools.length === 0 && (
            <div className="text-center py-16 mb-12">
              <div className="mx-auto w-24 h-24 mb-6 text-slate-300 dark:text-slate-600">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full" aria-hidden="true">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
                No results found
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-lg mb-8 max-w-md mx-auto">
                We couldn't find any tools matching "{query}". Try a different search term.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 hover:-translate-y-0.5 transition-all duration-300"
                >
                  Browse All Tools
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="mt-12">
                <p className="text-sm text-slate-400 dark:text-slate-500 mb-4">Try searching for:</p>
                <div className="flex flex-wrap justify-center gap-3">
                  {['ChatGPT', 'Midjourney', 'GitHub Copilot', 'DALL-E', 'Notion AI'].map((suggestion) => (
                    <Link
                      key={suggestion}
                      href={`/search?q=${encodeURIComponent(suggestion)}`}
                      className="px-4 py-2 text-sm bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    >
                      {suggestion}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tools Grid */}
          {filteredTools.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">
              {filteredTools.map((tool, index) => {
                const colors = getCategoryColors(tool.category);
                const hasAffiliate = hasAffiliateLink(tool);
                const ctaText = hasAffiliate ? '🔗 Try It Free' : 'Visit Website';
                
                return (
                  <Link
                    key={tool.id}
                    href={`/tools/${tool.id}`}
                    className={`bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 shadow-sm rounded-2xl overflow-hidden hover:border-emerald-300 dark:hover:border-emerald-600 hover:shadow-xl hover:shadow-emerald-500/5 hover:-translate-y-1 transition-all duration-300 ease-out block relative ${hasAffiliate ? 'affiliate-card' : ''}`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {/* Staff Pick Badge for affiliate tools */}
                    {hasAffiliate && (
                      <div className="absolute top-3 right-3 z-10">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/25">
                          🏷️ Staff Pick
                        </span>
                      </div>
                    )}
                    
                    <div className={`h-0.75 w-full ${colors.bg}`} style={{ height: '3px' }} />
                    
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="flex items-start gap-3">
                          <div className={`w-11 h-11 rounded-xl ${colors.bg}/10 dark:${colors.bgDark} ${colors.textLight} dark:${colors.text} flex items-center justify-center text-xl font-bold`}>
                            {tool.name.charAt(0)}
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg text-slate-900 dark:text-white">
                              {tool.name}
                            </h3>
                            <div className="flex items-center gap-1.5 mt-1">
                              {tool.needs_vpn ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                                  🪜 VPN Required
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                                  ✅ Direct Access
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {tool.pricing}
                        </span>
                      </div>

                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4 line-clamp-2">
                        {tool.description}
                      </p>

                      <div className="flex items-center justify-between gap-3">
                        <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${colors.bg} text-white dark:${colors.bgDark} dark:${colors.text}`}>
                          {tool.category}
                        </span>
                        
                        <a
                          href={getAffiliateLink(tool) || tool.url}
                          target="_blank"
                          rel="noopener noreferrer sponsored"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-gradient-to-r hover:from-emerald-500 hover:to-teal-500 hover:text-white hover:border-transparent focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:outline-none"
                        >
                          {ctaText}
                        </a>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          {/* Back Home */}
          <div className="text-center mt-16">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium transition-colors duration-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Back to Home
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
