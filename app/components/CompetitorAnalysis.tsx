'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Minus, ExternalLink, BarChart3, Target, Zap } from 'lucide-react';

interface CompetitorData {
  id: string;
  name: string;
  domain: string;
  trafficRank: number;
  monthlyVisits: number;
  topKeywords: string[];
  strengths: string[];
  weaknesses: string[];
  lastUpdated: string;
}

export default function CompetitorAnalysis() {
  const [competitors, setCompetitors] = useState<CompetitorData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCompetitor, setSelectedCompetitor] = useState<string | null>(null);

  const fetchCompetitors = async () => {
    try {
      const response = await fetch('/api/competitors');
      const data = await response.json();
      setCompetitors(data.competitors || []);
    } catch (error) {
      console.error('Failed to fetch competitors:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompetitors();
  }, []);

  const getTrafficColor = (rank: number) => {
    if (rank <= 10000) return 'text-green-600 dark:text-green-400';
    if (rank <= 50000) return 'text-blue-600 dark:text-blue-400';
    if (rank <= 100000) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-gray-600 dark:text-gray-400';
  };

  const formatTraffic = (visits: number) => {
    if (visits >= 1000000) return `${(visits / 1000000).toFixed(1)}M`;
    if (visits >= 1000) return `${(visits / 1000).toFixed(1)}K`;
    return visits.toString();
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-slate-200 dark:border-gray-800 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-200 dark:bg-gray-700 rounded w-1/3"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-slate-100 dark:bg-gray-800 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-slate-200 dark:border-gray-800 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">竞品分析</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            监控主要竞争对手的流量和关键词表现
          </p>
        </div>
        <BarChart3 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
      </div>

      <div className="space-y-4">
        {competitors.map((competitor) => (
          <div
            key={competitor.id}
            className="border border-slate-200 dark:border-gray-800 rounded-xl p-5 hover:border-emerald-500 dark:hover:border-emerald-400 transition-colors cursor-pointer"
            onClick={() => setSelectedCompetitor(selectedCompetitor === competitor.id ? null : competitor.id)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white">{competitor.name}</h4>
                  <a
                    href={competitor.domain}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-600 dark:text-emerald-400 hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-slate-600 dark:text-slate-400">
                    流量排名: <span className={`font-semibold ${getTrafficColor(competitor.trafficRank)}`}>
                      #{competitor.trafficRank.toLocaleString()}
                    </span>
                  </span>
                  <span className="text-slate-600 dark:text-slate-400">
                    月访问量: <span className="font-semibold text-slate-900 dark:text-white">
                      {formatTraffic(competitor.monthlyVisits)}
                    </span>
                  </span>
                </div>
              </div>
            </div>

            {selectedCompetitor === competitor.id && (
              <div className="mt-4 pt-4 border-t border-slate-200 dark:border-gray-800 space-y-4">
                <div>
                  <h5 className="text-sm font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                    <Target className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    主要优势
                  </h5>
                  <ul className="space-y-1">
                    {competitor.strengths.map((strength, idx) => (
                      <li key={idx} className="text-sm text-slate-600 dark:text-slate-400 flex items-start gap-2">
                        <span className="text-green-500 mt-1">•</span>
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h5 className="text-sm font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                    潜在弱点
                  </h5>
                  <ul className="space-y-1">
                    {competitor.weaknesses.map((weakness, idx) => (
                      <li key={idx} className="text-sm text-slate-600 dark:text-slate-400 flex items-start gap-2">
                        <span className="text-red-500 mt-1">•</span>
                        {weakness}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h5 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">
                    核心关键词
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {competitor.topKeywords.map((keyword, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-slate-100 dark:bg-gray-800 text-slate-700 dark:text-slate-300 text-xs rounded-full"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="text-xs text-slate-500 dark:text-slate-500">
                  最后更新: {new Date(competitor.lastUpdated).toLocaleDateString('zh-CN')}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {competitors.length === 0 && (
        <div className="text-center py-12 text-slate-500 dark:text-slate-400">
          暂无竞品数据，请先添加竞争对手
        </div>
      )}
    </div>
  );
}
