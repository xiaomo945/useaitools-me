import { Metadata } from 'next';
import Link from 'next/link';
import { Download, Mail, FileText, Image, BarChart3 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Press Kit - Use AI Tools',
  description: 'Download Use AI Tools brand assets, logos, screenshots and key statistics. Media partners are welcome to use our resources for their coverage.',
};

export default function PressPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 dark:from-gray-950 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-5xl font-bold text-slate-900 dark:text-white mb-6">
            Press Kit
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            Media partners are welcome to use our brand assets in their coverage. For more information, please get in touch with our press team.
          </p>
        </section>

        {/* Brand Guidelines */}
        <section className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg border border-slate-200 dark:border-gray-800 mb-12">
          <div className="flex items-center mb-6">
            <FileText className="w-8 h-8 text-emerald-600 mr-3" />
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Brand Guidelines</h2>
          </div>
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              Please follow these guidelines when using Use AI Tools brand assets:
            </p>
            <ul className="space-y-2 text-slate-600 dark:text-slate-300">
              <li>• Keep the logo intact and proportional — do not distort it or alter its colors</li>
              <li>• Use the light version on dark backgrounds and the dark version on light backgrounds</li>
              <li>• Leave enough clear space around the logo</li>
              <li>• Do not use the logo as a decorative element or background pattern</li>
              <li>• Refer to the brand by its full name, "Use AI Tools"</li>
            </ul>
          </div>
        </section>

        {/* Logo Downloads */}
        <section className="mb-12">
          <div className="flex items-center mb-6">
            <Image className="w-8 h-8 text-emerald-600 mr-3" />
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Logo Downloads</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-gray-800">
              <div className="bg-slate-50 dark:bg-gray-800 rounded-lg p-8 mb-4 flex items-center justify-center">
                <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center text-white font-bold text-2xl">
                  UAT
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Primary Logo</h3>
              <p className="text-slate-600 dark:text-slate-300 mb-4">
                Standard version, suitable for most use cases
              </p>
              <a
                href="/logo.png"
                download="use-ai-tools-logo.png"
                className="w-full px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center"
              >
                <Download className="w-4 h-4 mr-2" />
                Download PNG
              </a>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-gray-800">
              <div className="bg-gray-900 rounded-lg p-8 mb-4 flex items-center justify-center">
                <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center text-white font-bold text-2xl">
                  UAT
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Dark Background Version</h3>
              <p className="text-slate-600 dark:text-slate-300 mb-4">
                Designed for dark backgrounds and dark-mode interfaces
              </p>
              <a
                href="/brand/use-ai-tools-logo-dark.svg"
                download="use-ai-tools-logo-dark.svg"
                className="w-full px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center"
              >
                <Download className="w-4 h-4 mr-2" />
                Download SVG
              </a>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-gray-800">
              <div className="bg-slate-50 dark:bg-gray-800 rounded-lg p-8 mb-4 flex items-center justify-center">
                <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                  UAT
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Icon Version</h3>
              <p className="text-slate-600 dark:text-slate-300 mb-4">
                Ideal for favicons and small display sizes
              </p>
              <a
                href="/brand/use-ai-tools-icon.svg"
                download="use-ai-tools-icon.svg"
                className="w-full px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center"
              >
                <Download className="w-4 h-4 mr-2" />
                Download SVG
              </a>
            </div>
          </div>
        </section>

        {/* Screenshots */}
        <section className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg border border-slate-200 dark:border-gray-800 mb-12">
          <div className="flex items-center mb-6">
            <Image className="w-8 h-8 text-emerald-600 mr-3" />
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Product Screenshots</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border border-slate-200 dark:border-gray-800 rounded-xl overflow-hidden">
              <div className="bg-gradient-to-br from-emerald-500 to-teal-500 h-48 flex items-center justify-center text-white text-xl font-bold">
                Homepage Screenshot
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Homepage</h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm">
                  Showcases tool discovery, search and filtering
                </p>
              </div>
            </div>

            <div className="border border-slate-200 dark:border-gray-800 rounded-xl overflow-hidden">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-500 h-48 flex items-center justify-center text-white text-xl font-bold">
                Tool Detail Page
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Tool Details</h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm">
                  Showcases tool information, ratings and user reviews
                </p>
              </div>
            </div>

            <div className="border border-slate-200 dark:border-gray-800 rounded-xl overflow-hidden">
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 h-48 flex items-center justify-center text-white text-xl font-bold">
                Comparison Feature
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Tool Comparison</h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm">
                  Showcases multi-dimensional comparisons and decision matrices
                </p>
              </div>
            </div>

            <div className="border border-slate-200 dark:border-gray-800 rounded-xl overflow-hidden">
              <div className="bg-gradient-to-br from-orange-500 to-red-500 h-48 flex items-center justify-center text-white text-xl font-bold">
                Blog Articles
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Content Ecosystem</h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm">
                  Showcases review articles and tutorial content
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Statistics */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-12 mb-12">
          <div className="flex items-center mb-6">
            <BarChart3 className="w-8 h-8 text-white mr-3" />
            <h2 className="text-3xl font-bold text-white">Key Figures</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-white mb-2">1361+</div>
              <div className="text-emerald-100">Tools Listed</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">766+</div>
              <div className="text-emerald-100">Review Articles</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">6</div>
              <div className="text-emerald-100">Tool Categories</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">2</div>
              <div className="text-emerald-100">Languages Supported</div>
            </div>
          </div>
          <div className="mt-8 text-center text-emerald-100 text-sm">
            Last updated: June 2026
          </div>
        </section>

        {/* Contact */}
        <section className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg border border-slate-200 dark:border-gray-800">
          <div className="flex items-center mb-6">
            <Mail className="w-8 h-8 text-emerald-600 mr-3" />
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Media Contact</h2>
          </div>
          <div className="prose prose-lg dark:prose-invert max-w-none mb-6">
            <p className="text-slate-600 dark:text-slate-300">
              If you're a journalist, blogger or content creator who needs more information or would like to arrange an interview, please reach out to our press team:
            </p>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-gray-800 rounded-lg">
              <div>
                <div className="font-semibold text-slate-900 dark:text-white">Press Email</div>
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
              <strong>Note:</strong> We welcome media coverage and collaborations of all kinds. Whether you'd like to interview our founders, request a product demo or dig into the technical details, feel free to contact us anytime.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
