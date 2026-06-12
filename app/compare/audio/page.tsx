import type { Metadata } from 'next';
import Link from 'next/link';
import tools from '@/data/tools.json';
import Footer from '@/app/components/Footer';
import StarRating from '@/app/components/StarRating';

export const metadata: Metadata = {
  title: 'AI Audio Tools Comparison - Use AI Tools',
  description: 'Compare the best AI voice generators including Murf AI, ElevenLabs, and more. Find the perfect AI audio tool for your voiceover and audio production needs.',
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

const audioTools = (tools as Tool[]).filter(tool => tool.category === 'Audio');

const getCategoryColors = () => ({
  bg: 'bg-pink-500',
  bgLight: 'bg-pink-500/10',
  text: 'text-pink-600',
  border: 'border-pink-300',
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

export default function AudioComparePage() {
  const sortedTools = [...audioTools].sort((a, b) => (b.rating || 0) - (a.rating || 0));
  const recommendedTool = sortedTools[0];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-pink-100 dark:bg-pink-500/20 text-pink-600 dark:text-pink-400 mb-6">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
            AI Audio Tools Comparison
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Compare the best AI voice generators and audio tools to find the perfect solution for your voiceover needs
          </p>
        </div>

        {/* Recommended Tool Highlight */}
        {recommendedTool && (
          <div className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-3xl p-8 mb-12 text-white relative overflow-hidden">
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
                    <p className="text-pink-100">{recommendedTool.description}</p>
                  </div>
                </div>
                <a
                  href={getAffiliateLink(recommendedTool)}
                  target="_blank" rel="noopener noreferrer"
                  className="px-6 py-3 bg-white text-pink-600 font-semibold rounded-xl hover:bg-pink-50 transition-colors whitespace-nowrap"
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
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Compare All Audio Tools</h2>
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
                            <Link href={`/tools/${tool.id}`} className="font-semibold text-gray-900 dark:text-white hover:text-pink-600 dark:hover:text-pink-400">
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
                            Text-to-speech
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                            Voice cloning
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                            Multiple voices
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
                            className="px-3 py-2 text-sm font-semibold bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
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
                className="bg-white dark:bg-gray-900 rounded-2xl border border-slate-200 dark:border-gray-800 p-6 hover:shadow-xl hover:shadow-pink-500/5 hover:-translate-y-1 transition-all duration-300"
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
                    className="flex-1 px-4 py-2.5 text-sm font-semibold bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition-colors text-center"
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
          <div className="bg-gradient-to-r from-pink-500 to-rose-600 rounded-3xl p-8 text-white">
            <h2 className="text-2xl font-bold mb-4">Find Your Perfect AI Audio Tool</h2>
            <p className="text-pink-100 mb-6 max-w-xl mx-auto">
              Compare features, pricing, and reviews to find the best AI voice generator for your audio projects.
            </p>
            <Link
              href="/category/audio"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-pink-600 font-semibold rounded-xl hover:bg-pink-50 transition-colors"
            >
              View All Audio Tools →
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}