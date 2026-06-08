import Link from 'next/link';
import { ArrowRight, Star } from 'lucide-react';

interface RelatedTool {
  id: number;
  name: string;
  description: string;
  category: string;
  pricing: string;
  rating?: number;
  best_for?: string[];
}

interface RelatedToolsProps {
  currentTool: RelatedTool;
  allTools: RelatedTool[];
  limit?: number;
}

const categoryColorMap: Record<string, { bg: string; text: string; tag: string }> = {
  Writing: { bg: 'bg-blue-500/10', text: 'text-blue-600 dark:text-blue-400', tag: 'bg-blue-500' },
  Image: { bg: 'bg-violet-500/10', text: 'text-violet-600 dark:text-violet-400', tag: 'bg-violet-500' },
  Productivity: { bg: 'bg-teal-500/10', text: 'text-teal-600 dark:text-teal-400', tag: 'bg-teal-500' },
  Code: { bg: 'bg-orange-500/10', text: 'text-orange-600 dark:text-orange-400', tag: 'bg-orange-500' },
  Audio: { bg: 'bg-pink-500/10', text: 'text-pink-600 dark:text-pink-400', tag: 'bg-pink-500' },
  Video: { bg: 'bg-indigo-500/10', text: 'text-indigo-600 dark:text-indigo-400', tag: 'bg-indigo-500' },
};

function getRelatedTools(currentTool: RelatedTool, allTools: RelatedTool[], limit: number): RelatedTool[] {
  // 评分：同分类 +3, 共享 best_for 标签 +1, 高评分 +0.5
  const currentTags = new Set((currentTool.best_for || []).map(t => t.toLowerCase()));

  const scored = allTools
    .filter(t => t.id !== currentTool.id)
    .map(t => {
      let score = 0;
      if (t.category === currentTool.category) score += 3;
      const toolTags = t.best_for || [];
      const sharedTags = toolTags.filter(tag => currentTags.has(tag.toLowerCase())).length;
      score += sharedTags * 1.5;
      if (t.rating && t.rating >= 4.0) score += 0.5;
      if (t.pricing === currentTool.pricing) score += 0.3;
      return { tool: t, score };
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.tool);

  return scored;
}

export default function RelatedTools({ currentTool, allTools, limit = 4 }: RelatedToolsProps) {
  const related = getRelatedTools(currentTool, allTools, limit);

  if (related.length === 0) {
    return null;
  }

  return (
    <section className="mt-12 pt-10 border-t border-slate-200 dark:border-gray-800">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            You Might Also Like
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Similar tools in {currentTool.category} that users love
          </p>
        </div>
        <Link
          href={`/category/${currentTool.category.toLowerCase()}`}
          className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
        >
          See all {currentTool.category} tools
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {related.map((tool, index) => {
          const colors = categoryColorMap[tool.category] || categoryColorMap.Productivity;
          return (
            <Link
              key={tool.id}
              href={`/tools/${tool.id}`}
              className="group relative bg-white dark:bg-gray-900 border border-slate-200/60 dark:border-gray-800 shadow-sm rounded-2xl overflow-hidden hover:border-emerald-300 dark:hover:border-emerald-600 hover:shadow-xl hover:shadow-emerald-500/5 hover:-translate-y-1 transition-all duration-300 ease-out animate-fade-in-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className={`h-0.75 w-full ${colors.tag}`} style={{ height: '3px' }} />

              <div className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-xl ${colors.bg} ${colors.text} flex items-center justify-center text-lg font-bold flex-shrink-0`}>
                    {tool.name.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-base text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors truncate">
                      {tool.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      {tool.rating && (
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                            {(tool.rating || 0).toFixed(1)}
                          </span>
                        </div>
                      )}
                      <span className="text-xs text-slate-400 dark:text-slate-500">
                        {tool.pricing}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-slate-600 dark:text-gray-300 line-clamp-2 mb-3 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                  {tool.description}
                </p>

                {tool.best_for && tool.best_for.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {tool.best_for.slice(0, 2).map((tag: string, i: number) => (
                      <span key={i} className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-gray-800">
                  <span className={`text-xs font-semibold ${colors.text} uppercase tracking-wide`}>
                    {tool.category}
                  </span>
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    View
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="sm:hidden mt-6 text-center">
        <Link
          href={`/category/${currentTool.category.toLowerCase()}`}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
        >
          See all {currentTool.category} tools
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
