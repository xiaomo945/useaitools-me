'use client';

import { useEffect, useState } from 'react';

interface WebVitalMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  id: string;
  navigationType: string;
  url: string;
  timestamp: string;
}

interface ErrorReport {
  message: string;
  stack?: string;
  url: string;
  userAgent: string;
  timestamp: string;
  type: string;
}

interface WebVitalsStats {
  total: number;
  summary: Array<{
    name: string;
    count: number;
    avg: number;
    good: number;
    needsImprovement: number;
    poor: number;
  }>;
  recent: WebVitalMetric[];
}

interface ErrorStats {
  total: number;
  summary: Array<{
    type: string;
    count: number;
    uniqueMessages: number;
  }>;
  recent: ErrorReport[];
}

export default function MonitoringDashboard() {
  const [activeTab, setActiveTab] = useState<'performance' | 'errors'>('performance');
  const [webVitals, setWebVitals] = useState<WebVitalsStats | null>(null);
  const [errors, setErrors] = useState<ErrorStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [vitalsRes, errorsRes] = await Promise.all([
        fetch('/api/analytics/web-vitals'),
        fetch('/api/analytics/errors'),
      ]);

      if (vitalsRes.ok) {
        setWebVitals(await vitalsRes.json());
      }
      if (errorsRes.ok) {
        setErrors(await errorsRes.json());
      }
    } catch (error) {
      console.error('Failed to fetch monitoring data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatMetricValue = (name: string, value: number) => {
    switch (name) {
      case 'CLS':
        return value.toFixed(3);
      case 'LCP':
      case 'INP':
      case 'TTFB':
        return `${Math.round(value)}ms`;
      default:
        return value.toFixed(2);
    }
  };

  const getMetricThreshold = (name: string) => {
    switch (name) {
      case 'CLS':
        return { good: 0.1, poor: 0.25 };
      case 'LCP':
        return { good: 2500, poor: 4000 };
      case 'INP':
        return { good: 200, poor: 500 };
      case 'TTFB':
        return { good: 800, poor: 1800 };
      default:
        return { good: 0, poor: 0 };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-slate-600 dark:text-gray-400">Loading monitoring data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Monitoring Dashboard</h1>
            <p className="text-slate-600 dark:text-gray-400 mt-1">Performance metrics and error tracking</p>
          </div>
          <button
            onClick={fetchData}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Refresh
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-slate-200 dark:border-gray-800">
          <nav className="flex gap-4">
            <button
              onClick={() => setActiveTab('performance')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'performance'
                  ? 'text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-600 dark:border-emerald-400'
                  : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Performance
            </button>
            <button
              onClick={() => setActiveTab('errors')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'errors'
                  ? 'text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-600 dark:border-emerald-400'
                  : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Errors
            </button>
          </nav>
        </div>

        {/* Performance Tab */}
        {activeTab === 'performance' && (
          <div className="space-y-6">
            {webVitals && webVitals.summary.length > 0 ? (
              <>
                {/* Summary Cards */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                  {webVitals.summary.map((metric) => {
                    const threshold = getMetricThreshold(metric.name);
                    const goodPercent = (metric.good / metric.count) * 100;
                    
                    return (
                      <div key={metric.name} className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">{metric.name}</h3>
                        
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-2xl font-bold text-slate-900 dark:text-white">
                              {formatMetricValue(metric.name, metric.avg)}
                            </span>
                            <span className="text-sm text-slate-500 dark:text-gray-400">avg</span>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-slate-600 dark:text-gray-400">Threshold</span>
                              <span className="text-slate-900 dark:text-white">Good: &lt;{formatMetricValue(metric.name, threshold.good)}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-slate-600 dark:text-gray-400">Samples</span>
                              <span className="text-slate-900 dark:text-white">{metric.count}</span>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-slate-900 dark:text-white">Good</span>
                              <span className="text-slate-900 dark:text-white">{metric.good} ({goodPercent.toFixed(1)}%)</span>
                            </div>
                            <div className="w-full bg-slate-200 dark:bg-gray-700 rounded-full h-2">
                              <div
                                className="bg-green-500 h-2 rounded-full transition-all"
                                style={{ width: `${goodPercent}%` }}
                              ></div>
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-slate-200 dark:border-gray-700">
                            <div>
                              <div className="text-lg font-semibold text-green-600 dark:text-green-400">{metric.good}</div>
                              <div className="text-xs text-slate-500 dark:text-gray-400">Good</div>
                            </div>
                            <div>
                              <div className="text-lg font-semibold text-yellow-600 dark:text-yellow-400">{metric.needsImprovement}</div>
                              <div className="text-xs text-slate-500 dark:text-gray-400">NI</div>
                            </div>
                            <div>
                              <div className="text-lg font-semibold text-red-600 dark:text-red-400">{metric.poor}</div>
                              <div className="text-xs text-slate-500 dark:text-gray-400">Poor</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Recent Metrics */}
                <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Recent Performance Metrics</h3>
                  <div className="space-y-3">
                    {webVitals.recent.slice(-10).reverse().map((metric, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 border border-slate-200 dark:border-gray-700 rounded-lg">
                        <div className="flex items-center gap-4">
                          <span className="px-2 py-1 text-xs font-medium border border-slate-300 dark:border-gray-600 rounded text-slate-700 dark:text-gray-300">
                            {metric.name}
                          </span>
                          <div>
                            <div className="font-semibold text-slate-900 dark:text-white">
                              {formatMetricValue(metric.name, metric.value)}
                            </div>
                            <div className="text-sm text-slate-500 dark:text-gray-400">
                              {new URL(metric.url).pathname}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className={`px-2 py-1 text-xs font-medium rounded ${
                            metric.rating === 'good' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                            metric.rating === 'needs-improvement' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' :
                            'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                          }`}>
                            {metric.rating === 'needs-improvement' ? 'NI' : metric.rating.charAt(0).toUpperCase() + metric.rating.slice(1)}
                          </span>
                          <div className="text-sm text-slate-500 dark:text-gray-400">
                            {new Date(metric.timestamp).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-2xl p-12 shadow-sm flex items-center justify-center">
                <div className="text-center text-slate-500 dark:text-gray-400">
                  <p className="text-lg">No performance metrics collected yet</p>
                  <p className="text-sm mt-2">Metrics will appear as users visit the site</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Errors Tab */}
        {activeTab === 'errors' && (
          <div className="space-y-6">
            {errors && errors.summary.length > 0 ? (
              <>
                {/* Error Summary */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {errors.summary.map((errorType) => (
                    <div key={errorType.type} className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">{errorType.type}</h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-slate-900 dark:text-white">{errorType.count}</span>
                          <span className="text-sm text-slate-500 dark:text-gray-400">total</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-600 dark:text-gray-400">Unique messages</span>
                          <span className="text-slate-900 dark:text-white">{errorType.uniqueMessages}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Recent Errors */}
                <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Recent Errors</h3>
                  <div className="space-y-3">
                    {errors.recent.slice(-10).reverse().map((error, idx) => (
                      <div key={idx} className="p-4 border border-slate-200 dark:border-gray-700 rounded-lg space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-1 text-xs font-medium rounded bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400">
                            {error.type}
                          </span>
                          <div className="text-sm text-slate-500 dark:text-gray-400">
                            {new Date(error.timestamp).toLocaleString()}
                          </div>
                        </div>
                        <div className="font-semibold text-slate-900 dark:text-white">{error.message}</div>
                        <div className="text-sm text-slate-500 dark:text-gray-400">
                          {new URL(error.url).pathname}
                        </div>
                        {error.stack && (
                          <details className="text-xs">
                            <summary className="cursor-pointer text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white">
                              Stack trace
                            </summary>
                            <pre className="mt-2 p-2 bg-slate-100 dark:bg-gray-800 rounded overflow-x-auto text-slate-700 dark:text-gray-300">
                              {error.stack}
                            </pre>
                          </details>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-2xl p-12 shadow-sm flex items-center justify-center">
                <div className="text-center text-slate-500 dark:text-gray-400">
                  <p className="text-lg">No errors tracked yet</p>
                  <p className="text-sm mt-2">Errors will be logged as they occur</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
