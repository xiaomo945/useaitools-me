import type { Tool } from '@/types';

/**
 * Deliberately NOT a client component.
 *
 * It used to carry `'use client'`, which made it a client boundary that received
 * the whole `Tool[]` for the category as a prop — 481 fully populated tool
 * objects for /category/code, serialized into the RSC payload of every response.
 * The component only ever derived three numbers from that array (total, updated
 * this month, free) and renders no interactivity, so all of that serialization
 * bought nothing. As a server component the array never leaves the server.
 */
interface CategoryStatsProps {
  category: string;
  tools: Tool[];
}

export default function CategoryStats({ category, tools }: CategoryStatsProps) {
  const totalTools = tools.length;
  // Ratings were fabricated and have been removed from the dataset.
  // Show a real, verifiable count instead.
  const recentlyUpdated = tools.filter(t => (t.last_updated || '') >= '2026-09').length;
  const freeTools = tools.filter(t => 
    t.pricing === 'Free' || t.pricing === 'Freemium' || t.pricing === 'Open Source'
  );
  const paidTools = totalTools - freeTools.length;

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
            {recentlyUpdated}
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400">
            Updated This Month
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
    </div>
  );
}
