import { Metadata } from 'next';
import Link from 'next/link';
import { Target, Users, Zap, Award, Globe, TrendingUp } from 'lucide-react';

export const metadata: Metadata = {
  title: '关于我们 - Use AI Tools',
  description: '了解 Use AI Tools 的使命、愿景和团队。我们致力于帮助用户发现最佳 AI 工具，提升工作效率。',
  keywords: ['关于我们', 'AI 工具导航', '使命愿景', '团队介绍'],
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 dark:from-gray-950 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-5xl font-bold text-slate-900 dark:text-white mb-6">
            关于 <span className="text-emerald-600">Use AI Tools</span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            我们致力于成为最值得信赖的 AI 工具导航平台，帮助用户在 AI 时代保持竞争力
          </p>
        </section>

        {/* Mission & Vision */}
        <section className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg border border-slate-200 dark:border-gray-800">
            <div className="flex items-center mb-4">
              <Target className="w-10 h-10 text-emerald-600 mr-3" />
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">我们的使命</h2>
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              在 AI 技术快速发展的时代，帮助用户发现、比较和选择最适合的 AI 工具。我们通过专业的评测、详细的对比和真实的用户反馈，让每个用户都能做出明智的选择。
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg border border-slate-200 dark:border-gray-800">
            <div className="flex items-center mb-4">
              <Globe className="w-10 h-10 text-emerald-600 mr-3" />
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">我们的愿景</h2>
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              成为全球最权威的 AI 工具导航平台，建立 AI 工具行业的标准与信任。我们希望每个用户都能在这里找到提升效率的利器，每个开发者都能获得应有的曝光。
            </p>
          </div>
        </section>

        {/* Values */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-12">
            我们的核心价值观
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-emerald-100 dark:bg-emerald-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">专业权威</h3>
              <p className="text-slate-600 dark:text-slate-300">
                每个工具都经过严格筛选和评测，确保信息的准确性和时效性
              </p>
            </div>

            <div className="text-center">
              <div className="bg-emerald-100 dark:bg-emerald-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">用户至上</h3>
              <p className="text-slate-600 dark:text-slate-300">
                始终从用户需求出发，提供客观、中立的评价，不受商业利益影响
              </p>
            </div>

            <div className="text-center">
              <div className="bg-emerald-100 dark:bg-emerald-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">持续创新</h3>
              <p className="text-slate-600 dark:text-slate-300">
                紧跟 AI 技术发展，不断优化产品功能，为用户提供最佳体验
              </p>
            </div>
          </div>
        </section>

        {/* Statistics */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-12 mb-16">
          <h2 className="text-3xl font-bold text-center text-white mb-12">
            我们的成就
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-white mb-2">1361+</div>
              <div className="text-emerald-100">收录工具</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">6</div>
              <div className="text-emerald-100">工具分类</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">766+</div>
              <div className="text-emerald-100">评测文章</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">2</div>
              <div className="text-emerald-100">语言支持</div>
            </div>
          </div>
        </section>

        {/* Story */}
        <section className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg border border-slate-200 dark:border-gray-800 mb-16">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
            我们的故事
          </h2>
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              Use AI Tools 诞生于 2026 年初，当时 AI 工具如雨后春笋般涌现，但用户却面临选择困难。我们发现，虽然有很多优秀的 AI 工具，但缺乏一个集中、可信的导航平台。
            </p>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              作为一个独立开发者项目，我们从零开始，通过网吧的公共网络搭建了这个平台。没有投资，没有团队，只有对 AI 技术的热情和帮助用户的初心。
            </p>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              经过几个月的努力，我们已经收录了 1361 个 AI 工具，撰写了 766 篇评测文章，支持中英文双语，并实现了 PWA 离线访问。我们的目标是成为 AI 工具行业的权威参考，帮助用户在 AI 时代保持竞争力。
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
            加入我们
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto">
            无论你是想发现新工具，还是想推广你的 AI 产品，我们都欢迎你的参与
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/submit"
              className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
            >
              提交工具
            </Link>
            <Link
              href="/advertise"
              className="px-8 py-4 bg-white dark:bg-gray-800 hover:bg-slate-50 dark:hover:bg-gray-700 text-slate-900 dark:text-white font-semibold rounded-xl border-2 border-slate-200 dark:border-gray-700 transition-all duration-300 transform hover:scale-105"
            >
              广告合作
            </Link>
            <Link
              href="/"
              className="px-8 py-4 bg-white dark:bg-gray-800 hover:bg-slate-50 dark:hover:bg-gray-700 text-slate-900 dark:text-white font-semibold rounded-xl border-2 border-slate-200 dark:border-gray-700 transition-all duration-300 transform hover:scale-105"
            >
              浏览工具
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
