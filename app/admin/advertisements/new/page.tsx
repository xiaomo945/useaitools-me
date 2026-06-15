'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewAdvertisement() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    description: '',
    imageUrl: '',
    targetUrl: '',
    position: 'sidebar',
    adType: 'banner',
    status: 'active',
    startDate: '',
    endDate: '',
    price: 0,
    currency: 'USD',
    advertiser: '',
    priority: 0,
    targetCategory: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/advertisements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create advertisement');
      }

      router.push('/admin/advertisements');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create advertisement');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-950 dark:to-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
              新建广告位
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              创建新的广告位并配置展示规则
            </p>
          </div>
          <Link
            href="/admin/advertisements"
            className="px-6 py-3 bg-slate-200 hover:bg-slate-300 dark:bg-gray-800 dark:hover:bg-gray-700 text-slate-900 dark:text-slate-100 rounded-xl font-medium transition-colors"
          >
            返回列表
          </Link>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-slate-200 dark:border-gray-800 p-6">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
              基本信息
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  内部名称 *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="例如: homepage-banner"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  广告标题 *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="例如: 最佳 AI 写作工具"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  广告描述
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="简短描述广告内容"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  图片 URL
                </label>
                <input
                  type="url"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  目标链接 *
                </label>
                <input
                  type="url"
                  name="targetUrl"
                  value={formData.targetUrl}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="https://example.com"
                />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-slate-200 dark:border-gray-800 p-6">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
              展示配置
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  展示位置 *
                </label>
                <select
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="header">顶部</option>
                  <option value="sidebar">侧边栏</option>
                  <option value="footer">底部</option>
                  <option value="inline">内联</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  广告类型 *
                </label>
                <select
                  name="adType"
                  value={formData.adType}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="banner">横幅广告</option>
                  <option value="native">原生广告</option>
                  <option value="sponsored">赞助内容</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  状态
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="active">活跃</option>
                  <option value="paused">暂停</option>
                  <option value="expired">过期</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  优先级
                </label>
                <input
                  type="number"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="数字越大越优先"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  开始日期
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  结束日期
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  目标分类
                </label>
                <input
                  type="text"
                  name="targetCategory"
                  value={formData.targetCategory}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="例如: writing, image"
                />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-slate-200 dark:border-gray-800 p-6">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
              广告主信息
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  广告主名称
                </label>
                <input
                  type="text"
                  name="advertiser"
                  value={formData.advertiser}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="公司或个人名称"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  价格
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  step="0.01"
                  className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  货币
                </label>
                <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="USD">USD</option>
                  <option value="CNY">CNY</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white rounded-xl font-medium transition-colors"
            >
              {loading ? '创建中...' : '创建广告位'}
            </button>
            <Link
              href="/admin/advertisements"
              className="flex-1 px-6 py-3 bg-slate-200 hover:bg-slate-300 dark:bg-gray-800 dark:hover:bg-gray-700 text-slate-900 dark:text-slate-100 rounded-xl font-medium transition-colors text-center"
            >
              取消
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
