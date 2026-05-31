import Link from 'next/link';
import type { Metadata } from 'next';
import workflows from '@/data/workflows.json';
import Footer from '@/app/components/Footer';
import Breadcrumbs from '@/app/components/Breadcrumbs';

type Workflow = (typeof workflows)[0];

const difficultyConfig: Record<string, { bg: string; text: string; label: string }> = {
  beginner: { bg: 'bg-emerald-100 dark:bg-emerald-500/20', text: 'text-emerald-700 dark:text-emerald-300', label: '🌱 Beginner' },
  intermediate: { bg: 'bg-amber-100 dark:bg-amber-500/20', text: 'text-amber-700 dark:text-amber-300', label: '🔥 Intermediate' },
  advanced: { bg: 'bg-rose-100 dark:bg-rose-500/20', text: 'text-rose-700 dark:text-rose-300', label: '⚡ Advanced' },
};

const categoryColorMap: Record<string, { bg: string; text: string }> = {
  Writing: { bg: 'bg-blue-500', text: 'text-blue-600' },
  Image: { bg: 'bg-violet-500', text: 'text-violet-600' },
  Productivity: { bg: 'bg-teal-500', text: 'text-teal-600' },
  Code: { bg: 'bg-orange-500', text: 'text-orange-600' },
  Audio: { bg: 'bg-pink-500', text: 'text-pink-600' },
  Video: { bg: 'bg-indigo-500', text: 'text-indigo-600' },
};

const workflowIcons: Record<string, string> = {
  'wf-001': '🎬',
  'wf-002': '📝',
  'wf-003': '📸',
  'wf-004': '🎧',
  'wf-005': '💻',
  'wf-006': '📱',
  'wf-007': '🎓',
  'wf-008': '📧',
  'wf-009': '🎙️',
  'wf-010': '📊',
};

export const metadata: Metadata = {
  title: 'AI Workflows – Step-by-Step Guides – Use AI Tools',
  description: 'Discover step-by-step AI workflows for content creation, video production, coding, and more. Each workflow recommends the best AI tools for every step.',
  openGraph: {
    title: 'AI Workflows – Step-by-Step Guides – Use AI Tools',
    description: 'Discover step-by-step AI workflows for content creation, video production, coding, and more.',
  },
};

export default function WorkflowsPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Workflows', href: '/workflows', current: true },
          ]}
        />

        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">
            <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              AI Workflows
            </span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Step-by-step guides that show you exactly which AI tools to use and in what order. From script to screen, from idea to article.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {workflows.map((wf, index) => {
            const difficulty = difficultyConfig[wf.difficulty] || difficultyConfig.beginner;
            const catColors = categoryColorMap[wf.category] || categoryColorMap.Productivity;
            const icon = workflowIcons[wf.id] || '🔄';

            return (
              <Link
                key={wf.id}
                href={`/workflows/${wf.id}`}
                className="group bg-white dark:bg-gray-900 border border-slate-200/60 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm hover:border-emerald-300 dark:hover:border-emerald-600 hover:shadow-xl hover:shadow-emerald-500/5 hover:-translate-y-1 transition-all duration-300 ease-out animate-fade-in-up"
                style={{
                  animationDelay: `${index * 50}ms`,
                }}
              >
                <div className={`h-1 w-full ${catColors.bg}`} />

                <div className="p-5 sm:p-6">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="text-3xl">{icon}</div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${difficulty.bg} ${difficulty.text}`}>
                        {difficulty.label}
                      </span>
                    </div>
                  </div>

                  <h2 className="font-bold text-lg text-slate-900 dark:text-white mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {wf.name_en}
                  </h2>
                  <p className="text-sm text-slate-600 dark:text-gray-300 leading-relaxed mb-4 line-clamp-2">
                    {wf.description_en}
                  </p>

                  <div className="flex items-center gap-2 mb-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${catColors.bg} text-white`}>
                      {wf.category}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {wf.estimated_time}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {wf.steps.length} steps
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-sm font-semibold text-emerald-600 dark:text-emerald-400 group-hover:gap-2.5 transition-all duration-300">
                    View Workflow
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium transition-colors duration-300"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Back to Home
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}
