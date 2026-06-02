'use client';

import type { Tool } from '@/types';

interface CategoryStatsProps {
  category: string;
  tools: Tool[];
}

export default function CategoryStats({ category, tools }: CategoryStatsProps) {
  const totalTools = tools.length;
  const avgRating = totalTools > 0 
    ? tools.reduce((sum, tool) => sum + (tool.rating || 4), 0) / totalTools 
    : 0;
  const freeTools = tools.filter(t => 
    t.pricing === 'Free' || t.pricing === 'Freemium' || t.pricing === 'Open Source'
  );
  const paidTools = totalTools - freeTools.length;

  // Dummy difficulty data (since we don't have actual difficulty in JSON
  const beginner = totalTools > 0 ? Math.floor(totalTools * 0.5) : 0;
  const intermediate = totalTools > 0 ? Math.floor(totalTools * 0.35) : 0;
  const advanced = totalTools - beginner - intermediate;

  const colorMap: Record<string, string> = {
    Writing: 'text-blue-600',
    Image: 'text-violet-600',
    Productivity: 'text-teal-600',
    Code: 'text-orange-600',
    Audio: 'text-pink-600',
    Video: 'text-indigo-600',
  };

  const bgMap: Record<string, string> = {
    Writing: 'bg-blue-50 dark:bg-blue-950/30',
    Image: 'bg-violet-50 dark:bg-violet-950/30',
    Productivity: 'bg-teal-50 dark:bg-teal-950/30',
    Code: 'bg-orange-50 dark:bg-orange-950/30',
    Audio: 'bg-pink-50 dark:bg-pink-950/30',
    Video: 'bg-indigo-50 dark:bg-indigo-950/30',
  };

  const color = colorMap[category] || 'text-slate-600';
  const bg = bgMap[category] || 'bg-slate-50';

  return (
    <div className={`${bg} border border-slate-200/60 dark:border-slate-800 rounded-3xl p-6 mb-10`}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-6 text-center">
          <div className={`text-3xl font-extrabold ${color} mb-2`}>
            {totalTools}
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400">
            Total Tools
          </div>
        </div>
        <div className="p-6 text-center">
          <div className={`text-3xl font-extrabold ${color} mb-2`}>
            {avgRating.toFixed(1)}
            <span className="text-lg font-normal">/5</span>
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400">
            Avg Rating
          </div>
        </div>
        <div className="p-6 text-center">
          <div className={`text-3xl font-extrabold ${color} mb-2`}>
            {freeTools.length}
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400">
            Free/Freemium
          </div>
        </div>
        <div className="p-6 text-center">
          <div className={`text-3xl font-extrabold ${color} mb-2`}>
            {paidTools}
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400">
            Paid Options
          </div>
        </div>
      </div>
      {/* Difficulty bar chart */}
      {totalTools > 0 && (
        <div className="mt-6 pt-6 border-t border-slate-200/60 dark:border-slate-800">
          <div className="text-sm text-slate-700 dark:text-slate-400 mb-4 text-center">
            Difficulty Distribution
          </div>
          <div className="flex items-center gap-4">
            <div className="flex-1 h-4 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
              <div
                className="h-full bg-emerald-500"
                style={{ width: `${(beginner / totalTools) * 100}%` }}
                title={`Beginner: ${beginner}`}
              />
              <div
                className="h-full bg-amber-500"
                style={{ width: `${(intermediate / totalTools) * 100}%` }}
                title={`Intermediate: ${intermediate}`}
              />
              <div
                className="h-full bg-red-500"
                style={{ width: `${(advanced / totalTools) * 100}%` }}
                title={`Advanced: ${advanced}`}
              />
            </div>
            <div className="flex gap-3 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                Beginner
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-amber-500 rounded-full" />
                Intermediate
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-red-500 rounded-full" />
                Advanced
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
