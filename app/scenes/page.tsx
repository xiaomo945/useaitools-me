import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Footer from '@/app/components/Footer';
import Breadcrumbs from '@/app/components/Breadcrumbs';
import { scenes } from '@/data/scenes';

export const metadata: Metadata = {
  title: 'AI Tool Scenes - Find the Right AI Tools for Your Task',
  description:
    'Browse curated AI tool collections by real-world scenario: blog writing, video creation, podcast production, SEO content, study, design, customer support and more.',
  keywords: ['AI tool scenes', 'AI tools by use case', 'AI workflow collections'],
  alternates: { canonical: 'https://useaitools.me/scenes' },
};

export default function ScenesIndexPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 dark:from-gray-950 dark:to-gray-900">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Scenes', href: '/scenes', current: true },
          ]}
        />

        <section className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            AI Tool Scenes
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            Every scene below is a curated shortlist built around one real task. Pick the job you are
            trying to get done and compare the tools that actually fit it.
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {scenes.map((scene) => (
            <Link
              key={scene.slug}
              href={`/scenes/${scene.slug}`}
              className="group bg-white dark:bg-gray-900 rounded-xl border border-slate-200 dark:border-gray-800 p-6 shadow-sm hover:shadow-md hover:border-emerald-300 dark:hover:border-emerald-700 transition-all flex flex-col"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl" aria-hidden="true">
                  {scene.heroTag}
                </span>
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">
                  {scene.heroTagLabel}
                </span>
              </div>

              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                {scene.title}
              </h2>
              <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400 mb-3">
                {scene.subtitle}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400 flex-1">
                {scene.description}
              </p>

              <span className="mt-4 inline-flex items-center text-sm font-medium text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                Explore this scene
                <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </Link>
          ))}
        </section>
      </main>

      <Footer />
    </div>
  );
}
