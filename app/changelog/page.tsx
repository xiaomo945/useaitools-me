import { Metadata } from 'next';
import Link from 'next/link';
import { Calendar, Tag, Zap, Globe, Shield, BarChart3, CreditCard, Smartphone, Languages } from 'lucide-react';

export const metadata: Metadata = {
  title: '更新日志 - Use AI Tools',
  description: '查看 Use AI Tools 的最新更新和改进记录。我们持续优化产品，为用户提供更好的 AI 工具导航体验。',
  keywords: ['更新日志', '产品更新', '新功能', '版本记录'],
};

const changelogData = [
  {
    version: '2.5.0',
    date: '2026-06-15',
    highlights: ['Phase 6 规模化与变现'],
    icon: Zap,
    color: 'emerald',
    changes: [
      { type: 'feature', text: '联盟链接优化系统 — 智能转化率提升' },
      { type: 'feature', text: '赞助位销售系统 — 商家自助购买赞助位' },
      { type: 'feature', text: '广告位管理系统 — 完整的广告位创建和管理' },
      { type: 'feature', text: '公开 API 接口 — 供其他网站使用的 RESTful API' },
      { type: 'feature', text: '数据服务 — 工具数据分析、趋势追踪' },
      { type: 'feature', text: '付费会员系统 — 免费版/专业版/企业版' },
      { type: 'feature', text: '国际化支持 — 中英文双语切换' },
      { type: 'feature', text: '移动端 PWA — 离线访问、Service Worker' },
      { type: 'feature', text: '关于我们页面 — 品牌故事和使命' },
      { type: 'feature', text: '媒体资源页面 — Logo 下载、品牌指南' },
    ]
  },
  {
    version: '2.0.0',
    date: '2026-06-14',
    highlights: ['Phase 4 & 5 完成'],
    icon: BarChart3,
    color: 'blue',
    changes: [
      { type: 'feature', text: '个性化推荐系统 — 基于用户行为的智能推荐' },
      { type: 'feature', text: '智能搜索 — 语义搜索、自动补全' },
      { type: 'feature', text: '工具对比增强 — 多维度对比和决策矩阵' },
      { type: 'feature', text: '用户画像系统 — 行为分析和偏好追踪' },
      { type: 'feature', text: '社区功能 — 用户讨论和互动' },
      { type: 'feature', text: '流量分析系统 — Plausible + Microsoft Clarity' },
      { type: 'feature', text: 'A/B 测试系统 — 数据驱动的增长实验' },
      { type: 'feature', text: '竞品分析系统 — 自动追踪竞争对手' },
      { type: 'feature', text: '数据可视化仪表板 — 实时监控关键指标' },
    ]
  },
  {
    version: '1.5.0',
    date: '2026-06-13',
    highlights: ['Phase 3 SEO 优化'],
    icon: Globe,
    color: 'purple',
    changes: [
      { type: 'feature', text: '博客内容矩阵 — 766+ 篇 SEO 文章' },
      { type: 'feature', text: 'Sitemap 优化 — 自动生成完整站点地图' },
      { type: 'feature', text: '结构化数据 — Schema.org JSON-LD 标记' },
      { type: 'feature', text: 'RSS 订阅 — 支持内容聚合' },
      { type: 'feature', text: '邮件订阅系统 — Newsletter 功能' },
      { type: 'feature', text: '反向链接建设 — 提交到 20+ 个导航站' },
    ]
  },
  {
    version: '1.0.0',
    date: '2026-06-12',
    highlights: ['Phase 1 & 2 完成'],
    icon: Shield,
    color: 'teal',
    changes: [
      { type: 'feature', text: '数据库基础设施 — Prisma + SQLite' },
      { type: 'feature', text: '用户认证系统 — Auth.js v5 (GitHub/Google 登录)' },
      { type: 'feature', text: '工具数据迁移 — 1361 个工具从 JSON 迁移到数据库' },
      { type: 'feature', text: '用户评价系统 — 真实持久化评价' },
      { type: 'feature', text: '收藏功能 — 跨设备同步' },
      { type: 'feature', text: '工具提交页面 — 支持审核流程' },
      { type: 'feature', text: '后台管理系统 — 工具管理和审核' },
      { type: 'feature', text: '50+ 篇深度评测文章' },
      { type: 'feature', text: '30+ 篇对比文章' },
      { type: 'feature', text: '20+ 篇使用教程' },
    ]
  },
];

const colorMap: Record<string, { dot: string; icon: string; header: string }> = {
  emerald: {
    dot: 'bg-emerald-100 dark:bg-emerald-500/20',
    icon: 'text-emerald-600 dark:text-emerald-400',
    header: 'bg-gradient-to-r from-emerald-500 to-emerald-600',
  },
  blue: {
    dot: 'bg-blue-100 dark:bg-blue-500/20',
    icon: 'text-blue-600 dark:text-blue-400',
    header: 'bg-gradient-to-r from-blue-500 to-blue-600',
  },
  purple: {
    dot: 'bg-purple-100 dark:bg-purple-500/20',
    icon: 'text-purple-600 dark:text-purple-400',
    header: 'bg-gradient-to-r from-purple-500 to-purple-600',
  },
  teal: {
    dot: 'bg-teal-100 dark:bg-teal-500/20',
    icon: 'text-teal-600 dark:text-teal-400',
    header: 'bg-gradient-to-r from-teal-500 to-teal-600',
  },
};

const typeConfig: Record<string, { label: string; className: string }> = {
  feature: { label: '新功能', className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300' },
  improvement: { label: '改进', className: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300' },
  fix: { label: '修复', className: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300' },
};

export default function ChangelogPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 dark:from-gray-950 dark:to-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero */}
        <section className="text-center mb-16">
          <h1 className="text-5xl font-bold text-slate-900 dark:text-white mb-6">
            更新日志
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            记录 Use AI Tools 的每一次进步。我们持续迭代，让产品越来越好。
          </p>
        </section>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-slate-200 dark:bg-gray-800 hidden sm:block" />

          <div className="space-y-12">
            {changelogData.map((release) => {
              const Icon = release.icon;
              return (
                <div key={release.version} className="relative sm:pl-20">
                  {/* Timeline dot */}
                  <div className={`absolute left-4 top-0 w-8 h-8 rounded-full flex items-center justify-center hidden sm:flex ${colorMap[release.color].dot}`}>
                    <Icon className={`w-4 h-4 ${colorMap[release.color].icon}`} />
                  </div>

                  {/* Card */}
                  <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-slate-200 dark:border-gray-800 overflow-hidden">
                    {/* Header */}
                    <div className={`${colorMap[release.color].header} px-6 py-4`}>
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl font-bold text-white">
                            v{release.version}
                          </span>
                          {release.highlights.map((h) => (
                            <span key={h} className="px-3 py-1 bg-white/20 text-white text-sm rounded-full">
                              {h}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center gap-2 text-white/80 text-sm">
                          <Calendar className="w-4 h-4" />
                          {release.date}
                        </div>
                      </div>
                    </div>

                    {/* Changes */}
                    <div className="p-6">
                      <ul className="space-y-3">
                        {release.changes.map((change, i) => {
                          const config = typeConfig[change.type] || typeConfig.feature;
                          return (
                            <li key={i} className="flex items-start gap-3">
                              <span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-md flex-shrink-0 mt-0.5 ${config.className}`}>
                                {config.label}
                              </span>
                              <span className="text-slate-700 dark:text-slate-300">
                                {change.text}
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <section className="mt-16 text-center">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-slate-200 dark:border-gray-800 p-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              想要第一时间获取更新？
            </h2>
            <p className="text-slate-600 dark:text-slate-300 mb-6">
              订阅我们的 Newsletter，每次更新都会第一时间通知你。
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/"
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-colors"
              >
                浏览最新工具
              </Link>
              <Link
                href="/about"
                className="px-6 py-3 bg-white dark:bg-gray-800 hover:bg-slate-50 dark:hover:bg-gray-700 text-slate-900 dark:text-white font-semibold rounded-xl border-2 border-slate-200 dark:border-gray-700 transition-colors"
              >
                关于我们
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
