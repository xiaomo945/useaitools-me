import { Metadata } from 'next';
import Link from 'next/link';
import { Download, Mail, FileText, Image, BarChart3 } from 'lucide-react';

export const metadata: Metadata = {
  title: '媒体资源 - Use AI Tools',
  description: '下载 Use AI Tools 的品牌资源、Logo、截图和统计数据。欢迎媒体合作伙伴使用我们的资源进行报道。',
  keywords: ['媒体资源', '品牌下载', 'Logo', '统计数据', '媒体报道'],
};

export default function PressPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 dark:from-gray-950 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-5xl font-bold text-slate-900 dark:text-white mb-6">
            媒体资源
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            欢迎媒体合作伙伴使用我们的品牌资源进行报道。如需更多信息，请联系我们的媒体团队。
          </p>
        </section>

        {/* Brand Guidelines */}
        <section className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg border border-slate-200 dark:border-gray-800 mb-12">
          <div className="flex items-center mb-6">
            <FileText className="w-8 h-8 text-emerald-600 mr-3" />
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">品牌指南</h2>
          </div>
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              使用 Use AI Tools 品牌资源时，请遵循以下指南：
            </p>
            <ul className="space-y-2 text-slate-600 dark:text-slate-300">
              <li>• 保持 Logo 的完整性和比例，不要扭曲或修改颜色</li>
              <li>• 在深色背景上使用浅色版本，在浅色背景上使用深色版本</li>
              <li>• 确保 Logo 周围有足够的留白空间</li>
              <li>• 不要将 Logo 用作装饰元素或背景图案</li>
              <li>• 提及品牌时使用完整名称 "Use AI Tools"</li>
            </ul>
          </div>
        </section>

        {/* Logo Downloads */}
        <section className="mb-12">
          <div className="flex items-center mb-6">
            <Image className="w-8 h-8 text-emerald-600 mr-3" />
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Logo 下载</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-gray-800">
              <div className="bg-slate-50 dark:bg-gray-800 rounded-lg p-8 mb-4 flex items-center justify-center">
                <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center text-white font-bold text-2xl">
                  UAT
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">主 Logo</h3>
              <p className="text-slate-600 dark:text-slate-300 mb-4">
                标准版本，适用于大多数场景
              </p>
              <button className="w-full px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center">
                <Download className="w-4 h-4 mr-2" />
                下载 PNG
              </button>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-gray-800">
              <div className="bg-gray-900 rounded-lg p-8 mb-4 flex items-center justify-center">
                <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center text-white font-bold text-2xl">
                  UAT
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">深色背景版</h3>
              <p className="text-slate-600 dark:text-slate-300 mb-4">
                适用于深色背景和界面
              </p>
              <button className="w-full px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center">
                <Download className="w-4 h-4 mr-2" />
                下载 PNG
              </button>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-gray-800">
              <div className="bg-slate-50 dark:bg-gray-800 rounded-lg p-8 mb-4 flex items-center justify-center">
                <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                  UAT
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">图标版本</h3>
              <p className="text-slate-600 dark:text-slate-300 mb-4">
                适用于 favicon 和小尺寸显示
              </p>
              <button className="w-full px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center">
                <Download className="w-4 h-4 mr-2" />
                下载 PNG
              </button>
            </div>
          </div>
        </section>

        {/* Screenshots */}
        <section className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg border border-slate-200 dark:border-gray-800 mb-12">
          <div className="flex items-center mb-6">
            <Image className="w-8 h-8 text-emerald-600 mr-3" />
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">产品截图</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border border-slate-200 dark:border-gray-800 rounded-xl overflow-hidden">
              <div className="bg-gradient-to-br from-emerald-500 to-teal-500 h-48 flex items-center justify-center text-white text-xl font-bold">
                首页截图
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">首页展示</h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm">
                  展示工具发现、搜索和筛选功能
                </p>
              </div>
            </div>

            <div className="border border-slate-200 dark:border-gray-800 rounded-xl overflow-hidden">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-500 h-48 flex items-center justify-center text-white text-xl font-bold">
                工具详情页
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">工具详情</h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm">
                  展示工具信息、评分和用户评价
                </p>
              </div>
            </div>

            <div className="border border-slate-200 dark:border-gray-800 rounded-xl overflow-hidden">
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 h-48 flex items-center justify-center text-white text-xl font-bold">
                对比功能
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">工具对比</h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm">
                  展示多维度对比和决策矩阵
                </p>
              </div>
            </div>

            <div className="border border-slate-200 dark:border-gray-800 rounded-xl overflow-hidden">
              <div className="bg-gradient-to-br from-orange-500 to-red-500 h-48 flex items-center justify-center text-white text-xl font-bold">
                博客文章
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">内容生态</h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm">
                  展示评测文章和教程内容
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Statistics */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-12 mb-12">
          <div className="flex items-center mb-6">
            <BarChart3 className="w-8 h-8 text-white mr-3" />
            <h2 className="text-3xl font-bold text-white">关键数据</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-white mb-2">1361+</div>
              <div className="text-emerald-100">收录工具</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">766+</div>
              <div className="text-emerald-100">评测文章</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">6</div>
              <div className="text-emerald-100">工具分类</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">2</div>
              <div className="text-emerald-100">语言支持</div>
            </div>
          </div>
          <div className="mt-8 text-center text-emerald-100 text-sm">
            数据更新时间：2026 年 6 月
          </div>
        </section>

        {/* Contact */}
        <section className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg border border-slate-200 dark:border-gray-800">
          <div className="flex items-center mb-6">
            <Mail className="w-8 h-8 text-emerald-600 mr-3" />
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">媒体联系</h2>
          </div>
          <div className="prose prose-lg dark:prose-invert max-w-none mb-6">
            <p className="text-slate-600 dark:text-slate-300">
              如果您是媒体记者、博主或内容创作者，需要更多信息或采访安排，请联系我们的媒体团队：
            </p>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-gray-800 rounded-lg">
              <div>
                <div className="font-semibold text-slate-900 dark:text-white">媒体邮箱</div>
                <div className="text-slate-600 dark:text-slate-300">press@useaitools.me</div>
              </div>
              <Mail className="w-6 h-6 text-emerald-600" />
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-gray-800 rounded-lg">
              <div>
                <div className="font-semibold text-slate-900 dark:text-white">Twitter / X</div>
                <div className="text-slate-600 dark:text-slate-300">@jiongxiaomo</div>
              </div>
              <svg className="w-6 h-6 text-emerald-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </div>
          </div>
          <div className="mt-6 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
            <p className="text-sm text-emerald-800 dark:text-emerald-200">
              <strong>提示：</strong>我们欢迎所有形式的媒体报道和合作。如果您需要采访创始人、获取产品演示或了解更多技术细节，请随时联系我们。
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
