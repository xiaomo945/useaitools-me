'use client';

import React from 'react';
import Link from 'next/link';

type Category = 'Writing' | 'Image' | 'Productivity' | 'Code' | 'Audio' | 'Video';

const categoryEmojis: Record<Category, string> = {
  Writing: '✍️',
  Image: '🎨',
  Productivity: '⚡',
  Code: '💻',
  Audio: '🎵',
  Video: '🎬'
};

const colorMap: Record<Category, { 
  bg: string; 
  bgDark: string; 
  text: string; 
  textLight: string; 
  border: string; 
  ring: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  badgeShadow: string;
  colorValue: string;
  lightBg: string;
  darkBg: string;
}> = {
  Writing:    { 
    bg: 'bg-blue-500',    bgDark: 'bg-blue-500/20',    text: 'text-blue-300',    textLight: 'text-blue-600',    border: 'border-blue-300',    ring: 'hover:shadow-blue-500/20',
    badgeBg: 'bg-blue-100/80 dark:bg-blue-500/20',
    badgeText: 'text-blue-700 dark:text-blue-300',
    badgeBorder: 'border-blue-200 dark:border-blue-500/30',
    badgeShadow: 'shadow-[0_0_12px_rgba(59,130,246,0.15)]',
    colorValue: '#3b82f6',
    lightBg: 'from-emerald-50 via-white to-teal-50',
    darkBg: 'from-emerald-950/70 via-gray-950 to-teal-950/50'
  },
  Image:      { 
    bg: 'bg-violet-500', bgDark: 'bg-violet-500/20', text: 'text-violet-300', textLight: 'text-violet-600', border: 'border-violet-300', ring: 'hover:shadow-violet-500/20',
    badgeBg: 'bg-violet-100/80 dark:bg-violet-500/20',
    badgeText: 'text-violet-700 dark:text-violet-300',
    badgeBorder: 'border-violet-200 dark:border-violet-500/30',
    badgeShadow: 'shadow-[0_0_12px_rgba(139,92,246,0.15)]',
    colorValue: '#8b5cf6',
    lightBg: 'from-violet-50 via-white to-purple-50',
    darkBg: 'from-violet-950/70 via-gray-950 to-purple-950/50'
  },
  Productivity: { 
    bg: 'bg-teal-500',  bgDark: 'bg-teal-500/20',  text: 'text-teal-300',  textLight: 'text-teal-600',  border: 'border-teal-300',  ring: 'hover:shadow-teal-500/20',
    badgeBg: 'bg-teal-100/80 dark:bg-teal-500/20',
    badgeText: 'text-teal-700 dark:text-teal-300',
    badgeBorder: 'border-teal-200 dark:border-teal-500/30',
    badgeShadow: 'shadow-[0_0_12px_rgba(20,184,166,0.15)]',
    colorValue: '#14b8a6',
    lightBg: 'from-teal-50 via-white to-cyan-50',
    darkBg: 'from-teal-950/70 via-gray-950 to-cyan-950/50'
  },
  Code:       { 
    bg: 'bg-orange-500', bgDark: 'bg-orange-500/20', text: 'text-orange-300', textLight: 'text-orange-600', border: 'border-orange-300', ring: 'hover:shadow-orange-500/20',
    badgeBg: 'bg-orange-100/80 dark:bg-orange-500/20',
    badgeText: 'text-orange-700 dark:text-orange-300',
    badgeBorder: 'border-orange-200 dark:border-orange-500/30',
    badgeShadow: 'shadow-[0_0_12px_rgba(249,115,22,0.15)]',
    colorValue: '#f97316',
    lightBg: 'from-blue-50 via-white to-indigo-50',
    darkBg: 'from-blue-950/70 via-gray-950 to-indigo-950/50'
  },
  Audio:      { 
    bg: 'bg-pink-500',   bgDark: 'bg-pink-500/20',   text: 'text-pink-300',   textLight: 'text-pink-600',   border: 'border-pink-300',   ring: 'hover:shadow-pink-500/20',
    badgeBg: 'bg-pink-100/80 dark:bg-pink-500/20',
    badgeText: 'text-pink-700 dark:text-pink-300',
    badgeBorder: 'border-pink-200 dark:border-pink-500/30',
    badgeShadow: 'shadow-[0_0_12px_rgba(236,72,153,0.15)]',
    colorValue: '#ec4899',
    lightBg: 'from-pink-50 via-white to-rose-50',
    darkBg: 'from-pink-950/70 via-gray-950 to-rose-950/50'
  },
  Video:      { 
    bg: 'bg-indigo-500', bgDark: 'bg-indigo-500/20', text: 'text-indigo-300', textLight: 'text-indigo-600', border: 'border-indigo-300', ring: 'hover:shadow-indigo-500/20',
    badgeBg: 'bg-indigo-100/80 dark:bg-indigo-500/20',
    badgeText: 'text-indigo-700 dark:text-indigo-300',
    badgeBorder: 'border-indigo-200 dark:border-indigo-500/30',
    badgeShadow: 'shadow-[0_0_12px_rgba(99,102,241,0.15)]',
    colorValue: '#6366f1',
    lightBg: 'from-amber-50 via-white to-orange-50',
    darkBg: 'from-amber-950/70 via-gray-950 to-orange-950/50'
  }
};

interface CategoryHeroProps {
  category: string;
  categoryName: string;
  description: string;
  toolCount?: number;
}

const categoryAISummaries: Record<Category, string> = {
  Writing: '150+ AI writing tools for content creation, copywriting, SEO, and more. Top picks: Rytr, Jasper, Copy.ai. Price range: Free to $49/month.',
  Image: '120+ AI image generators and editors. Top picks: Midjourney, DALL-E 3, Stable Diffusion. Price range: Free to $60/month.',
  Productivity: '160+ AI productivity assistants and automation tools. Top picks: Notion AI, ChatGPT, Claude. Price range: Free to $30/month.',
  Code: '90+ AI coding assistants and development tools. Top picks: GitHub Copilot, Cursor, Codeium. Price range: Free to $19/month.',
  Audio: '80+ AI audio editors and voice generators. Top picks: ElevenLabs, Murf, Play.ht. Price range: Free to $49/month.',
  Video: '100+ AI video editors and generators. Top picks: VEED.io, Synthesia, HeyGen. Price range: Free to $99/month.'
};

export default function CategoryHero({ category, categoryName, description, toolCount }: CategoryHeroProps) {
  const colors = colorMap[category as Category];
  const emoji = categoryEmojis[category as Category];

  return (
    <div className="mb-10">
      <div className={`relative bg-gradient-to-br ${colors.lightBg} dark:${colors.darkBg} backdrop-blur-xl border border-emerald-200/50 dark:border-emerald-500/10 shadow-[0_8px_32px_rgba(16,185,129,0.08)] rounded-3xl p-8 sm:p-12 overflow-hidden`}>
        {/* Grid Background */}
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(to right, rgba(16, 185, 129, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(16, 185, 129, 0.05) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
          pointerEvents: 'none'
        }} />
        
        <div className="relative z-10 text-center">
          {/* Emoji */}
          <div className="text-6xl mb-4 animate-fade-in-up" style={{ animationDelay: '0ms' }}>{emoji}</div>
          
          {/* Category Badge */}
          <span 
            className={`inline-block px-5 py-2 rounded-full text-sm font-semibold ${colors.badgeBg} ${colors.badgeText} ${colors.badgeBorder} ${colors.badgeShadow} border mb-6 transition-all duration-300 hover:scale-105 animate-fade-in-up`}
            style={{ animationDelay: '100ms' }}
          >
            {categoryName}
          </span>
          
          {/* Title */}
          <h1 
            className="text-5xl sm:text-6xl font-extrabold text-gray-900 dark:text-white mb-6 animate-fade-in-up"
            style={{ 
              fontFamily: 'Playfair Display, serif',
              textShadow: `0 2px 20px rgba(0,0,0,0.05)`,
              animationDelay: '200ms'
            }}
          >
            <span className="relative inline-block">
              {categoryName} Tools
              <span 
                className="absolute -bottom-2 left-0 right-0 h-1 rounded-full opacity-60"
                style={{ backgroundColor: colors.colorValue }}
              />
            </span>
          </h1>
          
          {/* Description */}
          <div className="relative max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '300ms' }}>
            <div className="relative backdrop-blur-sm bg-white/40 dark:bg-gray-800/30 rounded-2xl p-6 border border-white/30 dark:border-gray-700/30">
              {/* Quote Marks */}
              <svg 
                className="absolute -top-4 -left-2 w-12 h-12 opacity-10"
                style={{ color: colors.colorValue }}
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                {description}
              </p>
              <svg 
                className="absolute -bottom-4 -right-2 w-12 h-12 opacity-10"
                style={{ color: colors.colorValue }}
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M9.983 3v7.391c0 5.704-3.731 9.57-8.983 10.609l-.995-2.151c2.432-.917 3.995-3.638 3.995-5.849h-4v-10h9.983zm14.017 0v7.391c0 5.704-3.748 9.57-9 10.609l-.996-2.151c2.433-.917 3.996-3.638 3.996-5.849h-3.983v-10h9.983z" />
              </svg>
            </div>
          </div>

          {/* AI Summary - Quick Facts for AI Search Engines */}
          <div className="relative max-w-2xl mx-auto mt-6 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
            <div className="backdrop-blur-sm bg-emerald-50/60 dark:bg-emerald-900/20 rounded-xl p-4 border border-emerald-200/50 dark:border-emerald-700/30">
              <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300 mb-1">Quick Summary</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {categoryAISummaries[category as Category]}
                {toolCount && ` Currently featuring ${toolCount} tools.`}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
