import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { scenes } from '@/data/scenes';

export default function SceneExplorer() {
  return (
    <section className="py-12 sm:py-16 bg-gradient-to-b from-slate-50 to-white dark:from-gray-950 dark:to-gray-900 border-y border-slate-200/50 dark:border-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 mb-3">
            🎯 Browse by Use Case
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white mb-3">
            Find Tools for Your <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">Specific Goal</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Stop browsing endless lists. Jump straight to the tools that solve your exact problem.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {scenes.slice(0, 6).map((scene, index) => (
            <Link
              key={scene.slug}
              href={`/scenes/${scene.slug}`}
              className="group relative p-5 bg-white dark:bg-gray-900 border border-slate-200/60 dark:border-gray-800 rounded-2xl hover:border-emerald-300 dark:hover:border-emerald-600 hover:shadow-xl hover:shadow-emerald-500/5 hover:-translate-y-1 transition-all duration-300 ease-out animate-fade-in-up overflow-hidden"
              style={{ animationDelay: `${index * 60}ms` }}
            >
              {/* Subtle gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 to-teal-500/0 group-hover:from-emerald-500/5 group-hover:to-teal-500/5 transition-all duration-500 pointer-events-none" />

              <div className="relative z-10 flex items-start gap-4">
                <div className="text-3xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  {scene.heroTag}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {scene.title}
                    </h3>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all duration-300 flex-shrink-0" />
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {scene.description}
                  </p>
                  <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-500">
                    <span className="font-medium text-emerald-600 dark:text-emerald-400">Explore</span>
                    <span>→</span>
                    <span>{scene.subtitle}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors group"
          >
            Or browse all 1,300+ tools in the directory
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
