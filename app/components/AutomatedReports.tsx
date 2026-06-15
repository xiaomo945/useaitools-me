'use client';

import { useState, useEffect } from 'react';
import { FileText, Download, Calendar, TrendingUp, Users, MousePointer, DollarSign } from 'lucide-react';

interface Report {
  id: string;
  type: 'weekly' | 'monthly' | 'seo' | 'traffic';
  title: string;
  generatedAt: string;
  period: {
    start: string;
    end: string;
  };
  metrics: {
    totalVisits: number;
    uniqueVisitors: number;
    pageViews: number;
    bounceRate: number;
    avgSessionDuration: number;
    conversionRate: number;
    affiliateClicks: number;
    estimatedRevenue: number;
  };
  topPages: Array<{
    path: string;
    views: number;
    conversions: number;
  }>;
  topKeywords: Array<{
    keyword: string;
    position: number;
    change: number;
  }>;
  insights: string[];
}

export default function AutomatedReports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await fetch('/api/reports');
      const data = await response.json();
      setReports(data.reports || []);
    } catch (error) {
      console.error('Failed to fetch reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateReport = async (type: 'weekly' | 'monthly') => {
    try {
      const response = await fetch('/api/reports/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type }),
      });
      if (response.ok) {
        await fetchReports();
      }
    } catch (error) {
      console.error('Failed to generate report:', error);
    }
  };

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

  const getReportIcon = (type: string) => {
    switch (type) {
      case 'weekly':
        return <Calendar className="w-5 h-5" />;
      case 'monthly':
        return <FileText className="w-5 h-5" />;
      case 'seo':
        return <TrendingUp className="w-5 h-5" />;
      case 'traffic':
        return <Users className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-slate-200 dark:border-gray-800 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-200 dark:bg-gray-700 rounded w-1/3"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-slate-100 dark:bg-gray-800 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-slate-200 dark:border-gray-800 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">自动化报告</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              生成并查看网站运营数据报告
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => generateReport('weekly')}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg transition-colors"
            >
              生成周报
            </button>
            <button
              onClick={() => generateReport('monthly')}
              className="px-4 py-2 bg-slate-100 dark:bg-gray-800 hover:bg-slate-200 dark:hover:bg-gray-700 text-slate-700 dark:text-slate-300 text-sm font-semibold rounded-lg transition-colors"
            >
              生成月报
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {reports.length === 0 ? (
            <div className="text-center py-12 text-slate-500 dark:text-slate-400">
              暂无报告，点击"生成周报"或"生成月报"创建第一份报告
            </div>
          ) : (
            reports.map((report) => (
              <div
                key={report.id}
                onClick={() => setSelectedReport(selectedReport?.id === report.id ? null : report)}
                className="border border-slate-200 dark:border-gray-800 rounded-xl p-5 hover:border-emerald-500 dark:hover:border-emerald-400 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-100 dark:bg-emerald-500/10 rounded-lg text-emerald-600 dark:text-emerald-400">
                      {getReportIcon(report.type)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-white">{report.title}</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {new Date(report.period.start).toLocaleDateString('zh-CN')} - {new Date(report.period.end).toLocaleDateString('zh-CN')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500 dark:text-slate-500">
                      生成于 {new Date(report.generatedAt).toLocaleDateString('zh-CN')}
                    </p>
                  </div>
                </div>

                {selectedReport?.id === report.id && (
                  <div className="mt-4 pt-4 border-t border-slate-200 dark:border-gray-800 space-y-4">
                    {/* Key Metrics */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-slate-50 dark:bg-gray-800/50 rounded-lg p-3">
                        <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 mb-1">
                          <Users className="w-3 h-3" />
                          总访问
                        </div>
                        <p className="text-lg font-bold text-slate-900 dark:text-white">
                          {formatNumber(report.metrics.totalVisits)}
                        </p>
                      </div>
                      <div className="bg-slate-50 dark:bg-gray-800/50 rounded-lg p-3">
                        <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 mb-1">
                          <MousePointer className="w-3 h-3" />
                          页面浏览
                        </div>
                        <p className="text-lg font-bold text-slate-900 dark:text-white">
                          {formatNumber(report.metrics.pageViews)}
                        </p>
                      </div>
                      <div className="bg-slate-50 dark:bg-gray-800/50 rounded-lg p-3">
                        <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 mb-1">
                          <TrendingUp className="w-3 h-3" />
                          转化率
                        </div>
                        <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                          {report.metrics.conversionRate.toFixed(2)}%
                        </p>
                      </div>
                      <div className="bg-slate-50 dark:bg-gray-800/50 rounded-lg p-3">
                        <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 mb-1">
                          <DollarSign className="w-3 h-3" />
                          预估收入
                        </div>
                        <p className="text-lg font-bold text-slate-900 dark:text-white">
                          ${report.metrics.estimatedRevenue.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    {/* Top Pages */}
                    <div>
                      <h5 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">热门页面</h5>
                      <div className="space-y-2">
                        {report.topPages.slice(0, 5).map((page, idx) => (
                          <div key={idx} className="flex items-center justify-between text-sm">
                            <span className="text-slate-700 dark:text-slate-300 truncate">{page.path}</span>
                            <span className="text-slate-500 dark:text-slate-400">{formatNumber(page.views)} 次</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Insights */}
                    <div>
                      <h5 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">关键洞察</h5>
                      <ul className="space-y-1">
                        {report.insights.map((insight, idx) => (
                          <li key={idx} className="text-sm text-slate-600 dark:text-slate-400 flex items-start gap-2">
                            <span className="text-emerald-500 mt-1">•</span>
                            {insight}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
