'use client';

import Link from 'next/link';
import { useState } from 'react';

const slotNameOptions = [
  'homepage-top',
  'category-sidebar',
  'tool-detail-bottom',
  'blog-bottom',
];
const statusOptions = ['active', 'inactive', 'scheduled'];

type FormState = {
  slotName: string;
  title: string;
  description: string;
  url: string;
  imageUrl: string;
  price: string;
  currency: string;
  advertiser: string;
  status: string;
  startDate: string;
  endDate: string;
  priority: string;
  category: string;
};

const initialState: FormState = {
  slotName: 'homepage-top',
  title: '',
  description: '',
  url: '',
  imageUrl: '',
  price: '0',
  currency: 'USD',
  advertiser: '',
  status: 'active',
  startDate: '',
  endDate: '',
  priority: '0',
  category: '',
};

export default function NewSponsoredPage() {
  const [form, setForm] = useState<FormState>(initialState);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const update = (key: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    if (!form.title.trim()) {
      setMessage({ type: 'error', text: 'Title 不能为空' });
      setSaving(false);
      return;
    }
    if (!form.url.trim()) {
      setMessage({ type: 'error', text: 'URL 不能为空' });
      setSaving(false);
      return;
    }

    try {
      const res = await fetch('/api/sponsored-slot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slotName: form.slotName,
          title: form.title.trim(),
          description: form.description.trim() || null,
          url: form.url.trim(),
          imageUrl: form.imageUrl.trim() || null,
          price: Number(form.price) || 0,
          currency: form.currency.trim() || 'USD',
          advertiser: form.advertiser.trim() || null,
          status: form.status,
          startDate: form.startDate || null,
          endDate: form.endDate || null,
          priority: Number(form.priority) || 0,
          category: form.category.trim() || null,
        }),
      });

      if (res.ok) {
        setMessage({ type: 'success', text: '✅ 赞助位已创建！' });
        setForm(initialState);
      } else {
        setMessage({ type: 'error', text: '创建失败，请重试' });
      }
    } catch {
      setMessage({ type: 'error', text: '网络错误，请重试' });
    } finally {
      setSaving(false);
    }
  };

  const inputBase =
    'w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-400 dark:focus:border-emerald-500 focus:ring-2 focus:ring-emerald-400/30 transition-all duration-200 text-sm';

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/40 via-white to-teal-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-emerald-950/20 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
              新增赞助位
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
              填写赞助位信息，保存后将自动出现在管理列表中
            </p>
          </div>
          <Link
            href="/admin/sponsored"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 hover:border-emerald-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all duration-300 text-sm whitespace-nowrap"
          >
            ← 返回列表
          </Link>
        </div>

        {message && (
          <div
            className={`mb-6 px-5 py-4 rounded-xl font-semibold text-sm ${
              message.type === 'success'
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                : 'bg-rose-100 text-rose-800 dark:bg-rose-500/20 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
            }`}
          >
            {message.text}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-900 rounded-2xl border border-slate-200 dark:border-gray-800 shadow-sm p-6 sm:p-8 space-y-6"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Slot Name <span className="text-rose-500">*</span>
              </label>
              <select
                value={form.slotName}
                onChange={(e) => update('slotName', e.target.value)}
                className={inputBase}
              >
                {slotNameOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Status
              </label>
              <select
                value={form.status}
                onChange={(e) => update('status', e.target.value)}
                className={inputBase}
              >
                {statusOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => update('title', e.target.value)}
                placeholder="例如：最佳 AI 写作工具推荐"
                className={inputBase}
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                URL <span className="text-rose-500">*</span>
              </label>
              <input
                type="url"
                value={form.url}
                onChange={(e) => update('url', e.target.value)}
                placeholder="https://example.com"
                className={inputBase}
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Description
              </label>
              <textarea
                value={form.description}
                onChange={(e) => update('description', e.target.value)}
                rows={3}
                placeholder="赞助位简介"
                className={`${inputBase} resize-none`}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Image URL
              </label>
              <input
                type="url"
                value={form.imageUrl}
                onChange={(e) => update('imageUrl', e.target.value)}
                placeholder="https://example.com/image.png"
                className={inputBase}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Price
              </label>
              <input
                type="number"
                step="0.01"
                value={form.price}
                onChange={(e) => update('price', e.target.value)}
                className={inputBase}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Currency
              </label>
              <input
                type="text"
                value={form.currency}
                onChange={(e) => update('currency', e.target.value)}
                placeholder="USD"
                className={inputBase}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Advertiser
              </label>
              <input
                type="text"
                value={form.advertiser}
                onChange={(e) => update('advertiser', e.target.value)}
                placeholder="广告主名称"
                className={inputBase}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Priority
              </label>
              <input
                type="number"
                value={form.priority}
                onChange={(e) => update('priority', e.target.value)}
                className={inputBase}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={form.startDate}
                onChange={(e) => update('startDate', e.target.value)}
                className={inputBase}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                End Date
              </label>
              <input
                type="date"
                value={form.endDate}
                onChange={(e) => update('endDate', e.target.value)}
                className={inputBase}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Category
              </label>
              <input
                type="text"
                value={form.category}
                onChange={(e) => update('category', e.target.value)}
                placeholder="例如：Writing, Image（仅特定分类展示）"
                className={inputBase}
              />
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row gap-3 sm:justify-end">
            <Link
              href="/admin/sponsored"
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 hover:border-slate-300 transition-all duration-200 text-sm"
            >
              取消
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 text-sm"
            >
              {saving ? '保存中...' : '💾 保存'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
