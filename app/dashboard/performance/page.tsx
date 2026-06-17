'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Footer from '@/app/components/Footer';
import { Activity, ArrowLeft, TrendingUp, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

type MetricData = {
  metric: string;
  count: number;
  p50: number | null;
  p75: number | null;
  p95: number | null;
  goodPct: number | null;
};

type ApiResponse = {
  period: { days: number; since: string };
  metrics: MetricData[];
};

// Thresholds per metric (good, poor) — matches WebVitals.tsx
const thresholds: Record<string, { good: number; poor: number; unit: string; label: string }> = {
  LCP: { good: 2500, poor: 4000, unit: 'ms', label: 'Largest Contentful Paint' },
  FID: { good: 100, poor: 300, unit: 'ms', label: 'First Input Delay' },
  INP: { good: 200, poor: 500, unit: 'ms', label: 'Interaction to Next Paint' },
  CLS: { good: 0.1, poor: 0.25, unit: '', label: 'Cumulative Layout Shift' },
  TTFB: { good: 800, poor: 1800, unit: 'ms', label: 'Time to First Byte' },
  FCP: { good: 1800, poor: 3000, unit: 'ms', label: 'First Contentful Paint' },
};

function formatValue(metric: string, value: number | null): string {
  if (value === null) return '—';
  const config = thresholds[metric];
  if (!config) return String(value);
  if (metric === 'CLS') return value.toFixed(3);
  return `${Math.round(value)}${config.unit}`;
}

function getRatingColor(metric: string, value: number | null): string {
  if (value === null) return 'text-slate-400';
  const config = thresholds[metric];
  if (!config) return 'text-slate-700 dark:text-slate-300';
  if (value <= config.good) return 'text-emerald-600 dark:text-emerald-400';
  if (value <= config.poor) return 'text-amber-600 dark:text-amber-400';
  return 'text-red-600 dark:text-red-400';
}

function getRatingBg(metric: string, value: number | null): string {
  if (value === null) return 'bg-slate-100 dark:bg-gray-800';
  const config = thresholds[metric];
  if (!config) return 'bg-slate-100 dark:bg-gray-800';
  if (value <= config.good) return 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800';
  if (value <= config.poor) return 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800';
  return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
}

export default function PerformanceDashboardPage() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [days, setDays] = useState(7);

  useEffect(() => {
    let cancelled = false;
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/analytics?days=${days}`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const json: ApiResponse = await response.json();
        if (!cancelled) setData(json);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchData();
    return () => { cancelled = true; };
  }, [days]);

  const totalSamples = data?.metrics.reduce((sum, m) => sum + m.count, 0) ?? 0;
  const metricsWithData = data?.metrics.filter((m) => m.count > 0) ?? [];
  const overallGoodPct = metricsWithData.length > 0
    ? Math.round((metricsWithData.reduce((sum, m) => sum + (m.goodPct ?? 0), 0) / metricsWithData.length) * 10) / 10
    : null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/25">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
              Performance Dashboard
            </h1>
          </div>
          <p className="text-slate-600 dark:text-gray-400">
            Real-user Core Web Vitals collected from production traffic
          </p>
        </div>

        {/* Period selector */}
        <div className="mb-6 flex items-center gap-2">
          <span className="text-sm text-slate-500 dark:text-slate-400 mr-2">Period:</span>
          {[7, 14, 30, 90].map((d) => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                days === d
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/25'
                  : 'bg-white dark:bg-gray-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-gray-700 hover:border-emerald-400'
              }`}
            >
              {d}d
            </button>
          ))}
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-slate-400" />
              <span className="text-sm text-slate-500 dark:text-slate-400">Total Samples</span>
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{totalSamples.toLocaleString()}</p>
          </div>
          <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              <span className="text-sm text-slate-500 dark:text-slate-400">Avg Good Rating</span>
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              {overallGoodPct !== null ? `${overallGoodPct}%` : '—'}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-slate-500 dark:text-slate-400">Metrics Tracked</span>
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{metricsWithData.length} / 6</p>
          </div>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-2xl p-5 animate-pulse">
                <div className="h-5 w-24 bg-slate-100 dark:bg-gray-800 rounded mb-4" />
                <div className="h-8 w-20 bg-slate-100 dark:bg-gray-800 rounded mb-3" />
                <div className="h-4 w-16 bg-slate-100 dark:bg-gray-800 rounded" />
              </div>
            ))}
          </div>
        )}

        {/* Error state */}
        {error && !loading && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6 text-center">
            <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-3" />
            <p className="text-red-700 dark:text-red-300 font-medium mb-1">Failed to load performance data</p>
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Metrics grid */}
        {data && !loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.metrics.map((m) => {
              const config = thresholds[m.metric];
              if (!config) return null;
              return (
                <div
                  key={m.metric}
                  className={`border rounded-2xl p-5 transition-all ${getRatingBg(m.metric, m.p75)}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white">{m.metric}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{config.label}</p>
                    </div>
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400 bg-white/60 dark:bg-gray-800/60 px-2 py-1 rounded-full">
                      {m.count} samples
                    </span>
                  </div>

                  {m.count === 0 ? (
                    <p className="text-sm text-slate-400 dark:text-slate-500 py-4 text-center">
                      No data yet
                    </p>
                  ) : (
                    <>
                      <div className="mb-3">
                        <span className="text-xs text-slate-500 dark:text-slate-400">p75 (primary)</span>
                        <p className={`text-2xl font-bold ${getRatingColor(m.metric, m.p75)}`}>
                          {formatValue(m.metric, m.p75)}
                        </p>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div>
                          <span className="text-slate-500 dark:text-slate-400">p50</span>
                          <p className="font-semibold text-slate-700 dark:text-slate-300">
                            {formatValue(m.metric, m.p50)}
                          </p>
                        </div>
                        <div>
                          <span className="text-slate-500 dark:text-slate-400">p95</span>
                          <p className="font-semibold text-slate-700 dark:text-slate-300">
                            {formatValue(m.metric, m.p95)}
                          </p>
                        </div>
                        <div>
                          <span className="text-slate-500 dark:text-slate-400">Good</span>
                          <p className="font-semibold text-emerald-600 dark:text-emerald-400">
                            {m.goodPct !== null ? `${m.goodPct}%` : '—'}
                          </p>
                        </div>
                      </div>
                      {/* Threshold bar */}
                      <div className="mt-3 pt-3 border-t border-slate-200/60 dark:border-gray-700/60">
                        <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-500 mb-1">
                          <span>Good ≤ {formatValue(m.metric, config.good)}</span>
                          <span>Poor &gt; {formatValue(m.metric, config.poor)}</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Info note */}
        {data && !loading && totalSamples === 0 && (
          <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-6">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">No data yet</h3>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Web Vitals are collected from real users in production. Once visitors land on your site,
              metrics will appear here within a few minutes. Vercel Analytics also provides these metrics
              in the Vercel dashboard.
            </p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
