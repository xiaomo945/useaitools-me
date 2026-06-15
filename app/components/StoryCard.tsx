import Link from 'next/link';
import { Coffee, ArrowRight, MapPin } from 'lucide-react';

export default function StoryCard() {
  return (
    <section className="py-12 sm:py-16 bg-white dark:bg-gray-950 border-y border-slate-100 dark:border-gray-800/50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 sm:gap-8 items-center">
          {/* Left: Visual */}
          <div className="md:col-span-2 flex justify-center">
            <div className="relative w-48 h-48 sm:w-56 sm:h-56">
              <div className="relative w-full h-full bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 rounded-3xl flex items-center justify-center border-2 border-emerald-200/50 dark:border-emerald-800/30 shadow-xl shadow-emerald-500/5">
                <div className="text-center">
                  <Coffee className="w-16 h-16 sm:w-20 sm:h-20 text-emerald-600 dark:text-emerald-400 mx-auto mb-2" strokeWidth={1.5} />
                  <div className="flex items-center justify-center gap-1 text-emerald-700 dark:text-emerald-300">
                    <MapPin className="w-3 h-3" />
                    <p className="text-xs font-bold">Baoding, China</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Story */}
          <div className="md:col-span-3">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 mb-3">
              🚕 Build in Public
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white mb-3">
              Built in a Baoding <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">Internet Café</span>
            </h2>
            <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
              This directory was built on a tight budget — coded between
              <span className="font-bold text-emerald-600 dark:text-emerald-400"> $0.50/hour café sessions</span>
              and a single coffee a day. No team, no funding, just one developer obsessed with helping people find the right AI tool without falling for marketing hype.
            </p>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-5">
              Every tool reviewed is something I (or the community) would genuinely use. No paid placements in rankings — affiliate links are clearly tagged.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/about"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm font-semibold hover:shadow-lg hover:shadow-emerald-500/25 hover:-translate-y-0.5 transition-all duration-300"
              >
                Read the full story
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/affiliate-disclosure"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-700 text-slate-700 dark:text-slate-300 text-sm font-semibold hover:border-emerald-300 dark:hover:border-emerald-600 transition-all duration-300"
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
