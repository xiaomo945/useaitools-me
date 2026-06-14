'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, ArrowRight, Users, MousePointer, ExternalLink, DollarSign } from 'lucide-react';

interface FunnelStage {
  id: string;
  name: string;
  count: number;
  conversionRate: number;
  icon: any;
  color: string;
}

interface ConversionFunnelProps {
  period?: '7d' | '30d' | '90d';
}

export default function ConversionFunnel({ period = '30d' }: ConversionFunnelProps) {
  const [stages, setStages] = useState<FunnelStage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFunnel = async () => {
      try {
        const response = await fetch(`/api/analytics/funnel?period=${period}`);
        if (response.ok) {
          const data = await response.json();
          setStages(data.stages);
        }
      } catch (error) {
        console.error('Failed to fetch funnel data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFunnel();
  }, [period]);

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-slate-200 dark:border-gray-800 p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-slate-200 dark:bg-gray-700 rounded w-1/3"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 bg-slate-100 dark:bg-gray-800 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const maxCount = stages[0]?.count || 1;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-slate-200 dark:border-gray-800 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">转化漏斗</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            追踪用户从访问到联盟点击的完整路径
          </p>
        </div>
        <div className="flex gap-2">
          {(['7d', '30d', '90d'] as const).map((p) => (
            <button
              key={p}
              onClick={() => window.location.reload()}
              className={`px-3 py-1.5 text-sm font-semibold rounded-lg transition-colors ${
                period === p
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 dark:bg-gray-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-gray-700'
              }`}
            >
              {p === '7d' ? '近7天' : p === '30d' ? '近30天' : '近90天'}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {stages.map((stage, index) => {
          const width = (stage.count / maxCount) * 100;
          const Icon = stage.icon;

          return (
            <div key={stage.id} className="relative">
              {/* Stage Card */}
              <div className="bg-slate-50 dark:bg-gray-800/50 rounded-xl p-4 border border-slate-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${stage.color}`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-white">{stage.name}</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {stage.count.toLocaleString()} 用户
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">
                      {stage.conversionRate.toFixed(1)}%
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">转化率</div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="relative h-2 bg-slate-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`absolute left-0 top-0 h-full rounded-full transition-all duration-500 ${stage.color.replace('bg-', 'bg-').replace('/600', '-500')}`}
                    style={{ width: `${width}%` }}
                  />
                </div>
              </div>

              {/* Arrow between stages */}
              {index < stages.length - 1 && (
                <div className="flex justify-center py-2">
                  <ArrowRight className="w-5 h-5 text-slate-400 dark:text-slate-600 rotate-90" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-3 gap-4 pt-6 border-t border-slate-200 dark:border-gray-700">
        <div className="text-center">
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {stages[stages.length - 1]?.conversionRate.toFixed(2)}%
          </div>
          <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">整体转化率</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {stages[stages.length - 1]?.count.toLocaleString()}
          </div>
          <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">联盟点击</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            ${((stages[stages.length - 1]?.count || 0) * 0.15).toFixed(2)}
          </div>
          <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">预估收入</div>
        </div>
      </div>
    </div>
  );
}
