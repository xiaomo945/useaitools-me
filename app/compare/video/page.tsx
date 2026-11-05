import type { Metadata } from 'next';
import Link from 'next/link';
import tools from '@/data/tools.json';
import Footer from '@/app/components/Footer';
import { getAffiliateLink } from '@/lib/affiliate';
import { generateSlugFromName } from '@/lib/slug';

export const metadata: Metadata = {
  title: 'AI Video Tools Comparison - Use AI Tools',
  description: 'Compare the best AI video editing tools including VEED.io, Runway ML, and more. Find the perfect AI video tool for your video production needs.',
  // Each category comparison owns its own canonical. The /compare layout used
  // to declare one for the hub, which made all three of these copies of it.
  alternates: { canonical: 'https://useaitools.me/compare/video' },
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

const videoTools = (tools as unknown as Tool[]).filter(tool => tool.category === 'Video');

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

export default function VideoComparePage() {
  // Every rating in tools.json is null, so sorting by rating was a no-op that
  // still implied a ranking. A-Z is deterministic and makes no claim.
  const sortedTools = [...videoTools].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 mb-6">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
            AI Video Tools Comparison
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Compare the best AI video editing tools and find the perfect tool for your video production workflow
          </p>
        </div>

        {/* Count is derived at render time, never hardcoded. There is no rating
            data in the catalogue, so this page makes no "Top Pick" claim. */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-slate-200 dark:border-gray-800 px-6 py-5 mb-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-600 dark:text-gray-400">
            <span className="font-semibold text-slate-900 dark:text-white">{sortedTools.length}</span> Video tools, listed A–Z. Open any tool for its full breakdown, pricing and hands-on notes.
          </p>
          <Link
            href="/category/video"
            prefetch={false}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-indigo-500/10 text-indigo-600 rounded-lg whitespace-nowrap"
          >
            Browse the Video category →
          </Link>
        </div>

        {/* Comparison Table */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-slate-200 dark:border-gray-800 overflow-hidden mb-12">
          <div className="bg-slate-50 dark:bg-gray-800 px-6 py-4 border-b border-slate-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Compare All Video Tools</h2>
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
                          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center text-lg font-bold shrink-0">
                            {tool.name.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <Link href={toolHref} prefetch={false} className="font-semibold text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400">
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
                            className="px-3 py-2 text-sm font-semibold text-white rounded-lg transition-colors bg-indigo-500 hover:bg-indigo-600"
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
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl p-8 text-white">
            <h2 className="text-2xl font-bold mb-4">Find Your Perfect AI Video Tool</h2>
            <p className="text-indigo-100 mb-6 max-w-xl mx-auto">
              Compare pricing and features, then open any tool for its full breakdown and hands-on notes.
            </p>
            <Link
              href="/category/video"
              prefetch={false}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-indigo-600 font-semibold rounded-xl hover:bg-indigo-50 transition-colors"
            >
              View All Video Tools →
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
