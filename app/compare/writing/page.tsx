import type { Metadata } from 'next';
import Link from 'next/link';
import tools from '@/data/tools.json';
import Footer from '@/app/components/Footer';
import StarRating from '@/app/components/StarRating';

export const metadata: Metadata = {
  title: 'AI Writing Tools Comparison - Use AI Tools',
  description: 'Compare the best AI writing tools including Rytr, Copy.ai, and Jasper. Find the perfect AI writing assistant for your content creation needs.',
};

type Tool = {
  id: number;
  name: string;
  description: string;
  category: string;
  pricing: string;
  url: string;
  affiliate_link: string;
  icon_url: string;
  needs_vpn: boolean;
  rating?: number;
  rating_count?: number;
};

const writingTools = (tools as Tool[]).filter(tool => tool.category === 'Writing');

const getCategoryColors = () => ({
  bg: 'bg-blue-500',
  bgLight: 'bg-blue-500/10',
  text: 'text-blue-600',
  border: 'border-blue-300',
});

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

// Get affiliate link from environment variable or fallback
function getAffiliateLink(tool: Tool): string {
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
  return envLink || tool.affiliate_link || tool.url;
}

export default function WritingComparePage() {
  const sortedTools = [...writingTools].sort((a, b) => (b.rating || 0) - (a.rating || 0));
  const recommendedTool = sortedTools[0];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 mb-6">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
            AI Writing Tools Comparison
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Compare the best AI writing assistants and find the perfect tool for your content creation workflow
          </p>
        </div>

        {/* Recommended Tool Highlight */}
        {recommendedTool && (
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl p-8 mb-12 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
            <div className="relative z-10">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-3xl font-bold">
                    {recommendedTool.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold bg-white/20">
                        🏆 Top Pick
                      </span>
                      <StarRating rating={recommendedTool.rating || 0} count={recommendedTool.rating_count || 0} size="sm" />
                    </div>
                    <h3 className="text-2xl font-bold">{recommendedTool.name}</h3>
                    <p className="text-blue-100">{recommendedTool.description}</p>
                  </div>
                </div>
                <a
                  href={getAffiliateLink(recommendedTool)}
                  target="_blank" rel="noopener noreferrer"
                  className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-colors whitespace-nowrap"
                >
                  Try {recommendedTool.name} Free →
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Comparison Table */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-slate-200 dark:border-gray-800 overflow-hidden mb-12">
          <div className="bg-slate-50 dark:bg-gray-800 px-6 py-4 border-b border-slate-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Compare All Writing Tools</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-gray-700">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">Tool</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">Rating</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">Pricing</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">Key Features</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600 dark:text-gray-400">Action</th>
                </tr>
              </thead>
              <tbody>
                {sortedTools.map((tool) => {
                  const pricingColors = getPricingColors(tool.pricing);
                  return (
                    <tr key={tool.id} className="border-b border-slate-100 dark:border-gray-700 hover:bg-slate-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl ${getCategoryColors().bgLight} ${getCategoryColors().text} flex items-center justify-center text-lg font-bold`}>
                            {tool.name.charAt(0)}
                          </div>
                          <div>
                            <Link href={`/tools/${tool.id}`} className="font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400">
                              {tool.name}
                            </Link>
                            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{tool.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <StarRating rating={tool.rating || 0} count={tool.rating_count || 0} size="sm" />
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${pricingColors.bg} ${pricingColors.text}`}>
                          {tool.pricing}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                          <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                            AI-powered writing
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                            Multiple templates
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                            SEO optimization
                          </li>
                        </ul>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-2">
                          <Link
                            href={`/tools/${tool.id}`}
                            className="px-3 py-2 text-sm font-semibold text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                          >
                            Details
                          </Link>
                          <a
                            href={getAffiliateLink(tool)}
                            target="_blank" rel="noopener noreferrer"
                            className="px-3 py-2 text-sm font-semibold bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                          >
                            Visit
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

        {/* Tool Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedTools.map((tool) => {
            const pricingColors = getPricingColors(tool.pricing);
            return (
              <div
                key={tool.id}
                className="bg-white dark:bg-gray-900 rounded-2xl border border-slate-200 dark:border-gray-800 p-6 hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl ${getCategoryColors().bgLight} ${getCategoryColors().text} flex items-center justify-center text-xl font-bold`}>
                      {tool.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                        {tool.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <StarRating rating={tool.rating || 0} count={tool.rating_count || 0} size="sm" />
                      </div>
                    </div>
                  </div>
                  <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${pricingColors.bg} ${pricingColors.text}`}>
                    {tool.pricing}
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                  {tool.description}
                </p>
                <div className="flex gap-2">
                  <Link
                    href={`/tools/${tool.id}`}
                    className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-center"
                  >
                    View Details
                  </Link>
                  <a
                    href={getAffiliateLink(tool)}
                    target="_blank" rel="noopener noreferrer"
                    className="flex-1 px-4 py-2.5 text-sm font-semibold bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors text-center"
                  >
                    Try Now
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-3xl p-8 text-white">
            <h2 className="text-2xl font-bold mb-4">Find Your Perfect AI Writing Tool</h2>
            <p className="text-blue-100 mb-6 max-w-xl mx-auto">
              Compare features, pricing, and reviews to find the best AI writing assistant for your content needs.
            </p>
            <Link
              href="/category/writing"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-colors"
            >
              View All Writing Tools →
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}