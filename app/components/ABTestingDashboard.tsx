'use client';

import { useState, useEffect } from 'react';

interface Experiment {
  id: string;
  name: string;
  description: string;
  variants: string[];
  status: 'running' | 'paused' | 'completed';
  startDate: string;
  endDate?: string;
  results?: {
    variant: string;
    impressions: number;
    conversions: number;
    conversionRate: number;
  }[];
}

export default function ABTestingDashboard() {
  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedExperiment, setSelectedExperiment] = useState<string | null>(null);

  const fetchExperiments = async () => {
    try {
      const response = await fetch('/api/ab-test');
      const data = await response.json();
      
      // Mock experiments for now
      const mockExperiments: Experiment[] = [
        {
          id: 'exp-001',
          name: 'CTA 按钮颜色测试',
          description: '测试绿色 vs 蓝色 CTA 按钮的转化率',
          variants: ['green', 'blue'],
          status: 'running',
          startDate: '2026-06-01',
          results: data.results || [],
        },
        {
          id: 'exp-002',
          name: '工具卡片布局测试',
          description: '测试网格布局 vs 列表布局的用户参与度',
          variants: ['grid', 'list'],
          status: 'running',
          startDate: '2026-06-10',
          results: [],
        },
      ];

      setExperiments(mockExperiments);
    } catch (error) {
      console.error('Failed to fetch experiments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperiments();
  }, []);

  const recordVariant = async (experimentId: string, variant: string) => {
    try {
      const sessionId = localStorage.getItem('sessionId') || `session-${Date.now()}`;
      
      await fetch('/api/ab-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: experimentId,
          variant,
          sessionId,
          metadata: { timestamp: new Date().toISOString() },
        }),
      });
    } catch (error) {
      console.error('Failed to record variant:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-950 dark:to-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-950 dark:to-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            A/B 测试仪表板
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            管理和监控所有增长实验，数据驱动优化决策
          </p>
        </div>

        {/* Experiments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {experiments.map((experiment) => (
            <div
              key={experiment.id}
              className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-slate-200 dark:border-gray-800 p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-1">
                    {experiment.name}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {experiment.description}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    experiment.status === 'running'
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                      : experiment.status === 'paused'
                      ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                      : 'bg-slate-100 text-slate-700 dark:bg-gray-800 dark:text-slate-400'
                  }`}
                >
                  {experiment.status === 'running' ? '运行中' : experiment.status === 'paused' ? '已暂停' : '已完成'}
                </span>
              </div>

              <div className="mb-4">
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                  开始日期: {new Date(experiment.startDate).toLocaleDateString('zh-CN')}
                </p>
                <div className="flex gap-2">
                  {experiment.variants.map((variant) => (
                    <button
                      key={variant}
                      onClick={() => recordVariant(experiment.id, variant)}
                      className="px-3 py-1 bg-slate-100 dark:bg-gray-800 text-slate-700 dark:text-slate-300 rounded-lg text-sm hover:bg-slate-200 dark:hover:bg-gray-700 transition-colors"
                    >
                      {variant}
                    </button>
                  ))}
                </div>
              </div>

              {experiment.results && experiment.results.length > 0 && (
                <div className="border-t border-slate-200 dark:border-gray-800 pt-4">
                  <h4 className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-3">
                    实验结果
                  </h4>
                  <div className="space-y-2">
                    {experiment.results.map((result) => (
                      <div key={result.variant} className="flex items-center justify-between">
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          {result.variant}
                        </span>
                        <div className="flex items-center gap-4">
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            {result.impressions} 次展示
                          </span>
                          <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                            {result.conversionRate.toFixed(2)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Create New Experiment Button */}
        <div className="mt-8">
          <button className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition-colors">
            创建新实验
          </button>
        </div>
      </div>
    </div>
  );
}
