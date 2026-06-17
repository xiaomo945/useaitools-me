'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ArrowRight, Home, Copy, Check, ChevronDown, Share2, X, ChevronLeft, ChevronRight } from 'lucide-react';
import Footer from '@/app/components/Footer';
import Breadcrumbs from '@/app/components/Breadcrumbs';
import ToolVerdict from '@/app/components/ToolVerdict';
import RelatedTools from '@/app/components/RelatedTools';
import toolsData from '@/data/tools.json';

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
  description_en?: string;
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
  A: 'Get Started for Free',
  B: 'Get Started for Free',
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

// StarRating component
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

const ratingDimensions = [
  { key: 'ease', label: 'Ease of Use', desc: 'How intuitive is the interface?' },
  { key: 'quality', label: 'Output Quality', desc: 'Accuracy and relevance of results' },
  { key: 'features', label: 'Features', desc: 'Breadth and depth of capabilities' },
  { key: 'value', label: 'Value for Money', desc: 'Pricing relative to competitors' },
  { key: 'stability', label: 'Stability', desc: 'Uptime and reliability' },
  { key: 'support', label: 'Support', desc: 'Responsiveness and helpfulness' },
];

const RatingTooltip = ({ overallRating, ratingCount }: { overallRating: number; ratingCount?: number }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const getDimensionRating = (key: string, base: number): number => {
    const offsets: Record<string, number> = { ease: 0.3, quality: -0.1, features: 0.1, value: -0.2, stability: 0.2, support: -0.3 };
    return Math.max(1, Math.min(5, +(base + (offsets[key] || 0)).toFixed(1)));
  };

  return (
    <div className="relative inline-flex">
      <button
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={() => setShowTooltip(!showTooltip)}
        className="flex items-center gap-3 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-lg"
        aria-label="View detailed ratings"
        aria-expanded={showTooltip}
      >
        <StarRating rating={Math.round(overallRating)} />
        <span className="font-medium">{overallRating}</span>
        <span className="text-slate-400 dark:text-slate-500">·</span>
        <span>Already used by {ratingCount?.toLocaleString()} users</span>
        <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      </button>
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-72 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-700 rounded-2xl shadow-2xl p-4 z-50 animate-fade-in-up">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rotate-45 w-3 h-3 bg-white dark:bg-gray-900 border-r border-b border-slate-200 dark:border-gray-700" />
          <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-3 flex items-center gap-2">
            <span className="text-emerald-600 dark:text-emerald-400">⭐</span> Detailed Ratings
          </h4>
          <div className="space-y-2.5">
            {ratingDimensions.map((dim) => {
              const dimRating = getDimensionRating(dim.key, overallRating);
              return (
                <div key={dim.key}>
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{dim.label}</span>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{dimRating}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="flex-1 h-1.5 bg-slate-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full transition-all duration-500" style={{ width: `${(dimRating / 5) * 100}%` }} />
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">{dim.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

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

const AlternativeToolCard = ({ altTool }: { altTool: Tool }) => {
  const altColors = getCategoryColors(altTool.category);
  const desc = (altTool.description_en || altTool.description).slice(0, 80);
  return (
    <Link
      href={`/tools/${altTool.id}`}
      className="group bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 border-l-4 border-l-amber-500 rounded-2xl p-5 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 ease-out animate-fade-in-up"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-9 h-9 rounded-lg ${altColors.bg}/10 flex items-center justify-center ${altColors.textLight} dark:${altColors.text} text-sm font-bold`}>
          {altTool.name.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm text-slate-900 dark:text-white truncate group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
            {altTool.name}
          </h4>
          <span className={`text-xs ${altColors.textLight} dark:${altColors.text}`}>
            {altTool.category}
          </span>
        </div>
      </div>
      <p className="text-slate-600 dark:text-gray-300 text-xs leading-relaxed mb-3">
        {desc}{(altTool.description_en || altTool.description).length > 80 ? '...' : ''}
      </p>
      {altTool.rating && (
        <div className="flex items-center gap-1.5">
          <StarRating rating={Math.round(altTool.rating)} />
          <span className="text-xs text-slate-500 dark:text-gray-400">{altTool.rating}</span>
        </div>
      )}
    </Link>
  );
};

// Screenshot Gallery Component
const ScreenshotGallery = ({ tool, colors }: { tool: Tool; colors: ReturnType<typeof getCategoryColors> }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  
  // Generate placeholder screenshots if none exist
  const screenshots = tool.examples?.map(ex => ex.image_url) || [];
  
  if (screenshots.length === 0) return null;
  
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % screenshots.length);
  };
  
  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + screenshots.length) % screenshots.length);
  };
  
  return (
    <>
      <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-3xl p-8 mb-8">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">📸 Screenshots & Demos</h2>
        
        {/* Main Image */}
        <div className="relative rounded-xl overflow-hidden mb-4 bg-gray-100 dark:bg-gray-800 aspect-video cursor-pointer group" onClick={() => setIsLightboxOpen(true)}>
          <Image
            src={screenshots[currentImageIndex]}
            alt={`${tool.name} screenshot ${currentImageIndex + 1}`}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 1024px) 100vw, 66vw"
          />
          
          {/* Navigation Arrows */}
          {screenshots.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prevImage(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 dark:bg-gray-900/90 hover:bg-white dark:hover:bg-gray-900 shadow-lg flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6 text-slate-700 dark:text-slate-300" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); nextImage(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 dark:bg-gray-900/90 hover:bg-white dark:hover:bg-gray-900 shadow-lg flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100"
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6 text-slate-700 dark:text-slate-300" />
              </button>
            </>
          )}
          
          {/* Image Counter */}
          <div className="absolute bottom-4 right-4 px-3 py-1.5 rounded-full bg-black/60 text-white text-sm font-medium">
            {currentImageIndex + 1} / {screenshots.length}
          </div>
        </div>
        
        {/* Thumbnail Strip */}
        {screenshots.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {screenshots.map((screenshot, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                  index === currentImageIndex
                    ? 'border-emerald-500 ring-2 ring-emerald-500/30'
                    : 'border-slate-200 dark:border-gray-700 hover:border-slate-300 dark:hover:border-gray-600'
                }`}
              >
                <div className="relative w-full h-full overflow-hidden">
                  <Image
                    src={screenshot}
                    alt={`Thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
      
      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4" onClick={() => setIsLightboxOpen(false)}>
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            aria-label="Close lightbox"
          >
            <X className="w-6 h-6 text-white" />
          </button>
          
          <div className="relative max-w-6xl w-full max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <Image
              src={screenshots[currentImageIndex]}
              alt={`${tool.name} screenshot ${currentImageIndex + 1}`}
              width={1200}
              height={800}
              className="w-full h-full object-contain rounded-lg"
              priority
            />
            
            {screenshots.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-8 h-8 text-white" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-8 h-8 text-white" />
                </button>
              </>
            )}
            
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-black/60 text-white text-sm font-medium">
              {currentImageIndex + 1} / {screenshots.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Export function
type BlogPost = {
  id: number;
  title: string;
  slug: string;
  date: string;
  description: string;
  category?: string;
  images?: { url: string; alt: string }[];
};

export default function ToolDetailClient({ tool, relatedTools, relatedArticles = [] }: { tool: Tool; relatedTools: Tool[]; relatedArticles?: BlogPost[] }) {
  const router = useRouter();
  const colors = getCategoryColors(tool.category);
  const features = categoryFeatures[tool.category] || categoryFeatures['Writing'];
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [openFAQIndex, setOpenFAQIndex] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'features' | 'reviews' | 'alternatives'>('overview');
  const hasAffiliate = hasAffiliateLink(tool);
  const ctaText = hasAffiliate ? ctaVariants[getCTAVariant()] : 'Visit Website';
  const ctaUrl = hasAffiliate ? getAffiliateLinkWithUTM(tool) : tool.url;
  const faqs = toolFAQs[tool.id];
  const processedFAQs = faqs?.map(faq => ({
    ...faq,
    answer: faq.answer.replace(/\{CTA_URL\}/g, ctaUrl)
  }));

  const allTools = toolsData as Tool[];
  const relatedToolIds = new Set(relatedTools.map(t => t.id));
  const getBestAlternatives = (): Tool[] => {
    const excludeIds = new Set([tool.id, ...relatedToolIds]);
    const sameCategory = allTools.filter(t => t.category === tool.category && !excludeIds.has(t.id));
    const sameCategoryAndSkill = tool.skill_level
      ? sameCategory.filter(t => t.skill_level === tool.skill_level)
      : [];
    const pool = sameCategoryAndSkill.length > 0 ? sameCategoryAndSkill : sameCategory;
    return [...pool]
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 3);
  };
  const bestAlternatives = getBestAlternatives();
  
  // People Also Viewed - based on browsing history
  const [peopleAlsoViewed, setPeopleAlsoViewed] = useState<Tool[]>([]);
  
  useEffect(() => {
    saveToHistory(tool.id);
    
    const compute = () => {
      try {
        const saved = localStorage.getItem('toolHistory');
        if (saved) {
          const history: { toolId: number; timestamp: number }[] = JSON.parse(saved);
          const excludeIds = new Set([tool.id, ...relatedToolIds, ...bestAlternatives.map(t => t.id)]);
          const historyToolIds = history.map(h => h.toolId).filter(id => !excludeIds.has(id));
          const historyTools = allTools.filter(t => historyToolIds.includes(t.id) && t.category === tool.category);
          
          if (historyTools.length >= 3) {
            setPeopleAlsoViewed(historyTools.slice(0, 3));
          } else {
            const popularOthers = allTools.filter(t => 
              t.category === tool.category && 
              !excludeIds.has(t.id) && 
              !historyToolIds.includes(t.id)
            ).sort((a, b) => (b.rating || 0) - (a.rating || 0));
            setPeopleAlsoViewed([...historyTools, ...popularOthers].slice(0, 3));
          }
        } else {
          const popular = allTools.filter(t => 
            t.category === tool.category && 
            t.id !== tool.id && 
            !relatedToolIds.has(t.id)
          ).sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 3);
          setPeopleAlsoViewed(popular);
        }
      } catch {
        const popular = allTools.filter(t => 
          t.category === tool.category && 
          t.id !== tool.id && 
          !relatedToolIds.has(t.id)
        ).sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 3);
        setPeopleAlsoViewed(popular);
      }
    };
    queueMicrotask(compute);
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

  const handleShare = async () => {
    const shareUrl = typeof window !== 'undefined' ? window.location.href : `https://useaitools.me/tools/${tool.id}`;
    const shareData = {
      title: `${tool.name} - Use AI Tools`,
      text: `${tool.name}: ${tool.description.slice(0, 100)}...`,
      url: shareUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error('Share failed:', err);
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setCopiedIndex(-1);
        setTimeout(() => setCopiedIndex(null), 2000);
      } catch (err) {
        console.error('Failed to copy link:', err);
      }
    }
  };

const [hasReferrer] = useState(() => {
    try { return !!sessionStorage.getItem('useaitools_scrollY'); } catch { return false; }
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 py-10 sm:py-16">
      <div className="max-w-4xl mx-auto px-3 sm:px-6">
        {/* Back Button */}
        <button
          onClick={() => {
            if (hasReferrer || document.referrer.includes('useaitools')) {
              router.back();
            } else {
              router.push('/');
            }
          }}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:underline mb-4 transition-colors duration-200"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {hasReferrer ? 'Back to results' : 'Browse all tools'}
        </button>

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
            <div className="absolute top-3 right-3 z-10">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/25 animate-pulse-glow">
                🏷️ Staff Pick
              </span>
            </div>
          )}
          
          {/* Category Color Bar */}
          <div className={`h-1 ${colors.bg}`} />
          
          <div className="p-6 sm:p-12">
            {/* Tool Name & Pricing */}
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

            {/* Description */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-gray-300 leading-relaxed mb-6 sm:mb-8">
              {tool.description}
            </p>

            {/* Affiliate Disclaimer for trust */}
            {hasAffiliate && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 text-center">
                We may earn a small commission if you try this tool. It doesn&apos;t affect our recommendation.
              </p>
            )}
            
            {/* CTA Button */}
            <div className="flex flex-wrap gap-3">
              <a
                href={ctaUrl}
                target="_blank" rel="noopener noreferrer"
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
              <button
                onClick={handleShare}
                className="inline-flex items-center gap-2 px-5 sm:px-6 py-3.5 sm:py-4 border border-slate-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-slate-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-gray-700 hover:border-emerald-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all duration-300"
              >
                {copiedIndex === -1 ? (
                  <Check className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500" />
                ) : (
                  <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
                {copiedIndex === -1 ? 'Copied!' : 'Share'}
              </button>
            </div>

            {/* Trust Signal + Feedback */}
            {tool.rating && tool.rating_count && (
              <div className="mt-4 flex flex-col items-center gap-3">
                <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                  <RatingTooltip overallRating={tool.rating} ratingCount={tool.rating_count} />
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      const key = `feedback_${tool.id}`;
                      const current = localStorage.getItem(key);
                      if (current === 'up') {
                        localStorage.removeItem(key);
                      } else {
                        localStorage.setItem(key, 'up');
                      }
                      window.dispatchEvent(new Event('feedback-updated'));
                    }}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 ${
                      typeof window !== 'undefined' && localStorage.getItem(`feedback_${tool.id}`) === 'up'
                        ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/20'
                    }`}
                  >
                    👍 Helpful
                  </button>
                  <button
                    onClick={() => {
                      const key = `feedback_${tool.id}`;
                      const current = localStorage.getItem(key);
                      if (current === 'down') {
                        localStorage.removeItem(key);
                      } else {
                        localStorage.setItem(key, 'down');
                      }
                      window.dispatchEvent(new Event('feedback-updated'));
                    }}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 ${
                      typeof window !== 'undefined' && localStorage.getItem(`feedback_${tool.id}`) === 'down'
                        ? 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-700'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-rose-50 dark:hover:bg-rose-900/20'
                    }`}
                  >
                    👎 Not for me
                  </button>
                </div>
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

        {/* Tool Verdict: Editor's one-liner recommendation */}
        <ToolVerdict
          name={tool.name}
          category={tool.category}
          pricing={tool.pricing}
          best_for={tool.best_for}
          hasAffiliate={hasAffiliate}
          affiliateUrl={ctaUrl}
        />

        {/* Screenshot Gallery */}
        <ScreenshotGallery tool={tool} colors={colors} />

        {/* Tab Navigation */}
        <div className="sticky top-0 z-30 bg-slate-50/95 dark:bg-gray-950/95 backdrop-blur-md border-b border-slate-200 dark:border-gray-800 mb-8 -mx-3 sm:-mx-6 px-3 sm:px-6">
          <nav className="flex gap-1 overflow-x-auto scrollbar-hide" role="tablist" aria-label="Tool information tabs">
            {([
              { key: 'overview' as const, label: 'Overview', icon: '📋' },
              { key: 'features' as const, label: 'Features', icon: '⚡' },
              { key: 'reviews' as const, label: 'Reviews', icon: '💬' },
              { key: 'alternatives' as const, label: 'Alternatives', icon: '🔄' },
            ]).map((tab) => (
              <button
                key={tab.key}
                role="tab"
                aria-selected={activeTab === tab.key}
                aria-controls={`panel-${tab.key}`}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-1.5 px-4 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-all duration-200 ${
                  activeTab === tab.key
                    ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:border-slate-300 dark:hover:border-gray-600'
                }`}
              >
                <span className="text-base">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Panels */}
        <div role="tabpanel" id="panel-overview" aria-labelledby="tab-overview" hidden={activeTab !== 'overview'}>
          {activeTab === 'overview' && (
            <>
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
                                target="_blank" rel="noopener noreferrer"
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
                      className="relative rounded-xl overflow-hidden shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300 ease-out group bg-gray-200 dark:bg-gray-700 aspect-video"
                      style={{ 
                        willChange: 'transform',
                        transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' 
                      }}
                    >
                      <Image
                        src={example.image_url}
                        alt={`${tool.name} Example ${index + 1} - AI tool demo`}
                        fill
                        className="object-cover opacity-0 animate-fade-in"
                        sizes="(max-width: 1024px) 100vw, 50vw"
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

        {/* People Also Viewed */}
        {peopleAlsoViewed.length > 0 && (
          <div className="bg-gradient-to-br from-sky-50/50 to-cyan-50/30 dark:from-gray-900 dark:to-sky-900/10 border border-slate-200 dark:border-gray-800 rounded-3xl p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-sky-500/25">
                <span className="text-white text-lg">👀</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">People Also Viewed</h2>
                <p className="text-sm text-slate-500 dark:text-gray-400">Other {tool.category} tools users explored</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {peopleAlsoViewed.map((viewedTool) => {
                const vColors = getCategoryColors(viewedTool.category);
                return (
                  <Link
                    key={viewedTool.id}
                    href={`/tools/${viewedTool.id}`}
                    className="group bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl p-4 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-9 h-9 rounded-lg ${vColors.bg}/10 flex items-center justify-center text-sm font-bold ${vColors.textLight}`}>
                        {viewedTool.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors truncate">{viewedTool.name}</h4>
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-amber-500">★</span>
                          <span className="text-xs text-slate-500">{viewedTool.rating || 4.0}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{viewedTool.description}</p>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {bestAlternatives.length > 0 && (
          <div className="bg-gradient-to-br from-amber-50/50 to-orange-50/30 dark:from-gray-900 dark:to-amber-900/10 border border-slate-200 dark:border-gray-800 rounded-3xl p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/25">
                <span className="text-white text-lg">🔄</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Best Alternatives</h2>
                <p className="text-sm text-slate-500 dark:text-gray-400">Same category, same skill level — different approach</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {bestAlternatives.map((altTool) => (
                <AlternativeToolCard key={altTool.id} altTool={altTool} />
              ))}
            </div>
          </div>
        )}

        {/* Complete Your Toolkit - Complementary Tools */}
        {(() => {
          const complementaryMap: Record<string, { category: string; reason: string }[]> = {
            'Writing': [
              { category: 'Image', reason: 'Pair with this for visuals' },
              { category: 'Productivity', reason: 'Publish & schedule content' },
            ],
            'Image': [
              { category: 'Writing', reason: 'Add compelling copy' },
              { category: 'Video', reason: 'Animate your visuals' },
            ],
            'Video': [
              { category: 'Audio', reason: 'Add voice & music' },
              { category: 'Writing', reason: 'Script your videos' },
            ],
            'Audio': [
              { category: 'Video', reason: 'Add visual elements' },
              { category: 'Writing', reason: 'Create show notes' },
            ],
            'Code': [
              { category: 'Productivity', reason: 'Manage your projects' },
              { category: 'Writing', reason: 'Document your code' },
            ],
            'Productivity': [
              { category: 'Writing', reason: 'Draft communications' },
              { category: 'Code', reason: 'Automate workflows' },
            ],
          };
          const complements = complementaryMap[tool.category] || [];
          const relatedIds = new Set(relatedTools.map(t => t.id));
          const complementTools = complements
            .map(c => ({
              ...c,
              tool: allTools.find(t => t.category === c.category && t.id !== tool.id && !relatedIds.has(t.id))
            }))
            .filter(c => c.tool)
            .slice(0, 2);
          
          if (complementTools.length === 0) return null;
          return (
            <div className="bg-gradient-to-br from-amber-50/60 to-orange-50/40 dark:from-amber-950/20 dark:via-gray-900 dark:to-orange-950/20 border border-amber-200/60 dark:border-amber-800/30 rounded-3xl p-6 sm:p-8 mb-8">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/25">
                  <span className="text-white text-lg">🔄</span>
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Complete Your Toolkit</h2>
                  <p className="text-sm text-slate-500 dark:text-gray-400">Tools that pair perfectly with {tool.name}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {complementTools.map((item) => {
                  const t = item.tool!;
                  const catColors: Record<string, string> = {
                    'Writing': 'bg-blue-500', 'Image': 'bg-violet-500', 'Video': 'bg-indigo-500',
                    'Audio': 'bg-pink-500', 'Code': 'bg-orange-500', 'Productivity': 'bg-teal-500',
                  };
                  return (
                    <Link
                      key={t.id}
                      href={`/tools/${t.id}`}
                      className="group bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl p-4 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`w-9 h-9 rounded-lg ${catColors[t.category] || 'bg-slate-500'}/10 flex items-center justify-center text-sm font-bold ${catColors[t.category]?.replace('bg-', 'text-').replace('-500', '-600') || 'text-slate-600'}`}>
                          {t.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors truncate">{t.name}</h4>
                          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${catColors[t.category] || 'bg-slate-500'} text-white`}>{t.category}</span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-2">{t.description}</p>
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-600 dark:text-amber-400">
                        🔗 {item.reason}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })()}

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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                      <div className="relative w-full h-32 mb-3 overflow-hidden rounded-lg">
                        <Image
                          src={article.images[0].url}
                          alt={article.images[0].alt}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      </div>
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
            </>
          )}
        </div>

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

        {/* Related Tools: Similar tools in same category */}
        <RelatedTools currentTool={tool} allTools={toolsData as { id: number; name: string; description: string; category: string; pricing: string; rating?: number; best_for?: string[] }[]} limit={4} />
      </div>
      <Footer />
    </div>
  );
}
