'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Advertisement {
  id: string;
  name: string;
  title: string;
  description?: string;
  imageUrl?: string;
  targetUrl: string;
  position: string;
  adType: string;
  status: string;
  startDate?: string;
  endDate?: string;
  price: number;
  currency: string;
  advertiser?: string;
  clickCount: number;
  viewCount: number;
  priority: number;
  targetCategory?: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdvertisementAdmin() {
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterPosition, setFilterPosition] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');

  useEffect(() => {
    fetchAdvertisements();
  }, [filterPosition, filterStatus]);

  const fetchAdvertisements = async () => {
    try {
      const params = new URLSearchParams();
      if (filterPosition) params.append('position', filterPosition);
      if (filterStatus) params.append('status', filterStatus);

      const response = await fetch(`/api/advertisements?${params.toString()}`);
      const data = await response.json();
      setAdvertisements(data.advertisements || []);
    } catch (error) {
      console.error('Failed to fetch advertisements:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
      case 'paused':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
      case 'expired':
        return 'bg-slate-100 text-slate-700 dark:bg-gray-800 dark:text-slate-400';
      default:
        return 'bg-slate-100 text-slate-700 dark:bg-gray-800 dark:text-slate-400';
    }
  };

  const getPositionLabel = (position: string) => {
    const labels: Record<string, string> = {
      header: '顶部',
      sidebar: '侧边栏',
      footer: '底部',
      inline: '内联',
    };
    return labels[position] || position;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-950 dark:to-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-950 dark:to-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
              广告位管理
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              管理网站广告位，追踪展示和点击数据
            </p>
          </div>
          <Link
            href="/admin/advertisements/new"
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition-colors"
          >
            + 新建广告位
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-slate-200 dark:border-gray-800 p-6 mb-6">
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                位置
              </label>
              <select
                value={filterPosition}
                onChange={(e) => setFilterPosition(e.target.value)}
                className="px-3 py-2 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg text-sm text-slate-900 dark:text-slate-100"
              >
                <option value="">全部</option>
                <option value="header">顶部</option>
                <option value="sidebar">侧边栏</option>
                <option value="footer">底部</option>
                <option value="inline">内联</option>
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
                <option value="paused">暂停</option>
                <option value="expired">过期</option>
              </select>
            </div>
          </div>
        </div>

        {/* Advertisements Table */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-slate-200 dark:border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-gray-700">
              <thead className="bg-slate-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    广告名称
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    位置
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    类型
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    状态
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    广告主
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    价格
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    展示/点击
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-slate-200 dark:divide-gray-700">
                {advertisements.map((ad) => {
                  const ctr = ad.viewCount > 0 ? ((ad.clickCount / ad.viewCount) * 100).toFixed(2) : '0.00';
                  return (
                    <tr key={ad.id} className="hover:bg-slate-50 dark:hover:bg-gray-800">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {ad.imageUrl && (
                            <img
                              src={ad.imageUrl}
                              alt={ad.title}
                              className="w-10 h-10 rounded-lg object-cover mr-3"
                            />
                          )}
                          <div>
                            <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                              {ad.title}
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">
                              {ad.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-100">
                        {getPositionLabel(ad.position)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-100">
                        {ad.adType}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(ad.status)}`}>
                          {ad.status === 'active' ? '活跃' : ad.status === 'paused' ? '暂停' : '过期'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-100">
                        {ad.advertiser || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-100">
                        {ad.price > 0 ? `${ad.currency} ${ad.price}` : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-100">
                        <div>{ad.viewCount.toLocaleString()}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          {ad.clickCount.toLocaleString()} ({ctr}%)
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <Link
                          href={`/admin/advertisements/${ad.id}/edit`}
                          className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 mr-3"
                        >
                          编辑
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {advertisements.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-500 dark:text-slate-400">暂无广告位</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
