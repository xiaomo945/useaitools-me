'use client';

import { useState } from 'react';
import { BookOpen, Download, Video, Star, CheckCircle } from 'lucide-react';

export default function EbookPage() {
  const [selectedPlan, setSelectedPlan] = useState<'basic' | 'premium'>('basic');

  const handlePurchase = async () => {
    // 这里集成 Gumroad 或 LemonSqueezy
    const productId = selectedPlan === 'basic' ? 'ebook-basic' : 'ebook-premium';
    // window.location.href = `https://gumroad.com/l/${productId}`;
    alert(`跳转到支付页面: ${productId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 dark:from-gray-950 dark:to-gray-900 py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-full text-sm font-semibold mb-6">
            <BookOpen className="w-4 h-4" />
            2026 Edition
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white mb-6">
            The Ultimate AI Tools Guide
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto mb-8">
            Discover 100+ hand-picked AI tools, learn how to use them effectively, and transform your workflow with our comprehensive guide.
          </p>
          <div className="flex items-center justify-center gap-6 text-sm text-slate-600 dark:text-slate-400">
            <span className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-500" />
              100+ Tools Reviewed
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-500" />
              10 Industry Scenarios
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-500" />
              Lifetime Updates
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
          {/* Basic Plan */}
          <div
            className={`relative bg-white dark:bg-gray-900 rounded-3xl p-8 border-2 transition-all cursor-pointer ${
              selectedPlan === 'basic'
                ? 'border-emerald-500 shadow-2xl shadow-emerald-500/20 scale-105'
                : 'border-slate-200 dark:border-gray-800 hover:border-emerald-300'
            }`}
            onClick={() => setSelectedPlan('basic')}
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                  Basic Edition
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Complete eBook in PDF format
                </p>
              </div>
              <BookOpen className="w-8 h-8 text-emerald-500" />
            </div>

            <div className="mb-6">
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-extrabold text-slate-900 dark:text-white">$19</span>
                <span className="text-slate-500">one-time</span>
              </div>
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span className="text-slate-700 dark:text-slate-300">100+ AI tools detailed reviews</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span className="text-slate-700 dark:text-slate-300">10 industry-specific recommendations</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span className="text-slate-700 dark:text-slate-300">Comparison tables & cheat sheets</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span className="text-slate-700 dark:text-slate-300">PDF format (50+ pages)</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span className="text-slate-700 dark:text-slate-300">Free lifetime updates</span>
              </li>
            </ul>

            <button
              onClick={handlePurchase}
              className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              Get Basic Edition
            </button>
          </div>

          {/* Premium Plan */}
          <div
            className={`relative bg-white dark:bg-gray-900 rounded-3xl p-8 border-2 transition-all cursor-pointer ${
              selectedPlan === 'premium'
                ? 'border-emerald-500 shadow-2xl shadow-emerald-500/20 scale-105'
                : 'border-slate-200 dark:border-gray-800 hover:border-emerald-300'
            }`}
            onClick={() => setSelectedPlan('premium')}
          >
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <div className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                MOST POPULAR
              </div>
            </div>

            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                  Premium Edition
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  eBook + Video tutorials + Templates
                </p>
              </div>
              <div className="flex gap-2">
                <Video className="w-8 h-8 text-emerald-500" />
                <Download className="w-8 h-8 text-emerald-500" />
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-extrabold text-slate-900 dark:text-white">$49</span>
                <span className="text-slate-500">one-time</span>
              </div>
              <div className="text-sm text-emerald-600 dark:text-emerald-400 font-semibold mt-2">
                Save $20 vs buying separately
              </div>
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span className="text-slate-700 dark:text-slate-300 font-semibold">Everything in Basic, plus:</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span className="text-slate-700 dark:text-slate-300">5-hour video tutorial series</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span className="text-slate-700 dark:text-slate-300">Notion templates for AI workflows</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span className="text-slate-700 dark:text-slate-300">Prompt library (500+ prompts)</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span className="text-slate-700 dark:text-slate-300">Exclusive community access</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span className="text-slate-700 dark:text-slate-300">1-on-1 onboarding call (30 min)</span>
              </li>
            </ul>

            <button
              onClick={handlePurchase}
              className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              Get Premium Edition
            </button>
          </div>
        </div>

        {/* What's Inside */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 sm:p-12 shadow-xl mb-16">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8 text-center">
            What's Inside the Guide
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-500" />
                Tool Reviews
              </h3>
              <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                <li>• Detailed pros & cons for each tool</li>
                <li>• Pricing breakdown & best deals</li>
                <li>• Real-world use cases</li>
                <li>• Performance benchmarks</li>
                <li>• User experience ratings</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-500" />
                Industry Scenarios
              </h3>
              <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                <li>• Content creation & marketing</li>
                <li>• Software development</li>
                <li>• Design & creative work</li>
                <li>• Business & productivity</li>
                <li>• Education & research</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-500" />
                Comparison Tables
              </h3>
              <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                <li>• Side-by-side feature comparison</li>
                <li>• Pricing comparison across tiers</li>
                <li>• Performance metrics</li>
                <li>• Integration capabilities</li>
                <li>• Best-for recommendations</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-500" />
                Premium Bonuses
              </h3>
              <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                <li>• Video tutorials (5+ hours)</li>
                <li>• Notion workflow templates</li>
                <li>• 500+ prompt library</li>
                <li>• Community access</li>
                <li>• 1-on-1 onboarding call</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">
            What Readers Say
          </h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                "This guide saved me weeks of research. Found the perfect AI tools for my content workflow!"
              </p>
              <p className="font-semibold text-slate-900 dark:text-white">— Sarah K., Content Creator</p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                "The comparison tables alone are worth the price. Made my decision so much easier."
              </p>
              <p className="font-semibold text-slate-900 dark:text-white">— Mike R., Developer</p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                "Premium edition's video tutorials are fantastic. Learned so much in just a few hours."
              </p>
              <p className="font-semibold text-slate-900 dark:text-white">— Lisa T., Designer</p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 sm:p-12 shadow-xl">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6 max-w-3xl mx-auto">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                What format is the eBook?
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                The eBook comes in PDF format, optimized for reading on any device (desktop, tablet, mobile).
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Do I get free updates?
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Yes! Both Basic and Premium editions include free lifetime updates. Whenever we add new tools or insights, you'll get the updated version automatically.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                What's included in the Premium edition?
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Premium includes everything in Basic, plus 5+ hours of video tutorials, Notion workflow templates, a 500+ prompt library, exclusive community access, and a 30-minute 1-on-1 onboarding call.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Is there a refund policy?
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Yes, we offer a 30-day money-back guarantee. If you're not satisfied, just email us for a full refund.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
