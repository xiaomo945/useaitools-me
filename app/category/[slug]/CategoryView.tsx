import type { Metadata } from 'next';
import Link from 'next/link';
import toolsData from '@/data/tools.json';
import { ArrowRight } from 'lucide-react';
import Footer from '@/app/components/Footer';
import CategoryHero from './CategoryHero';
import Breadcrumbs from '@/app/components/Breadcrumbs';
import { generateSlugFromName } from '@/lib/slug';
import CategoryStats from '@/app/components/CategoryStats';
import GoldPicks from '@/app/components/GoldPicks';
import TopTools from '@/app/components/TopTools';
import type { Tool } from '@/types';
import { getAffiliateLink, hasAffiliateLink } from '@/lib/affiliate';

const tools = toolsData as unknown as Tool[];
export type Category = Tool['category'];

/**
 * How many tool cards one category page renders.
 *
 * The grid used to render the entire category. `/category/code` holds 481 tools
 * and answered with 4.3 MB of HTML — `/category/productivity` 3.0 MB, and the
 * six category pages together were ~11 MB per crawl sweep. Every crawler pass
 * pulled all of that from the origin, which is most of why Fast Origin Transfer
 * reached 15.5 GB against a 10 GB allowance.
 *
 * 48 keeps a page around 400 KB while still giving each listing enough tools to
 * be worth landing on.
 */
export const TOOLS_PER_PAGE = 48;

export const categoryDescriptions: Record<Category, string> = {
  Writing: 'Discover powerful AI writing tools that help you create high-quality content faster, from blog posts and marketing copy to creative stories and academic papers.',
  Image: 'Explore cutting-edge AI image generation and editing tools that transform your creative ideas into stunning visuals with just a few words.',
  Productivity: 'Boost your workflow with AI-powered productivity tools that automate tasks, manage your schedule, and help you get more done in less time.',
  Code: 'Supercharge your development with AI coding assistants that write, refactor, and debug code for you, making programming faster and more accessible.',
  Audio: 'Create professional audio content with AI tools that generate realistic voices, produce music, and edit sound with incredible precision.',
  Video: 'Bring your videos to life with AI video tools that generate, edit, and enhance video content, from animated avatars to full-length productions.',
};

export const categoryNames: Record<Category, string> = {
  Writing: 'Writing',
  Image: 'Image',
  Productivity: 'Productivity',
  Code: 'Code',
  Audio: 'Audio',
  Video: 'Video',
};

export const CATEGORY_SLUGS = Object.keys(categoryNames).map((c) => c.toLowerCase());

export function resolveCategory(slug: string): Category | null {
  const candidate = slug.charAt(0).toUpperCase() + slug.slice(1) as Category;
  return Object.keys(categoryNames).includes(candidate) ? candidate : null;
}

const colorMap: Record<Category, { bg: string; bgDark: string; text: string; textLight: string; border: string; ring: string }> = {
  Writing:      { bg: 'bg-blue-500',   bgDark: 'bg-blue-500/20',   text: 'text-blue-300',   textLight: 'text-blue-600',   border: 'border-blue-300',   ring: 'hover:shadow-blue-500/20' },
  Image:        { bg: 'bg-violet-500', bgDark: 'bg-violet-500/20', text: 'text-violet-300', textLight: 'text-violet-600', border: 'border-violet-300', ring: 'hover:shadow-violet-500/20' },
  Productivity: { bg: 'bg-teal-500',   bgDark: 'bg-teal-500/20',   text: 'text-teal-300',   textLight: 'text-teal-600',   border: 'border-teal-300',   ring: 'hover:shadow-teal-500/20' },
  Code:         { bg: 'bg-orange-500', bgDark: 'bg-orange-500/20', text: 'text-orange-300', textLight: 'text-orange-600', border: 'border-orange-300', ring: 'hover:shadow-orange-500/20' },
  Audio:        { bg: 'bg-pink-500',   bgDark: 'bg-pink-500/20',   text: 'text-pink-300',   textLight: 'text-pink-600',   border: 'border-pink-300',   ring: 'hover:shadow-pink-500/20' },
  Video:        { bg: 'bg-indigo-500', bgDark: 'bg-indigo-500/20', text: 'text-indigo-300', textLight: 'text-indigo-600', border: 'border-indigo-300', ring: 'hover:shadow-indigo-500/20' },
};

/** Every tool in a category, with its affiliate link resolved from env. */
export function categoryTools(category: Category) {
  return tools
    .filter((t) => t.category === category)
    .map((t) => ({ ...t, affiliate_link: getAffiliateLink(t) }));
}

export function categoryTotalPages(category: Category): number {
  return Math.max(1, Math.ceil(categoryTools(category).length / TOOLS_PER_PAGE));
}

/** `/category/<slug>` for page 1, `/category/<slug>/page/<n>` after that. */
export function categoryPageHref(slug: string, page: number): string {
  return page <= 1 ? `/category/${slug}` : `/category/${slug}/page/${page}`;
}

/**
 * Metadata for one page of a category listing.
 *
 * Page 1 is the landing page and stays indexable. Pages 2..N are pure
 * navigation: they exist so the grid can be split into cacheable, reasonably
 * sized responses, not because anyone searches for "page 2". They carry
 * `noindex, follow` — noindex so a site that is still recovering from a mass
 * thin-content rejection does not add 27 more near-duplicate listing pages to
 * the index, and `follow` so the 48 tool links on each one still pass through.
 */
export function categoryMetadata(category: Category, page: number): Metadata {
  const slug = category.toLowerCase();
  const categoryName = categoryNames[category];
  const description = categoryDescriptions[category];
  const canonical = `https://useaitools.me/category/${slug}`;

  if (page <= 1) {
    return {
      title: `${categoryName} AI Tools - Use AI Tools`,
      description,
      openGraph: {
        title: `${categoryName} AI Tools - Use AI Tools`,
        description,
        siteName: 'Use AI Tools',
        type: 'website',
        url: canonical,
        locale: 'en_US',
      },
      twitter: { card: 'summary_large_image', title: `${categoryName} AI Tools - Use AI Tools`, description },
      // No hreflang: `?lang=zh` serves identical English HTML (no [locale]
      // segment exists), so it only creates duplicate-content signals.
      alternates: { canonical },
    };
  }

  return {
    title: `${categoryName} AI Tools – Page ${page}`,
    description,
    robots: { index: false, follow: true },
    // Self-referencing, not omitted. `app/layout.tsx` sets a global
    // `canonical: https://useaitools.me`, so any page that does not override it
    // claims to be a duplicate of the homepage — which is what this route did
    // before this line existed.
    alternates: { canonical: `${canonical}/page/${page}` },
  };
}

function pageWindow(current: number, total: number): (number | 'gap')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const out: (number | 'gap')[] = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  if (start > 2) out.push('gap');
  for (let i = start; i <= end; i++) out.push(i);
  if (end < total - 1) out.push('gap');
  out.push(total);
  return out;
}

function CategoryPager({
  slug,
  current,
  total,
  totalTools,
}: {
  slug: string;
  current: number;
  total: number;
  totalTools: number;
}) {
  if (total <= 1) return null;

  const edge = 'pointer-events-none opacity-40';
  const normal =
    'bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-gray-800';

  return (
    <nav aria-label="Category pagination" className="mt-12 flex flex-col items-center gap-4">
      <div className="text-xs text-slate-500 dark:text-slate-400">
        Page <span className="font-semibold text-slate-700 dark:text-slate-300">{current}</span> of{' '}
        <span className="font-semibold text-slate-700 dark:text-slate-300">{total}</span>{' '}
        ({totalTools} tools)
      </div>
      <div className="flex flex-wrap items-center justify-center gap-1.5">
        <Link
          href={categoryPageHref(slug, current - 1)}
          aria-disabled={current === 1}
          className={`inline-flex items-center gap-1 px-3 py-2 text-sm font-semibold rounded-full border transition-all ${current === 1 ? edge : normal}`}
        >
          ← Prev
        </Link>
        {pageWindow(current, total).map((p, i) =>
          p === 'gap' ? (
            <span key={`gap-${i}`} className="px-2 text-slate-400 dark:text-slate-500 text-sm font-semibold">
              …
            </span>
          ) : (
            <Link
              key={p}
              href={categoryPageHref(slug, p)}
              aria-current={p === current ? 'page' : undefined}
              className={`min-w-[40px] h-10 px-3 inline-flex items-center justify-center text-sm font-semibold rounded-full transition-all ${
                p === current
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/25'
                  : normal
              }`}
            >
              {p}
            </Link>
          ),
        )}
        <Link
          href={categoryPageHref(slug, current + 1)}
          aria-disabled={current === total}
          className={`inline-flex items-center gap-1 px-3 py-2 text-sm font-semibold rounded-full border transition-all ${current === total ? edge : normal}`}
        >
          Next →
        </Link>
      </div>
    </nav>
  );
}

/**
 * A category listing.
 *
 * Rendered by `/category/<slug>` (page 1) and `/category/<slug>/page/<n>`.
 * Both routes share this markup so the two cannot drift apart.
 */
export function CategoryView({ category, page }: { category: Category; page: number }) {
  const slug = category.toLowerCase();
  const categoryToolsAll = categoryTools(category);
  const colors = colorMap[category];
  const description = categoryDescriptions[category];
  const categoryName = categoryNames[category];

  const totalPages = Math.max(1, Math.ceil(categoryToolsAll.length / TOOLS_PER_PAGE));
  const currentPage = Math.min(Math.max(page, 1), totalPages);
  const startIdx = (currentPage - 1) * TOOLS_PER_PAGE;
  const pageTools = categoryToolsAll.slice(startIdx, startIdx + TOOLS_PER_PAGE);
  const isFirstPage = currentPage === 1;

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://useaitools.me' },
      {
        '@type': 'ListItem',
        position: 2,
        name: `${categoryName} AI Tools`,
        item: `https://useaitools.me/category/${slug}`,
      },
      ...(isFirstPage
        ? []
        : [
            {
              '@type': 'ListItem',
              position: 3,
              name: `Page ${currentPage}`,
              item: `https://useaitools.me/category/${slug}/page/${currentPage}`,
            },
          ]),
    ],
  };

  // Only the tools on this page are listed. Emitting all 481 entries with their
  // descriptions was a sizeable slice of the old 4.3 MB response and described
  // a list this document does not contain.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${categoryName} AI Tools - Use AI Tools`,
    description,
    url: `https://useaitools.me/category/${slug}`,
    publisher: {
      '@type': 'Organization',
      name: 'Use AI Tools',
      logo: { '@type': 'ImageObject', url: 'https://useaitools.me/logo.png' },
    },
    author: { '@type': 'Organization', name: 'Use AI Tools' },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: pageTools.length,
      itemListElement: pageTools.map((tool, index) => ({
        '@type': 'ListItem',
        position: startIdx + index + 1,
        name: tool.name,
        // The canonical tool URL - /tools/<id> only 308-redirects here, and a
        // structured-data URL should point at the page that actually exists.
        url: `https://useaitools.me/tool/${generateSlugFromName(tool.name)}`,
        description: tool.description_en || tool.description,
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen bg-slate-50 dark:bg-gray-950 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <Breadcrumbs
            items={
              isFirstPage
                ? [
                    { label: 'Home', href: '/' },
                    { label: categoryName, href: `/category/${slug}`, current: true },
                  ]
                : [
                    { label: 'Home', href: '/' },
                    { label: categoryName, href: `/category/${slug}` },
                    { label: `Page ${currentPage}`, href: `/category/${slug}/page/${currentPage}`, current: true },
                  ]
            }
          />

          <div className="mb-8" />

          {/* Writer Promotion Banner for Writing Category */}
          {isFirstPage && category === 'Writing' && (
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-500 p-px mb-10 shadow-xl">
              <div className="relative overflow-hidden rounded-3xl bg-emerald-50 dark:bg-gray-900 p-8 sm:p-10 border-l-4 border-emerald-600">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 mb-4">
                      <span className="animate-pulse">✨</span> Live Now
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">
                      🖋️ Looking for an affordable AI writer? Try our own tool — built for creators who refuse to overpay.
                    </h2>
                    <p className="text-lg text-slate-600 dark:text-gray-300 max-w-xl">
                      Write 3x faster with AI — try it free.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <a
                      href="https://tryaiwriter.com"
                      target="_blank" rel="noopener noreferrer"
                      className="flex-shrink-0 inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 hover:-translate-y-0.5 transition-all duration-300"
                    >
                      Try Use AI Writer Free
                      <ArrowRight className="w-5 h-5" />
                    </a>
                    <Link
                      href="/writer"
                      className="flex-shrink-0 inline-flex items-center justify-center gap-2 px-8 py-4 border border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-300 font-semibold rounded-xl hover:bg-emerald-100/50 dark:hover:bg-emerald-500/10 transition-all duration-300"
                    >
                      Explore Tools
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {isFirstPage ? (
            <>
              {/* Hero Component */}
              <CategoryHero
                category={category}
                categoryName={categoryName}
                description={description}
                toolCount={categoryToolsAll.length}
              />

              {/* Stats Component */}
              <CategoryStats category={category} tools={categoryToolsAll} />

              {/* Gold Picks: Top 3 Editor Recommendations */}
              <GoldPicks tools={categoryToolsAll} categoryColors={colors} />

              {/* Top 10 Tools by Rating */}
              <TopTools tools={categoryToolsAll} category={categoryName} categoryColors={colors} />

              <div className={`h-px bg-gradient-to-r from-transparent via-${slug}-300 dark:via-${slug}-500/20 to-transparent mb-10 mx-auto max-w-2xl`} />
            </>
          ) : (
            <div className="mb-10">
              <div className="text-xs uppercase tracking-wider font-bold text-emerald-600 dark:text-emerald-400 mb-3">
                {categoryName} · Page {currentPage} of {totalPages}
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white mb-4 leading-tight">
                {categoryName} AI Tools — Page {currentPage}
              </h1>
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
                {description}
              </p>
              <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
                Showing {startIdx + 1}–{startIdx + pageTools.length} of {categoryToolsAll.length} tools.{' '}
                <Link href={`/category/${slug}`} className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline">
                  Back to the top of {categoryName}
                </Link>
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 lg:gap-7">
            {pageTools.map((tool, index) => {
              const hasAffiliate = hasAffiliateLink(tool);
              const ctaText = hasAffiliate ? '🔗 Try It Free' : 'Visit Website';
              const toolHref = `/tool/${generateSlugFromName(tool.name)}`;

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
                          {/* The name links to the tool's own page. Before this the
                              grid only linked out to vendor sites, so none of the
                              481 tools in Code had an internal link from their own
                              category listing - the review pages were reachable
                              only through the sitemap and the top-10 rail.
                              prefetch is off: a reader opens one of these 48
                              cards, not all of them, and a renderer that never
                              clicks - Googlebot included - should not be
                              fetching 48 RSC payloads to draw one page. */}
                          <h3 className="font-semibold text-xl text-slate-900 dark:text-white">
                            <Link prefetch={false} href={toolHref} className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                              {tool.name}
                            </Link>
                          </h3>
                          <div className="flex items-center gap-1.5 mt-1">
                            {tool.needs_vpn ? (
                              <span title="Not available in every region." className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300">
                                🌐 Region-locked
                              </span>
                            ) : (
                              <span title="Available worldwide without a VPN." className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                                ✅ Global
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
                        target="_blank" rel="noopener noreferrer"
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

          <CategoryPager
            slug={slug}
            current={currentPage}
            total={totalPages}
            totalTools={categoryToolsAll.length}
          />

          {/* Promote Your Tool — Featured Listing */}
          <div className="mt-12 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border border-emerald-200/60 dark:border-emerald-800/40 rounded-2xl p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">🚀 Promote Your AI Tool</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Get featured in this category and reach thousands of AI enthusiasts. Starting at <span className="font-semibold text-emerald-600 dark:text-emerald-400">$19/listing</span>.
                </p>
              </div>
              <Link
                href="/submit/featured"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 whitespace-nowrap"
              >
                Get Featured →
              </Link>
            </div>
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
