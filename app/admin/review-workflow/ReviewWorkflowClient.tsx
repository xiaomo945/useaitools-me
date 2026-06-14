'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Eye, CheckCircle, Clock, FileText, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import Footer from '@/app/components/Footer';

interface ReviewWorkflow {
  id: string;
  status: 'draft' | 'in-progress' | 'ready' | 'published';
  progress: number; // 0-100
  startedAt: string;
  updatedAt: string;
  publishedAt: string | null;
  blogPost: {
    id: string;
    title: string;
    slug: string;
  };
  tool: {
    id: string;
    name: string;
    slug: string;
    category: string;
    iconUrl: string | null;
  };
  template: {
    id: string;
    name: string;
  } | null;
  author: {
    name: string | null;
    image: string | null;
  };
}

interface Tool {
  id: string;
  name: string;
  slug: string;
  category: string;
  iconUrl: string | null;
}

interface ReviewTemplate {
  id: string;
  name: string;
  description: string | null;
}

export default function ReviewWorkflowClient() {
  const [workflows, setWorkflows] = useState<ReviewWorkflow[]>([]);
  const [tools, setTools] = useState<Tool[]>([]);
  const [templates, setTemplates] = useState<ReviewTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showStartModal, setShowStartModal] = useState(false);
  const [selectedTool, setSelectedTool] = useState<string>('');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');

  const fetchWorkflows = async () => {
    try {
      const res = await fetch('/api/tool-review-workflow');
      if (res.ok) {
        const data = await res.json();
        setWorkflows(data.workflows || []);
      }
    } catch (error) {
      console.error('Failed to fetch workflows:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTools = async () => {
    try {
      const res = await fetch('/api/tools');
      if (res.ok) {
        const data = await res.json();
        setTools(data.tools || []);
      }
    } catch (error) {
      console.error('Failed to fetch tools:', error);
    }
  };

  const fetchTemplates = async () => {
    try {
      const res = await fetch('/api/tool-review-templates');
      if (res.ok) {
        const data = await res.json();
        setTemplates(data.templates || []);
      }
    } catch (error) {
      console.error('Failed to fetch templates:', error);
    }
  };

  useEffect(() => {
    fetchWorkflows();
    fetchTools();
    fetchTemplates();
  }, []);

  const handleStartReview = async () => {
    if (!selectedTool) return;

    try {
      const res = await fetch('/api/tool-review-workflow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toolId: selectedTool,
          templateId: selectedTemplate || undefined,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setWorkflows([data, ...workflows]);
        setShowStartModal(false);
        setSelectedTool('');
        setSelectedTemplate('');
      } else {
        const error = await res.json();
        alert(error.error || '创建评测失败');
      }
    } catch (error) {
      console.error('Failed to start review:', error);
      alert('创建评测失败');
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      draft: { icon: FileText, text: '草稿', color: 'bg-slate-100 text-slate-700 dark:bg-gray-800 dark:text-slate-400' },
      'in-progress': { icon: Clock, text: '进行中', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
      ready: { icon: CheckCircle, text: '待发布', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
      published: { icon: CheckCircle, text: '已发布', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
    };

    const badge = badges[status as keyof typeof badges] || badges.draft;
    const Icon = badge.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${badge.color}`}>
        <Icon className="w-3 h-3" />
        {badge.text}
      </span>
    );
  };

  const getProgressColor = (progress: number) => {
    if (progress < 30) return 'bg-red-500';
    if (progress < 70) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  const stats = {
    total: workflows.length,
    draft: workflows.filter(w => w.status === 'draft').length,
    inProgress: workflows.filter(w => w.status === 'in-progress').length,
    ready: workflows.filter(w => w.status === 'ready').length,
    published: workflows.filter(w => w.status === 'published').length,
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            评测工作流管理
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            管理工具评测的创建、编辑和发布流程
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-900 rounded-xl p-4 shadow-sm">
            <div className="text-2xl font-bold text-slate-900 dark:text-white">{stats.total}</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">总计</div>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-xl p-4 shadow-sm">
            <div className="text-2xl font-bold text-slate-600 dark:text-slate-400">{stats.draft}</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">草稿</div>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-xl p-4 shadow-sm">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.inProgress}</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">进行中</div>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-xl p-4 shadow-sm">
            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{stats.ready}</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">待发布</div>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-xl p-4 shadow-sm">
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{stats.published}</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">已发布</div>
          </div>
        </div>

        {/* Action Button */}
        <div className="mb-6 flex justify-end">
          <button
            onClick={() => setShowStartModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            开始新评测
          </button>
        </div>

        {/* Workflow List */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-900 rounded-xl p-6 animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-200 dark:bg-gray-700 rounded" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-200 dark:bg-gray-700 rounded w-1/3" />
                    <div className="h-3 bg-slate-200 dark:bg-gray-700 rounded w-1/4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : workflows.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-xl">
            <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-500 dark:text-slate-400 text-lg mb-4">
              暂无评测工作流
            </p>
            <button
              onClick={() => setShowStartModal(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
            >
              <Plus className="w-4 h-4" />
              开始第一个评测
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {workflows.map((workflow) => (
              <div
                key={workflow.id}
                className="bg-white dark:bg-gray-900 rounded-xl p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start gap-4">
                  {workflow.tool.iconUrl ? (
                    <img
                      src={workflow.tool.iconUrl}
                      alt={workflow.tool.name}
                      className="w-12 h-12 rounded-lg"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold">
                      {workflow.tool.name.charAt(0)}
                    </div>
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
                          {workflow.blogPost.title}
                        </h3>
                        <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                          <span>{workflow.tool.name}</span>
                          <span>•</span>
                          <span>{workflow.tool.category}</span>
                          {workflow.template && (
                            <>
                              <span>•</span>
                              <span>{workflow.template.name}</span>
                            </>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {getStatusBadge(workflow.status)}
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-slate-600 dark:text-slate-400">完成进度</span>
                        <span className="font-medium text-slate-900 dark:text-white">{workflow.progress}%</span>
                      </div>
                      <div className="h-2 bg-slate-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${getProgressColor(workflow.progress)} transition-all duration-300`}
                          style={{ width: `${workflow.progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-slate-500 dark:text-slate-400">
                        更新于 {new Date(workflow.updatedAt).toLocaleDateString('zh-CN')}
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/review-editor/${workflow.id}`}
                          className="flex items-center gap-1 px-3 py-1.5 text-sm text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                          编辑
                        </Link>
                        {workflow.status === 'published' && (
                          <Link
                            href={`/blog/${workflow.blogPost.slug}`}
                            className="flex items-center gap-1 px-3 py-1.5 text-sm text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                            查看
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Start Review Modal */}
      {showStartModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
              开始新评测
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  选择工具 *
                </label>
                <select
                  value={selectedTool}
                  onChange={(e) => setSelectedTool(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg text-slate-900 dark:text-white"
                >
                  <option value="">请选择工具...</option>
                  {tools.map((tool) => (
                    <option key={tool.id} value={tool.id}>
                      {tool.name} ({tool.category})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  选择模板
                </label>
                <select
                  value={selectedTemplate}
                  onChange={(e) => setSelectedTemplate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg text-slate-900 dark:text-white"
                >
                  <option value="">使用默认模板</option>
                  {templates.map((template) => (
                    <option key={template.id} value={template.id}>
                      {template.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => {
                  setShowStartModal(false);
                  setSelectedTool('');
                  setSelectedTemplate('');
                }}
                className="flex-1 px-4 py-2 bg-slate-100 dark:bg-gray-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-gray-700 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleStartReview}
                disabled={!selectedTool}
                className="flex-1 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                开始评测
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
