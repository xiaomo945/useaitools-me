'use client';

import { useState, useEffect } from 'react';

interface AffiliateLink {
  id: string;
  toolId: string | null;
  toolName: string;
  linkType: string;
  affiliateUrl: string;
  originalUrl: string | null;
  network: string | null;
  status: string;
  clickCount: number;
  conversionCount: number;
  revenue: number;
  startDate: string | null;
  endDate: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

interface Stats {
  totalLinks: number;
  totalClicks: number;
  totalConversions: number;
  totalRevenue: number;
  avgConversionRate: number;
}

interface NetworkStats {
  [network: string]: {
    clicks: number;
    conversions: number;
    revenue: number;
  };
}

export default function AffiliateOptimization() {
  const [affiliateLinks, setAffiliateLinks] = useState<AffiliateLink[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [networkStats, setNetworkStats] = useState<NetworkStats>({});
  const [topPerformers, setTopPerformers] = useState<AffiliateLink[]>([]);
  const [underperformers, setUnderperformers] = useState<AffiliateLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterNetwork, setFilterNetwork] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('clickCount');
  const [sortOrder, setSortOrder] = useState<string>('desc');

  const fetchAffiliateData = async () => {
    try {
      const params = new URLSearchParams();
      if (filterNetwork) params.append('network', filterNetwork);
      if (filterStatus) params.append('status', filterStatus);
      params.append('sortBy', sortBy);
      params.append('sortOrder', sortOrder);

      const response = await fetch(`/api/affiliate?${params.toString()}`);
      const data = await response.json();
      
      setAffiliateLinks(data.affiliateLinks || []);
      setStats(data.stats || null);
      setNetworkStats(data.networkStats || {});
      setTopPerformers(data.topPerformers || []);
      setUnderperformers(data.underperformers || []);
    } catch (error) {
      console.error('Failed to fetch affiliate data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAffiliateData();
  }, [filterNetwork, filterStatus, sortBy, sortOrder]); // eslint-disable-line react-hooks/exhaustive-deps

  const getConversionRate = (clicks: number, conversions: number) => {
    if (clicks === 0) return 0;
    return (conversions / clicks) * 100;
  };

  const getPerformanceColor = (rate: number) => {
    if (rate >= 5) return 'text-emerald-600 dark:text-emerald-400';
    if (rate >= 2) return 'text-amber-600 dark:text-amber-400';
    return 'text-red-600 dark:text-red-400';
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
            联盟链接优化系统
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            追踪点击、分析转化率、优化收入表现
          </p>
        </div>

        {/* Overall Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-slate-200 dark:border-gray-800 p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl">🔗</span>
              </div>
              <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                总链接数
              </h3>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {stats.totalLinks}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-slate-200 dark:border-gray-800 p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl">👆</span>
              </div>
              <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                总点击数
              </h3>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {stats.totalClicks.toLocaleString()}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-slate-200 dark:border-gray-800 p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl">✅</span>
              </div>
              <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                总转化数
              </h3>
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {stats.totalConversions.toLocaleString()}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-slate-200 dark:border-gray-800 p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl">💰</span>
              </div>
              <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                总收入
              </h3>
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                ${stats.totalRevenue.toFixed(2)}
              </p>
            </div>
          </div>
        )}

        {/* Network Stats */}
        {Object.keys(networkStats).length > 0 && (
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-slate-200 dark:border-gray-800 p-6 mb-8">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
              联盟网络表现
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 dark:divide-gray-700">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      网络
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      点击数
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      转化数
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      转化率
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      收入
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-slate-200 dark:divide-gray-700">
                  {Object.entries(networkStats).map(([network, data]) => {
                    const rate = getConversionRate(data.clicks, data.conversions);
                    return (
                      <tr key={network}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-slate-100">
                          {network}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-100">
                          {data.clicks.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-100">
                          {data.conversions.toLocaleString()}
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${getPerformanceColor(rate)}`}>
                          {rate.toFixed(2)}%
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-emerald-600 dark:text-emerald-400">
                          ${data.revenue.toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Top Performers & Underperformers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Top Performers */}
          {topPerformers.length > 0 && (
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-slate-200 dark:border-gray-800 p-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
                🏆 表现最佳
              </h3>
              <div className="space-y-3">
                {topPerformers.map((link) => {
                  const rate = getConversionRate(link.clickCount, link.conversionCount);
                  return (
                    <div key={link.id} className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                          {link.toolName}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {link.clickCount} 点击 → {link.conversionCount} 转化
                        </p>
                      </div>
                      <span className={`text-sm font-bold ${getPerformanceColor(rate)}`}>
                        {rate.toFixed(2)}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Underperformers */}
          {underperformers.length > 0 && (
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-slate-200 dark:border-gray-800 p-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
                ⚠️ 需要优化
              </h3>
              <div className="space-y-3">
                {underperformers.map((link) => {
                  const rate = getConversionRate(link.clickCount, link.conversionCount);
                  return (
                    <div key={link.id} className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                          {link.toolName}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {link.clickCount} 点击 → {link.conversionCount} 转化
                        </p>
                      </div>
                      <span className={`text-sm font-bold ${getPerformanceColor(rate)}`}>
                        {rate.toFixed(2)}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-slate-200 dark:border-gray-800 p-6 mb-6">
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                联盟网络
              </label>
              <select
                value={filterNetwork}
                onChange={(e) => setFilterNetwork(e.target.value)}
                className="px-3 py-2 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg text-sm text-slate-900 dark:text-slate-100"
              >
                <option value="">全部</option>
                {Object.keys(networkStats).map((network) => (
                  <option key={network} value={network}>
                    {network}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                状态
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg text-sm text-slate-900 dark:text-slate-100"
              >
                <option value="">全部</option>
                <option value="active">活跃</option>
                <option value="inactive">停用</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                排序字段
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg text-sm text-slate-900 dark:text-slate-100"
              >
                <option value="clickCount">点击数</option>
                <option value="conversionCount">转化数</option>
                <option value="revenue">收入</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                排序方式
              </label>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="px-3 py-2 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg text-sm text-slate-900 dark:text-slate-100"
              >
                <option value="desc">降序</option>
                <option value="asc">升序</option>
              </select>
            </div>
          </div>
        </div>

        {/* All Affiliate Links */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-slate-200 dark:border-gray-800 p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
            所有联盟链接
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-gray-700">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    工具名称
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    网络
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    状态
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    点击数
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    转化数
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    转化率
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    收入
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-slate-200 dark:divide-gray-700">
                {affiliateLinks.map((link) => {
                  const rate = getConversionRate(link.clickCount, link.conversionCount);
                  return (
                    <tr key={link.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-slate-100">
                        {link.toolName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">
                        {link.network || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          link.status === 'active'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                            : 'bg-slate-100 text-slate-700 dark:bg-gray-800 dark:text-slate-400'
                        }`}>
                          {link.status === 'active' ? '活跃' : '停用'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-100">
                        {link.clickCount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-100">
                        {link.conversionCount.toLocaleString()}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${getPerformanceColor(rate)}`}>
                        {rate.toFixed(2)}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-emerald-600 dark:text-emerald-400">
                        ${link.revenue.toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
