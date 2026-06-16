import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import toolsData from '@/data/tools.json';
import Footer from '@/app/components/Footer';
import { ArrowRight, Star } from 'lucide-react';
import { scenes, getSceneBySlug, getSceneSlugs, type SceneConfig } from '@/data/scenes';
import type { Tool } from '@/types';

const tools = toolsData as Tool[];

export async function generateStaticParams() {
  return getSceneSlugs().map(slug => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const scene = getSceneBySlug(slug);
  if (!scene) {
    return { title: 'Scene Not Found – Use AI Tools' };
  }
  return {
    title: scene.metaTitle,
    description: scene.metaDescription,
    openGraph: { title: scene.metaTitle, description: scene.metaDescription, type: 'website' },
    twitter: {
      card: 'summary_large_image',
      title: scene.metaTitle,
      description: scene.metaDescription,
    },
    alternates: { canonical: `https://useaitools.me/scenes/${slug}` },
  };
}

// Affiliate link helpers (same pattern as other pages)
function hasAffiliateLink(tool: Tool): boolean {
  const envVarName = `AFFILIATE_${tool.name.toUpperCase().replace(/\s+/g, '_')}`;
  let shortEnvVarName = '';
  if (tool.name.includes('Rytr')) shortEnvVarName = 'AFFILIATE_RYTR';
  else if (tool.name.includes('VEED')) shortEnvVarName = 'AFFILIATE_VEED';
  else if (tool.name.includes('Murf')) shortEnvVarName = 'AFFILIATE_MURF';
  else if (tool.name.includes('Pictory')) shortEnvVarName = 'AFFILIATE_PICTORY';
  else if (tool.name.includes('Grammarly')) shortEnvVarName = 'AFFILIATE_GRAMMARLY';
  const envLink = (shortEnvVarName && process.env[shortEnvVarName]) || process.env[envVarName];
  return !!(envLink || tool.affiliate_link);
}

function getAffiliateLink(tool: Tool): string {
  const envVarName = `AFFILIATE_${tool.name.toUpperCase().replace(/\s+/g, '_')}`;
  let shortEnvVarName = '';
  if (tool.name.includes('Rytr')) shortEnvVarName = 'AFFILIATE_RYTR';
  else if (tool.name.includes('VEED')) shortEnvVarName = 'AFFILIATE_VEED';
  else if (tool.name.includes('Murf')) shortEnvVarName = 'AFFILIATE_MURF';
  else if (tool.name.includes('Pictory')) shortEnvVarName = 'AFFILIATE_PICTORY';
  else if (tool.name.includes('Grammarly')) shortEnvVarName = 'AFFILIATE_GRAMMARLY';
  const envLink = (shortEnvVarName && process.env[shortEnvVarName]) || process.env[envVarName];
  return envLink || tool.affiliate_link || tool.url;
}

const categoryColorMap: Record<string, { bg: string; bgDark: string; text: string; textLight: string }> = {
  Writing:    { bg: 'bg-blue-500', bgDark: 'bg-blue-500/20', text: 'text-blue-300', textLight: 'text-blue-600' },
  Image:      { bg: 'bg-violet-500', bgDark: 'bg-violet-500/20', text: 'text-violet-300', textLight: 'text-violet-600' },
  Productivity: { bg: 'bg-teal-500', bgDark: 'bg-teal-500/20', text: 'text-teal-300', textLight: 'text-teal-600' },
  Code:       { bg: 'bg-orange-500', bgDark: 'bg-orange-500/20', text: 'text-orange-300', textLight: 'text-orange-600' },
  Audio:      { bg: 'bg-pink-500', bgDark: 'bg-pink-500/20', text: 'text-pink-300', textLight: 'text-pink-600' },
  Video:      { bg: 'bg-indigo-500', bgDark: 'bg-indigo-500/20', text: 'text-indigo-300', textLight: 'text-indigo-600' },
};

function getCategoryColors(category: string) {
  return categoryColorMap[category] || { bg: 'bg-slate-500', bgDark: 'bg-slate-500/20', text: 'text-slate-300', textLight: 'text-slate-600' };
}

function getSceneTools(scene: SceneConfig): Tool[] {
  const included = new Set(
    scene.includes.flat().map(n => n.toLowerCase())
  );
  const excluded = new Set(
    (scene.excludes || []).map(n => n.toLowerCase())
  );
  return tools.filter(t => {
    const name = t.name.toLowerCase();
    return included.has(name) && !excluded.has(name);
  });
}

function getTopPicks(scene: SceneConfig, sceneTools: Tool[]): Tool[] {
  return scene.topPicks
    .map(name => sceneTools.find(t => t.name.toLowerCase() === name.toLowerCase()))
    .filter(Boolean) as Tool[];
}

function generateSchema(scene: SceneConfig, toolCount: number) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: scene.metaTitle,
    description: scene.metaDescription,
    url: `https://useaitools.me/scenes/${scene.slug}`,
    numberOfItems: toolCount,
  };
}

function generateBreadcrumbSchema(scene: SceneConfig) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://useaitools.me',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Scenes',
        item: 'https://useaitools.me/scenes',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: scene.title,
        item: `https://useaitools.me/scenes/${scene.slug}`,
      },
    ],
  };
}

export default async function ScenePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const scene = getSceneBySlug(slug);
  if (!scene) notFound();

  const sceneTools = getSceneTools(scene);
  const topPicks = getTopPicks(scene, sceneTools);
  const otherTools = sceneTools.filter(t => !topPicks.includes(t));
  const schemaOrg = generateSchema(scene, sceneTools.length);
  const breadcrumbSchema = generateBreadcrumbSchema(scene);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <div className="min-h-screen bg-slate-50 dark:bg-gray-950">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-emerald-50/80 to-slate-50 dark:from-gray-900 dark:to-gray-950 border-b border-slate-200 dark:border-gray-800">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
            <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:underline mb-6 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              Back to Home
            </Link>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 mb-4">
              <span>{scene.heroTag}</span> {scene.heroTagLabel}
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              {scene.title}
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mb-3 leading-relaxed">
              {scene.subtitle}
            </p>

            <p className="text-base text-slate-500 dark:text-slate-400 max-w-xl">
              {scene.description}
            </p>

            <div className="flex items-center gap-4 mt-6">
              <span className="text-sm text-slate-500 dark:text-slate-400">
                <span className="font-bold text-slate-900 dark:text-white">{sceneTools.length}</span> tools reviewed
              </span>
              <span className="text-slate-300 dark:text-slate-700">|</span>
              <span className="text-sm text-slate-500 dark:text-slate-400">
                Updated <span className="font-medium">2026</span>
              </span>
            </div>
          </div>
        </section>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
          {/* Top 3 Editor Picks */}
          {topPicks.length > 0 && (
            <section className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl">🏆</span>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                    Editor&apos;s Top Picks
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Our top 3 recommendations for {scene.title.toLowerCase()}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {topPicks.map((tool, index) => {
                  const hasAffiliate = hasAffiliateLink(tool);
                  const affiliateUrl = getAffiliateLink(tool);
                  const colors = getCategoryColors(tool.category);
                  const rankBadge = index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉';
                  const isFeatured = index === 0;

                  return (
                    <div
                      key={tool.id}
                      className={`relative rounded-2xl overflow-hidden border transition-all duration-300 hover:-translate-y-1 ${
                        isFeatured
                          ? 'border-emerald-200 dark:border-emerald-500/30 shadow-lg shadow-emerald-500/5'
                          : 'border-slate-200/60 dark:border-gray-800/80 shadow-sm hover:shadow-md'
                      } bg-white dark:bg-gray-900`}
                    >
                      {isFeatured && (
                        <div className="h-1 w-full bg-gradient-to-r from-emerald-500 to-teal-500" />
                      )}

                      <div className="absolute top-3 left-3 z-10">
                        <span className="text-lg">{rankBadge}</span>
                      </div>

                      {hasAffiliate && (
                        <div className="absolute top-3 right-3 z-10">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/20">
                            ✨ Exclusive Deal
                          </span>
                        </div>
                      )}

                      <div className={`p-5 ${isFeatured ? 'pt-6' : ''}`}>
                        <div className="flex items-start gap-3 mb-3">
                          <div className={`w-10 h-10 rounded-xl ${colors.bgDark} ${colors.textLight} flex items-center justify-center text-lg font-bold flex-shrink-0`}>
                            {tool.name.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-semibold text-base text-slate-900 dark:text-white truncate">
                              {tool.name}
                            </h3>
                            <div className="flex items-center gap-2 mt-0.5">
                              {tool.rating && (
                                <div className="flex items-center gap-1">
                                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                    {(tool.rating || 0).toFixed(1)}
                                  </span>
                                </div>
                              )}
                              <span className="text-xs text-slate-400 dark:text-slate-500">
                                {tool.pricing}
                              </span>
                            </div>
                          </div>
                        </div>

                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-4">
                          {tool.description}
                        </p>

                        <a
                          href={affiliateUrl}
                          target="_blank" rel="noopener noreferrer"
                          className={`w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 ${
                            isFeatured
                              ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/25 hover:shadow-lg hover:shadow-emerald-500/30'
                              : hasAffiliate
                                ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/20 hover:bg-emerald-100 dark:hover:bg-emerald-500/20'
                                : `${colors.bg} text-white hover:opacity-90`
                          }`}
                        >
                          {hasAffiliate ? 'Try It Free' : 'Visit Website'}
                          <ArrowRight className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>

              <p className="mt-4 text-xs text-slate-400 dark:text-slate-500">
                Picks are based on user ratings, features, and value. We may earn a commission from some links, at no extra cost to you.{' '}
                <Link href="/affiliate-disclosure" className="underline hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                  Learn more
                </Link>
              </p>
            </section>
          )}

          {/* All Tools Grid */}
          {sceneTools.length > 0 && (
            <section className="mb-12">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
                All {scene.title} Tools ({sceneTools.length})
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {otherTools.map((tool, index) => {
                  const hasAffiliate = hasAffiliateLink(tool);
                  const affiliateUrl = getAffiliateLink(tool);
                  const colors = getCategoryColors(tool.category);

                  return (
                    <div
                      key={tool.id}
                      className={`group bg-white dark:bg-gray-900 border border-slate-200/60 dark:border-gray-800 shadow-sm rounded-2xl overflow-hidden hover:border-emerald-300 dark:hover:border-emerald-600 hover:shadow-xl hover:shadow-emerald-500/5 hover:-translate-y-1 transition-all duration-300 ease-out animate-fade-in-up ${
                        hasAffiliate ? 'affiliate-card' : ''
                      }`}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      {hasAffiliate && (
                        <div className="absolute top-3 right-3 z-10">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/25">
                            🏷️ Staff Pick
                          </span>
                        </div>
                      )}

                      <div className={`h-0.75 w-full ${colors.bg}`} style={{ height: '3px' }} />

                      <div className="p-4">
                        <Link href={`/tools/${tool.id}`} className="flex items-center gap-3 mb-3">
                          <div className={`w-10 h-10 rounded-xl ${colors.bg}/10 ${colors.textLight} flex items-center justify-center text-lg font-bold flex-shrink-0`}>
                            {tool.name.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-semibold text-base text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors truncate">
                              {tool.name}
                            </h3>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${colors.bg} text-white`}>
                                {tool.category}
                              </span>
                              <span className="text-xs text-slate-400 dark:text-slate-500">
                                {tool.pricing}
                              </span>
                            </div>
                          </div>
                        </Link>

                        <Link href={`/tools/${tool.id}`}>
                          <p className="text-sm text-slate-600 dark:text-gray-300 line-clamp-2 mb-3 hover:text-slate-900 dark:hover:text-white transition-colors">
                            {tool.description}
                          </p>
                        </Link>

                        {tool.best_for && tool.best_for.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mb-4">
                            {tool.best_for.slice(0, 3).map((tag: string, i: number) => (
                              <span key={i} className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="flex gap-2">
                          <a
                            href={affiliateUrl}
                            target="_blank" rel="noopener noreferrer"
                            className={`flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 ${
                              hasAffiliate
                                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-sm hover:shadow-lg hover:shadow-emerald-500/25'
                                : 'border border-emerald-300 dark:border-emerald-600/30 text-emerald-600 dark:text-emerald-400 hover:bg-gradient-to-r hover:from-emerald-500 hover:to-teal-500 hover:text-white hover:border-transparent'
                            }`}
                          >
                            {hasAffiliate ? 'Try Free' : 'Visit'}
                            <ArrowRight className="w-3.5 h-3.5" />
                          </a>
                          <Link
                            href={`/tools/${tool.id}`}
                            className="inline-flex items-center justify-center px-3 py-2.5 rounded-xl text-sm font-semibold border border-slate-200 dark:border-gray-700 text-slate-600 dark:text-slate-400 hover:border-emerald-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all duration-300"
                          >
                            Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* FAQ Section */}
          {scene.faq && scene.faq.length > 0 && (
            <section className="mb-12">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-6">
                Frequently Asked Questions
              </h2>
              <div className="space-y-3">
                {scene.faq.map((faq, index) => (
                  <details key={index} className="group bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-xl overflow-hidden">
                    <summary className="flex items-center justify-between cursor-pointer p-5 text-left hover:bg-slate-50 dark:hover:bg-gray-800/50 transition-colors list-none">
                      <span className="font-semibold text-slate-900 dark:text-white pr-4">{faq.question}</span>
                      <svg className="w-5 h-5 text-slate-400 flex-shrink-0 transition-transform duration-300 group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </summary>
                    <div className="px-5 pb-5 pt-0">
                      <p className="text-sm text-slate-600 dark:text-gray-300 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </details>
                ))}
              </div>
            </section>
          )}

          {/* Other Scenes */}
          <section className="mb-12">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
              Explore Other Scenes
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {scenes.filter(s => s.slug !== scene.slug).map(s => (
                <Link
                  key={s.slug}
                  href={`/scenes/${s.slug}`}
                  className="group p-4 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-xl hover:border-emerald-300 dark:hover:border-emerald-600 hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{s.heroTag}</span>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-sm text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors truncate">
                        {s.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {s.subtitle}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Footer */}
          <div className="text-center py-8 border-t border-slate-200 dark:border-gray-800">
            <Link href="/" className="inline-flex items-center gap-2 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
              Back to Home
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}
