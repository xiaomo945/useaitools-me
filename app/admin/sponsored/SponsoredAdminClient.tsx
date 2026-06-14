'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

type SponsoredSlotRow = {
  id: string;
  slotName: string;
  title: string;
  description: string | null;
  url: string;
  imageUrl: string | null;
  price: number;
  currency: string;
  advertiser: string | null;
  status: string;
  startDate: string | null;
  endDate: string | null;
  clickCount: number;
  viewCount: number;
  priority: number;
  category: string | null;
  createdAt: string;
};

const slotNameOptions = [
  'homepage-top',
  'category-sidebar',
  'tool-detail-bottom',
  'blog-bottom',
];
const statusOptions = ['active', 'inactive', 'scheduled'];

const formatDate = (value: string | null) => {
  if (!value) return '—';
  try {
    return new Date(value).toISOString().split('T')[0];
  } catch {
    return '—';
  }
};

const statusBadge = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300';
    case 'scheduled':
      return 'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300';
    default:
      return 'bg-slate-100 text-slate-700 dark:bg-slate-500/20 dark:text-slate-300';
  }
};

const statusLabel = (status: string) => {
  switch (status) {
    case 'active':
      return 'Active';
    case 'scheduled':
      return 'Scheduled';
    default:
      return 'Inactive';
  }
};

function RowTable({ rows, onToggle, onEdit }: {
  rows: SponsoredSlotRow[];
  onToggle: (row: SponsoredSlotRow) => void;
  onEdit: (row: SponsoredSlotRow) => void;
}) {
  if (rows.length === 0) {
    return (
      <div className="text-sm text-slate-500 dark:text-slate-400 py-6 text-center">
        暂无记录
      </div>
    );
  }
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead className="text-left text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wide">
          <tr className="border-b border-slate-200 dark:border-gray-800">
            <th className="px-3 py-3 font-semibold">Slot</th>
            <th className="px-3 py-3 font-semibold">Title</th>
            <th className="px-3 py-3 font-semibold">URL</th>
            <th className="px-3 py-3 font-semibold">Status</th>
            <th className="px-3 py-3 font-semibold">Price</th>
            <th className="px-3 py-3 font-semibold">Clicks</th>
            <th className="px-3 py-3 font-semibold">Views</th>
            <th className="px-3 py-3 font-semibold">Start</th>
            <th className="px-3 py-3 font-semibold">End</th>
            <th className="px-3 py-3 font-semibold text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-gray-800">
          {rows.map((row) => (
            <tr key={row.id} className="align-top">
              <td className="px-3 py-3 font-mono text-xs text-slate-600 dark:text-slate-300 whitespace-nowrap">
                {row.slotName}
              </td>
              <td className="px-3 py-3 text-slate-900 dark:text-white font-medium">
                {row.title}
                {row.category && (
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Category: {row.category}
                  </div>
                )}
              </td>
              <td className="px-3 py-3 text-slate-600 dark:text-slate-400">
                <a
                  href={row.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 underline underline-offset-2 break-all"
                >
                  {row.url}
                </a>
              </td>
              <td className="px-3 py-3">
                <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-semibold ${statusBadge(row.status)}`}>
                  {statusLabel(row.status)}
                </span>
              </td>
              <td className="px-3 py-3 text-slate-700 dark:text-slate-300 whitespace-nowrap">
                {row.currency} {row.price}
              </td>
              <td className="px-3 py-3 text-slate-700 dark:text-slate-300">{row.clickCount}</td>
              <td className="px-3 py-3 text-slate-700 dark:text-slate-300">{row.viewCount}</td>
              <td className="px-3 py-3 text-slate-500 dark:text-slate-400 text-xs whitespace-nowrap">
                {formatDate(row.startDate)}
              </td>
              <td className="px-3 py-3 text-slate-500 dark:text-slate-400 text-xs whitespace-nowrap">
                {formatDate(row.endDate)}
              </td>
              <td className="px-3 py-3 text-right whitespace-nowrap">
                <button
                  type="button"
                  onClick={() => onToggle(row)}
                  className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-colors mr-2"
                >
                  {row.status === 'active' ? '暂停' : '激活'}
                </button>
                <button
                  type="button"
                  onClick={() => onEdit(row)}
                  className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-gray-700 hover:bg-slate-50 dark:hover:bg-gray-800 transition-colors"
                >
                  编辑
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function EditModal({ row, onClose, onSaved }: {
  row: SponsoredSlotRow;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState<SponsoredSlotRow>(row);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setForm(row);
  }, [row]);

  const update = (key: keyof SponsoredSlotRow, value: unknown) => {
    setForm((prev) => ({ ...prev, [key]: value as never }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch('/api/sponsored-slot', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: form.id,
          slotName: form.slotName,
          title: form.title,
          description: form.description,
          url: form.url,
          imageUrl: form.imageUrl,
          price: Number(form.price) || 0,
          currency: form.currency,
          advertiser: form.advertiser,
          status: form.status,
          startDate: form.startDate,
          endDate: form.endDate,
          priority: Number(form.priority) || 0,
          category: form.category,
        }),
      });
      if (res.ok) {
        onSaved();
      } else {
        setError('保存失败，请重试');
      }
    } catch {
      setError('网络错误，请重试');
    } finally {
      setSaving(false);
    }
  };

  const inputBase =
    'w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-400 dark:focus:border-emerald-500 focus:ring-2 focus:ring-emerald-400/30 transition-all text-sm';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 dark:bg-black/70 p-4 overflow-y-auto">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-2xl max-h-full overflow-y-auto">
        <div className="p-6 border-b border-slate-200 dark:border-gray-800 flex items-start justify-between">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">编辑赞助位</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">修改赞助位信息</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          >
            ✕
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Slot Name
              </label>
              <select
                value={form.slotName}
                onChange={(e) => update('slotName', e.target.value)}
                className={inputBase}
              >
                {slotNameOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Status
              </label>
              <select
                value={form.status}
                onChange={(e) => update('status', e.target.value)}
                className={inputBase}
              >
                {statusOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Title *
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => update('title', e.target.value)}
                className={inputBase}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                URL *
              </label>
              <input
                type="url"
                value={form.url}
                onChange={(e) => update('url', e.target.value)}
                className={inputBase}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Description
              </label>
              <textarea
                value={form.description ?? ''}
                onChange={(e) => update('description', e.target.value)}
                rows={3}
                className={`${inputBase} resize-none`}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Image URL
              </label>
              <input
                type="url"
                value={form.imageUrl ?? ''}
                onChange={(e) => update('imageUrl', e.target.value)}
                className={inputBase}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Advertiser
              </label>
              <input
                type="text"
                value={form.advertiser ?? ''}
                onChange={(e) => update('advertiser', e.target.value)}
                className={inputBase}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Price
              </label>
              <input
                type="number"
                step="0.01"
                value={form.price}
                onChange={(e) => update('price', Number(e.target.value))}
                className={inputBase}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Currency
              </label>
              <input
                type="text"
                value={form.currency}
                onChange={(e) => update('currency', e.target.value)}
                className={inputBase}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Start Date
              </label>
              <input
                type="date"
                value={form.startDate ? new Date(form.startDate).toISOString().split('T')[0] : ''}
                onChange={(e) => update('startDate', e.target.value || null)}
                className={inputBase}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                End Date
              </label>
              <input
                type="date"
                value={form.endDate ? new Date(form.endDate).toISOString().split('T')[0] : ''}
                onChange={(e) => update('endDate', e.target.value || null)}
                className={inputBase}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Priority
              </label>
              <input
                type="number"
                value={form.priority}
                onChange={(e) => update('priority', Number(e.target.value))}
                className={inputBase}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Category
              </label>
              <input
                type="text"
                value={form.category ?? ''}
                onChange={(e) => update('category', e.target.value)}
                placeholder="例如：Writing, Image"
                className={inputBase}
              />
            </div>
          </div>
          {error && (
            <div className="text-sm text-rose-600 dark:text-rose-400 font-semibold">{error}</div>
          )}
        </div>
        <div className="p-6 border-t border-slate-200 dark:border-gray-800 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 hover:border-slate-300 transition-colors"
          >
            取消
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={handleSave}
            className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-500 shadow-sm hover:shadow-md hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
          >
            {saving ? '保存中...' : '保存'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SponsoredAdminClient() {
  const [slots, setSlots] = useState<SponsoredSlotRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editRow, setEditRow] = useState<SponsoredSlotRow | null>(null);

  const loadSlots = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/sponsored-slot?admin=1');
      if (res.ok) {
        const data = await res.json();
        setSlots((data.slots || []) as SponsoredSlotRow[]);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSlots();
  }, []);

  const handleToggle = async (row: SponsoredSlotRow) => {
    const nextStatus = row.status === 'active' ? 'inactive' : 'active';
    try {
      const res = await fetch('/api/sponsored-slot', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: row.id, status: nextStatus }),
      });
      if (res.ok) {
        setSlots((prev) =>
          prev.map((s) => (s.id === row.id ? { ...s, status: nextStatus } : s))
        );
      }
    } catch {
      // ignore
    }
  };

  const activeSlots = slots.filter((s) => s.status === 'active');
  const scheduledSlots = slots.filter((s) => s.status === 'scheduled');
  const inactiveSlots = slots.filter((s) => s.status !== 'active' && s.status !== 'scheduled');

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/40 via-white to-teal-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-emerald-950/20 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
              赞助位管理
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              管理首页、分类页、工具详情页及博客底部的赞助位
            </p>
          </div>
          <Link
            href="/admin/sponsored/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-500 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all whitespace-nowrap"
          >
            + 新增赞助位
          </Link>
        </div>

        {loading ? (
          <div className="text-slate-500 dark:text-slate-400 text-sm py-6">加载中...</div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-slate-200 dark:border-gray-800 shadow-sm p-5 sm:p-6">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="inline-flex w-2 h-2 rounded-full bg-emerald-500"></span>
                Active ({activeSlots.length})
              </h2>
              <RowTable rows={activeSlots} onToggle={handleToggle} onEdit={setEditRow} />
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-slate-200 dark:border-gray-800 shadow-sm p-5 sm:p-6">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="inline-flex w-2 h-2 rounded-full bg-amber-500"></span>
                Scheduled ({scheduledSlots.length})
              </h2>
              <RowTable rows={scheduledSlots} onToggle={handleToggle} onEdit={setEditRow} />
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-slate-200 dark:border-gray-800 shadow-sm p-5 sm:p-6">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="inline-flex w-2 h-2 rounded-full bg-slate-500"></span>
                Inactive ({inactiveSlots.length})
              </h2>
              <RowTable rows={inactiveSlots} onToggle={handleToggle} onEdit={setEditRow} />
            </div>
          </div>
        )}
      </div>

      {editRow && (
        <EditModal
          row={editRow}
          onClose={() => setEditRow(null)}
          onSaved={() => {
            setEditRow(null);
            loadSlots();
          }}
        />
      )}
    </div>
  );
}
