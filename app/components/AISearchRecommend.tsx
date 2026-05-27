'use client';

import { useState } from 'react';
import { Sparkles, X, ArrowUpRight } from 'lucide-react';

type Tool = {
  id: number;
  name: string;
  description: string;
  description_en: string;
  category: string;
  pricing: string;
  url: string;
  affiliate_link: string;
  icon_url: string;
  needs_vpn: boolean;
  languages: string[];
  rating: number;
  rating_count: number;
  rating_breakdown: Record<string, { score: number; max: number }>;
  last_updated: string;
  skill_level: string;
  best_for: string[];
};

type RecommendedTool = {
  tool: Tool;
  score: number;
  reasons: string[];
};

export default function AISearchRecommend() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<RecommendedTool[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Load tools from JSON (we use fetch to avoid import issues in client components)
  const loadTools = async (): Promise<Tool[]> => {
    const response = await fetch('/api/tools');
    if (response.ok) {
      return response.json();
    }
    // Fallback: load from tools.json directly
    const fallback = await fetch('/data/tools.json');
    if (fallback.ok) return fallback.json();
    return [];
  };

  const analyzeQuery = (query: string): { categories: string[]; priceRange: string; keywords: string[]; language: string } => {
    const lowerQuery = query.toLowerCase();
    const categories: string[] = [];
    const keywords: string[] = [];
    let priceRange = '';
    let language = '';

    // Category matching
    if (/writing|copy|blog|article|text|content|email|letter/i.test(lowerQuery)) categories.push('Writing');
    if (/image|picture|photo|illustration|art|design|logo|banner/i.test(lowerQuery)) categories.push('Image');
    if (/video|movie|clip|animation|reel|short/i.test(lowerQuery)) categories.push('Video');
    if (/audio|voice|music|podcast|speech|sound/i.test(lowerQuery)) categories.push('Audio');
    if (/code|dev|program|api|debug|test|review/i.test(lowerQuery)) categories.push('Code');
    if (/producti|workflow|automat|manage|organize|schedul|note/i.test(lowerQuery)) categories.push('Productivity');

    // Price matching
    if (/free|0\$|\$0|no cost/i.test(lowerQuery)) priceRange = 'Free';
    if (/(under|below|less than)\s*\$?(\d+)/i.test(lowerQuery)) {
      const match = lowerQuery.match(/(under|below|less than)\s*\$?(\d+)/i);
      priceRange = `under $${match?.[2]}`;
    }
    if (/cheap|budget|low.?cost|afford/i.test(lowerQuery)) priceRange = 'budget';

    // Language matching
    if (/chinese|中文/i.test(lowerQuery)) language = 'Chinese';
    if (/japanese|日本語/i.test(lowerQuery)) language = 'Japanese';
    if (/spanish|español/i.test(lowerQuery)) language = 'Spanish';
    if (/french|français/i.test(lowerQuery)) language = 'French';

    // Keyword extraction
    const commonWords = ['i', 'need', 'a', 'an', 'the', 'for', 'that', 'can', 'with', 'to', 'is', 'it', 'of', 'in', 'and', 'or', 'my', 'me', 'use', 'using', 'monthly', 'per', 'support', 'supports', 'best', 'tool', 'tools', 'tool,', 'which', 'what', 'help', 'tooling'];
    const words = lowerQuery.replace(/[^\w\s$]/g, '').split(/\s+/).filter(w => w.length > 2 && !commonWords.includes(w));
    keywords.push(...words);

    return { categories, priceRange, keywords, language };
  };

  const scoreTool = (tool: Tool, analysis: ReturnType<typeof analyzeQuery>): RecommendedTool | null => {
    let score = 0;
    const reasons: string[] = [];

    // Category match (highest weight)
    if (analysis.categories.length > 0) {
      if (analysis.categories.includes(tool.category)) {
        score += 50;
        reasons.push(`Matches ${tool.category} category`);
      }
    }

    // Language match
    if (analysis.language) {
      const hasLanguage = tool.languages.some(l => l.toLowerCase().includes(analysis.language.toLowerCase()));
      if (hasLanguage) {
        score += 20;
        reasons.push(`Supports ${analysis.language}`);
      }
    }

    // Price match
    if (analysis.priceRange) {
      if (analysis.priceRange === 'Free' && tool.pricing === 'Free') {
        score += 30;
        reasons.push('Free tool');
      } else if (analysis.priceRange === 'Free' && tool.pricing === 'Freemium') {
        score += 20;
        reasons.push('Has free tier');
      } else if (analysis.priceRange === 'budget' && ['Free', 'Freemium', 'Open Source'].includes(tool.pricing)) {
        score += 20;
        reasons.push(`${tool.pricing} - budget-friendly`);
      }
    }

    // Keyword matching in description and best_for
    const searchableText = `${tool.description} ${tool.description_en} ${tool.best_for.join(' ')}`.toLowerCase();
    const matchedKeywords = analysis.keywords.filter(kw => searchableText.includes(kw));
    if (matchedKeywords.length > 0) {
      score += matchedKeywords.length * 8;
      reasons.push(`Relevant for: ${matchedKeywords.slice(0, 2).join(', ')}`);
    }

    // Bonus for high rating
    if (tool.rating >= 4.5) score += 10;
    else if (tool.rating >= 4.0) score += 5;

    if (score < 15) return null;

    return { tool, score, reasons };
  };

  const handleSearch = async () => {
    if (!query.trim()) return;

    setIsSearching(true);
    setIsOpen(true);

    try {
      const tools = await loadTools();
      const analysis = analyzeQuery(query);

      const scored = tools
        .map(tool => scoreTool(tool, analysis))
        .filter((r): r is RecommendedTool => r !== null)
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);

      setResults(scored);
    } catch {
      // Silently handle errors
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
    if (e.key === 'Escape') {
      setIsOpen(false);
      setQuery('');
      setResults([]);
    }
  };

  return (
    <div className="relative">
      {/* AI Recommend Button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          if (isOpen) {
            setQuery('');
            setResults([]);
          }
        }}
        className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-xl shadow-lg shadow-emerald-500/20 hover:shadow-xl hover:shadow-emerald-500/30 hover:-translate-y-0.5 transition-all duration-300"
        aria-label="AI tool recommendation"
      >
        <Sparkles className="w-4 h-4" />
        <span className="hidden sm:inline">AI Recommend</span>
      </button>

      {/* Modal/Panel */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4">
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => { setIsOpen(false); setQuery(''); setResults([]); }} />
          
          {/* Panel */}
          <div className="relative w-full max-w-2xl bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-2xl shadow-2xl p-6 sm:p-8">
            {/* Close Button */}
            <button
              onClick={() => { setIsOpen(false); setQuery(''); setResults([]); }}
              className="absolute top-4 right-4 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors"
            >
              <X className="w-5 h-5 text-slate-500" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/25">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">AI Tool Recommender</h3>
                <p className="text-sm text-slate-500 dark:text-gray-400">Describe what you need in natural language</p>
              </div>
            </div>

            {/* Search Input */}
            <div className="mb-6">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="e.g., I need a writing tool under $20/month that supports Chinese"
                className="w-full px-4 py-3 bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              />
              <button
                onClick={handleSearch}
                disabled={isSearching || !query.trim()}
                className="mt-3 w-full px-4 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 dark:disabled:bg-gray-700 text-white font-medium rounded-xl shadow-lg shadow-emerald-500/20 transition-all duration-300 flex items-center justify-center gap-2"
              >
                {isSearching ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Find Best Tools
                  </>
                )}
              </button>
            </div>

            {/* Results */}
            {results.length > 0 && (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {results.map((result, index) => (
                  <a
                    key={result.tool.id}
                    href={`/tools/${result.tool.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block bg-gradient-to-br from-slate-50 to-emerald-50/20 dark:from-gray-800 dark:to-emerald-500/10 border border-slate-200 dark:border-gray-700 rounded-xl p-4 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold text-sm">#{index + 1}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <h4 className="font-semibold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                            {result.tool.name}
                          </h4>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-slate-500 dark:text-gray-400 bg-slate-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">
                              {result.tool.pricing}
                            </span>
                            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                              {result.tool.category}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-gray-300 line-clamp-2 mb-2">
                          {result.tool.description}
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {result.reasons.slice(0, 3).map((reason, i) => (
                            <span key={i} className="text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/20 px-2 py-0.5 rounded-full">
                              ✓ {reason}
                            </span>
                          ))}
                        </div>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-500 group-hover:-translate-y-0.5 transition-all flex-shrink-0 mt-1" />
                    </div>
                  </a>
                ))}
              </div>
            )}

            {/* No Results */}
            {results.length === 0 && query && !isSearching && (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🔍</span>
                </div>
                <p className="text-slate-600 dark:text-gray-300 mb-2">No matching tools found</p>
                <p className="text-sm text-slate-500 dark:text-gray-400">Try describing your needs more specifically</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
