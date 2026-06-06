'use client';

import React from 'react';
import Link from 'next/link';
import { Tool, getCategoryColors } from '../utils/toolHelpers';

interface ComparisonBarProps {
  show: boolean;
  selectedToolIds: number[];
  displayedTools: Tool[];
  isDragOver: boolean;
  onClear: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
}

const ComparisonBar: React.FC<ComparisonBarProps> = ({
  show,
  selectedToolIds,
  displayedTools,
  isDragOver,
  onClear,
  onDragOver,
  onDragLeave,
  onDrop,
}) => {
  if (!show) return null;

  const selectedTools = selectedToolIds
    .map(id => displayedTools.find(t => t.id === id))
    .filter(Boolean) as Tool[];

  return (
    <div
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className={`fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-slate-200 dark:border-gray-800 shadow-2xl z-50 transform transition-all duration-300 ease-out ${isDragOver ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 shadow-emerald-500/20' : ''}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              {selectedToolIds.length === 1 ? '1 tool selected' : '2 tools selected'}
            </span>
            <div className="flex items-center gap-2">
              {selectedTools.map((tool) => (
                <span key={tool.id} className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColors(tool.category).bg} text-white`}>
                  {tool.name}
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClear}
              className="px-3 py-2 text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
            >
              Clear
            </button>
            <Link
              href={`/compare?tool=${selectedToolIds[0]}${selectedToolIds[1] ? `&tool=${selectedToolIds[1]}` : ''}`}
              className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
            >
              Compare Now →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparisonBar;
