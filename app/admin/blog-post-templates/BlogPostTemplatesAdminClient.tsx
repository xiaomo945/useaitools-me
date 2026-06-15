'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Copy, FileText } from 'lucide-react';
import Footer from '@/app/components/Footer';

interface BlogPostTemplate {
  id: string;
  name: string;
  type: string;
  description: string | null;
  structure: any[];
  guidelines: any;
  isActive: boolean;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function BlogPostTemplatesAdminClient() {
  const [templates, setTemplates] = useState<BlogPostTemplate[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTemplates = async () => {
    try {
      const res = await fetch('/api/blog-post-templates');
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
  }, []); // eslint-disable-line react-hooks/exhaustive-deps, react-hooks/set-state-in-effect

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这个模板吗？')) return;

    try {
      const res = await fetch(`/api/blog-post-templates/${id}`, {
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

  const handleDuplicate = async (template: BlogPostTemplate) => {
    const newTemplate = {
      name: `${template.name} (副本)`,
      type: template.type,
      description: template.description,
      structure: template.structure,
      guidelines: template.guidelines,
      isActive: false,
      isDefault: false,
    };

    try {
      const res = await fetch('/api/blog-post-templates', {
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

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      review: '评测文章',
      comparison: '对比文章',
      tutorial: '教程文章',
      news: '新闻资讯',
    };
    return labels[type] || type;
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      review: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      comparison: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
      tutorial: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      news: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    };
    return colors[type] || 'bg-slate-100 text-slate-700 dark:bg-gray-800 dark:text-slate-400';
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            博客文章模板管理
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            管理博客文章的标准模板，确保内容质量和一致性
          </p>
        </div>

        <div className="mb-6 flex justify-between items-center">
          <div className="text-sm text-slate-600 dark:text-slate-400">
            共 {templates.length} 个模板
          </div>
          <a
            href="/admin/blog-post-templates/new"
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            创建模板
          </a>
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
            <FileText className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <p className="text-slate-500 dark:text-slate-400 text-lg mb-4">
              暂无博客文章模板
            </p>
            <a
              href="/admin/blog-post-templates/new"
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
            >
              <Plus className="w-4 h-4" />
              创建第一个模板
            </a>
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
                      <span className={`px-2 py-0.5 text-xs font-medium rounded ${getTypeColor(template.type)}`}>
                        {getTypeLabel(template.type)}
                      </span>
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
                      <span>{template.structure.length} 个章节</span>
                      <span>•</span>
                      <span>更新于 {new Date(template.updatedAt).toLocaleDateString('zh-CN')}</span>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {template.structure.slice(0, 5).map((section, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 text-xs bg-slate-100 dark:bg-gray-800 text-slate-700 dark:text-slate-300 rounded"
                        >
                          {section.title}
                        </span>
                      ))}
                      {template.structure.length > 5 && (
                        <span className="px-2 py-1 text-xs text-slate-500 dark:text-slate-400">
                          +{template.structure.length - 5} 更多
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={`/admin/blog-post-templates/${template.id}/edit`}
                      className="p-2 text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                      title="编辑"
                    >
                      <Edit className="w-4 h-4" />
                    </a>
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
