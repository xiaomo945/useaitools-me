'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import tools from '@/data/tools.json';
import { Home } from 'lucide-react';
import Footer from '@/app/components/Footer';

type Tool = (typeof tools)[0];

export default function SavedPage() {
  const [savedIds, setSavedIds] = useState<number[]>([]);
  
  // Load saved ids from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('savedTools');
    if (saved) {
      setSavedIds(JSON.parse(saved));
    }
  }, []);
  
  // Get saved tools
  const savedTools = tools.filter((tool) => savedIds.includes(tool.id));
  
  // Helper to get colors
  const getCategoryColors = (category: Tool['category']) => {
    switch (category) {
      case 'Writing':
        return {
          bg: 'bg-blue-500',
          bgDark: 'bg-blue-500/20',
          text: 'text-blue-300',
          textLight: 'text-blue-600',
          border: 'border-blue-300',
          ring: 'hover:shadow-blue-500/20',
        };
      case 'Image':
        return {
          bg: 'bg-violet-500',
          bgDark: 'bg-violet-500/20',
          text: 'text-violet-300',
          textLight: 'text-violet-600',
          border: 'border-violet-300',
          ring: 'hover:shadow-violet-500/20',
        };
      case 'Productivity':
        return {
          bg: 'bg-teal-500',
          bgDark: 'bg-teal-500/20',
          text: 'text-teal-300',
          textLight: 'text-teal-600',
          border: 'border-teal-300',
          ring: 'hover:shadow-teal-500/20',
        };
      case 'Code':
        return {
          bg: 'bg-orange-500',
          bgDark: 'bg-orange-500/20',
          text: 'text-orange-300',
          textLight: 'text-orange-600',
          border: 'border-orange-300',
          ring: 'hover:shadow-orange-500/20',
        };
      case 'Audio':
        return {
          bg: 'bg-pink-500',
          bgDark: 'bg-pink-500/20',
          text: 'text-pink-300',
          textLight: 'text-pink-600',
          border: 'border-pink-300',
          ring: 'hover:shadow-pink-500/20',
        };
      case 'Video':
        return {
          bg: 'bg-indigo-500',
          bgDark: 'bg-indigo-500/20',
          text: 'text-indigo-300',
          textLight: 'text-indigo-600',
          border: 'border-indigo-300',
          ring: 'hover:shadow-indigo-500/20',
        };
      default:
        return {
          bg: 'bg-slate-500',
          bgDark: 'bg-slate-500/20',
          text: 'text-slate-300',
          textLight: 'text-slate-600',
          border: 'border-slate-300',
          ring: 'hover:shadow-slate-500/20',
        };
    }
  };

  const getPricingColors = (pricing: string) => {
    switch (pricing) {
      case 'Freemium':
        return {
          bg: 'bg-emerald-100 dark:bg-emerald-500/20',
          text: 'text-emerald-700 dark:text-emerald-300',
        };
      case 'Free Trial':
        return {
          bg: 'bg-blue-100 dark:bg-blue-500/20',
          text: 'text-blue-700 dark:text-blue-300',
        };
      case 'Paid':
        return {
          bg: 'bg-slate-100 dark:bg-slate-800',
          text: 'text-slate-700 dark:text-slate-300',
        };
      case 'Open Source':
        return {
          bg: 'bg-purple-100 dark:bg-purple-500/20',
          text: 'text-purple-700 dark:text-purple-300',
        };
      default:
        return {
          bg: 'bg-slate-100 dark:bg-slate-800',
          text: 'text-slate-700 dark:text-slate-300',
        };
    }
  };

  const toggleSave = (id: number) => {
    const newSavedIds = savedIds.includes(id)
      ? savedIds.filter((savedId) => savedId !== id)
      : [...savedIds, id];
    setSavedIds(newSavedIds);
    localStorage.setItem('savedTools', JSON.stringify(newSavedIds));
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 py-12 sm:py-16 grid-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
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

        {/* Page Header */}
        <div className="mb-10">
          <div className="bg-gradient-to-br from-rose-50/80 via-white to-pink-50/80 dark:from-rose-950/60 dark:via-gray-900 dark:to-pink-950/60 backdrop-blur-xl border border-white/60 dark:border-rose-500/10 shadow-xl shadow-rose-500/5 dark:shadow-2xl dark:shadow-rose-500/5 rounded-3xl p-8 sm:p-12">
            <div className="text-center">
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-4">
                ❤️ Saved Tools
              </h1>
              <p className="text-base sm:text-lg text-gray-500 dark:text-gray-400">
                Your favorite AI tools all in one place.
              </p>
            </div>
          </div>
        </div>

        {/* Saved Tools Grid or Empty State */}
        {savedTools.length === 0 ? (
          <div className="text-center py-20">
            <div className="mx-auto w-24 h-24 mb-6 text-slate-300 dark:text-slate-600">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            <p className="text-slate-600 dark:text-gray-400 text-lg font-medium mb-6">
              No saved tools yet. Start exploring and save your favorites!
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 hover:-translate-y-0.5 transition-all duration-300"
            >
              Explore Tools →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {savedTools.map((tool, index) => {
              const colors = getCategoryColors(tool.category);
              const pricingColors = getPricingColors(tool.pricing);
              const isSaved = true;

              return (
                <div
                  key={tool.id}
                  className={`bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 shadow-sm dark:shadow-xl rounded-2xl overflow-hidden group hover:-translate-y-1.5 transition-all duration-300 ease-out animate-fade-in-up ${colors.ring}`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Category Color Bar - 3px Height */}
                  <div className={`h-0.75 w-full ${colors.bg}`} style={{ height: '3px' }} />
                  
                  <div className="p-7">
                    {/* Tool Header */}
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-11 h-11 rounded-xl ${colors.bg}/10 dark:${colors.bgDark} ${colors.textLight} dark:${colors.text} flex items-center justify-center text-xl font-bold group-hover:scale-105 transition-transform duration-300 ease-out`} style={{ fontFamily: 'Playfair Display, serif' }}>
                          {tool.name.charAt(0)}
                        </div>
                        <h3 className="font-semibold text-xl text-slate-900 dark:text-white">
                          {tool.name}
                        </h3>
                      </div>
                      <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${pricingColors.bg} ${pricingColors.text}`}>
                        {tool.pricing}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-slate-600 dark:text-gray-300 leading-relaxed mb-6">
                      {tool.description}
                    </p>

                    {/* Footer */}
                    <div className="flex items-center justify-between gap-3">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${colors.bg} text-white dark:${colors.bgDark} dark:${colors.text}`}>
                        {tool.category}
                      </span>
                      
                      <div className="flex items-center gap-2">
                        <a
                          href={tool.affiliate_link || tool.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`inline-flex items-center gap-2 px-4 py-2 border ${colors.border} dark:${colors.bgDark} dark:border-transparent ${colors.textLight} dark:${colors.text} text-sm font-semibold rounded-lg transition-all duration-300 ease-out hover:-translate-y-0.5 hover:${colors.bg} hover:text-white hover:border-transparent focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:outline-none`}
                        >
                          Visit Website
                        </a>
                        <button
                          onClick={() => toggleSave(tool.id)}
                          className={`inline-flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ease-out ${
                            isSaved
                              ? 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300 hover:bg-rose-200 dark:hover:bg-rose-500/30'
                              : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                          }`}
                        >
                          ❤️ {isSaved ? 'Saved' : 'Save'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
