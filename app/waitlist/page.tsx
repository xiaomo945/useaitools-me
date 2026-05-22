import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Mail, Shield, Zap } from 'lucide-react';
import Footer from '@/app/components/Footer';

export const metadata: Metadata = {
  title: 'Join the Use AI Writer Waitlist - Early Access',
  description: 'Be among the first to try Use AI Writer - the first affordable AI writing copilot that truly understands context. Limited spots available.',
  keywords: ['AI writer', 'AI writing tool', 'waitlist', 'early access'],
};

export default function WaitlistPage() {
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 dark:from-gray-950 dark:via-gray-900 dark:to-emerald-950/30">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          {/* Back link */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors mb-12"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          {/* Hero */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Early Access
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-6">
              <span style={{ fontFamily: 'Playfair Display, serif' }}>
                Use AI Writer
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
              Your AI writing copilot. The first affordable AI writer that truly understands context. Built for speed and clarity.
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
            {[
              { icon: Zap, title: 'Blazing Fast', desc: 'Drafts in seconds, not minutes' },
              { icon: Sparkles, title: 'More Creative', desc: 'Beyond basic ChatGPT patterns' },
              { icon: Shield, title: '100% Private', desc: 'Your content stays yours' },
            ].map((feature, i) => (
              <div key={i} className="text-center p-6 rounded-2xl bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 shadow-sm">
                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
                  <feature.icon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-1">{feature.title}</h3>
                <p className="text-sm text-slate-500 dark:text-gray-400">{feature.desc}</p>
              </div>
            ))}
          </div>

          {/* Waitlist Form */}
          <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-2xl p-8 shadow-sm">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Join the Waitlist
              </h2>
              <p className="text-slate-500 dark:text-gray-400">
                Limited spots. Be first in line when we launch.
              </p>
            </div>

            <form className="space-y-4" action="/api/waitlist" method="POST">
              <div>
                <label htmlFor="email" className="sr-only">Email address</label>
                <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-emerald-500 transition-all">
                  <Mail className="w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter your email"
                    required
                    className="flex-1 bg-transparent outline-none text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-4 px-6 bg-emerald-600 text-white font-semibold rounded-xl shadow-md shadow-emerald-500/25 hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-500/30 hover:-translate-y-0.5 transition-all duration-300"
              >
                Join the Waitlist
              </button>
            </form>

            <p className="text-xs text-center text-slate-400 dark:text-slate-500 mt-4">
              No spam, ever. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
