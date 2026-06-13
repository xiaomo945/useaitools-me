'use client';

import React from 'react';
import Link from 'next/link';

interface Tool {
  id: number;
  name: string;
  category: string;
}

interface ColorScheme {
  bg: string;
  bgDark: string;
  text: string;
  textLight: string;
  border: string;
  ring: string;
  shadow: string;
}

interface CompareBarProps {
  selectedForCompare: number[];
  displayedTools: Tool[];
  isDragOver: boolean;
  onClear: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent) => void;
  getCategoryColors: (category: string) => ColorScheme;
}

const CompareBar: React.FC<CompareBarProps> = ({
  selectedForCompare,
  displayedTools,
  isDragOver,
  onClear,
  onDragOver,
  onDragLeave,
  onDrop,
  getCategoryColors,
}) => {
  if (selectedForCompare.length === 0) return null;

  return (
    <div
      role="region"
      aria-label="Compare tools"
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className={`fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-slate-200 dark:border-gray-800 shadow-2xl z-50 transform transition-all duration-300 ease-out ${isDragOver ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 shadow-emerald-500/20' : ''}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              {selectedForCompare.length === 1 ? 'Select 1 more to compare' : '2 tools selected'}
            </span>
            <div className="flex items-center gap-2">
              {selectedForCompare.map((toolId) => {
                const tool = displayedTools.find((t) => t.id === toolId);
                if (!tool) return null;
                const colors = getCategoryColors(tool.category);
                return (
                  <span
                    key={tool.id}
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${colors.bgDark} ${colors.textLight} dark:${colors.text}`}
                  >
                    {tool.name}
                  </span>
                );
              })}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClear}
              className="min-h-[44px] min-w-[44px] px-3 py-2 text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors flex items-center justify-center"
              aria-label="Clear comparison"
            >
              Clear
            </button>
            {selectedForCompare.length >= 2 ? (
              <Link
                href={`/compare?tool=${selectedForCompare[0]}&tool=${selectedForCompare[1]}`}
                className="min-h-[44px] px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center"
              >
                Compare Now →
              </Link>
            ) : (
              <span className="min-h-[44px] px-3 py-2 text-xs text-slate-400 dark:text-slate-500 font-medium flex items-center">
                + Select another tool
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompareBar;
