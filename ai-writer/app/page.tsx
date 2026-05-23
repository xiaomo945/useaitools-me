'use client';

import { useState } from 'react';
import { 
  PenLine, 
  Sparkles, 
  Copy, 
  RotateCcw, 
  Check, 
  Loader2, 
  FileText, 
  MessageSquare, 
  ScrollText, 
  BookOpen,
  Mail,
  FileEdit,
  Type
} from 'lucide-react';

type WritingTemplate = {
  id: string;
  name: string;
  icon: React.ReactNode;
  prompt: string;
};

const templates: WritingTemplate[] = [
  {
    id: 'blog',
    name: '博客文章',
    icon: <FileText className="w-5 h-5" />,
    prompt: '请写一篇关于以下主题的博客文章，要求内容丰富、结构清晰、语言流畅：\n\n'
  },
  {
    id: 'email',
    name: '商务邮件',
    icon: <Mail className="w-5 h-5" />,
    prompt: '请帮我写一封专业的商务邮件，内容如下：\n\n'
  },
  {
    id: 'social',
    name: '社交媒体',
    icon: <MessageSquare className="w-5 h-5" />,
    prompt: '请为以下主题创作吸引人的社交媒体文案：\n\n'
  },
  {
    id: 'essay',
    name: '文章/论文',
    icon: <ScrollText className="w-5 h-5" />,
    prompt: '请帮我写一篇关于以下主题的文章/论文：\n\n'
  },
  {
    id: 'story',
    name: '故事/小说',
    icon: <BookOpen className="w-5 h-5" />,
    prompt: '请根据以下提示创作一个引人入胜的故事：\n\n'
  },
  {
    id: 'copywriting',
    name: '营销文案',
    icon: <FileEdit className="w-5 h-5" />,
    prompt: '请为以下产品/服务创作有说服力的营销文案：\n\n'
  }
];

export default function Home() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [wordCount, setWordCount] = useState(500);

  const handleTemplateClick = (template: WritingTemplate) => {
    setSelectedTemplate(template.id);
    setInputText(template.prompt);
  };

  const handleGenerate = async () => {
    if (!inputText.trim()) return;

    setIsGenerating(true);
    setOutputText('');

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: inputText, wordCount })
      });

      const data = await response.json();
      
      if (data.success) {
        let currentText = '';
        const words = data.text.split(' ');
        
        for (let i = 0; i < words.length; i++) {
          await new Promise(resolve => setTimeout(resolve, 50));
          currentText += (i > 0 ? ' ' : '') + words[i];
          setOutputText(currentText);
        }
      } else {
        setOutputText('生成失败，请稍后重试。');
      }
    } catch (error) {
      setOutputText('抱歉，发生了错误。请检查您的 API 配置。');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setInputText('');
    setOutputText('');
    setSelectedTemplate(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-2 rounded-xl">
                <PenLine className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  AI Writer
                </h1>
                <p className="text-sm text-slate-500">智能写作助手</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-100">
                <div className="flex items-center space-x-2 mb-4">
                  <Type className="w-5 h-5 text-emerald-600" />
                  <h2 className="text-lg font-semibold text-slate-800">输入您的需求</h2>
                </div>
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="描述您想写什么... 例如：写一篇关于人工智能在教育领域应用的博客文章"
                  className="w-full h-48 p-4 border border-slate-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
              </div>

              <div className="p-6 bg-slate-50 border-b border-slate-100">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center space-x-4">
                    <label className="text-sm font-medium text-slate-700">字数：</label>
                    <input
                      type="range"
                      min="100"
                      max="2000"
                      value={wordCount}
                      onChange={(e) => setWordCount(Number(e.target.value))}
                      className="w-40 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                    />
                    <span className="text-sm font-semibold text-emerald-600 min-w-[60px]">{wordCount} 字</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={handleReset}
                      className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors flex items-center space-x-2"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>重置</span>
                    </button>
                    <button
                      onClick={handleGenerate}
                      disabled={isGenerating || !inputText.trim()}
                      className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-medium rounded-xl hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-emerald-500/20 flex items-center space-x-2"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>生成中...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5" />
                          <span>生成内容</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-emerald-600" />
                  <h2 className="text-lg font-semibold text-slate-800">生成结果</h2>
                </div>
                {outputText && (
                  <button
                    onClick={handleCopy}
                    className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copied ? '已复制' : '复制'}</span>
                  </button>
                )}
              </div>
              <div className="p-6">
                {outputText ? (
                  <div className="prose prose-slate max-w-none">
                    <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{outputText}</p>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Sparkles className="w-8 h-8 text-slate-400" />
                    </div>
                    <p className="text-slate-500">在上方输入内容，点击"生成内容"开始</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-800 mb-4">写作模板</h2>
              <div className="space-y-2">
                {templates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => handleTemplateClick(template)}
                    className={`w-full p-4 rounded-xl border-2 transition-all flex items-center space-x-3 text-left ${
                      selectedTemplate === template.id
                        ? 'border-emerald-500 bg-emerald-50'
                        : 'border-slate-200 hover:border-emerald-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${
                      selectedTemplate === template.id ? 'text-emerald-600' : 'text-slate-500'
                    }`}>
                      {template.icon}
                    </div>
                    <span className={`font-medium ${
                      selectedTemplate === template.id ? 'text-emerald-700' : 'text-slate-700'
                    }`}>
                      {template.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-lg p-6 text-white">
              <h3 className="text-lg font-semibold mb-2">使用提示</h3>
              <ul className="space-y-2 text-sm text-emerald-50">
                <li className="flex items-start space-x-2">
                  <span className="mt-1">•</span>
                  <span>越详细的描述会产生越好的结果</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="mt-1">•</span>
                  <span>可以指定文章的风格和受众</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="mt-1">•</span>
                  <span>生成后可以再次优化内容</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-slate-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-slate-500">
            © 2024 AI Writer - 让写作更简单
          </p>
        </div>
      </footer>
    </div>
  );
}
