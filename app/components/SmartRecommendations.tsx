'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { Tool } from '@/types';

interface SmartRecommendationsProps {
  tools: Tool[];
  currentToolId?: number;
}

interface UserBehavior {
  viewedCategories: Record<string, number>;
  viewedTools: number[];
  lastUpdated: number;
}

const BEHAVIOR_STORAGE_KEY = 'user-behavior';
const MAX_VIEWED_TOOLS = 20;

export default function SmartRecommendations({ tools, currentToolId }: SmartRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<Tool[]>([]);
  const [behavior, setBehavior] = useState<UserBehavior>({
    viewedCategories: {},
    viewedTools: [],
    lastUpdated: Date.now(),
  });

  // 加载用户行为数据
  useEffect(() => {
    const stored = localStorage.getItem(BEHAVIOR_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as UserBehavior;
        setBehavior(parsed);
      } catch (e) {
        console.error('Failed to parse user behavior:', e);
      }
    }
  }, []);

  // 记录当前工具浏览
  useEffect(() => {
    if (currentToolId) {
      const currentTool = tools.find(t => t.id === currentToolId);
      if (currentTool) {
        const newBehavior = { ...behavior };
        
        // 更新分类浏览次数
        newBehavior.viewedCategories[currentTool.category] = 
          (newBehavior.viewedCategories[currentTool.category] || 0) + 1;
        
        // 更新浏览工具列表
        if (!newBehavior.viewedTools.includes(currentToolId)) {
          newBehavior.viewedTools = [currentToolId, ...newBehavior.viewedTools].slice(0, MAX_VIEWED_TOOLS);
        }
        
        newBehavior.lastUpdated = Date.now();
        setBehavior(newBehavior);
        localStorage.setItem(BEHAVIOR_STORAGE_KEY, JSON.stringify(newBehavior));
      }
    }
  }, [currentToolId, tools]);

  // 计算推荐工具
  useEffect(() => {
    if (tools.length === 0) return;

    // 获取用户最常浏览的分类
    const topCategories = Object.entries(behavior.viewedCategories)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([category]) => category);

    // 过滤工具：排除当前工具和已浏览工具
    let candidates = tools.filter(t => 
      t.id !== currentToolId && 
      !behavior.viewedTools.includes(t.id)
    );

    // 评分算法：分类匹配 + 评分权重
    const scoredTools = candidates.map(tool => {
      let score = 0;
      
      // 分类匹配加分（前3个分类各加10/8/6分）
      const categoryIndex = topCategories.indexOf(tool.category);
      if (categoryIndex !== -1) {
        score += [10, 8, 6][categoryIndex];
      }
      
      // 评分加权
      score += (tool.rating || 0) * 2;
      
      // 评分数量加权（越多越可信）
      if (tool.rating_count) {
        score += Math.min(Math.log10(tool.rating_count) * 2, 10);
      }
      
      return { tool, score };
    });

    // 按分数排序，取前6个
    const topTools = scoredTools
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)
      .map(item => item.tool);

    setRecommendations(topTools);
  }, [tools, currentToolId, behavior]);

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border border-emerald-200/60 dark:border-emerald-800/40 rounded-3xl p-6 sm:p-8 mb-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/25">
          <span className="text-white text-lg">🎯</span>
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Recommended for You
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Based on your browsing preferences
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {recommendations.map((tool) => {
          const colors = getCategoryColors(tool.category);
          return (
            <Link
              key={tool.id}
              href={`/tool/${tool.id}`}
              className="group bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-2xl p-4 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className={`w-10 h-10 rounded-xl ${colors.bg}/10 dark:${colors.bgDark} flex items-center justify-center text-lg font-bold flex-shrink-0`}>
                  {tool.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-900 dark:text-white truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {tool.name}
                  </h3>
                  <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-semibold ${colors.bgDark} ${colors.textLight} dark:${colors.text}`}>
                    {tool.category}
                  </span>
                </div>
              </div>
              
              <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-3">
                {tool.description}
              </p>
              
              {tool.rating && (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        className={`w-4 h-4 ${star <= Math.round(tool.rating!) ? 'text-amber-400' : 'text-slate-300 dark:text-slate-600'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    {tool.rating.toFixed(1)}
                  </span>
                  {tool.rating_count && (
                    <span className="text-xs text-slate-500 dark:text-slate-500">
                      ({tool.rating_count.toLocaleString()})
                    </span>
                  )}
                </div>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

// 分类颜色映射
function getCategoryColors(category: string) {
  const colors: Record<string, { bg: string; bgDark: string; text: string; textLight: string }> = {
    Writing: { bg: 'bg-blue-500', bgDark: 'bg-blue-500/20', text: 'text-blue-300', textLight: 'text-blue-600' },
    Image: { bg: 'bg-violet-500', bgDark: 'bg-violet-500/20', text: 'text-violet-300', textLight: 'text-violet-600' },
    Productivity: { bg: 'bg-teal-500', bgDark: 'bg-teal-500/20', text: 'text-teal-300', textLight: 'text-teal-600' },
    Code: { bg: 'bg-orange-500', bgDark: 'bg-orange-500/20', text: 'text-orange-300', textLight: 'text-orange-600' },
    Audio: { bg: 'bg-pink-500', bgDark: 'bg-pink-500/20', text: 'text-pink-300', textLight: 'text-pink-600' },
    Video: { bg: 'bg-indigo-500', bgDark: 'bg-indigo-500/20', text: 'text-indigo-300', textLight: 'text-indigo-600' },
  };
  return colors[category] || colors.Productivity;
}
