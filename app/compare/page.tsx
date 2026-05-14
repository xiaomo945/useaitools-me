'use client';

import { useState } from 'react';
import Link from 'next/link';
import tools from '@/data/tools.json';
import { Home } from 'lucide-react';
import Footer from '@/app/components/Footer';

type Tool = (typeof tools)[0];

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

export default function ComparePage() {
  const [tool1Id, setTool1Id] = useState<string>('');
  const [tool2Id, setTool2Id] = useState<string>('');

  const tool1 = tools.find(t => t.id === Number(tool1Id));
  const tool2 = tools.find(t => t.id === Number(tool2Id));

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
          <div className="bg-gradient-to-br from-emerald-50/80 via-white to-teal-50/80 dark:from-emerald-950/60 dark:via-gray-900 dark:to-teal-950/60 backdrop-blur-xl border border-white/60 dark:border-emerald-500/10 shadow-xl shadow-emerald-500/5 dark:shadow-2xl dark:shadow-emerald-500/5 rounded-3xl p-8 sm:p-12">
            <div className="text-center">
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-2">
                Compare AI Tools
              </h1>
              <p className="text-base sm:text-lg text-gray-500 dark:text-gray-400 mt-3 max-w-2xl mx-auto">
                Select two AI tools to compare them side by side.
              </p>
            </div>
          </div>
        </div>

        {/* Tool Selectors */}
        <div className="mb-10 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-3xl p-8 sm:p-12 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                Tool 1
              </label>
              <select
                value={tool1Id}
                onChange={(e) => setTool1Id(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all duration-300 ease-out"
              >
                <option value="">Select a tool...</option>
                {tools.map(tool => (
                  <option key={tool.id} value={tool.id}>
                    {tool.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                Tool 2
              </label>
              <select
                value={tool2Id}
                onChange={(e) => setTool2Id(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all duration-300 ease-out"
              >
                <option value="">Select a tool...</option>
                {tools.map(tool => (
                  <option key={tool.id} value={tool.id}>
                    {tool.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Comparison Table */}
        {(tool1 || tool2) && (
          <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-3xl overflow-hidden shadow-xl">
            <table className="w-full">
              <thead className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white w-1/5">
                    Feature
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-slate-900 dark:text-white w-2/5">
                    {tool1 ? tool1.name : 'Tool 1'}
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-slate-900 dark:text-white w-2/5">
                    {tool2 ? tool2.name : 'Tool 2'}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-gray-800">
                <tr>
                  <td className="px-6 py-4 text-sm font-medium text-slate-700 dark:text-gray-300">
                    Category
                  </td>
                  <td className="px-6 py-4 text-center">
                    {tool1 ? (
                      <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${getCategoryColors(tool1.category).bg} text-white`}>
                        {tool1.category}
                      </span>
                    ) : (
                      <span className="text-slate-400 dark:text-slate-600 text-sm">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {tool2 ? (
                      <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${getCategoryColors(tool2.category).bg} text-white`}>
                        {tool2.category}
                      </span>
                    ) : (
                      <span className="text-slate-400 dark:text-slate-600 text-sm">-</span>
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm font-medium text-slate-700 dark:text-gray-300">
                    Description
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-gray-400">
                    {tool1 ? tool1.description : '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-gray-400">
                    {tool2 ? tool2.description : '-'}
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm font-medium text-slate-700 dark:text-gray-300">
                    Pricing
                  </td>
                  <td className="px-6 py-4 text-center">
                    {tool1 ? (
                      <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${getPricingColors(tool1.pricing).bg} ${getPricingColors(tool1.pricing).text}`}>
                        {tool1.pricing}
                      </span>
                    ) : (
                      <span className="text-slate-400 dark:text-slate-600 text-sm">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {tool2 ? (
                      <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${getPricingColors(tool2.pricing).bg} ${getPricingColors(tool2.pricing).text}`}>
                        {tool2.pricing}
                      </span>
                    ) : (
                      <span className="text-slate-400 dark:text-slate-600 text-sm">-</span>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Visit Website Buttons */}
            <div className="bg-slate-50 dark:bg-gray-900/50 border-t border-slate-200 dark:border-gray-800 p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex justify-center">
                  {tool1 ? (
                    <a
                      href={tool1.affiliate_link || tool1.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 hover:-translate-y-0.5 transition-all duration-300"
                    >
                      Visit {tool1.name}
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 7H8.5M17 7v8.5" />
                      </svg>
                    </a>
                  ) : (
                    <span className="text-slate-400 dark:text-slate-600 text-sm">Select Tool 1 first</span>
                  )}
                </div>
                <div className="flex justify-center">
                  {tool2 ? (
                    <a
                      href={tool2.affiliate_link || tool2.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 hover:-translate-y-0.5 transition-all duration-300"
                    >
                      Visit {tool2.name}
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 7H8.5M17 7v8.5" />
                      </svg>
                    </a>
                  ) : (
                    <span className="text-slate-400 dark:text-slate-600 text-sm">Select Tool 2 first</span>
                  )}
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
