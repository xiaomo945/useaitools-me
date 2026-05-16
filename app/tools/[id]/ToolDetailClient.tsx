'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowRight, Home, Copy, Check } from 'lucide-react';
import Footer from '@/app/components/Footer';

type Example = {
  prompt: string;
  image_url: string;
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
        {/* Back to Home Link */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white transition-colors duration-300"
          >
            <Home className="w-5 h-5" />
            <span className="font-medium">Back to Home</span>
          </Link>
        </div>

        {/* Tool Header */}
        <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-3xl shadow-xl overflow-hidden mb-8">
          {/* Category Color Bar */}
          <div className={`h-1 ${colors.bg}`} />
          
          <div className="p-8 sm:p-12">
            {/* Tool Name & Pricing */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-2">
                  {tool.name}
                </h1>
                <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-semibold ${colors.bg} text-white`}>
                  {tool.category}
                </span>
              </div>
              <span className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold">
                {tool.pricing}
              </span>
            </div>

            {/* Description */}
            <p className="text-lg text-slate-600 dark:text-gray-300 leading-relaxed mb-8">
              {tool.description}
            </p>

            {/* CTA Button */}
            <a
              href={tool.affiliate_link || tool.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 hover:-translate-y-0.5 transition-all duration-300"
            >
              Visit Official Website
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>

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
                      className="relative rounded-xl overflow-hidden shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300 ease-out group"
                      style={{ 
                        willChange: 'transform',
                        transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' 
                      }}
                    >
                      <img
                        src={example.image_url}
                        alt={`Example ${index + 1}`}
                        className="w-full h-auto object-cover"
                        loading="lazy"
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
