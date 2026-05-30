'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Footer from '../components/Footer';
import workflows from '@/data/workflows.json';

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

export default function WorkflowsPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 py-12 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="mb-12 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">
            AI Workflows
          </h1>
          <p className="text-lg text-slate-600 dark:text-gray-300 max-w-2xl mx-auto">
            Step-by-step workflows to supercharge your productivity with AI tools.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(workflows as Workflow[]).map((workflow, index) => (
            <Link
              key={workflow.id}
              href={`/workflows/${workflow.id}`}
              className="group bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 ease-out"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-gray-800 text-slate-700 dark:text-gray-300 mb-3">
                    {workflow.category}
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {workflow.name}
                  </h3>
                </div>
              </div>

              <p className="text-slate-600 dark:text-gray-300 mb-4">
                {workflow.description}
              </p>

              <div className="flex flex-wrap items-center gap-4 mb-4 text-sm">
                <div className="flex items-center gap-1.5 text-slate-600 dark:text-gray-300">
                  <span className="text-lg">👥</span>
                  <span className="truncate max-w-[150px]">{workflow.who_for}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-600 dark:text-gray-300">
                  <span className="text-lg">⏱️</span>
                  <span>{workflow.estimated_time}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                    workflow.difficulty === 'beginner' 
                      ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
                      : 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300'
                  }`}>
                    {workflow.difficulty}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold">
                View workflow
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
