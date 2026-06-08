import Link from 'next/link';
import { Coffee, ArrowRight, MapPin } from 'lucide-react';

export default function StoryCard() {
  return (
    <section className="py-12 sm:py-16 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-amber-950/30 dark:via-orange-950/30 dark:to-yellow-950/30 border-y border-amber-200/40 dark:border-amber-900/40">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 sm:gap-8 items-center">
          {/* Left: Visual */}
          <div className="md:col-span-2 flex justify-center">
            <div className="relative w-48 h-48 sm:w-56 sm:h-56">
              {/* 装饰性背景 */}
              <div className="absolute inset-0 bg-gradient-to-br from-amber-300 to-orange-400 dark:from-amber-700 dark:to-orange-700 rounded-full opacity-20 blur-2xl animate-pulse" />
              <div className="relative w-full h-full bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/40 dark:to-orange-900/40 rounded-3xl flex items-center justify-center border-2 border-amber-300/50 dark:border-amber-700/50 shadow-xl shadow-amber-500/10">
                <div className="text-center">
                  <Coffee className="w-16 h-16 sm:w-20 sm:h-20 text-amber-700 dark:text-amber-400 mx-auto mb-2" strokeWidth={1.5} />
                  <div className="flex items-center justify-center gap-1 text-amber-800 dark:text-amber-300">
                    <MapPin className="w-3 h-3" />
                    <p className="text-xs font-bold">Baoding, China</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Story */}
          <div className="md:col-span-3">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 mb-3">
              🚕 Build in Public
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white mb-3">
              Built in a Baoding <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">Internet Café</span>
            </h2>
            <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
              This directory was built on a tight budget — coded between
              <span className="font-bold text-amber-600 dark:text-amber-400"> $0.50/hour café sessions</span>
              and a single coffee a day. No team, no funding, just one developer obsessed with helping people find the right AI tool without falling for marketing hype.
            </p>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-5">
              Every tool reviewed is something I (or the community) would genuinely use. No paid placements in rankings — affiliate links are clearly tagged.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/about"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-semibold hover:shadow-lg hover:shadow-amber-500/25 hover:-translate-y-0.5 transition-all duration-300"
              >
                Read the full story
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/affiliate-disclosure"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white dark:bg-gray-900 border border-amber-300 dark:border-amber-700/50 text-slate-700 dark:text-slate-300 text-sm font-semibold hover:border-amber-500 transition-all duration-300"
              >
                How we stay honest
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
