'use client';

import { useState, useEffect } from 'react';

interface DashboardMetrics {
  totalVisits: number;
  uniqueVisitors: number;
  pageViews: number;
  bounceRate: number;
  avgSessionDuration: number;
  conversionRate: number;
  affiliateClicks: number;
  estimatedRevenue: number;
}

interface TrafficData {
  date: string;
  visits: number;
  pageViews: number;
}

interface KeywordData {
  keyword: string;
  position: number;
  change: number;
  url: string;
}

interface CompetitorData {
  name: string;
  domain: string;
  trafficRank: number;
  monthlyVisits: number;
}

export default function AnalyticsDashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [trafficData, setTrafficData] = useState<TrafficData[]>([]);
  const [keywords, setKeywords] = useState<KeywordData[]>([]);
  const [competitors, setCompetitors] = useState<CompetitorData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'traffic' | 'keywords' | 'competitors'>('overview');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [metricsRes, trafficRes, keywordsRes, competitorsRes] = await Promise.all([
        fetch('/api/analytics/dashboard'),
        fetch('/api/analytics/traffic'),
        fetch('/api/keywords'),
        fetch('/api/competitors'),
      ]);

      if (metricsRes.ok) {
        const metricsData = await metricsRes.json();
        setMetrics(metricsData.metrics);
      }

      if (trafficRes.ok) {
        const trafficDataResult = await trafficRes.json();
        setTrafficData(trafficDataResult.data || []);
      }

      if (keywordsRes.ok) {
        const keywordsData = await keywordsRes.json();
        setKeywords(keywordsData.keywords || []);
      }

      if (competitorsRes.ok) {
        const competitorsData = await competitorsRes.json();
        setCompetitors(competitorsData.competitors || []);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-950 dark:to-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
              ))}
            </div>
            <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded"></div>
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
            数据分析仪表板
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            实时监控网站性能、流量和增长指标
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-slate-200 dark:border-gray-800">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: '概览' },
              { id: 'traffic', label: '流量' },
              { id: 'keywords', label: '关键词' },
              { id: 'competitors', label: '竞品' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && metrics && (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard
                title="总访问量"
                value={metrics.totalVisits.toLocaleString()}
                change={12.5}
                icon="👥"
              />
              <MetricCard
                title="独立访客"
                value={metrics.uniqueVisitors.toLocaleString()}
                change={8.3}
                icon="🌐"
              />
              <MetricCard
                title="页面浏览量"
                value={metrics.pageViews.toLocaleString()}
                change={15.2}
                icon="📄"
              />
              <MetricCard
                title="预估收入"
                value={`$${metrics.estimatedRevenue.toFixed(2)}`}
                change={23.1}
                icon="💰"
              />
            </div>

            {/* Secondary Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-slate-200 dark:border-gray-800 p-6">
                <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                  跳出率
                </h3>
                <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                  {metrics.bounceRate.toFixed(1)}%
                </p>
                <div className="mt-2">
                  <div className="h-2 bg-slate-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full"
                      style={{ width: `${metrics.bounceRate}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-slate-200 dark:border-gray-800 p-6">
                <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                  平均会话时长
                </h3>
                <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                  {Math.floor(metrics.avgSessionDuration / 60)}:{(metrics.avgSessionDuration % 60).toString().padStart(2, '0')}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                  分钟
                </p>
              </div>

              <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-slate-200 dark:border-gray-800 p-6">
                <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                  转化率
                </h3>
                <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                  {metrics.conversionRate.toFixed(2)}%
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                  {metrics.affiliateClicks} 次联盟点击
                </p>
              </div>
            </div>

            {/* Traffic Chart Placeholder */}
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-slate-200 dark:border-gray-800 p-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
                流量趋势（过去 30 天）
              </h3>
              <div className="h-64 flex items-center justify-center text-slate-400 dark:text-slate-500">
                [流量趋势图表 - 需要集成图表库如 Recharts 或 Chart.js]
              </div>
            </div>
          </div>
        )}

        {/* Traffic Tab */}
        {activeTab === 'traffic' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-slate-200 dark:border-gray-800 p-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
                每日流量数据
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 dark:divide-gray-700">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        日期
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        访问量
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        页面浏览量
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-900 divide-y divide-slate-200 dark:divide-gray-700">
                    {trafficData.map((day, idx) => (
                      <tr key={idx}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-100">
                          {day.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-100">
                          {day.visits.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-100">
                          {day.pageViews.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Keywords Tab */}
        {activeTab === 'keywords' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-slate-200 dark:border-gray-800 p-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
                关键词排名追踪
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 dark:divide-gray-700">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        关键词
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        排名
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        变化
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        URL
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-900 divide-y divide-slate-200 dark:divide-gray-700">
                    {keywords.map((kw, idx) => (
                      <tr key={idx}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-slate-100">
                          {kw.keyword}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-100">
                          #{kw.position}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={kw.change > 0 ? 'text-emerald-600' : kw.change < 0 ? 'text-red-600' : 'text-slate-500'}>
                            {kw.change > 0 ? `+${kw.change}` : kw.change}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400 truncate max-w-xs">
                          {kw.url}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Competitors Tab */}
        {activeTab === 'competitors' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-slate-200 dark:border-gray-800 p-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
                竞品分析
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 dark:divide-gray-700">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        竞品
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        域名
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        流量排名
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        月访问量
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-900 divide-y divide-slate-200 dark:divide-gray-700">
                    {competitors.map((comp, idx) => (
                      <tr key={idx}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-slate-100">
                          {comp.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                          {comp.domain}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-100">
                          #{comp.trafficRank}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-100">
                          {comp.monthlyVisits.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function MetricCard({ title, value, change, icon }: { title: string; value: string; change: number; icon: string }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-slate-200 dark:border-gray-800 p-6">
      <div className="flex items-center justify-between mb-4">
        <span className="text-2xl">{icon}</span>
        <span className={`text-sm font-medium ${change > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
          {change > 0 ? '+' : ''}{change}%
        </span>
      </div>
      <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
        {title}
      </h3>
      <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
        {value}
      </p>
    </div>
  );
}
