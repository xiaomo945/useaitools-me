'use client';

import React, { useState } from 'react';
import Link from 'next/link';

// --- Types ---
interface Scenario {
  id: string;
  name: string;
  icon: string;
}

interface MatrixTool {
  id: number;
  name: string;
  rating: number;
  pricing: string;
  affiliateLink: string;
  url: string;
}

interface Recommendation {
  level: 'best_fit' | 'viable' | 'not_recommended';
  reason: string;
}

export interface DecisionMatrixData {
  category: string;
  scenarios: Scenario[];
  tools: MatrixTool[];
  matrix: Record<string, Record<string, Recommendation>>;
}

interface DecisionMatrixProps {
  data: DecisionMatrixData;
  compact?: boolean;
}

// --- Sub-components ---
function RecommendationCell({ recommendation }: { recommendation: Recommendation }) {
  const config = {
    best_fit: {
      icon: '✅',
      label: 'Best Fit',
      cellClass: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
      badgeClass: 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300',
    },
    viable: {
      icon: '☑️',
      label: 'Viable',
      cellClass: 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300',
      badgeClass: 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300',
    },
    not_recommended: {
      icon: '➖',
      label: 'Not Ideal',
      cellClass: 'bg-slate-50 dark:bg-slate-800/50 text-slate-400 dark:text-slate-500',
      badgeClass: 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500',
    },
  };

  const c = config[recommendation.level];

  return (
    <td className={`px-3 py-3 text-center transition-colors duration-200 ${c.cellClass}`}>
      <div className="group relative inline-flex flex-col items-center gap-1">
        <span className="text-lg leading-none">{c.icon}</span>
        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${c.badgeClass}`}>
          {c.label}
        </span>
        {/* Tooltip */}
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-slate-900 dark:bg-slate-700 text-white text-xs rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
          {recommendation.reason}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-2 h-2 bg-slate-900 dark:bg-slate-700 rotate-45" />
        </div>
      </div>
    </td>
  );
}

function ToolHeader({ tool, compact }: { tool: MatrixTool; compact?: boolean }) {
  return (
    <th className="px-3 py-4 text-center min-w-[140px]">
      <div className="flex flex-col items-center gap-2">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center text-xl font-bold text-emerald-600 dark:text-emerald-400" style={{ fontFamily: 'Playfair Display, serif' }}>
          {tool.name.charAt(0)}
        </div>
        <span className="font-semibold text-sm text-slate-900 dark:text-white truncate max-w-[120px]">
          {tool.name}
        </span>
        <div className="flex items-center gap-1">
          <svg className="w-3.5 h-3.5 text-amber-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
          <span className="text-xs text-slate-600 dark:text-gray-400">{tool.rating.toFixed(1)}</span>
        </div>
        {!compact && (
          <a
            href={tool.affiliateLink || tool.url}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="mt-1 inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-sm hover:shadow-md hover:shadow-emerald-500/25 hover:-translate-y-0.5 transition-all duration-300"
          >
            Visit
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H8.5M17 7v8.5" />
            </svg>
          </a>
        )}
      </div>
    </th>
  );
}

// --- Main Component ---
export default function DecisionMatrix({ data, compact = false }: DecisionMatrixProps) {
  if (!data || !data.tools || data.tools.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500 dark:text-gray-400">
        No data available for this category.
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="overflow-x-auto rounded-2xl border border-slate-200/60 dark:border-gray-800 shadow-sm">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30">
              <th className="px-3 py-4 text-left text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider w-32 min-w-[120px]">
                Scenario
              </th>
              {data.tools.map((tool) => (
                <ToolHeader key={tool.id} tool={tool} compact={compact} />
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-gray-800/60">
            {data.scenarios.map((scenario, sIdx) => (
              <tr key={scenario.id} className={sIdx % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-slate-50/50 dark:bg-gray-900/50'}>
                <td className="px-3 py-3 text-sm font-medium text-slate-700 dark:text-gray-300">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{scenario.icon}</span>
                    <span className="truncate">{scenario.name}</span>
                  </div>
                </td>
                {data.tools.map((tool) => {
                  const rec = data.matrix[String(tool.id)]?.[scenario.id] ?? {
                    level: 'not_recommended' as const,
                    reason: 'No data available for this combination.',
                  };
                  return <RecommendationCell key={`${tool.id}-${scenario.id}`} recommendation={rec} />;
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-4 text-xs text-slate-500 dark:text-gray-400">
        <span className="flex items-center gap-1.5"><span>✅</span> Best Fit</span>
        <span className="flex items-center gap-1.5"><span>☑️</span> Viable</span>
        <span className="flex items-center gap-1.5"><span>➖</span> Not Ideal</span>
      </div>

      {/* CTA to full compare page */}
      {!compact && (
        <div className="text-center mt-6">
          <Link
            href="/compare"
            className="inline-flex items-center gap-2 px-6 py-3 border-2 border-emerald-600 text-emerald-600 dark:text-emerald-400 dark:border-emerald-500 font-semibold rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-500/10 hover:-translate-y-0.5 transition-all duration-300"
          >
            View Full Comparison Tool
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      )}
    </div>
  );
}

// --- Category Switcher ---
const CATEGORIES = [
  { id: 'Writing', label: 'Writing', icon: '✍️' },
  { id: 'Image', label: 'Image', icon: '🎨' },
  { id: 'Video', label: 'Video', icon: '🎬' },
  { id: 'Audio', label: 'Audio', icon: '🎵' },
  { id: 'Code', label: 'Code', icon: '💻' },
  { id: 'Productivity', label: 'Productivity', icon: '📊' },
] as const;

export type CategoryId = typeof CATEGORIES[number]['id'];

interface DecisionMatrixWithSwitcherProps {
  matrices: Record<string, DecisionMatrixData>;
  defaultCategory?: CategoryId;
  compact?: boolean;
}

export function DecisionMatrixWithSwitcher({ matrices, defaultCategory = 'Writing', compact = false }: DecisionMatrixWithSwitcherProps) {
  const [activeCategory, setActiveCategory] = useState<CategoryId>(defaultCategory);
  const currentData = matrices[activeCategory];

  return (
    <div>
      {/* Category Switcher */}
      <div className="flex items-center justify-center gap-2 mb-6 flex-wrap">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id as CategoryId)}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
              activeCategory === cat.id
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/25'
                : 'bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 text-slate-600 dark:text-gray-300 hover:border-emerald-400 hover:text-emerald-600 dark:hover:text-emerald-400'
            }`}
            aria-pressed={activeCategory === cat.id}
          >
            <span>{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Matrix */}
      {currentData ? (
        <DecisionMatrix data={currentData} compact={compact} />
      ) : (
        <div className="text-center py-8 text-slate-500 dark:text-gray-400">
          Decision matrix for {activeCategory} is coming soon.
        </div>
      )}
    </div>
  );
}
