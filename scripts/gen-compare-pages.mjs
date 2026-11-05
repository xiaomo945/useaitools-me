/**
 * Regenerate the three /compare/<category> pages from one template.
 *
 * Why: the three files were copy-pasted and had drifted into shipping
 * invented data (a "Top Pick" chosen by an all-null rating column, 0-star
 * badges, and three hardcoded "Key Features" bullets pasted onto every tool),
 * plus ~350 default-prefetching <Link>s per page. This template keeps only
 * fields that actually exist in tools.json and turns prefetch off.
 *
 * Run from the repo root: node scripts/gen-compare-pages.mjs
 */
import fs from 'node:fs';
import path from 'node:path';

const cwd = process.cwd();
if (!fs.existsSync(path.join(cwd, 'app', 'compare', 'CompareClient.tsx'))) {
  throw new Error('Run this from the repo root (useaitools-me/).');
}

const pages = [
  {
    dir: 'video',
    category: 'Video',
    component: 'VideoComparePage',
    title: 'AI Video Tools Comparison - Use AI Tools',
    metaDescription:
      'Compare the best AI video editing tools including VEED.io, Runway ML, and more. Find the perfect AI video tool for your video production needs.',
    heroTitle: 'AI Video Tools Comparison',
    heroSubtitle:
      'Compare the best AI video editing tools and find the perfect tool for your video production workflow',
    tableTitle: 'Compare All Video Tools',
    ctaTitle: 'Find Your Perfect AI Video Tool',
    ctaSubtitle:
      'Compare pricing and features, then open any tool for its full breakdown and hands-on notes.',
    ctaLabel: 'View All Video Tools →',
    categoryHref: '/category/video',
    accent: 'indigo',
    gradient: 'from-indigo-500 to-purple-600',
    iconPaths: [
      'M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z',
      'M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    ],
  },
  {
    dir: 'audio',
    category: 'Audio',
    component: 'AudioComparePage',
    title: 'AI Audio Tools Comparison - Use AI Tools',
    metaDescription:
      'Compare the best AI voice generators including Murf AI, ElevenLabs, and more. Find the perfect AI audio tool for your voiceover and audio production needs.',
    heroTitle: 'AI Audio Tools Comparison',
    heroSubtitle:
      'Compare the best AI voice generators and audio tools to find the perfect solution for your voiceover needs',
    tableTitle: 'Compare All Audio Tools',
    ctaTitle: 'Find Your Perfect AI Audio Tool',
    ctaSubtitle:
      'Compare pricing and features, then open any tool for its full breakdown and hands-on notes.',
    ctaLabel: 'View All Audio Tools →',
    categoryHref: '/category/audio',
    accent: 'pink',
    gradient: 'from-pink-500 to-rose-600',
    iconPaths: [
      'M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z',
    ],
  },
  {
    dir: 'writing',
    category: 'Writing',
    component: 'WritingComparePage',
    title: 'AI Writing Tools Comparison - Use AI Tools',
    metaDescription:
      'Compare the best AI writing tools including Rytr, Copy.ai, and Jasper. Find the perfect AI writing assistant for your content creation needs.',
    heroTitle: 'AI Writing Tools Comparison',
    heroSubtitle:
      'Compare the best AI writing assistants and find the perfect tool for your content creation workflow',
    tableTitle: 'Compare All Writing Tools',
    ctaTitle: 'Find Your Perfect AI Writing Tool',
    ctaSubtitle:
      'Compare pricing and features, then open any tool for its full breakdown and hands-on notes.',
    ctaLabel: 'View All Writing Tools →',
    categoryHref: '/category/writing',
    accent: 'blue',
    gradient: 'from-blue-500 to-indigo-600',
    iconPaths: [
      'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
    ],
  },
];

function iconSvg(paths) {
  return paths
    .map(
      (d) =>
        '              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="' +
        d +
        '" />'
    )
    .join('\n');
}

function render(p) {
  const a = p.accent;
  const chip =
    'bg-' + a + '-500/10 text-' + a + '-600';
  const iconBox =
    'bg-' + a + '-100 dark:bg-' + a + '-500/20 text-' + a + '-600 dark:text-' + a + '-400';
  const heroBox =
    'bg-' + a + '-100 dark:bg-' + a + '-500/20 text-' + a + '-600 dark:text-' + a + '-400';
  const linkHover = 'hover:text-' + a + '-600 dark:hover:text-' + a + '-400';
  const solidBtn = 'bg-' + a + '-500 hover:bg-' + a + '-600';

  return `import type { Metadata } from 'next';
import Link from 'next/link';
import tools from '@/data/tools.json';
import Footer from '@/app/components/Footer';
import { getAffiliateLink } from '@/lib/affiliate';
import { generateSlugFromName } from '@/lib/slug';

export const metadata: Metadata = {
  title: '${p.title}',
  description: '${p.metaDescription}',
  // Each category comparison owns its own canonical. The /compare layout used
  // to declare one for the hub, which made all three of these copies of it.
  alternates: { canonical: 'https://useaitools.me/compare/${p.dir}' },
};

type Tool = {
  id: number;
  name: string;
  description: string;
  category: string;
  pricing: string;
  url: string;
  affiliate_link: string;
};

const ${p.dir}Tools = (tools as unknown as Tool[]).filter(tool => tool.category === '${p.category}');

const getPricingColors = (pricing: string) => {
  switch (pricing) {
    case 'Freemium':
      return { bg: 'bg-emerald-100', text: 'text-emerald-700' };
    case 'Free Trial':
      return { bg: 'bg-blue-100', text: 'text-blue-700' };
    case 'Paid':
      return { bg: 'bg-slate-100', text: 'text-slate-700' };
    case 'Open Source':
      return { bg: 'bg-purple-100', text: 'text-purple-700' };
    default:
      return { bg: 'bg-slate-100', text: 'text-slate-700' };
  }
};

export default function ${p.component}() {
  // Every rating in tools.json is null, so sorting by rating was a no-op that
  // still implied a ranking. A-Z is deterministic and makes no claim.
  const sortedTools = [...${p.dir}Tools].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl ${heroBox} mb-6">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
${iconSvg(p.iconPaths)}
            </svg>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
            ${p.heroTitle}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            ${p.heroSubtitle}
          </p>
        </div>

        {/* Count is derived at render time, never hardcoded. There is no rating
            data in the catalogue, so this page makes no "Top Pick" claim. */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-slate-200 dark:border-gray-800 px-6 py-5 mb-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-600 dark:text-gray-400">
            <span className="font-semibold text-slate-900 dark:text-white">{sortedTools.length}</span> ${p.category} tools, listed A–Z. Open any tool for its full breakdown, pricing and hands-on notes.
          </p>
          <Link
            href="${p.categoryHref}"
            prefetch={false}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold ${chip} rounded-lg whitespace-nowrap"
          >
            Browse the ${p.category} category →
          </Link>
        </div>

        {/* Comparison Table */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-slate-200 dark:border-gray-800 overflow-hidden mb-12">
          <div className="bg-slate-50 dark:bg-gray-800 px-6 py-4 border-b border-slate-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">${p.tableTitle}</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-gray-700">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">Tool</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">Pricing</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600 dark:text-gray-400">Action</th>
                </tr>
              </thead>
              <tbody>
                {sortedTools.map((tool) => {
                  const pricingColors = getPricingColors(tool.pricing);
                  const toolHref = '/tool/' + generateSlugFromName(tool.name);
                  const visitHref = getAffiliateLink(tool) || tool.url;
                  return (
                    <tr key={tool.id} className="border-b border-slate-100 dark:border-gray-700 hover:bg-slate-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl ${chip} flex items-center justify-center text-lg font-bold shrink-0">
                            {tool.name.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <Link href={toolHref} prefetch={false} className="font-semibold text-gray-900 dark:text-white ${linkHover}">
                              {tool.name}
                            </Link>
                            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{tool.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={'px-3 py-1.5 rounded-full text-xs font-semibold ' + pricingColors.bg + ' ' + pricingColors.text}>
                          {tool.pricing}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end">
                          <a
                            href={visitHref}
                            target="_blank" rel="noopener noreferrer"
                            className="px-3 py-2 text-sm font-semibold text-white rounded-lg transition-colors ${solidBtn}"
                          >
                            Visit →
                          </a>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r ${p.gradient} rounded-3xl p-8 text-white">
            <h2 className="text-2xl font-bold mb-4">${p.ctaTitle}</h2>
            <p className="text-${a}-100 mb-6 max-w-xl mx-auto">
              ${p.ctaSubtitle}
            </p>
            <Link
              href="${p.categoryHref}"
              prefetch={false}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-${a}-600 font-semibold rounded-xl hover:bg-${a}-50 transition-colors"
            >
              ${p.ctaLabel}
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
`;
}

for (const page of pages) {
  const out = path.join(cwd, 'app', 'compare', page.dir, 'page.tsx');
  fs.writeFileSync(out, render(page), 'utf8');
  console.log('wrote', out);
}
