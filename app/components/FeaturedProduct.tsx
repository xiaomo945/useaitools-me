import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function FeaturedProduct() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
      <Link
        href="/waitlist"
        className="group block bg-gradient-to-r from-slate-50 via-white to-emerald-50/70 dark:from-gray-800/50 dark:via-gray-900 dark:to-emerald-900/20 border border-slate-200 dark:border-gray-700/80 rounded-2xl shadow-sm hover:shadow-lg hover:shadow-emerald-500/10 hover:-translate-y-0.5 transition-all duration-300 overflow-hidden"
      >
        <div className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {/* Left Icon */}
            <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-emerald-600 flex items-center justify-center shadow-md shadow-emerald-500/25 group-hover:scale-105 transition-transform duration-300">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
              </svg>
            </div>
            
            {/* Center Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                  Use AI Writer
                </h3>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300">
                  <Sparkles className="w-3 h-3" />
                  Coming Soon
                </span>
              </div>
              <p className="text-sm sm:text-base text-slate-600 dark:text-gray-300 mb-2">
                The first affordable AI writer that truly understands context. Built for speed and clarity.
              </p>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs sm:text-sm text-slate-500 dark:text-gray-400">
                <span>🚀 Blazing fast drafts</span>
                <span>💎 More creative than ChatGPT</span>
                <span>🔒 100% private</span>
              </div>
            </div>
            
            {/* Right CTA */}
            <div className="flex-shrink-0 mt-4 sm:mt-0">
              <div className="inline-flex items-center gap-2 px-5 py-3 bg-emerald-600 text-white font-semibold rounded-xl shadow-md shadow-emerald-500/25 group-hover:bg-emerald-700 group-hover:shadow-lg group-hover:shadow-emerald-500/30 transition-all duration-300">
                Join the Waitlist
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </div>
              <p className="text-xs text-center text-slate-400 dark:text-slate-500 mt-2">
                Limited Spots
              </p>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
