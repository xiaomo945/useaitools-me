import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import workflows from '@/data/workflows.json';
import tools from '@/data/tools.json';
import Footer from '@/app/components/Footer';
import Breadcrumbs from '@/app/components/Breadcrumbs';
import StarRating from '@/app/components/StarRating';

type Workflow = (typeof workflows)[0];
type Tool = (typeof tools)[0];

const difficultyConfig: Record<string, { bg: string; text: string; label: string }> = {
  beginner: { bg: 'bg-emerald-100 dark:bg-emerald-500/20', text: 'text-emerald-700 dark:text-emerald-300', label: '🌱 Beginner' },
  intermediate: { bg: 'bg-amber-100 dark:bg-amber-500/20', text: 'text-amber-700 dark:text-amber-300', label: '🔥 Intermediate' },
  advanced: { bg: 'bg-rose-100 dark:bg-rose-500/20', text: 'text-rose-700 dark:text-rose-300', label: '⚡ Advanced' },
};

const categoryColorMap: Record<string, { bg: string; bgDark: string; text: string; textLight: string }> = {
  Writing: { bg: 'bg-blue-500', bgDark: 'bg-blue-500/20', text: 'text-blue-300', textLight: 'text-blue-600' },
  Image: { bg: 'bg-violet-500', bgDark: 'bg-violet-500/20', text: 'text-violet-300', textLight: 'text-violet-600' },
  Productivity: { bg: 'bg-teal-500', bgDark: 'bg-teal-500/20', text: 'text-teal-300', textLight: 'text-teal-600' },
  Code: { bg: 'bg-orange-500', bgDark: 'bg-orange-500/20', text: 'text-orange-300', textLight: 'text-orange-600' },
  Audio: { bg: 'bg-pink-500', bgDark: 'bg-pink-500/20', text: 'text-pink-300', textLight: 'text-pink-600' },
  Video: { bg: 'bg-indigo-500', bgDark: 'bg-indigo-500/20', text: 'text-indigo-300', textLight: 'text-indigo-600' },
};

function truncate(str: string, max: number): string {
  return str.length > max ? str.slice(0, max) + '…' : str;
}

export async function generateStaticParams() {
  return workflows.map((wf) => ({
    slug: wf.id,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const workflow = workflows.find((wf) => wf.id === slug);

  if (!workflow) {
    return { title: 'Not Found – Use AI Tools' };
  }

  const title = `${workflow.name_en} – Use AI Tools`;
  const description = workflow.description_en;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
  };
}

export default async function WorkflowDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const workflow = workflows.find((wf) => wf.id === slug);

  if (!workflow) {
    notFound();
  }

  const difficulty = difficultyConfig[workflow.difficulty] || difficultyConfig.beginner;
  const categoryColors = categoryColorMap[workflow.category] || categoryColorMap.Productivity;

  const stepToolsMap: Record<number, Tool[]> = {};
  for (const step of workflow.steps) {
    stepToolsMap[step.step] = step.tool_ids
      .map((tid) => tools.find((t) => t.id === tid))
      .filter((t): t is Tool => !!t);
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    'name': workflow.name_en,
    'description': workflow.description_en,
    'url': `https://useaitools.me/workflows/${workflow.id}`,
    'publisher': {
      '@type': 'Organization',
      'name': 'Use AI Tools',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen bg-slate-50 dark:bg-gray-950 py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Workflows', href: '/workflows' },
              { label: workflow.name_en, href: `/workflows/${workflow.id}`, current: true },
            ]}
          />

          <div className="mb-8">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${difficulty.bg} ${difficulty.text}`}>
                {difficulty.label}
              </span>
              <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${categoryColors.bg} text-white`}>
                {workflow.category}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {workflow.estimated_time}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">
              {workflow.name_en}
            </h1>
            <p className="text-lg text-slate-600 dark:text-gray-300 leading-relaxed mb-6">
              {workflow.description_en}
            </p>

            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>For: {workflow.who_for_en}</span>
            </div>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-emerald-300 dark:via-emerald-700/40 to-transparent mb-10" />

          <div className="space-y-8">
            {workflow.steps.map((step, index) => {
              const stepToolList = stepToolsMap[step.step] || [];
              return (
                <div
                  key={step.step}
                  className="relative"
                >
                  <div className="flex gap-4 sm:gap-6">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 text-white font-bold text-sm sm:text-base flex items-center justify-center shadow-lg shadow-emerald-500/25 flex-shrink-0">
                        {step.step}
                      </div>
                      {index < workflow.steps.length - 1 && (
                        <div className="w-0.5 flex-1 bg-gradient-to-b from-emerald-300 to-transparent dark:from-emerald-700/40 mt-2" />
                      )}
                    </div>

                    <div className="flex-1 pb-8">
                      <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-2">
                        {step.title_en}
                      </h2>
                      <p className="text-slate-600 dark:text-gray-300 mb-4 leading-relaxed">
                        {step.description_en}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {stepToolList.map((tool) => {
                          const toolCatColors = categoryColorMap[tool.category] || categoryColorMap.Productivity;
                          return (
                            <Link
                              key={tool.id}
                              href={`/tools/${tool.id}`}
                              className="group bg-white dark:bg-gray-900 border border-slate-200/60 dark:border-gray-800 rounded-2xl p-4 shadow-sm hover:border-emerald-300 dark:hover:border-emerald-600 hover:shadow-xl hover:shadow-emerald-500/5 hover:-translate-y-1 transition-all duration-300 ease-out"
                            >
                              <div className="flex items-center gap-3 mb-2">
                                <div className={`w-9 h-9 rounded-xl ${toolCatColors.bgDark} ${toolCatColors.textLight} dark:${toolCatColors.text} flex items-center justify-center text-lg font-bold flex-shrink-0`} style={{ fontFamily: 'Playfair Display, serif' }}>
                                  {tool.name.charAt(0)}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <h3 className="font-semibold text-sm text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors truncate">
                                    {tool.name}
                                  </h3>
                                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-semibold ${toolCatColors.bg} text-white`}>
                                    {tool.category}
                                  </span>
                                </div>
                              </div>
                              <p className="text-xs text-slate-500 dark:text-gray-400 leading-relaxed mb-2 line-clamp-2">
                                {truncate(tool.description_en || tool.description, 80)}
                              </p>
                              <div className="flex items-center gap-2">
                                <StarRating rating={tool.rating || 4.0} size="sm" />
                                <span className="text-[10px] text-slate-400 dark:text-gray-500">
                                  ({tool.rating_count || 0})
                                </span>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-emerald-300 dark:via-emerald-700/40 to-transparent my-10" />

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link
              href={`/category/${workflow.category.toLowerCase()}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 rounded-full hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-all duration-300"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              Browse {workflow.category} Tools
            </Link>
            <Link
              href="/workflows"
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors duration-300"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              All Workflows
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
