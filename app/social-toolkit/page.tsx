import { Metadata } from 'next';
import Link from 'next/link';
import { Share2, MessageSquare, BookOpen, CheckCircle, ArrowRight, Zap, Target, TrendingUp } from 'lucide-react';

export const metadata: Metadata = {
  title: '社交媒体推广工具包 - Use AI Tools',
  description: '一键生成 Twitter、Reddit、Dev.to 等平台的推广内容模板，快速分享你喜欢的 AI 工具。',
  keywords: ['社交媒体推广', 'AI 工具分享', 'Twitter 推广', 'Reddit 发帖', '内容模板'],
};

const platforms = [
  {
    name: 'Twitter / X',
    icon: MessageSquare,
    color: 'text-sky-500',
    bg: 'bg-sky-50 dark:bg-sky-500/10',
    limit: '280 字符',
    templates: [
      {
        title: '工具推荐',
        template: `Just discovered [工具名] — it's [一句话描述].\n\n[具体数据/成果]\n\nTry it → [链接]\n\n#AITools #BuildInPublic`,
      },
      {
        title: '对比分享',
        template: `I've tested [数量] AI [类型] tools.\n\nHere's my ranking:\n\n1. [工具A] — [原因]\n2. [工具B] — [原因]\n3. [工具C] — [原因]\n\nFull comparison → [链接]`,
      },
      {
        title: '成果展示',
        template: `[时间] ago I started using AI tools for [任务].\n\nBefore: [旧方式的问题]\nAfter: [新方式的成果]\n\nThe tool that changed everything: [工具名] → [链接]`,
      },
    ],
  },
  {
    name: 'Reddit',
    icon: MessageSquare,
    color: 'text-orange-500',
    bg: 'bg-orange-50 dark:bg-orange-500/10',
    limit: '无字符限制',
    templates: [
      {
        title: 'Build in Public',
        template: `## Title: I built [什么] from [特别的环境] — [具体数据/成果]\n\nHey r/SideProject!\n\nI wanted to share what I've been working on...\n\n**What it does:**\n- [功能1]\n- [功能2]\n- [功能3]\n\n**Tech stack:** [技术栈]\n\n**Current stats:**\n- [数据1]\n- [数据2]\n\nWould love your feedback! Link in comments.`,
      },
      {
        title: '工具推荐帖',
        template: `## Title: After testing [数量] AI [类型] tools, here are my top picks\n\nI've spent [时间] testing various AI tools for [用途]. Here's what I found:\n\n**Best for [场景A]:** [工具名]\n- Pros: [优点]\n- Cons: [缺点]\n- Price: [价格]\n\n**Best for [场景B]:** [工具名]\n- Pros: [优点]\n- Cons: [缺点]\n- Price: [价格]\n\nFull breakdown: [链接]\n\nHappy to answer any questions!`,
      },
    ],
  },
  {
    name: 'Dev.to',
    icon: BookOpen,
    color: 'text-indigo-500',
    bg: 'bg-indigo-50 dark:bg-indigo-500/10',
    limit: '无字符限制',
    templates: [
      {
        title: '技术分享文章',
        template: `# [数字] AI [类型] Tools That [解决什么痛点]\n\n## Introduction\n[建立共鸣：描述读者可能遇到的问题]\n\n## Tool 1: [工具名]\n**What it does:** [一句话]\n**Best for:** [适用场景]\n**Price:** [价格]\n[详细评测]\n\n## Tool 2: [工具名]\n[同上结构]\n\n## Comparison Table\n| Tool | Best For | Price | Rating |\n|------|----------|-------|--------|\n| [A]  | [场景]  | [价格] | [评分] |\n\n## Final Verdict\n[根据不同需求给出建议]\n\n---\n*What AI tools are you using? Let me know in the comments!*`,
      },
      {
        title: '建站经验分享',
        template: `# How I Built [项目名] with [技术栈] in [时间]\n\n## Why I Built This\n[动机和背景]\n\n## The Tech Stack\n- **Frontend:** [技术]\n- **Backend:** [技术]\n- **Hosting:** [技术]\n\n## Key Challenges\n### Challenge 1: [问题]\n[解决方案]\n\n### Challenge 2: [问题]\n[解决方案]\n\n## What I Learned\n1. [经验1]\n2. [经验2]\n3. [经验3]\n\n## Results\n- [数据1]\n- [数据2]\n\nCheck it out: [链接]\n\n*Feedback welcome!*`,
      },
    ],
  },
];

const tips = [
  {
    icon: Target,
    title: '选择合适的时间发布',
    description: 'Twitter 最佳时间：美东 9-10 AM。Reddit：工作日早上。Dev.to：周二/周四上午。',
  },
  {
    icon: Zap,
    title: '内容要真实有价值',
    description: '分享真实使用体验，提供具体数据和截图。避免过度营销，社区最看重真诚。',
  },
  {
    icon: TrendingUp,
    title: '持续互动建立信任',
    description: '回复每一条评论，参与社区讨论。不要发完就走，持续互动才能建立影响力。',
  },
];

export default function SocialToolkitPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 dark:from-gray-950 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 rounded-full text-sm font-semibold mb-6">
            <Share2 className="w-4 h-4" />
            推广工具包
          </div>
          <h1 className="text-5xl font-bold text-slate-900 dark:text-white mb-6">
            社交媒体推广工具包
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            一键复制各平台推广模板，快速分享你喜欢的 AI 工具，帮助更多人发现好用的工具
          </p>
        </section>

        {/* Tips Section */}
        <section className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tips.map((tip) => {
              const Icon = tip.icon;
              return (
                <div
                  key={tip.title}
                  className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm"
                >
                  <Icon className="w-8 h-8 text-emerald-600 mb-4" />
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                    {tip.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">
                    {tip.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Platform Templates */}
        <section className="space-y-12">
          {platforms.map((platform) => {
            const Icon = platform.icon;
            return (
              <div key={platform.name}>
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-10 h-10 rounded-xl ${platform.bg} flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${platform.color}`} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                      {platform.name}
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      字符限制：{platform.limit}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {platform.templates.map((tpl) => (
                    <div
                      key={tpl.title}
                      className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                          {tpl.title}
                        </h3>
                        <Link
                          href="/"
                          className="inline-flex items-center gap-1 text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                        >
                          选择工具 <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                      <pre className="bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl p-4 text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap font-mono overflow-x-auto">
                        {tpl.template}
                      </pre>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </section>

        {/* CTA Section */}
        <section className="mt-16 text-center">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">
              开始推广你喜欢的 AI 工具
            </h2>
            <p className="text-lg text-emerald-100 mb-8 max-w-2xl mx-auto">
              选择一款工具，复制模板，分享到社交媒体。帮助更多人发现好用的 AI 工具
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-emerald-600 rounded-xl font-semibold hover:bg-emerald-50 transition-colors"
              >
                浏览 AI 工具 <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-700 text-white rounded-xl font-semibold hover:bg-emerald-800 transition-colors"
              >
                阅读博客文章
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
