import { notFound } from 'next/navigation';
import Link from 'next/link';
import tools from '@/data/tools.json';
import { ArrowRight } from 'lucide-react';
import Footer from '@/app/components/Footer';
import { Metadata } from 'next';
import CategoryHero from './CategoryHero';
import Breadcrumbs from '@/app/components/Breadcrumbs';

type Tool = (typeof tools)[0];
type Category = Tool['category'];

const categoryDescriptions: Record<Category, string> = {
  Writing: 'Discover powerful AI writing tools that help you create high-quality content faster, from blog posts and marketing copy to creative stories and academic papers.',
  Image: 'Explore cutting-edge AI image generation and editing tools that transform your creative ideas into stunning visuals with just a few words.',
  Productivity: 'Boost your workflow with AI-powered productivity tools that automate tasks, manage your schedule, and help you get more done in less time.',
  Code: 'Supercharge your development with AI coding assistants that write, refactor, and debug code for you, making programming faster and more accessible.',
  Audio: 'Create professional audio content with AI tools that generate realistic voices, produce music, and edit sound with incredible precision.',
  Video: 'Bring your videos to life with AI video tools that generate, edit, and enhance video content, from animated avatars to full-length productions.',
  Medical: 'Transform healthcare with AI medical tools that assist in diagnosis, patient care, drug discovery, and medical imaging analysis.',
  Finance: 'Optimize financial operations with AI tools for risk assessment, fraud detection, investment analysis, and automated trading.',
  Law: 'Empower legal professionals with AI tools that simplify contract review, legal research, document drafting, and case management.',
  Agriculture: 'Revolutionize farming with AI tools for crop monitoring, pest detection, yield prediction, and smart irrigation systems.'
};

const categoryNames: Record<Category, string> = {
  Writing: 'Writing',
  Image: 'Image',
  Productivity: 'Productivity',
  Code: 'Code',
  Audio: 'Audio',
  Video: 'Video',
  Medical: 'Medical',
  Finance: 'Finance',
  Law: 'Law',
  Agriculture: 'Agriculture'
};

const colorMap: Record<Category, { bg: string; bgDark: string; text: string; textLight: string; border: string; ring: string }> = {
  Writing:    { bg: 'bg-blue-500',    bgDark: 'bg-blue-500/20',    text: 'text-blue-300',    textLight: 'text-blue-600',    border: 'border-blue-300',    ring: 'hover:shadow-blue-500/20' },
  Image:      { bg: 'bg-violet-500', bgDark: 'bg-violet-500/20', text: 'text-violet-300', textLight: 'text-violet-600', border: 'border-violet-300', ring: 'hover:shadow-violet-500/20' },
  Productivity: { bg: 'bg-teal-500',  bgDark: 'bg-teal-500/20',  text: 'text-teal-300',  textLight: 'text-teal-600',  border: 'border-teal-300',  ring: 'hover:shadow-teal-500/20' },
  Code:       { bg: 'bg-orange-500', bgDark: 'bg-orange-500/20', text: 'text-orange-300', textLight: 'text-orange-600', border: 'border-orange-300', ring: 'hover:shadow-orange-500/20' },
  Audio:      { bg: 'bg-pink-500',   bgDark: 'bg-pink-500/20',   text: 'text-pink-300',   textLight: 'text-pink-600',   border: 'border-pink-300',   ring: 'hover:shadow-pink-500/20' },
  Video:      { bg: 'bg-indigo-500', bgDark: 'bg-indigo-500/20', text: 'text-indigo-300', textLight: 'text-indigo-600', border: 'border-indigo-300', ring: 'hover:shadow-indigo-500/20' },
  Medical:    { bg: 'bg-red-500',    bgDark: 'bg-red-500/20',    text: 'text-red-300',    textLight: 'text-red-600',    border: 'border-red-300',    ring: 'hover:shadow-red-500/20' },
  Finance:    { bg: 'bg-green-500',   bgDark: 'bg-green-500/20',  text: 'text-green-300',  textLight: 'text-green-600',  border: 'border-green-300',  ring: 'hover:shadow-green-500/20' },
  Law:        { bg: 'bg-gray-700',    bgDark: 'bg-gray-700/20',    text: 'text-gray-300',    textLight: 'text-gray-600',    border: 'border-gray-300',    ring: 'hover:shadow-gray-500/20' },
  Agriculture:{ bg: 'bg-amber-600', bgDark: 'bg-amber-600/20', text: 'text-amber-300', textLight: 'text-amber-700', border: 'border-amber-300', ring: 'hover:shadow-amber-500/20' }
};

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

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const categorySlug = slug.charAt(0).toUpperCase() + slug.slice(1);
  const category = categorySlug as Category;

  if (!Object.keys(categoryNames).includes(category)) {
    return {
      title: 'Not Found – Use AI Tools',
    };
  }

  const categoryName = categoryNames[category];
  const title = `${categoryName} AI Tools – Use AI Tools`;
  const description = `Discover the best ${categoryName} AI tools. Handpicked directory of ${categoryName} tools to boost your workflow.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const categorySlug = slug.charAt(0).toUpperCase() + slug.slice(1);
  const category = categorySlug as Category;

  if (!Object.keys(categoryNames).includes(category)) {
    notFound();
  }

  // Enrich tools with affiliate links from environment variables
  const categoryTools = tools
    .filter(t => t.category === category)
    .map(t => ({ ...t, affiliate_link: getAffiliateLink(t) }));
  const colors = colorMap[category];
  const description = categoryDescriptions[category];
  const categoryName = categoryNames[category];

  // CollectionPage Schema
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    'name': `${categoryName} AI Tools - Use AI Tools`,
    'description': description,
    'url': `https://useaitools.me/category/${slug}`,
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
      'numberOfItems': categoryTools.length,
      'itemListElement': categoryTools.map((tool, index) => ({
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
              { label: categoryName, href: `/category/${slug}`, current: true }
            ]} 
          />
          
          <div className="mb-8" />

          {/* Hero Component */}
          <CategoryHero 
            category={category}
            categoryName={categoryName}
            description={description}
          />

          <div className={`h-px bg-gradient-to-r from-transparent via-${categorySlug.toLowerCase()}-300 dark:via-${categorySlug.toLowerCase()}-500/20 to-transparent mb-10 mx-auto max-w-2xl`} />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {categoryTools.map((tool, index) => {
              const hasAffiliate = hasAffiliateLink(tool);
              const ctaText = hasAffiliate ? '🔗 Try It Free' : 'Visit Website';
              
              return (
              <div
                key={tool.id}
                className={`bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 shadow-sm dark:shadow-xl rounded-2xl overflow-hidden group hover:-translate-y-1.5 transition-all duration-300 ease-out ${colors.ring} relative`}
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
                <div className="p-7">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-start gap-3">
                      <div className={`w-11 h-11 rounded-xl ${colors.bgDark} ${colors.textLight} dark:${colors.text} flex items-center justify-center text-xl font-bold group-hover:scale-105 transition-transform duration-300`}>
                        {tool.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-xl text-slate-900 dark:text-white">
                          {tool.name}
                        </h3>
                        <div className="flex items-center gap-1.5 mt-1">
                          {tool.needs_vpn ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                              🪜 VPN
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                              ✅ Direct
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      {tool.pricing}
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-gray-300 leading-relaxed mb-6">
                    {tool.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${colors.bg} text-white dark:${colors.bgDark} dark:${colors.text}`}>
                      {tool.category}
                    </span>
                    <a
                      href={getAffiliateLink(tool) || tool.url}
                      target="_blank"
                      rel="noopener noreferrer sponsored"
                      className={`inline-flex items-center gap-2 px-4 py-2 border ${colors.border} dark:${colors.bgDark} dark:border-transparent ${colors.textLight} dark:${colors.text} text-sm font-semibold rounded-lg transition-all duration-300 ease-out hover:-translate-y-0.5 hover:${colors.bg} hover:text-white hover:border-transparent`}
                    >
                      {ctaText}
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            );
            })}
          </div>

          <div className="text-center mt-12">
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
