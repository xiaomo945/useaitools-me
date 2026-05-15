'use client';

import React from 'react';
import Link from 'next/link';

type Category = 'Writing' | 'Image' | 'Productivity' | 'Code' | 'Audio' | 'Video';

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
}> = {
  Writing:    { 
    bg: 'bg-blue-500',    bgDark: 'bg-blue-500/20',    text: 'text-blue-300',    textLight: 'text-blue-600',    border: 'border-blue-300',    ring: 'hover:shadow-blue-500/20',
    badgeBg: 'bg-blue-100/80 dark:bg-blue-500/20',
    badgeText: 'text-blue-700 dark:text-blue-300',
    badgeBorder: 'border-blue-200 dark:border-blue-500/30',
    badgeShadow: 'shadow-[0_0_12px_rgba(59,130,246,0.15)]',
    colorValue: '#3b82f6'
  },
  Image:      { 
    bg: 'bg-violet-500', bgDark: 'bg-violet-500/20', text: 'text-violet-300', textLight: 'text-violet-600', border: 'border-violet-300', ring: 'hover:shadow-violet-500/20',
    badgeBg: 'bg-violet-100/80 dark:bg-violet-500/20',
    badgeText: 'text-violet-700 dark:text-violet-300',
    badgeBorder: 'border-violet-200 dark:border-violet-500/30',
    badgeShadow: 'shadow-[0_0_12px_rgba(139,92,246,0.15)]',
    colorValue: '#8b5cf6'
  },
  Productivity: { 
    bg: 'bg-teal-500',  bgDark: 'bg-teal-500/20',  text: 'text-teal-300',  textLight: 'text-teal-600',  border: 'border-teal-300',  ring: 'hover:shadow-teal-500/20',
    badgeBg: 'bg-teal-100/80 dark:bg-teal-500/20',
    badgeText: 'text-teal-700 dark:text-teal-300',
    badgeBorder: 'border-teal-200 dark:border-teal-500/30',
    badgeShadow: 'shadow-[0_0_12px_rgba(20,184,166,0.15)]',
    colorValue: '#14b8a6'
  },
  Code:       { 
    bg: 'bg-orange-500', bgDark: 'bg-orange-500/20', text: 'text-orange-300', textLight: 'text-orange-600', border: 'border-orange-300', ring: 'hover:shadow-orange-500/20',
    badgeBg: 'bg-orange-100/80 dark:bg-orange-500/20',
    badgeText: 'text-orange-700 dark:text-orange-300',
    badgeBorder: 'border-orange-200 dark:border-orange-500/30',
    badgeShadow: 'shadow-[0_0_12px_rgba(249,115,22,0.15)]',
    colorValue: '#f97316'
  },
  Audio:      { 
    bg: 'bg-pink-500',   bgDark: 'bg-pink-500/20',   text: 'text-pink-300',   textLight: 'text-pink-600',   border: 'border-pink-300',   ring: 'hover:shadow-pink-500/20',
    badgeBg: 'bg-pink-100/80 dark:bg-pink-500/20',
    badgeText: 'text-pink-700 dark:text-pink-300',
    badgeBorder: 'border-pink-200 dark:border-pink-500/30',
    badgeShadow: 'shadow-[0_0_12px_rgba(236,72,153,0.15)]',
    colorValue: '#ec4899'
  },
  Video:      { 
    bg: 'bg-indigo-500', bgDark: 'bg-indigo-500/20', text: 'text-indigo-300', textLight: 'text-indigo-600', border: 'border-indigo-300', ring: 'hover:shadow-indigo-500/20',
    badgeBg: 'bg-indigo-100/80 dark:bg-indigo-500/20',
    badgeText: 'text-indigo-700 dark:text-indigo-300',
    badgeBorder: 'border-indigo-200 dark:border-indigo-500/30',
    badgeShadow: 'shadow-[0_0_12px_rgba(99,102,241,0.15)]',
    colorValue: '#6366f1'
  }
};

interface CategoryHeroProps {
  category: Category;
  categoryName: string;
  description: string;
}

export default function CategoryHero({ category, categoryName, description }: CategoryHeroProps) {
  const colors = colorMap[category];

  return (
    <div className="mb-10">
      <div className="relative bg-gradient-to-br from-emerald-50/80 via-white to-teal-50/60 dark:from-emerald-950/70 via-gray-950 to-teal-950/50 backdrop-blur-xl border border-emerald-200/50 dark:border-emerald-500/10 shadow-[0_8px_32px_rgba(16,185,129,0.08)] rounded-3xl p-8 sm:p-12 overflow-hidden">
        {/* Grid Background */}
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(to right, rgba(16, 185, 129, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(16, 185, 129, 0.05) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
          pointerEvents: 'none'
        }} />
        
        <div className="relative z-10 text-center">
          {/* Category Badge */}
          <span 
            className={`inline-block px-5 py-2 rounded-full text-sm font-semibold ${colors.badgeBg} ${colors.badgeText} ${colors.badgeBorder} ${colors.badgeShadow} border mb-6 transition-all duration-300 hover:scale-105 animate-fade-in-up`}
            style={{ animationDelay: '0ms' }}
          >
            {categoryName}
          </span>
          
          {/* Title */}
          <h1 
            className="text-5xl sm:text-6xl font-extrabold text-gray-900 dark:text-white mb-6 animate-fade-in-up"
            style={{ 
              fontFamily: 'Playfair Display, serif',
              textShadow: `0 2px 20px rgba(0,0,0,0.05)`,
              animationDelay: '100ms'
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
          <div className="relative max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '200ms' }}>
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
        </div>
      </div>
    </div>
  );
}
