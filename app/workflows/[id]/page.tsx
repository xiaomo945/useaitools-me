import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Home, ArrowRight } from 'lucide-react';
import Footer from '@/app/components/Footer';
import workflows from '@/data/workflows.json';
import tools from '@/data/tools.json';

interface WorkflowStep {
  step: number;
  title: string;
  title_en?: string;
  tool_ids: number[];
  description: string;
  description_en?: string;
}

interface Workflow {
  id: string;
  name: string;
  name_en?: string;
  category: string;
  who_for: string;
  who_for_en?: string;
  description: string;
  description_en?: string;
  estimated_time: string;
  difficulty: string;
  steps: WorkflowStep[];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const workflow = (workflows as Workflow[]).find((w) => w.id === id);

  if (!workflow) {
    return { title: 'Workflow Not Found' };
  }

  return {
    title: workflow.name,
    description: workflow.description,
  };
}

export default async function WorkflowDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const workflow = (workflows as Workflow[]).find((w) => w.id === id);

  if (!workflow) {
    notFound();
  }

  const getToolById = (toolId: number) => {
    return (tools as any[]).find((t) => t.id === toolId);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white transition-colors duration-300">
            <Home className="w-5 h-5" />
            <span className="font-medium">Back to Home</span>
          </Link>
        </div>

        <div className="mb-12 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-3xl p-8 sm:p-12 shadow-xl">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-gray-800 text-slate-700 dark:text-gray-300">
              {workflow.category}
            </span>
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
              workflow.difficulty === 'beginner' 
                ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
                : 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300'
            }`}>
              {workflow.difficulty}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">
            {workflow.name}
          </h1>

          <p className="text-lg text-slate-600 dark:text-gray-300 mb-6">
            {workflow.description}
          </p>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-slate-50 dark:bg-gray-800/60 rounded-xl p-4">
              <div className="text-slate-500 dark:text-gray-400 mb-1">For</div>
              <div className="font-semibold text-slate-900 dark:text-white">
                {workflow.who_for}
              </div>
            </div>
            <div className="bg-slate-50 dark:bg-gray-800/60 rounded-xl p-4">
              <div className="text-slate-500 dark:text-gray-400 mb-1">Estimated Time</div>
              <div className="font-semibold text-slate-900 dark:text-white">
                {workflow.estimated_time}
              </div>
            </div>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">
            Step-by-Step Workflow
          </h2>
          <div className="space-y-6">
            {workflow.steps.map((step, index) => (
              <div key={step.step} className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-3xl p-6 sm:p-8 shadow-sm relative">
                <div className="absolute -top-3 -left-4 sm:-left-6 w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-emerald-500/25">
                  {step.step}
                </div>

                <div className="ml-8 sm:ml-10">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                    {step.title}
                  </h3>
                  <p className="text-slate-600 dark:text-gray-300 mb-6">
                    {step.description}
                  </p>

                  {step.tool_ids.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-slate-500 dark:text-gray-400 mb-3">
                        Recommended Tools
                      </h4>
                      <div className="flex flex-wrap gap-3">
                        {step.tool_ids.map((toolId) => {
                          const tool = getToolById(toolId);
                          if (!tool) return null;
                          
                          return (
                            <Link
                              key={toolId}
                              href={`/tools/${toolId}`}
                              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl text-sm font-medium text-slate-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 hover:border-emerald-300 dark:hover:border-emerald-500/30 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all duration-300"
                            >
                              <span className="text-lg">{tool.name.charAt(0)}</span>
                              {tool.name}
                              <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <Link
            href="/workflows"
            className="inline-flex items-center gap-2 px-8 py-4 border border-slate-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-slate-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-gray-700 hover:border-emerald-300 dark:hover:border-emerald-500/30 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all duration-300"
          >
            <Home className="w-5 h-5" />
            View All Workflows
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}
