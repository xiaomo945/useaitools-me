'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ArrowRight, Zap, Brain, Shield, Check, Home } from 'lucide-react';
import Footer from '@/app/components/Footer';
import Breadcrumbs from '@/app/components/Breadcrumbs';

const WAITLIST_END_DATE = new Date('2026-06-15T00:00:00');

const useCountdown = () => {
  const [days, setDays] = useState(14);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const diff = WAITLIST_END_DATE.getTime() - now.getTime();
      if (diff <= 0) {
        clearInterval(interval);
        return;
      }
      setDays(Math.floor(diff / (1000 * 60 * 60 * 24)));
      setHours(Math.floor((diff / (1000 * 60 * 60)) % 24));
      setMinutes(Math.floor((diff / (1000 * 60)) % 60));
      setSeconds(Math.floor((diff / 1000) % 60));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return { days, hours, minutes, seconds };
};

const features = [
  {
    icon: Zap,
    title: 'Fast Drafts',
    description: 'Generate blog posts, emails, and social content in seconds. From prompt to polished in under 30 seconds.',
  },
  {
    icon: Brain,
    title: 'Context-Aware',
    description: 'Remembers your brand voice, style preferences, and audience. No more starting from scratch every time.',
  },
  {
    icon: Shield,
    title: '100% Private',
    description: 'Your data stays yours. No training on your content, no selling your information. Enterprise-grade privacy.',
  },
];

export default function WaitlistPage() {
  const { days, hours, minutes, seconds } = useCountdown();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, type: 'waitlist' }),
      });
      if (res.ok) {
        setSubmitted(true);
      }
    } catch (err) {
      console.error('Failed to join waitlist:', err);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Waitlist', href: '/waitlist', current: true },
          ]}
        />

        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 mb-6">
            <span className="animate-pulse">🚀</span> Coming Soon
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white mb-4">
            Use AI Writer
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed mb-4">
            Affordable, fast, and truly understands your context. Our own AI writing tool — built for real people with real budgets.
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">
            We&apos;re just getting started. Be among the first to shape this product.
          </p>
          <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
            Join {process.env.NEXT_PUBLIC_WAITLIST_BASE_COUNT || '120'}+ creators on the waitlist
          </p>
        </div>

        {/* Countdown Timer */}
        <div className="mt-10 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
          <p className="text-center text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-4">
            Early bird pricing ends in
          </p>
          <div className="flex items-center justify-center gap-3 sm:gap-4">
            {[
              { value: days, label: 'Days' },
              { value: hours, label: 'Hours' },
              { value: minutes, label: 'Min' },
              { value: seconds, label: 'Sec' },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-16 sm:w-20 h-16 sm:h-20 rounded-xl bg-slate-100 dark:bg-gray-800 flex items-center justify-center">
                  <span className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tabular-nums">
                    {String(item.value).padStart(2, '0')}
                  </span>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 block">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Email Signup */}
        {!submitted ? (
          <form onSubmit={handleSubmit} className="mt-10 max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="flex-1 px-5 py-4 rounded-xl border border-slate-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                aria-label="Email address for waitlist"
              />
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                {loading ? 'Joining...' : 'Join Waitlist'}
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
            <p className="mt-3 text-xs text-slate-500 dark:text-slate-400 text-center">
              No spam. No credit card. Cancel anytime.
            </p>
          </form>
        ) : (
          <div className="mt-10 max-w-md mx-auto bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">You&apos;re on the list!</h3>
            <p className="text-slate-600 dark:text-gray-300">We&apos;ll notify you when Use AI Writer is ready. Early bird pricing is locked in.</p>
          </div>
        )}

        {/* Feature Cards */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{feature.title}</h3>
              <p className="text-sm text-slate-600 dark:text-gray-300 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Why We&apos;re Building */}
        <div className="mt-16 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-2xl p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Why We&apos;re Building This</h2>
          <div className="space-y-4 text-slate-600 dark:text-gray-300 leading-relaxed">
            <p>
              After testing 50+ AI tools and talking to thousands of users, we noticed a gap: the market is polarized between expensive enterprise tools and limited free options.
            </p>
            <p>
              Use AI Writer is our answer — a tool that&apos;s affordable, context-aware, and truly multilingual from day one.
            </p>
          </div>
          <Link
            href="/blog/why-building-use-ai-writer"
            className="mt-6 inline-flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
          >
            Read our full story
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium transition-colors duration-300"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}
