'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import tools from '@/data/tools.json';
import { Home, Share2, Check, Copy } from 'lucide-react';
import Footer from '@/app/components/Footer';

const StarRating = dynamic(() => import('@/app/components/StarRating'), { ssr: false });

type RatingDimension = {
  score: number;
  note: string;
};

type RatingBreakdown = {
  ease_of_use?: RatingDimension;
  output_quality?: RatingDimension;
  features?: RatingDimension;
  value_for_money?: RatingDimension;
  stability?: RatingDimension;
  support?: RatingDimension;
};

const DIMENSION_LABELS: Record<string, string> = {
  ease_of_use: 'Ease of Use',
  output_quality: 'Output Quality',
  features: 'Features',
  value_for_money: 'Value for Money',
  stability: 'Stability',
  support: 'Support',
};

const DIMENSIONS = Object.keys(DIMENSION_LABELS);

type Tool = (typeof tools)[0];

interface AIRecommendation {
  toolRecommendations: {
    toolName: string;
    strongestDimension: string;
    strongestScore: number;
    summary: string;
  }[];
  overallWinner: string;
  overallWinnerAvg: number;
}

const generateAIRecommendation = (selectedTools: Tool[]): AIRecommendation | null => {
  if (selectedTools.length === 0) return null;

  const toolRecommendations = selectedTools.map(tool => {
    const breakdown = (tool as Record<string, unknown>).rating_breakdown as RatingBreakdown | undefined;
    let strongestDimension = '';
    let strongestScore = 0;
    let totalScore = 0;
    let dimensionCount = 0;

    DIMENSIONS.forEach(dim => {
      const dimData = breakdown?.[dim as keyof RatingBreakdown];
      const score = dimData?.score ?? 0;
      if (score > 0) {
        totalScore += score;
        dimensionCount++;
        if (score > strongestScore) {
          strongestScore = score;
          strongestDimension = dim;
        }
      }
    });

    const avgScore = dimensionCount > 0 ? totalScore / dimensionCount : 0;
    const dimLabel = DIMENSION_LABELS[strongestDimension] || strongestDimension;

    const summary = strongestScore > 0
      ? `${tool.name} excels in ${dimLabel} (${strongestScore}/5), making it the go-to choice for users who prioritize ${dimLabel.toLowerCase()}.`
      : `${tool.name} has limited rating data available for comparison.`;

    return {
      toolName: tool.name,
      strongestDimension,
      strongestScore,
      summary,
      avgScore,
    };
  });

  const validRecs = toolRecommendations.filter(r => r.strongestScore > 0);
  if (validRecs.length === 0) return null;

  const overallWinner = toolRecommendations.reduce((best, current) =>
    current.avgScore > best.avgScore ? current : best
  , toolRecommendations[0]);

  return {
    toolRecommendations: toolRecommendations.map(r => ({
      toolName: r.toolName,
      strongestDimension: r.strongestDimension,
      strongestScore: r.strongestScore,
      summary: r.summary,
    })),
    overallWinner: overallWinner.toolName,
    overallWinnerAvg: Math.round(overallWinner.avgScore * 10) / 10,
  };
};

const getCategoryColors = (category: Tool['category']) => {
  switch (category) {
    case 'Writing':
      return { bg: 'bg-blue-500', bgDark: 'bg-blue-500/20', text: 'text-blue-300', textLight: 'text-blue-600', border: 'border-blue-300', ring: 'hover:shadow-blue-500/20' };
    case 'Image':
      return { bg: 'bg-violet-500', bgDark: 'bg-violet-500/20', text: 'text-violet-300', textLight: 'text-violet-600', border: 'border-violet-300', ring: 'hover:shadow-violet-500/20' };
    case 'Productivity':
      return { bg: 'bg-teal-500', bgDark: 'bg-teal-500/20', text: 'text-teal-300', textLight: 'text-teal-600', border: 'border-teal-300', ring: 'hover:shadow-teal-500/20' };
    case 'Code':
      return { bg: 'bg-orange-500', bgDark: 'bg-orange-500/20', text: 'text-orange-300', textLight: 'text-orange-600', border: 'border-orange-300', ring: 'hover:shadow-orange-500/20' };
    case 'Audio':
      return { bg: 'bg-pink-500', bgDark: 'bg-pink-500/20', text: 'text-pink-300', textLight: 'text-pink-600', border: 'border-pink-300', ring: 'hover:shadow-pink-500/20' };
    case 'Video':
      return { bg: 'bg-indigo-500', bgDark: 'bg-indigo-500/20', text: 'text-indigo-300', textLight: 'text-indigo-600', border: 'border-indigo-300', ring: 'hover:shadow-indigo-500/20' };
    default:
      return { bg: 'bg-slate-500', bgDark: 'bg-slate-500/20', text: 'text-slate-300', textLight: 'text-slate-600', border: 'border-slate-300', ring: 'hover:shadow-slate-500/20' };
  }
};

const getPricingColors = (pricing: string) => {
  switch (pricing) {
    case 'Freemium':
      return { bg: 'bg-emerald-100 dark:bg-emerald-500/20', text: 'text-emerald-700 dark:text-emerald-300' };
    case 'Free Trial':
      return { bg: 'bg-blue-100 dark:bg-blue-500/20', text: 'text-blue-700 dark:text-blue-300' };
    case 'Paid':
      return { bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-700 dark:text-slate-300' };
    case 'Open Source':
      return { bg: 'bg-purple-100 dark:bg-purple-500/20', text: 'text-purple-700 dark:text-purple-300' };
    case 'Free':
      return { bg: 'bg-green-100 dark:bg-green-500/20', text: 'text-green-700 dark:text-green-300' };
    default:
      return { bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-700 dark:text-slate-300' };
  }
};

// 模拟用户评价数据
const getMockReview = (toolName: string) => {
  const reviews = [
    `Excellent tool! ${toolName} has completely transformed my workflow. Highly recommend!`,
    `Great value for money. ${toolName} is intuitive and powerful.`,
    `Best in class. ${toolName} offers features that competitors don't have.`,
    `Love using ${toolName}! The interface is clean and responsive.`,
    `Game changer! ${toolName} saves me hours every week.`,
  ];
  return reviews[Math.floor(Math.random() * reviews.length)];
};

export default function ComparePage() {
  const [tool1Id, setTool1Id] = useState<string>('');
  const [tool2Id, setTool2Id] = useState<string>('');
  const [tool3Id, setTool3Id] = useState<string>('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tool = params.get('tool');
    if (tool) {
      if (!tool1Id) setTool1Id(tool);
      else if (!tool2Id) setTool2Id(tool);
      else if (!tool3Id) setTool3Id(tool);
    }
  }, []);

  const tool1 = tools.find(t => t.id === Number(tool1Id));
  const tool2 = tools.find(t => t.id === Number(tool2Id));
  const tool3 = tools.find(t => t.id === Number(tool3Id));

  const selectedTools = [tool1, tool2, tool3].filter(Boolean) as Tool[];

  const generateShareLink = () => {
    const ids = [tool1Id, tool2Id, tool3Id].filter(Boolean).join(',');
    return `${window.location.origin}/compare?tools=${ids}`;
  };

  const handleShare = async () => {
    const link = generateShareLink();
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      const textArea = document.createElement('textarea');
      textArea.value = link;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white transition-colors duration-300">
            <Home className="w-5 h-5" />
            <span className="font-medium">Back to Home</span>
          </Link>
        </div>

        <div className="mb-10">
          <div className="bg-gradient-to-br from-emerald-50/80 via-white to-teal-50/80 dark:from-emerald-950/60 dark:via-gray-900 dark:to-teal-950/60 backdrop-blur-xl border border-white/60 dark:border-emerald-500/10 shadow-xl shadow-emerald-500/5 dark:shadow-2xl dark:shadow-emerald-500/5 rounded-3xl p-8 sm:p-12">
            <div className="text-center">
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-2">
                Compare AI Tools
              </h1>
              <p className="text-base sm:text-lg text-gray-500 dark:text-gray-400 mt-3 max-w-2xl mx-auto">
                Select up to 3 AI tools to compare them side by side.
              </p>
            </div>
          </div>
        </div>

        <div className="mb-10 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-3xl p-8 sm:p-12 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { id: tool1Id, setId: setTool1Id, label: 'Tool 1', otherIds: [tool2Id, tool3Id] },
              { id: tool2Id, setId: setTool2Id, label: 'Tool 2', otherIds: [tool1Id, tool3Id] },
              { id: tool3Id, setId: setTool3Id, label: 'Tool 3', otherIds: [tool1Id, tool2Id] },
            ].map(({ id, setId, label, otherIds }) => (
              <div key={label}>
                <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                  {label}
                </label>
                <select
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all duration-300 ease-out"
                >
                  <option value="">Select a tool...</option>
                  {tools.filter(t => !otherIds.includes(String(t.id))).map(tool => (
                    <option key={tool.id} value={tool.id}>{tool.name}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>

        {selectedTools.length > 0 && (
          <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-3xl overflow-hidden shadow-xl overflow-x-auto">
            {(() => {
              const recommendation = generateAIRecommendation(selectedTools);
              if (!recommendation) return null;
              return (
                <div className="border-l-4 border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-2xl p-6 m-6">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl">🤖</span>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">AI Recommendation</h3>
                  </div>
                  <div className="space-y-3">
                    {recommendation.toolRecommendations.map((rec, idx) => (
                      <p key={idx} className="text-sm text-slate-700 dark:text-gray-300 leading-relaxed">
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">{rec.toolName}</span>
                        {' — '}
                        {rec.summary}
                      </p>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-emerald-200/60 dark:border-emerald-800/40">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      🏆 Overall Winner: <span className="text-emerald-600 dark:text-emerald-400">{recommendation.overallWinner}</span>
                      <span className="ml-2 text-xs font-normal text-slate-500 dark:text-gray-400">
                        (avg {recommendation.overallWinnerAvg}/5)
                      </span>
                    </p>
                  </div>
                </div>
              );
            })()}
            <table className="w-full min-w-[800px]">
              <thead className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white w-1/5">
                    Feature
                  </th>
                  {selectedTools.map((tool, idx) => (
                    <th key={idx} className="px-6 py-4 text-center text-sm font-semibold text-slate-900 dark:text-white">
                      <div className="flex flex-col items-center gap-2">
                        <div className={`w-10 h-10 rounded-xl ${getCategoryColors(tool.category).bg}/10 flex items-center justify-center text-xl font-bold`} style={{ fontFamily: 'Playfair Display, serif' }}>
                          {tool.name.charAt(0)}
                        </div>
                        <span>{tool.name}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-gray-800">
                <tr>
                  <td className="px-6 py-4 text-sm font-medium text-slate-700 dark:text-gray-300">Category</td>
                  {selectedTools.map((tool, idx) => (
                    <td key={idx} className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${getCategoryColors(tool.category).bg} text-white`}>
                        {tool.category}
                      </span>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm font-medium text-slate-700 dark:text-gray-300">Rating</td>
                  {selectedTools.map((tool, idx) => (
                    <td key={idx} className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <StarRating rating={tool.rating || 4.0} size="sm" />
                        <span className="text-sm text-slate-600 dark:text-gray-400">
                          ({tool.rating_count || 0} reviews)
                        </span>
                      </div>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm font-medium text-slate-700 dark:text-gray-300">Description</td>
                  {selectedTools.map((tool, idx) => (
                    <td key={idx} className="px-6 py-4 text-sm text-slate-600 dark:text-gray-400">
                      {tool.description}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm font-medium text-slate-700 dark:text-gray-300">Pricing</td>
                  {selectedTools.map((tool, idx) => (
                    <td key={idx} className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${getPricingColors(tool.pricing).bg} ${getPricingColors(tool.pricing).text}`}>
                        {tool.pricing}
                      </span>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm font-medium text-slate-700 dark:text-gray-300">VPN Required</td>
                  {selectedTools.map((tool, idx) => (
                    <td key={idx} className="px-6 py-4 text-center">
                      {tool.needs_vpn ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-300">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          Yes
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                          <Check className="w-3 h-3" />
                          No
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm font-medium text-slate-700 dark:text-gray-300">User Review</td>
                  {selectedTools.map((tool, idx) => (
                    <td key={idx} className="px-6 py-4 text-sm text-slate-600 dark:text-gray-400">
                      "{getMockReview(tool.name)}"
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>

            <div className="bg-slate-50 dark:bg-gray-900/50 border-t border-slate-200 dark:border-gray-800 p-8">
              <div className="grid grid-cols-1 gap-6">
                <div className="flex flex-wrap justify-center gap-4">
                  {selectedTools.map((tool, idx) => (
                    <a
                      key={idx}
                      href={tool.affiliate_link || tool.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 hover:-translate-y-0.5 transition-all duration-300"
                    >
                      Visit {tool.name}
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 7H8.5M17 7v8.5" />
                      </svg>
                    </a>
                  ))}
                </div>

                <div className="flex justify-center mt-4">
                  <button
                    onClick={handleShare}
                    className="inline-flex items-center gap-2 px-6 py-3 border border-slate-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-slate-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-gray-700 hover:border-emerald-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all duration-300"
                  >
                    {copied ? (
                      <>
                        <Check className="w-5 h-5" />
                        Link copied!
                      </>
                    ) : (
                      <>
                        <Share2 className="w-5 h-5" />
                        Share Comparison
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}