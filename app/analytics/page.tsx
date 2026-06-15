'use client';

import { useState } from 'react';
import TrafficDashboard from '@/app/components/TrafficDashboard';
import ConversionFunnel from '@/app/components/ConversionFunnel';
import KeywordTracker from '@/app/components/KeywordTracker';
import CompetitorAnalysis from '@/app/components/CompetitorAnalysis';
import AutomatedReports from '@/app/components/AutomatedReports';

type TabType = 'traffic' | 'funnel' | 'keywords' | 'competitors' | 'reports';

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('traffic');

  const tabs = [
    { id: 'traffic' as TabType, label: '流量分析', icon: '📊' },
    { id: 'funnel' as TabType, label: '转化漏斗', icon: '🎯' },
    { id: 'keywords' as TabType, label: '关键词追踪', icon: '🔍' },
    { id: 'competitors' as TabType, label: '竞品分析', icon: '🏆' },
    { id: 'reports' as TabType, label: '自动化报告', icon: '📈' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-950 dark:to-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-slate-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            数据分析中心
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            实时监控网站性能、用户行为和增长指标，数据驱动决策
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-900 border-b border-slate-200 dark:border-gray-800 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-1 overflow-x-auto" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-4 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:border-slate-300 dark:hover:border-gray-700'
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'traffic' && <TrafficDashboard />}
        {activeTab === 'funnel' && <ConversionFunnel />}
        {activeTab === 'keywords' && <KeywordTracker />}
        {activeTab === 'competitors' && <CompetitorAnalysis />}
        {activeTab === 'reports' && <AutomatedReports />}
      </div>
    </div>
  );
}
