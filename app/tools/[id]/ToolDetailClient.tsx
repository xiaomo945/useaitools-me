'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ArrowRight, Home, Copy, Check } from 'lucide-react';
import Footer from '@/app/components/Footer';
import Breadcrumbs from '@/app/components/Breadcrumbs';

// Save tool to browsing history
const saveToHistory = (toolId: number) => {
  try {
    const saved = localStorage.getItem('toolHistory');
    let history: { toolId: number; timestamp: number }[] = saved ? JSON.parse(saved) : [];
    
    // Remove if already exists
    history = history.filter(item => item.toolId !== toolId);
    
    // Add to beginning with timestamp
    history.unshift({ toolId, timestamp: Date.now() });
    
    // Keep only last 50
    history = history.slice(0, 50);
    
    localStorage.setItem('toolHistory', JSON.stringify(history));
  } catch (err) {
    console.error('Failed to save history:', err);
  }
};

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

type Tool = {
  id: number;
  name: string;
  description: string;
  category: 'Writing' | 'Image' | 'Productivity' | 'Code' | 'Audio' | 'Video';
  url: string;
  affiliate_link: string | null;
  icon_url: string;
  pricing: string;
  examples?: Example[];
  needs_vpn: boolean;
  languages: string[];
  use_cases?: UseCase[];
  pros_cons?: ProsCons;
};

// Helper function to check if a tool has affiliate link
const hasAffiliateLink = (tool: Tool): boolean => {
  return !!(tool.affiliate_link);
};

// Helper function to get affiliate link with UTM parameters
const getAffiliateLinkWithUTM = (tool: Tool): string => {
  if (!tool.affiliate_link) return tool.url;
  
  const url = new URL(tool.affiliate_link);
  url.searchParams.set('utm_source', 'useaitools');
  url.searchParams.set('utm_medium', 'referral');
  url.searchParams.set('utm_campaign', 'staff_pick');
  return url.toString();
};

// CTA A/B test variants
const ctaVariants = {
  A: '🔗 Try It Free',
  B: '🚀 Get Started Now',
};

// Get CTA variant based on user
const getCTAVariant = (): keyof typeof ctaVariants => {
  return localStorage.getItem('ctaVariant') as keyof typeof ctaVariants || 'A';
};

// Usage steps for different categories
const categoryUsageSteps: Record<string, { title: string; steps: string[] }> = {
  Writing: {
    title: 'How to Use Writing Tools',
    steps: [
      'Choose your content type from the available templates (blog post, social media, email, etc.)',
      'Provide a clear prompt describing what you want to create, including tone, style, and key points',
      'Customize the generated content by editing, rewriting sections, or adjusting the tone',
      'Use built-in SEO features to optimize your content for search engines before publishing'
    ]
  },
  Image: {
    title: 'How to Use Image Tools',
    steps: [
      'Craft a detailed prompt describing your desired image - include style, composition, colors, and subjects',
      'Select the appropriate model or style preset for your project (photorealistic, anime, watercolor, etc.)',
      'Generate multiple variations and refine your prompt based on results',
      'Download in your preferred resolution and format, then post-process if needed'
    ]
  },
  Productivity: {
    title: 'How to Use Productivity Tools',
    steps: [
      'Start by defining your goal - whether it be task management, note-taking, or project planning',
      'Input your raw data, notes, or tasks into the tool',
      'Let the AI organize, categorize, and prioritize your information automatically',
      'Review suggestions and customize the output to match your workflow preferences'
    ]
  },
  Code: {
    title: 'How to Use Coding Tools',
    steps: [
      'Install the extension for your preferred IDE (VS Code, JetBrains, etc.)',
      'Start typing - the AI will provide real-time code completions and suggestions',
      'Use natural language comments to describe what you want to implement',
      'Review and refine AI-generated code, ensuring it meets your standards'
    ]
  },
  Audio: {
    title: 'How to Use Audio Tools',
    steps: [
      'Choose your voice or music style from the available options',
      'Input your text script or describe the music you want to create',
      'Adjust parameters like tone, speed, pitch, and background effects',
      'Preview and export in your preferred audio format (MP3, WAV, etc.)'
    ]
  },
  Video: {
    title: 'How to Use Video Tools',
    steps: [
      'Start with either a text prompt or upload your existing video footage',
      'Select the video style, duration, and aspect ratio for your project',
      'Customize by adding text overlays, background music, or visual effects',
      'Render and download your final video in the desired resolution'
    ]
  }
};

const categoryFeatures: Record<string, string[]> = {
  Writing: [
    'AI-powered content generation for blogs, social media, and marketing copy',
    'Real-time grammar, spelling, and tone suggestions',
    'SEO optimization and keyword integration',
    'Multi-language content creation and translation',
    'Content summarization and paraphrasing',
    'Brand voice consistency tools'
  ],
  Image: [
    'Text-to-image generation with detailed prompt control',
    'Professional image editing and enhancement',
    'Art style transfer and customization',
    'High-resolution upscaling and output',
    'Background removal and object manipulation',
    'Batch image processing and generation'
  ],
  Productivity: [
    'Smart task prioritization and management',
    'AI-powered meeting transcription and summaries',
    'Automated workflow creation and optimization',
    'Real-time team collaboration and communication',
    'Cross-device and cross-platform synchronization',
    'Intelligent document analysis and organization'
  ],
  Code: [
    'AI-driven code completion and suggestions',
    'Automated code refactoring and optimization',
    'Real-time error detection and debugging',
    'Automatic code documentation generation',
    'Multi-language programming support',
    'Security vulnerability scanning'
  ],
  Audio: [
    'Natural-sounding text-to-speech conversion',
    'High-fidelity voice cloning technology',
    'Professional audio editing and enhancement',
    'AI music generation and composition',
    'Advanced noise reduction and audio cleanup',
    'Podcast and audiobook production tools'
  ],
  Video: [
    'Text-to-video generation with customizable styles',
    'AI avatar creation and lip-syncing',
    'Professional video editing and enhancement',
    'Automatic background removal and replacement',
    'Multi-language text-to-speech dubbing',
    'Video script generation and storyboarding'
  ]
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

export default function ToolDetailClient({ tool, relatedTools }: { tool: Tool; relatedTools: Tool[] }) {
  const colors = getCategoryColors(tool.category);
  const features = categoryFeatures[tool.category] || categoryFeatures['Writing'];
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const hasAffiliate = hasAffiliateLink(tool);
  const ctaText = hasAffiliate ? ctaVariants[getCTAVariant()] : 'Visit Official Website';
  const ctaUrl = hasAffiliate ? getAffiliateLinkWithUTM(tool) : tool.url;
  
  // Save to browsing history on mount
  useEffect(() => {
    saveToHistory(tool.id);
  }, [tool.id]);

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Breadcrumbs */}
        <Breadcrumbs 
          items={[
            { label: 'Home', href: '/' },
            { label: tool.category, href: `/category/${tool.category.toLowerCase()}` },
            { label: tool.name, href: `/tools/${tool.id}`, current: true }
          ]} 
        />

        {/* Tool Header */}
        <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-3xl shadow-xl overflow-hidden mb-8 relative">
          {/* Staff Pick Badge for affiliate tools */}
          {hasAffiliate && (
            <div className="absolute top-4 right-4 z-10">
              <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/25 animate-pulse-glow">
                🏷️ Staff Pick
              </span>
            </div>
          )}
          
          {/* Category Color Bar */}
          <div className={`h-1 ${colors.bg}`} />
          
          <div className="p-8 sm:p-12">
            {/* Tool Name & Pricing */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-2">
                  {tool.name}
                </h1>
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-semibold ${colors.bg} text-white`}>
                    {tool.category}
                  </span>
                  {tool.needs_vpn ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      🪜 VPN Required
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                      ✅ Direct Access
                    </span>
                  )}
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold">
                  {tool.pricing}
                </span>
                {tool.languages && tool.languages.length > 0 && (
                  <span className="px-3 py-1.5 rounded-full text-xs bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
                  {tool.languages.join(', ')}
                </span>
                )}
              </div>
            </div>

            {/* Description */}
            <p className="text-lg text-slate-600 dark:text-gray-300 leading-relaxed mb-8">
              {tool.description}
            </p>

            {/* Affiliate Disclaimer for trust */}
            {hasAffiliate && (
              <div className="mb-6 text-center">
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-3">
                  We may earn a small commission if you try this tool. It doesn&apos;t affect our recommendation.
                </p>
                {tool.name === 'Rytr' && (
                  <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                    ✅ Trusted by 10M+ creators worldwide • Free plan available
                  </p>
                )}
                {tool.name === 'VEED.io' && (
                  <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                    ✅ Free plan available • No credit card required
                  </p>
                )}
                {tool.name === 'Murf AI' && (
                  <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                    ✅ Trusted by Google, Meta, Deloitte • 10 min free trial
                  </p>
                )}
                {tool.name === 'Pictory' && (
                  <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                    ✅ 14-day free trial • No credit card required
                  </p>
                )}
                {!['Rytr', 'VEED.io', 'Murf AI', 'Pictory'].includes(tool.name) && hasAffiliate && (
                  <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                    ✅ Free plan available
                  </p>
                )}
              </div>
            )}
            
            {/* CTA Button */}
            <div className="flex flex-wrap gap-3 mb-6">
              <a
                href={ctaUrl}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 hover:-translate-y-0.5 transition-all duration-300 min-h-[44px] min-w-[44px]"
              >
                {ctaText}
                <ArrowRight className="w-5 h-5" />
              </a>
              <Link
                href={`/compare?tool=${tool.id}`}
                className="inline-flex items-center gap-2 px-6 py-4 border border-slate-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-slate-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-gray-700 hover:border-emerald-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all duration-300 min-h-[44px]"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                </svg>
                Compare
              </Link>
            </div>
          </div>
        </div>

        {/* Use Cases Section */}
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

        {/* Pros & Cons Section */}
        {tool.pros_cons && (
          <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-3xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">⚖️ Honest Review</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Pros */}
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
              {/* Cons */}
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

        {/* Features Section */}
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

        {/* Examples Section */}
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
                    animationFillMode: 'forwards'
                  }}
                >
                  {/* Example Header with Index */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-8 h-8 rounded-full ${colors.bg} flex items-center justify-center text-white text-sm font-bold shadow-md`}>
                      {index + 1}
                    </div>
                    <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                      Example {index + 1}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Image */}
                    <div 
                      className="relative rounded-xl overflow-hidden shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300 ease-out group bg-gray-200 dark:bg-gray-700"
                      style={{ 
                        willChange: 'transform',
                        transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' 
                      }}
                    >
                      <img
                        src={example.image_url}
                        alt={`${tool.name} Example ${index + 1} - AI tool demo`}
                        className="w-full h-auto object-cover opacity-0 animate-fade-in"
                        width="600"
                        height="400"
                        loading="lazy"
                        onLoad={(e) => {
                          (e.currentTarget as HTMLImageElement).classList.remove('opacity-0');
                          (e.currentTarget as HTMLImageElement).classList.add('opacity-100');
                        }}
                      />
                      {/* Shimmer overlay on hover */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/0 via-white/0 to-transparent group-hover:via-white/20 transition-all duration-1000 transform -translate-x-full group-hover:translate-x-full pointer-events-none" />
                    </div>
                    {/* Prompt */}
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

        {/* Related Tools Section */}
        {relatedTools.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">🔗 Related Tools</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedTools.map((relatedTool, index) => {
                const relatedColors = getCategoryColors(relatedTool.category);
                return (
                  <div
                    key={relatedTool.id}
                    className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 ease-out animate-fade-in-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-10 h-10 rounded-lg ${relatedColors.bg}/10 dark:${relatedColors.bgDark} ${relatedColors.textLight} dark:${relatedColors.text} flex items-center justify-center text-lg font-bold`}>
                        {relatedTool.name.charAt(0)}
                      </div>
                      <h3 className="font-semibold text-lg text-slate-900 dark:text-white">
                        {relatedTool.name}
                      </h3>
                    </div>
                    <p className="text-slate-600 dark:text-gray-300 text-sm leading-relaxed mb-4 line-clamp-2">
                      {relatedTool.description}
                    </p>
                    <Link
                      href={`/tools/${relatedTool.id}`}
                      className={`inline-flex items-center gap-2 text-sm font-semibold ${relatedColors.textLight} dark:${relatedColors.text} hover:${relatedColors.bg} hover:text-white px-4 py-2 rounded-lg transition-all duration-300`}
                    >
                      View Tool
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Bottom CTA for affiliate tools */}
        {hasAffiliate && (
          <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-3xl p-8 mb-8 text-center">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
              Ready to Try {tool.name}?
            </h2>
            {tool.name === 'Rytr' && (
              <p className="text-slate-600 dark:text-gray-300 mb-6">
                Join 10M+ creators worldwide. Start writing better content today — free plan includes 10,000 characters.
              </p>
            )}
            {tool.name === 'VEED.io' && (
              <p className="text-slate-600 dark:text-gray-300 mb-6">
                Edit videos in your browser — no downloads needed. Free plan available, no credit card required.
              </p>
            )}
            {tool.name === 'Murf AI' && (
              <p className="text-slate-600 dark:text-gray-300 mb-6">
                Create studio-quality voiceovers in minutes. 120+ realistic voices, 10-minute free trial.
              </p>
            )}
            {tool.name === 'Pictory' && (
              <p className="text-slate-600 dark:text-gray-300 mb-6">
                Turn scripts into videos with AI. 14-day free trial, no credit card required.
              </p>
            )}
            {!['Rytr', 'VEED.io', 'Murf AI', 'Pictory'].includes(tool.name) && (
              <p className="text-slate-600 dark:text-gray-300 mb-6">
                Start using {tool.name} today. {tool.description.slice(0, 80)}...
              </p>
            )}
            <a
              href={ctaUrl}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 hover:-translate-y-0.5 transition-all duration-300 min-h-[44px]"
            >
              {ctaText}
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        )}

        {/* Footer */}
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
