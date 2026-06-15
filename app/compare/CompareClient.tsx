'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import type { Tool } from '@/types';
import { Plus, X, Star, ArrowRight, Check } from 'lucide-react';
import toolsData from '@/data/tools.json';

const tools = toolsData as Tool[];

const categoryColorMap: Record<string, { bg: string; text: string }> = {
  Writing: { bg: 'bg-blue-500/10', text: 'text-blue-600 dark:text-blue-400' },
  Image: { bg: 'bg-violet-500/10', text: 'text-violet-600 dark:text-violet-400' },
  Productivity: { bg: 'bg-teal-500/10', text: 'text-teal-600 dark:text-teal-400' },
  Code: { bg: 'bg-orange-500/10', text: 'text-orange-600 dark:text-orange-400' },
  Audio: { bg: 'bg-pink-500/10', text: 'text-pink-600 dark:text-pink-400' },
  Video: { bg: 'bg-indigo-500/10', text: 'text-indigo-600 dark:text-indigo-400' },
};

const MAX_TOOLS = 4;

export default function ComparePage() {
  const [selectedIds, setSelectedIds] = useState<number[]>([1, 2]);
  const [showPicker, setShowPicker] = useState(false);
  const [pickerSearch, setPickerSearch] = useState('');
  const [pickerCategory, setPickerCategory] = useState<string>('All');

  const selectedTools = useMemo(() => {
    return selectedIds
      .map(id => tools.find(t => t.id === id))
      .filter(Boolean) as Tool[];
  }, [selectedIds]);

  const availableTools = useMemo(() => {
    return tools.filter(t => !selectedIds.includes(t.id));
  }, [selectedIds]);

  const filteredPickerTools = useMemo(() => {
    let result = availableTools;
    if (pickerCategory !== 'All') {
      result = result.filter(t => t.category === pickerCategory);
    }
    if (pickerSearch) {
      const q = pickerSearch.toLowerCase();
      result = result.filter(t =>
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        (t.best_for || []).some(b => b.toLowerCase().includes(q))
      );
    }
    return result.slice(0, 20);
  }, [availableTools, pickerCategory, pickerSearch]);

  const categories = ['All', 'Writing', 'Image', 'Productivity', 'Code', 'Audio', 'Video'];

  const addTool = (id: number) => {
    if (selectedIds.length < MAX_TOOLS) {
      setSelectedIds([...selectedIds, id]);
      setShowPicker(false);
      setPickerSearch('');
    }
  };

  const removeTool = (id: number) => {
    if (selectedIds.length > 2) {
      setSelectedIds(selectedIds.filter(tid => tid !== id));
    }
  };

  // Get best value for each row (highlighted in green)
  const bestPrice = useMemo(() => {
    const prices = selectedTools.map(t => {
      const m = t.pricing.match(/\$(\d+)/);
      return m ? parseInt(m[1]) : Infinity;
    });
    return Math.min(...prices);
  }, [selectedTools]);

  const bestRating = useMemo(() => {
    const ratings = selectedTools.map(t => t.rating || 0);
    return Math.max(...ratings);
  }, [selectedTools]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 mb-4">
            ⚖️ Side-by-Side Comparison
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white mb-3">
            Compare AI Tools
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Select 2-4 tools to compare side-by-side. Find the perfect match for your workflow.
          </p>
        </div>

        {/* Selected Tools Row */}
        <div className="mb-8">
          <div className={`grid gap-4 ${selectedTools.length === 2 ? 'grid-cols-1 sm:grid-cols-2' : selectedTools.length === 3 ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-2 sm:grid-cols-4'}`}>
            {selectedTools.map((tool) => {
              const colors = categoryColorMap[tool.category] || categoryColorMap.Productivity;
              return (
                <div key={tool.id} className="relative bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-2xl p-4 shadow-sm">
                  {selectedTools.length > 2 && (
                    <button
                      onClick={() => removeTool(tool.id)}
                      className="absolute top-2 right-2 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-gray-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                      aria-label={`Remove ${tool.name}`}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl ${colors.bg} ${colors.text} flex items-center justify-center text-xl font-bold flex-shrink-0`}>
                      {tool.name.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-slate-900 dark:text-white truncate">{tool.name}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{tool.category}</p>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Add Tool Button */}
            {selectedTools.length < MAX_TOOLS && (
              <button
                onClick={() => setShowPicker(true)}
                className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border-2 border-dashed border-emerald-300 dark:border-emerald-700 rounded-2xl p-4 hover:border-emerald-500 dark:hover:border-emerald-500 transition-all duration-300 flex items-center justify-center min-h-[88px]"
              >
                <div className="flex flex-col items-center gap-1 text-emerald-600 dark:text-emerald-400">
                  <Plus className="w-6 h-6" />
                  <span className="text-sm font-semibold">Add Tool</span>
                </div>
              </button>
            )}
          </div>
        </div>

        {/* Comparison Table */}
        {selectedTools.length >= 2 && (
          <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 dark:bg-slate-800/50">
                  <tr>
                    <th className="sticky left-0 z-10 bg-slate-50 dark:bg-slate-800/50 px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider min-w-[120px]">
                      Feature
                    </th>
                    {selectedTools.map(tool => (
                      <th key={tool.id} className="px-4 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white min-w-[180px]">
                        {tool.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-gray-800">
                  {/* Rating */}
                  <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="sticky left-0 z-10 bg-white dark:bg-gray-900 px-4 py-4 text-sm font-medium text-slate-700 dark:text-slate-300">
                      Rating
                    </td>
                    {selectedTools.map(tool => {
                      const isBest = tool.rating === bestRating && bestRating > 0;
                      return (
                        <td key={tool.id} className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              <Star className={`w-4 h-4 ${tool.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
                              <span className={`text-sm font-semibold ${isBest ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}>
                                {tool.rating ? tool.rating.toFixed(1) : 'N/A'}
                              </span>
                            </div>
                            {isBest && <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">★ BEST</span>}
                          </div>
                          {tool.rating_count && (
                            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                              {tool.rating_count.toLocaleString()} reviews
                            </p>
                          )}
                        </td>
                      );
                    })}
                  </tr>

                  {/* Pricing */}
                  <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="sticky left-0 z-10 bg-white dark:bg-gray-900 px-4 py-4 text-sm font-medium text-slate-700 dark:text-slate-300">
                      Pricing
                    </td>
                    {selectedTools.map(tool => {
                      const m = tool.pricing.match(/\$(\d+)/);
                      const price = m ? parseInt(m[1]) : Infinity;
                      const isBest = price === bestPrice && bestPrice < Infinity;
                      return (
                        <td key={tool.id} className="px-4 py-4">
                          <span className={`text-sm font-semibold ${isBest ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}>
                            {tool.pricing}
                          </span>
                          {isBest && <span className="ml-2 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">★ LOWEST</span>}
                        </td>
                      );
                    })}
                  </tr>

                  {/* Category */}
                  <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="sticky left-0 z-10 bg-white dark:bg-gray-900 px-4 py-4 text-sm font-medium text-slate-700 dark:text-slate-300">
                      Category
                    </td>
                    {selectedTools.map(tool => {
                      const colors = categoryColorMap[tool.category] || categoryColorMap.Productivity;
                      return (
                        <td key={tool.id} className="px-4 py-4">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${colors.bg} ${colors.text}`}>
                            {tool.category}
                          </span>
                        </td>
                      );
                    })}
                  </tr>

                  {/* Best For */}
                  <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="sticky left-0 z-10 bg-white dark:bg-gray-900 px-4 py-4 text-sm font-medium text-slate-700 dark:text-slate-300 align-top">
                      Best For
                    </td>
                    {selectedTools.map(tool => (
                      <td key={tool.id} className="px-4 py-4">
                        <div className="flex flex-wrap gap-1">
                          {(tool.best_for || []).slice(0, 4).map((tag, i) => (
                            <span key={i} className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                              {tag}
                            </span>
                          ))}
                          {(!tool.best_for || tool.best_for.length === 0) && (
                            <span className="text-xs text-slate-400">—</span>
                          )}
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Description */}
                  <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="sticky left-0 z-10 bg-white dark:bg-gray-900 px-4 py-4 text-sm font-medium text-slate-700 dark:text-slate-300 align-top">
                      Description
                    </td>
                    {selectedTools.map(tool => (
                      <td key={tool.id} className="px-4 py-4">
                        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                          {tool.description}
                        </p>
                      </td>
                    ))}
                  </tr>

                  {/* Languages */}
                  <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="sticky left-0 z-10 bg-white dark:bg-gray-900 px-4 py-4 text-sm font-medium text-slate-700 dark:text-slate-300">
                      Languages
                    </td>
                    {selectedTools.map(tool => (
                      <td key={tool.id} className="px-4 py-4">
                        <span className="text-sm text-slate-700 dark:text-slate-300">
                          {tool.languages && tool.languages.length > 0 ? `${tool.languages.length}+` : '—'}
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* Skill Level */}
                  <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="sticky left-0 z-10 bg-white dark:bg-gray-900 px-4 py-4 text-sm font-medium text-slate-700 dark:text-slate-300">
                      Skill Level
                    </td>
                    {selectedTools.map(tool => (
                      <td key={tool.id} className="px-4 py-4">
                        <span className="text-sm text-slate-700 dark:text-slate-300 capitalize">
                          {tool.skill_level || '—'}
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* VPN Required */}
                  <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="sticky left-0 z-10 bg-white dark:bg-gray-900 px-4 py-4 text-sm font-medium text-slate-700 dark:text-slate-300">
                      VPN Required
                    </td>
                    {selectedTools.map(tool => (
                      <td key={tool.id} className="px-4 py-4">
                        {tool.needs_vpn ? (
                          <span className="text-amber-600 dark:text-amber-400 text-sm font-semibold">Yes</span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-sm font-semibold">
                            <Check className="w-3.5 h-3.5" />
                            No
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* CTA Row */}
                  <tr className="bg-slate-50 dark:bg-slate-800/30">
                    <td className="sticky left-0 z-10 bg-slate-50 dark:bg-slate-800/30 px-4 py-4 text-sm font-medium text-slate-700 dark:text-slate-300">
                      Action
                    </td>
                    {selectedTools.map(tool => (
                      <td key={tool.id} className="px-4 py-4">
                        <a
                          href={tool.affiliate_link || tool.url}
                          target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm font-semibold hover:shadow-lg hover:shadow-emerald-500/25 hover:-translate-y-0.5 transition-all duration-300"
                        >
                          Visit {tool.name}
                          <ArrowRight className="w-3.5 h-3.5" />
                        </a>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tool Picker Modal */}
        {showPicker && (
          <div
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
            onClick={() => setShowPicker(false)}
          >
            <div
              className="bg-white dark:bg-gray-900 rounded-2xl max-w-2xl w-full max-h-[80vh] flex flex-col shadow-2xl animate-fade-in-up"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-5 border-b border-slate-200 dark:border-gray-800 flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Add a Tool to Compare</h2>
                <button
                  onClick={() => setShowPicker(false)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-gray-800 text-slate-500"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-5 border-b border-slate-200 dark:border-gray-800 space-y-3">
                <input
                  type="text"
                  placeholder="Search tools by name, description, or use case..."
                  value={pickerSearch}
                  onChange={e => setPickerSearch(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  autoFocus
                />
                <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-1 px-1">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setPickerCategory(cat)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                        pickerCategory === cat
                          ? 'bg-emerald-500 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-3">
                {filteredPickerTools.length === 0 ? (
                  <p className="text-center text-slate-500 dark:text-slate-400 py-8">
                    No tools found. Try a different search or category.
                  </p>
                ) : (
                  <div className="space-y-1.5">
                    {filteredPickerTools.map(tool => {
                      const colors = categoryColorMap[tool.category] || categoryColorMap.Productivity;
                      return (
                        <button
                          key={tool.id}
                          onClick={() => addTool(tool.id)}
                          className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left"
                        >
                          <div className={`w-10 h-10 rounded-xl ${colors.bg} ${colors.text} flex items-center justify-center text-base font-bold flex-shrink-0`}>
                            {tool.name.charAt(0)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="font-semibold text-sm text-slate-900 dark:text-white truncate">
                              {tool.name}
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                              {tool.pricing} · {tool.category}
                            </p>
                          </div>
                          <Plus className="w-4 h-4 text-slate-400 flex-shrink-0" />
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* SEO-friendly links to category comparisons */}
        <section className="mt-12 pt-8 border-t border-slate-200 dark:border-gray-800">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
            Browse Curated Comparisons
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { label: 'AI Writing Tools', href: '/compare/writing' },
              { label: 'AI Video Tools', href: '/compare/video' },
              { label: 'AI Audio Tools', href: '/compare/audio' },
            ].map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="group p-4 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-xl hover:border-emerald-300 dark:hover:border-emerald-600 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {link.label}
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
