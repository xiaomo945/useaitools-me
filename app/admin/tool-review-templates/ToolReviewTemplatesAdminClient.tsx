'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Copy } from 'lucide-react';
import Footer from '@/app/components/Footer';

interface ReviewTemplate {
  id: string;
  name: string;
  description: string | null;
  sections: any[];
  ratingDimensions: any[];
  isActive: boolean;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function ToolReviewTemplatesAdminClient() {
  const [templates, setTemplates] = useState<ReviewTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<ReviewTemplate | null>(null);

  const fetchTemplates = async () => {
    try {
      const res = await fetch('/api/tool-review-templates');
      if (res.ok) {
        const data = await res.json();
        setTemplates(data.templates);
      }
    } catch (error) {
      console.error('Failed to fetch templates:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这个模板吗？')) return;

    try {
      const res = await fetch(`/api/tool-review-templates/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setTemplates(templates.filter(t => t.id !== id));
      } else {
        const data = await res.json();
        alert(data.error || '删除失败');
      }
    } catch (error) {
      console.error('Failed to delete template:', error);
      alert('删除失败');
    }
  };

  const handleDuplicate = async (template: ReviewTemplate) => {
    const newTemplate = {
      name: `${template.name} (副本)`,
      description: template.description,
      sections: template.sections,
      ratingDimensions: template.ratingDimensions,
      isActive: false,
      isDefault: false,
    };

    try {
      const res = await fetch('/api/tool-review-templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTemplate),
      });

      if (res.ok) {
        fetchTemplates();
      }
    } catch (error) {
      console.error('Failed to duplicate template:', error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            评测模板管理
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            管理工具评测的标准模板，确保评测质量一致性
          </p>
        </div>

        <div className="mb-6 flex justify-between items-center">
          <div className="text-sm text-slate-600 dark:text-slate-400">
            共 {templates.length} 个模板
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            创建模板
          </button>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-900 rounded-xl p-6 animate-pulse">
                <div className="space-y-3">
                  <div className="h-6 bg-slate-200 dark:bg-gray-700 rounded w-1/3" />
                  <div className="h-4 bg-slate-200 dark:bg-gray-700 rounded w-2/3" />
                  <div className="h-4 bg-slate-200 dark:bg-gray-700 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : templates.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-xl">
            <p className="text-slate-500 dark:text-slate-400 text-lg mb-4">
              暂无评测模板
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
            >
              <Plus className="w-4 h-4" />
              创建第一个模板
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {templates.map((template) => (
              <div
                key={template.id}
                className="bg-white dark:bg-gray-900 rounded-xl p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                        {template.name}
                      </h3>
                      {template.isDefault && (
                        <span className="px-2 py-0.5 text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 rounded">
                          默认
                        </span>
                      )}
                      {template.isActive ? (
                        <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded">
                          启用
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 text-xs font-medium bg-slate-100 text-slate-700 dark:bg-gray-800 dark:text-slate-400 rounded">
                          禁用
                        </span>
                      )}
                    </div>
                    
                    {template.description && (
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                        {template.description}
                      </p>
                    )}

                    <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                      <span>{template.sections.length} 个章节</span>
                      <span>•</span>
                      <span>{template.ratingDimensions.length} 个评分维度</span>
                      <span>•</span>
                      <span>更新于 {new Date(template.updatedAt).toLocaleDateString('zh-CN')}</span>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {template.sections.slice(0, 5).map((section, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 text-xs bg-slate-100 dark:bg-gray-800 text-slate-700 dark:text-slate-300 rounded"
                        >
                          {section.title}
                        </span>
                      ))}
                      {template.sections.length > 5 && (
                        <span className="px-2 py-1 text-xs text-slate-500 dark:text-slate-400">
                          +{template.sections.length - 5} 更多
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingTemplate(template)}
                      className="p-2 text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                      title="编辑"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDuplicate(template)}
                      className="p-2 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      title="复制"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(template.id)}
                      className="p-2 text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                      title="删除"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
