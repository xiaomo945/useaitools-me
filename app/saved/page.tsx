'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import toolsData from '@/data/tools.json';
import { Home, Download, Check, Copy, Link2 } from 'lucide-react';
import Footer from '@/app/components/Footer';
import Breadcrumbs from '@/app/components/Breadcrumbs';
import UserToolList from '@/app/components/UserToolList';
import type { Tool } from '@/types';

const tools = toolsData as Tool[];

// Load saved ids from localStorage on initialization
const getSavedIds = (): number[] => {
  try {
    const saved = localStorage.getItem('savedTools');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

// Generate CSV content from saved tools
const generateCSV = (savedTools: Tool[]): string => {
  const headers = ['Name', 'Description', 'Category', 'Pricing', 'URL', 'Affiliate Link'];
  const rows = savedTools.map((tool) => [
    `"${tool.name}"`,
    `"${tool.description}"`,
    `"${tool.category}"`,
    `"${tool.pricing}"`,
    `"${tool.url}"`,
    `"${tool.affiliate_link || ''}"`
  ]);
  
  return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
};

// Download CSV file
const downloadCSV = (savedTools: Tool[]) => {
  const csvContent = generateCSV(savedTools);
  const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `saved-tools-${Date.now()}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export default function SavedPage() {
  const [savedIds, setSavedIds] = useState<number[]>(getSavedIds());
  const [exporting, setExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [copySuccess, setCopySuccess] = useState<'text' | 'links' | null>(null);
  
  // Get saved tools
  const savedTools = tools.filter((tool) => savedIds.includes(tool.id));
  
  // Handle export
  const handleExport = () => {
    setExporting(true);
    setTimeout(() => {
      downloadCSV(savedTools);
      setExporting(false);
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 2000);
    }, 300);
  };

  const handleCopyAsText = async () => {
    try {
      const text = savedTools.map(t => t.name).join('\n');
      await navigator.clipboard.writeText(text);
      setCopySuccess('text');
      setShowExportMenu(false);
      setTimeout(() => setCopySuccess(null), 2000);
    } catch { /* ignore */ }
  };

  const handleCopyAsLinks = async () => {
    try {
      const links = savedTools.map(t => `${t.name}: https://useaitools.me/tools/${t.id}`).join('\n');
      await navigator.clipboard.writeText(links);
      setCopySuccess('links');
      setShowExportMenu(false);
      setTimeout(() => setCopySuccess(null), 2000);
    } catch { /* ignore */ }
  };
  
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
        {/* Breadcrumbs */}
        <Breadcrumbs 
          items={[
            { label: 'Home', href: '/' },
            { label: 'Saved Tools', href: '/saved', current: true }
          ]} 
        />

        {/* Page Header */}
        <div className="mb-10">
          <div className="bg-gradient-to-br from-rose-50/80 via-white to-pink-50/80 dark:from-rose-950/60 dark:via-gray-900 dark:to-pink-950/60 backdrop-blur-xl border border-white/60 dark:border-rose-500/10 shadow-xl shadow-rose-500/5 dark:shadow-2xl dark:shadow-rose-500/5 rounded-2xl p-8 sm:p-12">
            <div className="text-center">
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-4">
                ❤️ Saved Tools
              </h1>
              <p className="text-base sm:text-lg text-gray-500 dark:text-gray-400 mb-6">
                Your favorite AI tools all in one place.
              </p>
              {savedTools.length > 0 && (
                <div className="relative inline-block">
                  {copySuccess && (
                    <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-emerald-600 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg animate-pulse whitespace-nowrap z-10">
                      {copySuccess === 'text' ? '📋 Names copied!' : '🔗 Links copied!'}
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleExport}
                      disabled={exporting}
                      className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 ease-out ${
                        exportSuccess
                          ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                          : 'bg-gradient-to-r from-slate-700 to-slate-800 text-white hover:from-slate-600 hover:to-slate-700 shadow-lg shadow-slate-700/30 hover:shadow-slate-600/40 hover:-translate-y-0.5'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {exportSuccess ? (
                        <>
                          <Check className="w-4 h-4" />
                          Exported!
                        </>
                      ) : exporting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Exporting...
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4" />
                          CSV
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => setShowExportMenu(!showExportMenu)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 border-2 border-emerald-600 text-emerald-600 dark:text-emerald-400 dark:border-emerald-500 rounded-xl font-semibold hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-all duration-300 ease-out hover:-translate-y-0.5"
                    >
                      <Copy className="w-4 h-4" />
                      Copy
                      <svg className={`w-3 h-3 transition-transform duration-200 ${showExportMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                  {showExportMenu && (
                    <div className="absolute top-full left-0 mt-2 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-700 rounded-xl shadow-xl z-20 overflow-hidden min-w-[200px]">
                      <button
                        onClick={handleCopyAsText}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
                      >
                        <Copy className="w-4 h-4 text-emerald-500" />
                        <div className="text-left">
                          <div className="font-medium">Copy as Text</div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">Tool names, one per line</div>
                        </div>
                      </button>
                      <button
                        onClick={handleCopyAsLinks}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors border-t border-slate-100 dark:border-gray-800"
                      >
                        <Link2 className="w-4 h-4 text-emerald-500" />
                        <div className="text-left">
                          <div className="font-medium">Copy as Links</div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">Names + URLs, one per line</div>
                        </div>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* User Recommendation Lists */}
        {savedTools.length > 0 && (
          <UserToolList savedTools={savedTools} />
        )}

        {/* Saved Tools Grid or Empty State */}
        {savedTools.length === 0 ? (
          <div className="text-center py-20">
            <div className="mx-auto w-24 h-24 mb-8 flex items-center justify-center">
              <div className="relative">
                <svg className="w-20 h-20 text-slate-200 dark:text-slate-700" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
                <div className="absolute -top-1 -right-1 w-8 h-8 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
              Your favorites list is empty
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-base max-w-md mx-auto mb-8 leading-relaxed">
              Start exploring tools and click the heart icon to save them here.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 hover:-translate-y-0.5 transition-all duration-300"
            >
              Browse Popular Tools
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 lg:gap-7">
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
                      <div className="flex items-start gap-3">
                        <div className={`w-11 h-11 rounded-xl ${colors.bg}/10 dark:${colors.bgDark} ${colors.textLight} dark:${colors.text} flex items-center justify-center text-xl font-bold group-hover:scale-105 transition-transform duration-300 ease-out font-serif`}>
                          {tool.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-xl text-slate-900 dark:text-white">
                            {tool.name}
                          </h3>
                          <div className="flex items-center gap-1.5 mt-1">
                            {tool.needs_vpn ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                                🪜 VPN
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                                ✅ Direct
                              </span>
                            )}
                          </div>
                        </div>
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
                          target="_blank" rel="noopener noreferrer"
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
