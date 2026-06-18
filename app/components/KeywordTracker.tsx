'use client';

import { useState, useEffect } from 'react';
import { Search, TrendingUp, TrendingDown, Minus, ExternalLink } from 'lucide-react';

interface KeywordData {
  keyword: string;
  position: number;
  previousPosition: number;
  change: number;
  url: string;
  searchVolume: number;
  difficulty: number;
}

interface KeywordTrackerProps {
  initialKeywords?: string[];
}

export default function KeywordTracker({ initialKeywords = [] }: KeywordTrackerProps) {
  const [keywords, setKeywords] = useState<KeywordData[]>([]);
  const [loading, setLoading] = useState(false);
  const [newKeyword, setNewKeyword] = useState('');
  const [filter, setFilter] = useState<'all' | 'improved' | 'declined' | 'stable'>('all');

  useEffect(() => {
    fetchKeywords();
  }, []);

  const fetchKeywords = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/keywords');
      if (response.ok) {
        const data = await response.json();
        setKeywords(data.keywords);
      }
    } catch (error) {
      console.error('Failed to fetch keywords:', error);
    } finally {
      setLoading(false);
    }
  };

  const addKeyword = async () => {
    if (!newKeyword.trim()) return;

    setLoading(true);
    try {
      const response = await fetch('/api/keywords', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword: newKeyword.trim() }),
      });

      if (response.ok) {
        setNewKeyword('');
        await fetchKeywords();
      }
    } catch (error) {
      console.error('Failed to add keyword:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeKeyword = async (keyword: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/keywords', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword }),
      });

      if (response.ok) {
        await fetchKeywords();
      }
    } catch (error) {
      console.error('Failed to remove keyword:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredKeywords = keywords.filter((kw) => {
    if (filter === 'all') return true;
    if (filter === 'improved') return kw.change > 0;
    if (filter === 'declined') return kw.change < 0;
    return kw.change === 0;
  });

  const getTrendIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (change < 0) return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  const getTrendColor = (change: number) => {
    if (change > 0) return 'text-green-600 dark:text-green-400';
    if (change < 0) return 'text-red-600 dark:text-red-400';
    return 'text-gray-500 dark:text-gray-400';
  };

  const getPositionColor = (position: number) => {
    if (position <= 3) return 'text-green-600 dark:text-green-400 font-bold';
    if (position <= 10) return 'text-blue-600 dark:text-blue-400 font-semibold';
    if (position <= 20) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-gray-600 dark:text-gray-400';
  };

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty <= 30) return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
    if (difficulty <= 60) return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
    return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-slate-200 dark:border-gray-800 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">关键词排名追踪</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            监控网站在搜索引擎中的关键词排名变化
          </p>
        </div>
        <div className="flex gap-2">
          {(['all', 'improved', 'declined', 'stable'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-sm font-semibold rounded-lg transition-colors ${
                filter === f
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 dark:bg-gray-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-gray-700'
              }`}
            >
              {f === 'all' ? '全部' : f === 'improved' ? '上升' : f === 'declined' ? '下降' : '稳定'}
            </button>
          ))}
        </div>
      </div>

      {/* Add Keyword */}
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={newKeyword}
          onChange={(e) => setNewKeyword(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addKeyword()}
          aria-label="Enter keyword to track"
          placeholder="输入要追踪的关键词..."
          className="flex-1 px-4 py-2 bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
        <button
          onClick={addKeyword}
          disabled={loading || !newKeyword.trim()}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          添加
        </button>
      </div>

      {/* Keywords Table */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 bg-slate-100 dark:bg-gray-800 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : filteredKeywords.length === 0 ? (
        <div className="text-center py-12">
          <Search className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <p className="text-slate-600 dark:text-slate-400">
            {filter === 'all' ? '还没有追踪任何关键词' : `没有${filter === 'improved' ? '上升' : filter === 'declined' ? '下降' : '稳定'}的关键词`}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredKeywords.map((kw) => (
            <div
              key={kw.keyword}
              className="flex items-center justify-between p-4 bg-slate-50 dark:bg-gray-800/50 rounded-lg hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <span className="font-semibold text-slate-900 dark:text-white">{kw.keyword}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${getDifficultyColor(kw.difficulty)}`}>
                    难度 {kw.difficulty}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                  <span>搜索量: {kw.searchVolume.toLocaleString()}</span>
                  <a
                    href={kw.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                  >
                    查看页面 <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className={`text-2xl font-bold ${getPositionColor(kw.position)}`}>
                    #{kw.position}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">当前排名</div>
                </div>

                <div className="flex items-center gap-2">
                  {getTrendIcon(kw.change)}
                  <span className={`font-semibold ${getTrendColor(kw.change)}`}>
                    {kw.change > 0 ? `+${kw.change}` : kw.change}
                  </span>
                </div>

                <button
                  onClick={() => removeKeyword(kw.keyword)}
                  className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                  title="移除关键词"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Summary Stats */}
      {keywords.length > 0 && (
        <div className="mt-6 grid grid-cols-4 gap-4 pt-6 border-t border-slate-200 dark:border-gray-700">
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-900 dark:text-white">{keywords.length}</div>
            <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">追踪关键词</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {keywords.filter((k) => k.change > 0).length}
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">排名上升</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {keywords.filter((k) => k.change < 0).length}
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">排名下降</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {keywords.filter((k) => k.position <= 10).length}
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">前10名</div>
          </div>
        </div>
      )}
    </div>
  );
}
