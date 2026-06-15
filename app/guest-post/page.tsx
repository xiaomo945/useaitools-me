import { Metadata } from 'next';
import Link from 'next/link';
import { PenTool, FileText, CheckCircle, ArrowRight, Users, TrendingUp, Globe } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Guest Post 投稿 - Use AI Tools',
  description: '向 Use AI Tools 投稿，分享你的 AI 工具评测、使用经验和行业见解。与数万 AI 爱好者交流。',
  keywords: ['投稿', 'Guest Post', 'AI 工具评测', '内容合作', '博主合作'],
};

const benefits = [
  {
    icon: Users,
    title: '触达精准受众',
    description: '我们的读者都是 AI 工具的活跃用户，你的内容将直接触达目标群体。'
  },
  {
    icon: TrendingUp,
    title: '提升品牌权威',
    description: '在专业平台发布内容，建立你在 AI 领域的专业形象和影响力。'
  },
  {
    icon: Globe,
    title: '获取高质量外链',
    description: '所有投稿都会包含你的个人简介和网站链接，提升 SEO 权重。'
  }
];

const guidelines = [
  {
    title: '内容主题',
    items: [
      'AI 工具深度评测（使用 2 周以上）',
      '工具对比分析（至少对比 3 个工具）',
      'AI 工具使用教程和技巧',
      '行业趋势分析和洞察',
      '实际案例和成功经验'
    ]
  },
  {
    title: '内容要求',
    items: [
      '字数：1500-3000 字',
      '原创内容，未在其他平台发布',
      '包含真实使用截图或数据',
      '客观公正，不偏袒特定产品',
      '提供实用价值和可操作建议'
    ]
  },
  {
    title: '格式规范',
    items: [
      '使用 Markdown 格式',
      '包含清晰的标题层级（H2/H3）',
      '添加相关图片（至少 3 张）',
      '提供工具官方链接',
      '包含作者简介和联系方式'
    ]
  }
];

const topics = [
  'Best AI Writing Tools for Content Creators in 2026',
  'How to Use AI Image Generators Effectively',
  'AI Video Editing Tools: A Complete Guide',
  'Productivity Boost: AI Tools for Remote Workers',
  'AI Code Assistants: Which One is Right for You?',
  'The Future of AI Audio Tools for Podcasters'
];

export default function GuestPostPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 dark:from-gray-950 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 rounded-full text-sm font-semibold mb-6">
            <PenTool className="w-4 h-4" />
            内容合作
          </div>
          <h1 className="text-5xl font-bold text-slate-900 dark:text-white mb-6">
            Guest Post 投稿
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            分享你的 AI 工具使用经验，与数万 AI 爱好者交流，建立你在 AI 领域的专业影响力
          </p>
        </section>

        {/* Benefits */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-12">
            为什么选择我们？
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div key={index} className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg border border-slate-200 dark:border-gray-800 hover:shadow-xl transition-shadow">
                  <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-500/20 rounded-xl flex items-center justify-center mb-6">
                    <Icon className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300">
                    {benefit.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Guidelines */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-12">
            投稿指南
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {guidelines.map((section, index) => (
              <div key={index} className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg border border-slate-200 dark:border-gray-800">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-emerald-600" />
                  {section.title}
                </h3>
                <ul className="space-y-3">
                  {section.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-slate-600 dark:text-slate-300">
                      <span className="text-emerald-600 mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Suggested Topics */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-12">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              推荐选题
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {topics.map((topic, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-colors">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-emerald-100 flex-shrink-0" />
                    <span className="text-white font-medium">{topic}</span>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-emerald-100 text-center mt-6 text-sm">
              当然，你也可以选择其他与 AI 工具相关的主题
            </p>
          </div>
        </section>

        {/* Submission Process */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-12">
            投稿流程
          </h2>
          <div className="max-w-3xl mx-auto">
            <div className="space-y-6">
              {[
                { step: '1', title: '准备内容', desc: '按照投稿指南准备你的文章，确保内容原创、有价值。' },
                { step: '2', title: '发送邮件', desc: '将文章发送到 guest@useaitools.me，附上作者简介和联系方式。' },
                { step: '3', title: '审核反馈', desc: '我们会在 3 个工作日内审核并回复，可能需要修改建议。' },
                { step: '4', title: '发布上线', desc: '审核通过后，文章将在 1-2 天内发布，并通知你。' }
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                    {item.step}
                  </div>
                  <div className="flex-1 bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-gray-800">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                      {item.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-slate-200 dark:border-gray-800 p-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              准备好投稿了吗？
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 mb-8">
              将你的文章发送到我们的邮箱，开始你的内容创作之旅
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a
                href="mailto:guest@useaitools.me?subject=Guest Post Submission"
                className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 inline-flex items-center gap-2"
              >
                <PenTool className="w-5 h-5" />
                发送邮件投稿
              </a>
              <Link
                href="/blog"
                className="px-8 py-4 bg-white dark:bg-gray-800 hover:bg-slate-50 dark:hover:bg-gray-700 text-slate-900 dark:text-white font-semibold rounded-xl border-2 border-slate-200 dark:border-gray-700 transition-all duration-300 transform hover:scale-105 inline-flex items-center gap-2"
              >
                查看博客示例
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-6">
              我们期待看到你的精彩内容！
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
