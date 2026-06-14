'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, Users, Eye, Clock, ArrowUpRight, ArrowDownRight, Calendar } from 'lucide-react';

interface AnalyticsData {
  pageViews: number;
  uniqueVisitors: number;
  bounceRate: number;
  avgSessionDuration: number;
  topPages: Array<{ path: string; views: number }>;
  topReferrers: Array<{ domain: string; count: number }>;
  dailyStats: Array<{ date: string; views: number; visitors: number }>;
}

interface TrafficDashboardProps {
  initialData?: AnalyticsData;
}

export default function TrafficDashboard({ initialData }: TrafficDashboardProps) {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [data, setData] = useState<AnalyticsData | null>(initialData || null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/analytics?range=${timeRange}`);
        if (response.ok) {
          const json = await response.json();
          setData(json);
        }
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timeRange]);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}m ${secs}s`;
  };

  const MetricCard = ({
    title,
    value,
    change,
    icon: Icon,
    trend,
  }: {
    title: string;
    value: string;
    change: number;
    icon: any;
    trend: 'up' | 'down';
  }) => (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-slate-200 dark:border-gray-800 p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="p-2 bg-emerald-100 dark:bg-emerald-500/10 rounded-lg">
          <Icon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div
          className={`flex items-center gap-1 text-sm font-semibold ${
            trend === 'up' ? 'text-emerald-600' : 'text-red-600'
          }`}
        >
          {trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
          {Math.abs(change)}%
        </div>
      </div>
      <h3 className="text-sm text-slate-600 dark:text-slate-400 mb-1">{title}</h3>
      <p className="text-3xl font-bold text-slate-900 dark:text-white">{value}</p>
    </div>
  );

  if (!data && !loading) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-slate-200 dark:border-gray-800 p-12 text-center">
        <p className="text-slate-600 dark:text-slate-400">
          分析数据加载中...请确保已配置 Plausible Analytics 或 Vercel Analytics
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">流量分析</h2>
        <div className="flex gap-2">
          {(['7d', '30d', '90d'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                timeRange === range
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 dark:bg-gray-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-gray-700'
              }`}
            >
              {range === '7d' ? '近7天' : range === '30d' ? '近30天' : '近90天'}
            </button>
          ))}
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="页面浏览量"
          value={formatNumber(data?.pageViews || 0)}
          change={12.5}
          icon={Eye}
          trend="up"
        />
        <MetricCard
          title="独立访客"
          value={formatNumber(data?.uniqueVisitors || 0)}
          change={8.3}
          icon={Users}
          trend="up"
        />
        <MetricCard
          title="跳出率"
          value={`${(data?.bounceRate || 0).toFixed(1)}%`}
          change={-5.2}
          icon={TrendingUp}
          trend="down"
        />
        <MetricCard
          title="平均停留时间"
          value={formatDuration(data?.avgSessionDuration || 0)}
          change={15.7}
          icon={Clock}
          trend="up"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Traffic Chart */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-slate-200 dark:border-gray-800 p-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">每日流量趋势</h3>
          <div className="h-64 flex items-end justify-between gap-2">
            {(data?.dailyStats || []).slice(-14).map((day, idx) => {
              const maxViews = Math.max(...(data?.dailyStats || []).map((d) => d.views));
              const height = maxViews > 0 ? (day.views / maxViews) * 100 : 0;
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                  <div
                    className="w-full bg-gradient-to-t from-emerald-500 to-teal-400 rounded-t-lg transition-all hover:from-emerald-600 hover:to-teal-500"
                    style={{ height: `${height}%` }}
                    title={`${day.views} 次浏览`}
                  />
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {new Date(day.date).getDate()}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Pages */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-slate-200 dark:border-gray-800 p-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">热门页面</h3>
          <div className="space-y-3">
            {(data?.topPages || []).slice(0, 5).map((page, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="text-sm font-bold text-slate-400 dark:text-slate-500 w-6">
                    {idx + 1}
                  </span>
                  <span className="text-sm text-slate-700 dark:text-slate-300 truncate">
                    {page.path}
                  </span>
                </div>
                <span className="text-sm font-semibold text-slate-900 dark:text-white">
                  {formatNumber(page.views)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Referrers */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-slate-200 dark:border-gray-800 p-6">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">流量来源</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(data?.topReferrers || []).slice(0, 6).map((referrer, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 bg-slate-50 dark:bg-gray-800/50 rounded-lg"
            >
              <span className="text-sm text-slate-700 dark:text-slate-300">{referrer.domain}</span>
              <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                {referrer.count}
              </span>
            </div>
          ))}
        </div>
      </div>

      {loading && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-2xl">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto" />
            <p className="mt-4 text-slate-600 dark:text-slate-400">加载分析数据...</p>
          </div>
        </div>
      )}
    </div>
  );
}
