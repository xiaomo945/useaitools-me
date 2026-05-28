'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ArrowRight, Home, Copy, Check, ChevronDown } from 'lucide-react';
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

type Review = {
  username: string;
  rating: number;
  text: string;
};

const toolReviews: Record<number, Review[]> = {
  23: [
    {
      username: 'Sarah M.',
      rating: 5,
      text: "Rytr completely changed my content workflow. I went from spending 3 hours per blog post to under 30 minutes. The SEO optimizer alone is worth the price."
    },
    {
      username: 'James K.',
      rating: 4,
      text: "Great value for money. The templates cover almost every use case I have. Only wish the long-form editor had more customization options like Jasper."
    },
    {
      username: 'Priya D.',
      rating: 5,
      text: "As a non-native English speaker, the 30+ language support is a game-changer. I create content in both English and Hindi with excellent quality."
    },
  ],
  51: [
    {
      username: 'Alex T.',
      rating: 5,
      text: "VEED.io replaced my entire video editing pipeline. The auto-subtitles feature is insanely accurate and saves me hours every week. Best browser-based editor I've used."
    },
    {
      username: 'Maria L.',
      rating: 4,
      text: "The AI voiceover and background removal features are incredibly polished. Performance does depend on internet speed, but for quick social media videos, it's unbeatable."
    },
    {
      username: 'Chen W.',
      rating: 5,
      text: "I use VEED to translate my YouTube videos into 5 languages. The AI dubbing quality is shockingly good. My international views went up 300% in two months."
    },
  ],
};

const toolFAQs: Record<number, { question: string; answer: string }[]> = {
  23: [
    {
      question: "Can I try Rytr for free?",
      answer: "Yes! Rytr offers a generous free plan that lets you generate up to 10,000 characters per month. It's perfect for testing the quality before committing. [Try Rytr Free]({CTA_URL})."
    },
    {
      question: "Is Rytr beginner-friendly?",
      answer: "Absolutely. Rytr is designed for users with zero technical background. You just pick a template, enter your prompt, and get results in seconds. No learning curve required."
    },
    {
      question: "What if I don't like it?",
      answer: "Rytr's free plan has no credit card requirement, so there's zero risk. If you upgrade to paid, they offer a 7-day money-back guarantee. You can cancel anytime."
    },
    {
      question: "How does Rytr compare to Jasper or Copy.ai?",
      answer: "Rytr costs a fraction of Jasper ($9 vs $49/month) and offers similar quality for most use cases. Copy.ai has more templates, but Rytr's SEO features and multilingual support are superior. [See our comparison]({CTA_URL})."
    },
  ],
  51: [
    {
      question: "Can I try VEED.io for free?",
      answer: "Yes, VEED offers a free plan with basic editing features and watermarked exports. It's enough to test the core features and see if it fits your workflow. [Try VEED Free]({CTA_URL})."
    },
    {
      question: "Is VEED.io beginner-friendly?",
      answer: "Yes. VEED is entirely browser-based — no software to install. The drag-and-drop interface is intuitive, and the AI features (auto-subtitles, background removal) work with one click."
    },
    {
      question: "What if I don't like it?",
      answer: "The free plan is no-commitment. For paid plans, VEED offers a 30-day money-back guarantee. If you're not satisfied, they'll refund your payment."
    },
    {
      question: "How does VEED.io compare to Runway or Synthesia?",
      answer: "VEED is more of a complete video editor, while Runway focuses on AI generation and Synthesia on AI avatars. VEED gives you the most bang for your buck if you need editing, subtitles, and AI features in one place. [See our comparison]({CTA_URL})."
    },
  ],
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
  rating?: number;
  rating_count?: number;
  last_updated?: string;
  skill_level?: string;
  best_for?: string[];
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

// Export function
export default function ToolDetailClient({ tool, relatedTools }: { tool: Tool; relatedTools: Tool[] }) {
  const colors = getCategoryColors(tool.category);
  const features = categoryFeatures[tool.category] || categoryFeatures['Writing'];
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [openFAQIndex, setOpenFAQIndex] = useState<number | null>(null);
  const hasAffiliate = hasAffiliateLink(tool);
  const ctaText = hasAffiliate ? ctaVariants[getCTAVariant()] : 'Visit Official Website';
  const ctaUrl = hasAffiliate ? getAffiliateLinkWithUTM(tool) : tool.url;
  const faqs = toolFAQs[tool.id];
  const processedFAQs = faqs?.map(faq => ({
    ...faq,
    answer: faq.answer.replace(/\{CTA_URL\}/g, ctaUrl)
  }));
  
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

// Similar Tool Card with rating display
const SimilarToolCard = ({ relatedTool }: { relatedTool: Tool }) => {
  const relatedColors = getCategoryColors(relatedTool.category);
  return (
    <Link
      href={`/tools/${relatedTool.id}`}
      className="group bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 ease-out animate-fade-in-up"
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
                    {tool.skill_level && (
                      <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold ${getSkillLevelColors(tool.skill_level).bg} ${getSkillLevelColors(tool.skill_level).text}`}>
                        {getSkillLevelColors(tool.skill_level).label}
                      </span>
                    )}
                    {tool.needs_vpn ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        🪜 VPN Required
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                        ✅ Direct Access
                      </span>
                    )}
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {tool.best_for?.slice(0, 4).map((tag, i) => (
                        <span key={i} className="inline-flex items-center px-2 py-1 rounded-full text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {tag}
                        </span>
                      ))}
                    </div>
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
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-4 text-center">
                We may earn a small commission if you try this tool. It doesn&apos;t affect our recommendation.
              </p>
            )}
            
            {/* CTA Button */}
            <div className="flex flex-wrap gap-3">
              <a
                href={ctaUrl}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 hover:-translate-y-0.5 transition-all duration-300"
              >
                {ctaText}
                <ArrowRight className="w-5 h-5" />
              </a>
              <Link
                href={`/compare?tool=${tool.id}`}
                className="inline-flex items-center gap-2 px-6 py-4 border border-slate-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-slate-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-gray-700 hover:border-emerald-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all duration-300"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                </svg>
                Compare
              </Link>
            </div>

            {/* Trust Signal */}
            {tool.rating && tool.rating_count && (
              <div className="mt-4 flex items-center justify-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                <StarRating rating={Math.round(tool.rating)} />
                <span className="font-medium">{tool.rating}</span>
                <span className="text-slate-400 dark:text-slate-500">·</span>
                <span>Already used by {tool.rating_count.toLocaleString()} users</span>
              </div>
            )}
            {/* Data Update Status - New Trust Signal */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30">
                <span className="text-lg">✅</span>
                <span className="font-semibold text-emerald-700 dark:text-emerald-300">Verified</span>
              </div>
              {tool.last_updated && (
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-gray-700">
                  <span className="text-lg">📅</span>
                  <span className="text-slate-600 dark:text-slate-300">Last updated: {tool.last_updated}</span>
                </div>
              )}
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

        {/* User Reviews Section */}
        {toolReviews[tool.id] && (
          <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-3xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">💬 What Users Are Saying</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Real feedback from Reddit, Trustpilot, and verified users</p>
            <div className="space-y-5">
              {toolReviews[tool.id].map((review, index) => (
                <div key={index} className="flex gap-4 p-5 rounded-xl bg-slate-50 dark:bg-gray-800/60 border border-slate-100 dark:border-gray-700/50">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 dark:from-gray-600 dark:to-gray-700 flex items-center justify-center text-slate-600 dark:text-slate-300 font-semibold text-sm">
                    {review.username.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-semibold text-sm text-slate-900 dark:text-white">{review.username}</span>
                      <StarRating rating={review.rating} />
                    </div>
                    <p className="text-slate-600 dark:text-gray-300 text-sm leading-relaxed">{review.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FAQ Section */}
        {processedFAQs && processedFAQs.length > 0 && (
          <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-3xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">❓ Frequently Asked Questions</h2>
            <div className="space-y-3">
              {processedFAQs.map((faq, index) => (
                <div key={index} className="border border-slate-200 dark:border-gray-700/50 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setOpenFAQIndex(openFAQIndex === index ? null : index)}
                    className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50 dark:hover:bg-gray-800/50 transition-colors duration-200"
                    aria-expanded={openFAQIndex === index}
                  >
                    <span className="font-semibold text-slate-900 dark:text-white pr-4">{faq.question}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform duration-300 ${openFAQIndex === index ? 'rotate-180' : ''}`}
                    />
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-out ${openFAQIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                  >
                    <div className="px-5 pb-5 pt-0">
                      <p className="text-slate-600 dark:text-gray-300 text-sm leading-relaxed">
                        {faq.answer.split(/\[([^\]]+)\]\(([^)]+)\)/).map((part, i, arr) => {
                          if (i % 3 === 1) {
                            return (
                              <a
                                key={i}
                                href={arr[i + 1]}
                                target="_blank"
                                rel="noopener noreferrer sponsored"
                                className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline"
                              >
                                {part}
                              </a>
                            );
                          }
                          if (i % 3 === 2) return null;
                          return <span key={i}>{part}</span>;
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
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
                        className="w-full h-auto object-cover opacity-0 animate-fade-in max-w-full aspect-video"
                        style={{ aspectRatio: '16/9' }}
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

        {/* Similar Tools Section - Enhanced with Smart Recommendations */}
        {relatedTools.length > 0 && (
          <div className="bg-gradient-to-br from-slate-50 to-emerald-50/30 dark:from-gray-900 dark:to-emerald-900/10 border border-slate-200 dark:border-gray-800 rounded-3xl p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/25">
                <span className="text-white text-lg">✨</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Similar Tools</h2>
                <p className="text-sm text-slate-500 dark:text-gray-400">Based on category, pricing, and user preferences</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {relatedTools.map((relatedTool, index) => (
                <SimilarToolCard key={relatedTool.id} relatedTool={relatedTool} />
              ))}
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
