'use client';

import { useState, useEffect } from 'react';
import { Save, X, Plus, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Section {
  id: string;
  title: string;
  type: string;
  required: boolean;
  description?: string;
}

interface Guidelines {
  wordCount: { min: number; max: number };
  seoRequirements?: string[];
  qualityChecks?: string[];
}

interface Template {
  id?: string;
  name: string;
  type: string;
  description: string;
  structure: Section[];
  guidelines: Guidelines;
  isActive: boolean;
  isDefault: boolean;
}

export default function BlogPostTemplateEditor({ templateId }: { templateId?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [template, setTemplate] = useState<Template>({
    name: '',
    type: 'review',
    description: '',
    structure: [
      { id: 'intro', title: '引言', type: 'text', required: true, description: '吸引读者注意力，介绍主题' },
      { id: 'overview', title: '工具概述', type: 'text', required: true, description: '简要介绍工具的核心功能' },
      { id: 'features', title: '核心功能', type: 'list', required: true, description: '详细列出主要功能' },
      { id: 'pros-cons', title: '优缺点', type: 'pros-cons', required: true, description: '客观分析优缺点' },
      { id: 'pricing', title: '定价分析', type: 'text', required: true, description: '分析定价方案' },
      { id: 'verdict', title: '总结评价', type: 'text', required: true, description: '给出最终建议' },
    ],
    guidelines: {
      wordCount: { min: 800, max: 1500 },
      seoRequirements: ['包含核心关键词', '使用H2/H3标签', '添加内部链接'],
      qualityChecks: ['内容原创', '事实准确', '语言流畅'],
    },
    isActive: true,
    isDefault: false,
  });

  const fetchTemplate = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/blog-post-templates/${templateId}`);
      if (res.ok) {
        const data = await res.json();
        setTemplate(data);
      }
    } catch (error) {
      console.error('Failed to fetch template:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (templateId) {
      fetchTemplate();
    }
  }, [templateId]); // eslint-disable-line react-hooks/exhaustive-deps, react-hooks/set-state-in-effect

  const handleSave = async () => {
    setSaving(true);
    try {
      const url = templateId
        ? `/api/blog-post-templates/${templateId}`
        : '/api/blog-post-templates';
      const method = templateId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(template),
      });

      if (res.ok) {
        router.push('/admin/blog-post-templates');
      } else {
        const data = await res.json();
        alert(data.error || '保存失败');
      }
    } catch (error) {
      console.error('Failed to save template:', error);
      alert('保存失败');
    } finally {
      setSaving(false);
    }
  };

  const addSection = () => {
    setTemplate({
      ...template,
      structure: [
        ...template.structure,
        { id: `section-${Date.now()}`, title: '新章节', type: 'text', required: false },
      ],
    });
  };

  const updateSection = (index: number, field: keyof Section, value: any) => {
    const newStructure = [...template.structure];
    newStructure[index] = { ...newStructure[index], [field]: value };
    setTemplate({ ...template, structure: newStructure });
  };

  const removeSection = (index: number) => {
    setTemplate({
      ...template,
      structure: template.structure.filter((_, i) => i !== index),
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-slate-600 dark:text-slate-400">加载中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              {templateId ? '编辑模板' : '创建模板'}
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              定义博客文章的结构和质量标准
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => router.push('/admin/blog-post-templates')}
              className="flex items-center gap-2 px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
              取消
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 disabled:opacity-50 transition-colors"
            >
              <Save className="w-4 h-4" />
              {saving ? '保存中...' : '保存'}
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {/* 基本信息 */}
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
              基本信息
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  模板名称 *
                </label>
                <input
                  type="text"
                  value={template.name}
                  onChange={(e) => setTemplate({ ...template, name: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="例如：标准评测模板"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  文章类型 *
                </label>
                <select
                  value={template.type}
                  onChange={(e) => setTemplate({ ...template, type: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="review">评测文章</option>
                  <option value="comparison">对比文章</option>
                  <option value="tutorial">教程文章</option>
                  <option value="news">新闻资讯</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  模板描述
                </label>
                <textarea
                  value={template.description}
                  onChange={(e) => setTemplate({ ...template, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="描述这个模板的用途和特点"
                />
              </div>
              <div className="flex gap-6">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={template.isActive}
                    onChange={(e) => setTemplate({ ...template, isActive: e.target.checked })}
                    className="w-4 h-4 text-emerald-500 border-slate-300 rounded focus:ring-emerald-500"
                  />
                  <span className="text-sm text-slate-700 dark:text-slate-300">启用</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={template.isDefault}
                    onChange={(e) => setTemplate({ ...template, isDefault: e.target.checked })}
                    className="w-4 h-4 text-emerald-500 border-slate-300 rounded focus:ring-emerald-500"
                  />
                  <span className="text-sm text-slate-700 dark:text-slate-300">设为默认模板</span>
                </label>
              </div>
            </div>
          </div>

          {/* 文章结构 */}
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                文章结构
              </h2>
              <button
                onClick={addSection}
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                添加章节
              </button>
            </div>
            <div className="space-y-3">
              {template.structure.map((section, index) => (
                <div
                  key={section.id}
                  className="flex items-start gap-3 p-4 border border-slate-200 dark:border-gray-700 rounded-lg"
                >
                  <div className="flex-1 space-y-3">
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={section.title}
                        onChange={(e) => updateSection(index, 'title', e.target.value)}
                        className="flex-1 px-3 py-2 border border-slate-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        placeholder="章节标题"
                      />
                      <select
                        value={section.type}
                        onChange={(e) => updateSection(index, 'type', e.target.value)}
                        className="px-3 py-2 border border-slate-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      >
                        <option value="text">文本</option>
                        <option value="list">列表</option>
                        <option value="pros-cons">优缺点</option>
                        <option value="table">表格</option>
                      </select>
                    </div>
                    <input
                      type="text"
                      value={section.description || ''}
                      onChange={(e) => updateSection(index, 'description', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="章节说明（可选）"
                    />
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={section.required}
                        onChange={(e) => updateSection(index, 'required', e.target.checked)}
                        className="w-4 h-4 text-emerald-500 border-slate-300 rounded focus:ring-emerald-500"
                      />
                      <span className="text-sm text-slate-700 dark:text-slate-300">必填</span>
                    </label>
                  </div>
                  <button
                    onClick={() => removeSection(index)}
                    className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 质量标准 */}
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
              质量标准
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  字数要求
                </label>
                <div className="flex gap-3">
                  <input
                    type="number"
                    value={template.guidelines.wordCount.min}
                    onChange={(e) => setTemplate({
                      ...template,
                      guidelines: {
                        ...template.guidelines,
                        wordCount: {
                          min: parseInt(e.target.value) || 0,
                          max: template.guidelines.wordCount?.max ?? 0,
                        },
                      },
                    })}
                    className="flex-1 px-3 py-2 border border-slate-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="最少字数"
                  />
                  <input
                    type="number"
                    value={template.guidelines.wordCount.max}
                    onChange={(e) => setTemplate({
                      ...template,
                      guidelines: {
                        ...template.guidelines,
                        wordCount: {
                          min: template.guidelines.wordCount?.min ?? 0,
                          max: parseInt(e.target.value) || 0,
                        },
                      },
                    })}
                    className="flex-1 px-3 py-2 border border-slate-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="最多字数"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
