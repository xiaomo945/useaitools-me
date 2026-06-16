'use client';

import { useState, useEffect } from 'react';
import { Save, X, Plus, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Section {
  id: string;
  title: string;
  type: string;
  required: boolean;
}

interface RatingDimension {
  id: string;
  name: string;
  weight: number;
}

interface Template {
  id?: string;
  name: string;
  description: string;
  sections: Section[];
  ratingDimensions: RatingDimension[];
  isActive: boolean;
  isDefault: boolean;
}

export default function TemplateEditor({ templateId }: { templateId?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [template, setTemplate] = useState<Template>({
    name: '',
    description: '',
    sections: [
      { id: 'overview', title: '工具概述', type: 'text', required: true },
      { id: 'features', title: '核心功能', type: 'list', required: true },
      { id: 'pricing', title: '定价分析', type: 'text', required: true },
      { id: 'pros-cons', title: '优缺点', type: 'pros-cons', required: true },
      { id: 'verdict', title: '总结评价', type: 'text', required: true },
    ],
    ratingDimensions: [
      { id: 'ease-of-use', name: '易用性', weight: 1.0 },
      { id: 'features', name: '功能丰富度', weight: 1.0 },
      { id: 'value', name: '性价比', weight: 0.8 },
      { id: 'support', name: '客户支持', weight: 0.6 },
    ],
    isActive: true,
    isDefault: false,
  });

  const fetchTemplate = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/tool-review-templates/${templateId}`);
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
  }, [templateId]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSave = async () => {
    setSaving(true);
    try {
      const url = templateId
        ? `/api/tool-review-templates/${templateId}`
        : '/api/tool-review-templates';
      const method = templateId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(template),
      });

      if (res.ok) {
        router.push('/admin/tool-review-templates');
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
      sections: [
        ...template.sections,
        { id: `section-${Date.now()}`, title: '新章节', type: 'text', required: false },
      ],
    });
  };

  const updateSection = (index: number, field: keyof Section, value: any) => {
    const newSections = [...template.sections];
    newSections[index] = { ...newSections[index], [field]: value };
    setTemplate({ ...template, sections: newSections });
  };

  const removeSection = (index: number) => {
    setTemplate({
      ...template,
      sections: template.sections.filter((_, i) => i !== index),
    });
  };

  const addDimension = () => {
    setTemplate({
      ...template,
      ratingDimensions: [
        ...template.ratingDimensions,
        { id: `dimension-${Date.now()}`, name: '新维度', weight: 1.0 },
      ],
    });
  };

  const updateDimension = (index: number, field: keyof RatingDimension, value: any) => {
    const newDimensions = [...template.ratingDimensions];
    newDimensions[index] = { ...newDimensions[index], [field]: value };
    setTemplate({ ...template, ratingDimensions: newDimensions });
  };

  const removeDimension = (index: number) => {
    setTemplate({
      ...template,
      ratingDimensions: template.ratingDimensions.filter((_, i) => i !== index),
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
              定义评测模板的结构和评分维度
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => router.push('/admin/tool-review-templates')}
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

          {/* 评测章节 */}
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                评测章节
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
              {template.sections.map((section, index) => (
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

          {/* 评分维度 */}
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                评分维度
              </h2>
              <button
                onClick={addDimension}
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                添加维度
              </button>
            </div>
            <div className="space-y-3">
              {template.ratingDimensions.map((dimension, index) => (
                <div
                  key={dimension.id}
                  className="flex items-center gap-3 p-4 border border-slate-200 dark:border-gray-700 rounded-lg"
                >
                  <input
                    type="text"
                    value={dimension.name}
                    onChange={(e) => updateDimension(index, 'name', e.target.value)}
                    className="flex-1 px-3 py-2 border border-slate-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="维度名称"
                  />
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-slate-700 dark:text-slate-300">权重:</label>
                    <input
                      type="number"
                      value={dimension.weight}
                      onChange={(e) => updateDimension(index, 'weight', parseFloat(e.target.value))}
                      step="0.1"
                      min="0"
                      max="1"
                      className="w-20 px-3 py-2 border border-slate-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>
                  <button
                    onClick={() => removeDimension(index)}
                    className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
