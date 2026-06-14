'use client';

import Link from 'next/link';
import { useState } from 'react';

type FormState = {
  toolName: string;
  toolId: string;
  linkType: string;
  affiliateUrl: string;
  originalUrl: string;
  network: string;
  status: string;
  notes: string;
};

const initialState: FormState = {
  toolName: '',
  toolId: '',
  linkType: 'signup',
  affiliateUrl: '',
  originalUrl: '',
  network: '',
  status: 'active',
  notes: '',
};

const linkTypeOptions = ['signup', 'pricing', 'homepage', 'referral'];
const statusOptions = ['active', 'paused', 'expired'];

export default function NewAffiliatePage() {
  const [form, setForm] = useState<FormState>(initialState);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    if (!form.toolName.trim()) {
      setMessage({ type: 'error', text: '工具名称不能为空' });
      setSaving(false);
      return;
    }
    if (!form.affiliateUrl.trim()) {
      setMessage({ type: 'error', text: '联盟链接不能为空' });
      setSaving(false);
      return;
    }

    try {
      const res = await fetch('/api/affiliate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toolName: form.toolName.trim(),
          toolId: form.toolId.trim() || null,
          linkType: form.linkType,
          affiliateUrl: form.affiliateUrl.trim(),
          originalUrl: form.originalUrl.trim() || null,
          network: form.network.trim() || null,
          status: form.status,
          notes: form.notes.trim() || null,
        }),
      });

      if (res.ok) {
        setMessage({ type: 'success', text: '✅ 链接已创建成功！' });
        setForm(initialState);
      } else {
        const data = await res.json().catch(() => ({}));
        setMessage({
          type: 'error',
          text: data.error || '创建失败，请重试',
        });
      }
    } catch (e) {
      console.error(e);
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
              ➕ 新增联盟链接
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
              填写链接信息，保存后将自动出现在管理列表中
            </p>
          </div>
          <Link
            href="/admin/affiliate"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 hover:border-emerald-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all duration-300 text-sm"
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
            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                工具名称 <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="toolName"
                value={form.toolName}
                onChange={handleChange}
                placeholder="例如：Grammarly, Notion AI"
                className={inputBase}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                工具 ID（可选）
              </label>
              <input
                type="text"
                name="toolId"
                value={form.toolId}
                onChange={handleChange}
                placeholder="数据库中的工具 ID"
                className={inputBase}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                链接类型
              </label>
              <select
                name="linkType"
                value={form.linkType}
                onChange={handleChange}
                className={inputBase}
              >
                {linkTypeOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                联盟链接（带 UTM） <span className="text-rose-500">*</span>
              </label>
              <input
                type="url"
                name="affiliateUrl"
                value={form.affiliateUrl}
                onChange={handleChange}
                placeholder="https://partner.example.com/...?utm_source=useaitools"
                className={inputBase}
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                原始链接（可选）
              </label>
              <input
                type="url"
                name="originalUrl"
                value={form.originalUrl}
                onChange={handleChange}
                placeholder="https://example.com"
                className={inputBase}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                联盟网络（可选）
              </label>
              <input
                type="text"
                name="network"
                value={form.network}
                onChange={handleChange}
                placeholder="Amazon Associates, ShareASale, CJ..."
                className={inputBase}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                状态
              </label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
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
                备注（可选）
              </label>
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                rows={3}
                placeholder="佣金比例、有效期、合作条款等..."
                className={`${inputBase} resize-none`}
              />
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row gap-3 sm:justify-end">
            <Link
              href="/admin/affiliate"
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 hover:border-slate-300 transition-all duration-200 text-sm"
            >
              取消
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 text-sm"
            >
              {saving ? '保存中...' : '💾 保存链接'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
