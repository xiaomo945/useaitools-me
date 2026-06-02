'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ArrowRight, Home, Copy, Check, ChevronDown } from 'lucide-react';
import Footer from '@/app/components/Footer';
import Breadcrumbs from '@/app/components/Breadcrumbs';

type Example = {
  prompt: string;
  image_url: string;
};

type UseCase = {
  title: string;
  detail: string;
};

type ProsCons = {
  pros: string[];
  cons: string[];
};

type RatingBreakdown = {
  ease_of_use: { score: number; note: string };
  output_quality: { score: number; note: string };
  features: { score: number; note: string };
  value_for_money: { score: number; note: string };
  stability: { score: number; note: string };
  support: { score: number; note: string };
};

type Tool = {
  id: number;
  name: string;
  description: string;
  description_en?: string;
  category: 'Writing' | 'Image' | 'Productivity' | 'Code' | 'Audio' | 'Video';
  pricing: string;
  url: string;
  affiliate_link: string;
  icon_url: string;
  examples?: Example[];
  needs_vpn: boolean;
  languages: string[];
  use_cases?: UseCase[];
  pros_cons?: ProsCons;
  rating?: number;
  rating_count?: number;
  rating_breakdown?: RatingBreakdown;
  skill_level?: string;
  best_for?: string[];
};

type BlogPost = {
  id: number;
  title: string;
  slug: string;
  date: string;
  description: string;
  category?: string;
  images?: { url: string; alt: string }[];
};

const hasAffiliateLink = (tool: Tool): boolean => !!(tool.affiliate_link);

const getAffiliateLinkWithUTM = (tool: Tool): string => {
  if (!tool.affiliate_link) return tool.url;
  try {
    const url = new URL(tool.affiliate_link);
    url.searchParams.set('utm_source', 'useaitools');
    url.searchParams.set('utm_medium', 'referral');
    url.searchParams.set('utm_campaign', 'staff_pick');
    return url.toString();
  } catch {
    return tool.affiliate_link;
  }
};

const ctaVariants = {
  A: 'Get Started for Free',
  B: 'Get Started for Free',
};

const getCTAVariant = (): keyof typeof ctaVariants => {
  try {
    return (localStorage.getItem('ctaVariant') as keyof typeof ctaVariants) || 'A';
  } catch {
    return 'A';
  }
};

const getCategoryColors = (category: Tool['category']) => {
  switch (category) {
    case 'Writing':
      return { bg: 'bg-blue-500', bgDark: 'bg-blue-500/20', text: 'text-blue-300', textLight: 'text-blue-600', border: 'border-blue-300' };
    case 'Image':
      return { bg: 'bg-violet-500', bgDark: 'bg-violet-500/20', text: 'text-violet-300', textLight: 'text-violet-600', border: 'border-violet-300' };
    case 'Productivity':
      return { bg: 'bg-teal-500', bgDark: 'bg-teal-500/20', text: 'text-teal-300', textLight: 'text-teal-600', border: 'border-teal-300' };
    case 'Code':
      return { bg: 'bg-orange-500', bgDark: 'bg-orange-500/20', text: 'text-orange-300', textLight: 'text-orange-600', border: 'border-orange-300' };
    case 'Audio':
      return { bg: 'bg-pink-500', bgDark: 'bg-pink-500/20', text: 'text-pink-300', textLight: 'text-pink-600', border: 'border-pink-300' };
    case 'Video':
      return { bg: 'bg-indigo-500', bgDark: 'bg-indigo-500/20', text: 'text-indigo-300', textLight: 'text-indigo-600', border: 'border-indigo-300' };
    default:
      return { bg: 'bg-slate-500', bgDark: 'bg-slate-500/20', text: 'text-slate-300', textLight: 'text-slate-600', border: 'border-slate-300' };
  }
};

const getSkillLevelColors = (level: string) => {
  switch (level) {
    case 'beginner':
      return { bg: 'bg-emerald-100 dark:bg-emerald-500/20', text: 'text-emerald-700 dark:text-emerald-300', label: '🌱 Beginner' };
    case 'intermediate':
      return { bg: 'bg-amber-100 dark:bg-amber-500/20', text: 'text-amber-700 dark:text-amber-300', label: '🔥 Intermediate' };
    case 'advanced':
      return { bg: 'bg-rose-100 dark:bg-rose-500/20', text: 'text-rose-700 dark:text-rose-300', label: '⚡ Advanced' };
    default:
      return { bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-700 dark:text-slate-300', label: '🌱 Beginner' };
  }
};

const categoryFeatures: Record<string, string[]> = {
  Writing: [
    'AI-powered content generation for blogs, social media, and marketing copy',
    'Real-time grammar, spelling, and tone suggestions',
    'SEO optimization and keyword integration',
    'Multi-language content creation and translation',
    'Content summarization and paraphrasing',
    'Brand voice consistency tools',
  ],
  Image: [
    'Text-to-image generation with detailed prompt control',
    'Professional image editing and enhancement',
    'Art style transfer and customization',
    'High-resolution upscaling and output',
    'Background removal and object manipulation',
    'Batch image processing and generation',
  ],
  Productivity: [
    'Smart task prioritization and management',
    'AI-powered meeting transcription and summaries',
    'Automated workflow creation and optimization',
    'Real-time team collaboration and communication',
    'Cross-device and cross-platform synchronization',
    'Intelligent document analysis and organization',
  ],
  Code: [
    'AI-driven code completion and suggestions',
    'Automated code refactoring and optimization',
    'Real-time error detection and debugging',
    'Automatic code documentation generation',
    'Multi-language programming support',
    'Security vulnerability scanning',
  ],
  Audio: [
    'Natural-sounding text-to-speech conversion',
    'High-fidelity voice cloning technology',
    'Professional audio editing and enhancement',
    'AI music generation and composition',
    'Advanced noise reduction and audio cleanup',
    'Podcast and audiobook production tools',
  ],
  Video: [
    'Text-to-video generation with customizable styles',
    'AI avatar creation and lip-syncing',
    'Professional video editing and enhancement',
    'Automatic background removal and replacement',
    'Multi-language text-to-speech dubbing',
    'Video script generation and storyboarding',
  ],
};

export default function ToolSlugClient({
  tool,
  relatedTools,
  relatedArticles,
  slug,
}: {
  tool: Tool;
  relatedTools: Tool[];
  relatedArticles: BlogPost[];
  slug: string;
}) {
  const colors = getCategoryColors(tool.category);
  const features = categoryFeatures[tool.category] || categoryFeatures['Writing'];
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const hasAffiliate = hasAffiliateLink(tool);
  const ctaText = hasAffiliate ? ctaVariants[getCTAVariant()] : 'Visit Website';
  const ctaUrl = hasAffiliate ? getAffiliateLinkWithUTM(tool) : tool.url;

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const StarRating = ({ rating }: { rating: number }) => (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-4 h-4 ${star <= rating ? 'text-amber-400' : 'text-slate-300 dark:text-slate-600'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 py-10 sm:py-16">
      <div className="max-w-4xl mx-auto px-3 sm:px-6">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: tool.category, href: `/category/${tool.category.toLowerCase()}` },
            { label: tool.name, href: `/tool/${slug}`, current: true },
          ]}
        />

        {/* Tool Header */}
        <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-3xl shadow-xl overflow-hidden mb-8 relative">
          {hasAffiliate && (
            <div className="absolute top-3 right-3 z-10">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/25 animate-pulse-glow">
                🏷️ Staff Pick
              </span>
            </div>
          )}

          <div className={`h-1 ${colors.bg}`} />

          <div className="p-6 sm:p-12">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2.5xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-2">
                  {tool.name}
                </h1>
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className={`inline-block px-3 py-1.5 rounded-full text-sm font-semibold ${colors.bg} text-white`}>
                    {tool.category}
                  </span>
                  {tool.skill_level && (
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-semibold ${getSkillLevelColors(tool.skill_level).bg} ${getSkillLevelColors(tool.skill_level).text}`}>
                      {getSkillLevelColors(tool.skill_level).label}
                    </span>
                  )}
                  {tool.needs_vpn ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      🪜 VPN Required
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                      ✅ Direct Access
                    </span>
                  )}
                  <div className="flex flex-wrap gap-1 mt-1">
                    {tool.best_for?.slice(0, 4).map((tag, i) => (
                      <span key={i} className="inline-flex items-center px-2 py-1 rounded-full text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-sm">
                  {tool.pricing}
                </span>
                {tool.languages && tool.languages.length > 0 && (
                  <span className="px-2.5 py-1.5 rounded-full text-xs bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
                    {tool.languages.join(', ')}
                  </span>
                )}
              </div>
            </div>

            <p className="text-base sm:text-lg text-slate-600 dark:text-gray-300 leading-relaxed mb-6 sm:mb-8">
              {tool.description}
            </p>

            {hasAffiliate && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 text-center">
                We may earn a small commission if you try this tool. It doesn&apos;t affect our recommendation.
              </p>
            )}

            <div className="flex flex-wrap gap-3">
              <a
                href={ctaUrl}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className={`inline-flex items-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 font-semibold rounded-xl transition-all duration-300 ${
                  hasAffiliate
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25 hover:from-emerald-600 hover:to-teal-600 hover:shadow-xl hover:shadow-emerald-500/30'
                    : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30'
                } hover:-translate-y-0.5`}
              >
                {ctaText}
                {hasAffiliate && <span className="text-[10px] opacity-60 ml-1">via partner</span>}
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
              <Link
                href={`/compare?tool=${tool.id}`}
                className="inline-flex items-center gap-2 px-5 sm:px-6 py-3.5 sm:py-4 border border-slate-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-slate-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-gray-700 hover:border-emerald-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all duration-300"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                </svg>
                Compare
              </Link>
            </div>

            {tool.rating && tool.rating_count && (
              <div className="mt-4 flex items-center justify-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                <StarRating rating={Math.round(tool.rating)} />
                <span className="font-medium">{tool.rating}</span>
                <span className="text-slate-400 dark:text-slate-500">·</span>
                <span>Already used by {tool.rating_count.toLocaleString()} users</span>
              </div>
            )}
          </div>
        </div>

        {/* Use Cases */}
        {tool.use_cases && tool.use_cases.length > 0 && (
          <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-3xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">🎯 Real-World Use Cases</h2>
            <div className="space-y-6">
              {tool.use_cases.map((useCase, index) => (
                <div key={index} className="p-5 rounded-xl bg-slate-50 dark:bg-gray-800/60 border border-slate-100 dark:border-gray-700/50">
                  <div className="flex items-start gap-4">
                    <div className={`flex-shrink-0 w-10 h-10 rounded-lg ${colors.bg} flex items-center justify-center text-white text-sm font-bold shadow-md`}>
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-slate-900 dark:text-white mb-2">{useCase.title}</h3>
                      <p className="text-slate-600 dark:text-gray-300 text-sm leading-relaxed">{useCase.detail}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pros & Cons */}
        {tool.pros_cons && (
          <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-3xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">⚖️ Honest Review</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-lg text-emerald-600 dark:text-emerald-400 mb-4 flex items-center gap-2">
                  <span className="text-xl">✅</span> Pros
                </h3>
                <ul className="space-y-3">
                  {tool.pros_cons.pros.map((pro, index) => (
                    <li key={index} className="flex items-start gap-3 text-slate-600 dark:text-gray-300 text-sm leading-relaxed">
                      <span className="flex-shrink-0 mt-0.5 w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center">
                        <span className="text-emerald-600 dark:text-emerald-400 text-xs">+</span>
                      </span>
                      {pro}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-lg text-amber-600 dark:text-amber-400 mb-4 flex items-center gap-2">
                  <span className="text-xl">⚠️</span> Cons
                </h3>
                <ul className="space-y-3">
                  {tool.pros_cons.cons.map((con, index) => (
                    <li key={index} className="flex items-start gap-3 text-slate-600 dark:text-gray-300 text-sm leading-relaxed">
                      <span className="flex-shrink-0 mt-0.5 w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center">
                        <span className="text-amber-600 dark:text-amber-400 text-xs">−</span>
                      </span>
                      {con}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Features */}
        <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-3xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Features</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`flex items-center gap-4 p-4 rounded-xl ${colors.bgDark} dark:${colors.bgDark}`}
              >
                <div className={`w-8 h-8 rounded-lg ${colors.bg} flex items-center justify-center`}>
                  <span className="text-white text-sm font-bold">{index + 1}</span>
                </div>
                <span className={`font-medium ${colors.textLight} dark:${colors.text}`}>
                  {feature}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Examples */}
        {tool.examples && tool.examples.length > 0 && (
          <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-3xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">🎨 Examples & Prompts</h2>
            <div className="space-y-6">
              {tool.examples.map((example, index) => (
                <div
                  key={index}
                  className="pb-6 border-b border-gray-100 dark:border-gray-800 last:pb-0 last:border-b-0 animate-fade-in-up"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    opacity: 0,
                    animationFillMode: 'forwards',
                  }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-8 h-8 rounded-full ${colors.bg} flex items-center justify-center text-white text-sm font-bold shadow-md`}>
                      {index + 1}
                    </div>
                    <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                      Example {index + 1}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="relative rounded-xl overflow-hidden shadow-md bg-gray-200 dark:bg-gray-700">
                      <img
                        src={example.image_url}
                        alt={`${tool.name} Example ${index + 1}`}
                        className="w-full h-auto object-cover max-w-full aspect-video"
                        style={{ aspectRatio: '16/9' }}
                        width="600"
                        height="400"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800/60 rounded-lg p-4 flex flex-col">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Prompt</h3>
                        <button
                          onClick={() => copyToClipboard(example.prompt, index)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-200/60 dark:bg-gray-700/60 hover:bg-slate-300 dark:hover:bg-gray-600 transition-all duration-200 text-slate-600 dark:text-slate-300 text-xs font-medium"
                          aria-label="Copy prompt to clipboard"
                        >
                          {copiedIndex === index ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                          {copiedIndex === index ? 'Copied!' : 'Copy'}
                        </button>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 font-mono text-sm leading-relaxed flex-1">
                        {example.prompt}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Similar Tools */}
        {relatedTools.length > 0 && (
          <div className="bg-gradient-to-br from-slate-50 to-emerald-50/30 dark:from-gray-900 dark:to-emerald-900/10 border border-slate-200 dark:border-gray-800 rounded-3xl p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/25">
                <span className="text-white text-lg">✨</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Similar Tools</h2>
                <p className="text-sm text-slate-500 dark:text-gray-400">Based on category and user preferences</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {relatedTools.map((relatedTool) => {
                const relatedColors = getCategoryColors(relatedTool.category);
                return (
                  <Link
                    key={relatedTool.id}
                    href={`/tool/${relatedTool.name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')}`}
                    className="group bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 ease-out"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-9 h-9 rounded-lg ${relatedColors.bg}/10 flex items-center justify-center ${relatedColors.textLight} dark:${relatedColors.text} text-sm font-bold`}>
                        {relatedTool.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm text-slate-900 dark:text-white truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                          {relatedTool.name}
                        </h4>
                        <span className={`text-xs ${relatedColors.textLight} dark:${relatedColors.text}`}>
                          {relatedTool.category}
                        </span>
                      </div>
                    </div>
                    <p className="text-slate-600 dark:text-gray-300 text-xs leading-relaxed mb-3 line-clamp-2">
                      {relatedTool.description.slice(0, 100)}...
                    </p>
                    {relatedTool.rating && (
                      <div className="flex items-center gap-1.5">
                        <StarRating rating={Math.round(relatedTool.rating)} />
                        <span className="text-xs text-slate-500 dark:text-gray-400">{relatedTool.rating}</span>
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-gray-700">
              <Link
                href={`/category/${tool.category.toLowerCase()}`}
                className="inline-flex items-center gap-2 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium transition-colors"
              >
                View all {tool.category} tools
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <div className="bg-gradient-to-br from-slate-50 to-indigo-50/30 dark:from-gray-900 dark:to-indigo-900/10 border border-slate-200 dark:border-gray-800 rounded-3xl p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
                <span className="text-white text-lg">📚</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Related Articles</h2>
                <p className="text-sm text-slate-500 dark:text-gray-400">Guides and comparisons about {tool.category.toLowerCase()} tools</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {relatedArticles.map((article) => {
                const postDate = new Date(article.date);
                const formattedDate = postDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                return (
                  <Link
                    key={article.id}
                    href={`/blog/${article.slug}`}
                    className="group bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-xl p-4 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-out"
                  >
                    {article.images?.[0] && (
                      <img
                        src={article.images[0].url}
                        alt={article.images[0].alt}
                        className="w-full h-32 object-cover rounded-lg mb-3"
                        loading="lazy"
                        decoding="async"
                      />
                    )}
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-500/20 px-2 py-0.5 rounded-full">
                        {article.category}
                      </span>
                      <span className="text-xs text-slate-400 dark:text-gray-500">{formattedDate}</span>
                    </div>
                    <h4 className="font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2 mb-2 text-sm">
                      {article.title}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-gray-400 line-clamp-2">
                      {article.description}
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Back to Home */}
        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium transition-colors duration-300"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}
