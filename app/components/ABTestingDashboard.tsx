'use client';

import { useState, useEffect } from 'react';

interface Experiment {
  id: string;
  name: string;
  description: string;
  variants: string[];
  status: 'running' | 'paused' | 'completed';
  startDate: string;
  endDate?: string;
  results?: {
    variant: string;
    impressions: number;
    conversions: number;
    conversionRate: number;
  }[];
}

export default function ABTestingDashboard() {
  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedExperiment, setSelectedExperiment] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formVariants, setFormVariants] = useState('');

  useEffect(() => {
    fetchExperiments();
  }, []);

  const fetchExperiments = async () => {
    try {
      const response = await fetch('/api/ab-test');
      const data = await response.json();
      
      // Mock experiments for now
      const mockExperiments: Experiment[] = [
        {
          id: 'exp-001',
          name: 'CTA Button Color Test',
          description: 'Compare conversion rates of green vs. blue CTA buttons',
          variants: ['green', 'blue'],
          status: 'running',
          startDate: '2026-06-01',
          results: data.results || [],
        },
        {
          id: 'exp-002',
          name: 'Tool Card Layout Test',
          description: 'Compare user engagement between grid and list layouts',
          variants: ['grid', 'list'],
          status: 'running',
          startDate: '2026-06-10',
          results: [],
        },
      ];

      setExperiments(mockExperiments);
    } catch (error) {
      console.error('Failed to fetch experiments:', error);
    } finally {
      setLoading(false);
    }
  };

  const recordVariant = async (experimentId: string, variant: string) => {
    try {
      const sessionId = localStorage.getItem('sessionId') || `session-${Date.now()}`;
      
      await fetch('/api/ab-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: experimentId,
          variant,
          sessionId,
          metadata: { timestamp: new Date().toISOString() },
        }),
      });
    } catch (error) {
      console.error('Failed to record variant:', error);
    }
  };

  const createExperiment = () => {
    const name = formName.trim();
    if (!name) return;

    const variants = formVariants
      .split(',')
      .map((v) => v.trim())
      .filter(Boolean);

    const experiment: Experiment = {
      id: `exp-${Date.now()}`,
      name,
      description: formDescription.trim() || 'No description provided',
      variants: variants.length > 0 ? variants : ['control', 'variant-b'],
      status: 'running',
      startDate: new Date().toISOString().split('T')[0],
      results: [],
    };

    setExperiments((prev) => [experiment, ...prev]);
    setFormName('');
    setFormDescription('');
    setFormVariants('');
    setShowCreateForm(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-950 dark:to-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
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
            A/B Testing Dashboard
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Manage and monitor every growth experiment to make data-driven optimization decisions
          </p>
        </div>

        {/* Experiments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {experiments.map((experiment) => (
            <div
              key={experiment.id}
              className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-slate-200 dark:border-gray-800 p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-1">
                    {experiment.name}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {experiment.description}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    experiment.status === 'running'
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                      : experiment.status === 'paused'
                      ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                      : 'bg-slate-100 text-slate-700 dark:bg-gray-800 dark:text-slate-400'
                  }`}
                >
                  {experiment.status === 'running' ? 'Running' : experiment.status === 'paused' ? 'Paused' : 'Completed'}
                </span>
              </div>

              <div className="mb-4">
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                  Start date: {new Date(experiment.startDate).toLocaleDateString('en-US')}
                </p>
                <div className="flex gap-2">
                  {experiment.variants.map((variant) => (
                    <button
                      key={variant}
                      onClick={() => recordVariant(experiment.id, variant)}
                      className="px-3 py-1 bg-slate-100 dark:bg-gray-800 text-slate-700 dark:text-slate-300 rounded-lg text-sm hover:bg-slate-200 dark:hover:bg-gray-700 transition-colors"
                    >
                      {variant}
                    </button>
                  ))}
                </div>
              </div>

              {experiment.results && experiment.results.length > 0 && (
                <div className="border-t border-slate-200 dark:border-gray-800 pt-4">
                  <h4 className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-3">
                    Experiment results
                  </h4>
                  <div className="space-y-2">
                    {experiment.results.map((result) => (
                      <div key={result.variant} className="flex items-center justify-between">
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          {result.variant}
                        </span>
                        <div className="flex items-center gap-4">
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            {result.impressions} impressions
                          </span>
                          <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                            {result.conversionRate.toFixed(2)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Create New Experiment */}
        <div className="mt-8">
          <button
            type="button"
            onClick={() => setShowCreateForm((prev) => !prev)}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition-colors"
          >
            {showCreateForm ? 'Cancel' : 'Create new experiment'}
          </button>

          {showCreateForm && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                createExperiment();
              }}
              className="mt-4 bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-slate-200 dark:border-gray-800 p-6 space-y-4"
            >
              <div>
                <label htmlFor="exp-name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Experiment name
                </label>
                <input
                  id="exp-name"
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Hero headline test"
                  required
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                />
              </div>

              <div>
                <label htmlFor="exp-desc" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Description
                </label>
                <input
                  id="exp-desc"
                  type="text"
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="What are you testing?"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                />
              </div>

              <div>
                <label htmlFor="exp-variants" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Variants (comma separated)
                </label>
                <input
                  id="exp-variants"
                  type="text"
                  value={formVariants}
                  onChange={(e) => setFormVariants(e.target.value)}
                  placeholder="control, variant-b"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                />
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Leave empty to use the default &quot;control, variant-b&quot;.
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 dark:hover:bg-slate-600 text-white rounded-lg font-medium transition-colors"
              >
                Start experiment
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
