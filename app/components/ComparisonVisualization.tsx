'use client';

import type { Tool } from '@/types';

const DIMENSIONS = [
  'ease_of_use',
  'output_quality',
  'features',
  'value_for_money',
  'stability',
  'support',
] as const;

const DIMENSION_LABELS: Record<string, string> = {
  ease_of_use: 'Ease of Use',
  output_quality: 'Output Quality',
  features: 'Features',
  value_for_money: 'Value for Money',
  stability: 'Stability',
  support: 'Support',
};

interface ComparisonVisualizationProps {
  tools: Tool[];
}

export default function ComparisonVisualization({ tools }: ComparisonVisualizationProps) {
  return (
    <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-3xl p-8 mb-10">
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 text-center">
        🌟 Rating Breakdown
      </h3>
      
      <div className="space-y-6">
        {DIMENSIONS.map((dim) => (
          <div key={dim}>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                {DIMENSION_LABELS[dim]}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {tools.map((tool, idx) => {
                const ratingBreakdown = tool.rating_breakdown;
                const score = ratingBreakdown?.[dim]?.score || 0;
                const percentage = (score / 5) * 100;
                
                const color = idx === 0 
                  ? 'from-emerald-500 to-teal-500' 
                  : idx === 1 
                    ? 'from-blue-500 to-indigo-500' 
                    : 'from-violet-500 to-purple-500';
                
                return (
                  <div key={idx}>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mb-1 font-medium">
                      {tool.name}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r ${color} transition-all duration-1000`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 w-10 text-right">
                        {score}/5
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
