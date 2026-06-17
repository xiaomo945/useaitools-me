import type { Metadata } from 'next';
import Link from 'next/link';
import Footer from '@/app/components/Footer';
import { scenes } from '@/data/scenes';
import { ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'AI Tool Scenes – Find the Perfect Tools for Your Use Case – Use AI Tools',
  description: 'Browse curated collections of AI tools organized by use case. From blog writing to video creation, find the best tools for your specific needs.',
  openGraph: {
    title: 'AI Tool Scenes – Use AI Tools',
    description: 'Curated AI tool collections by use case.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Tool Scenes – Use AI Tools',
    description: 'Curated AI tool collections by use case.',
  },
  alternates: {
    canonical: 'https://useaitools.me/scenes',
  },
};

export default function ScenesPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950">
      {/* Hero */}
      <section className="pt-20 pb-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            AI Tool Scenes
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Curated collections of AI tools organized by use case. Find the perfect toolkit for your specific workflow.
          </p>
        </div>
      </section>

      {/* Scenes Grid */}
      <section className="px-4 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {scenes.map((scene) => (
              <Link
                key={scene.slug}
                href={`/scenes/${scene.slug}`}
                className="group block bg-white dark:bg-gray-900 rounded-2xl border border-slate-200/60 dark:border-gray-800/80 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="text-4xl mb-4">{scene.heroTag}</div>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {scene.title}
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
                  {scene.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 dark:text-slate-500">
                    {scene.includes.length} tools
                  </span>
                  <span className="flex items-center text-sm text-emerald-600 dark:text-emerald-400 font-medium group-hover:translate-x-1 transition-transform">
                    Explore <ArrowRight className="w-4 h-4 ml-1" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
