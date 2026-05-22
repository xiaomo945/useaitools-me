import Link from 'next/link';
import { ArrowRight, Zap, Brain, Shield, Check, X } from 'lucide-react';
import Footer from '@/app/components/Footer';
import Breadcrumbs from '@/app/components/Breadcrumbs';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Meet Use AI Writer — The AI Writing Tool for Creators',
  description: 'Write blog posts, emails, and social content in seconds. Use AI Writer costs $5/mo vs Jasper $49/mo. Join the waitlist for early access.',
  openGraph: {
    title: 'Meet Use AI Writer — The AI Writing Tool for Creators',
    description: 'Write blog posts, emails, and social content in seconds. Use AI Writer costs $5/mo vs Jasper $49/mo. Join the waitlist for early access.',
    url: 'https://useaitools.me/writer',
    siteName: 'Use AI Writer',
  },
};

const features = [
  {
    icon: Zap,
    title: 'Lightning Fast Drafts',
    description: 'Generate blog posts, emails, and social content in seconds. From prompt to polished in under 30 seconds.',
  },
  {
    icon: Brain,
    title: 'Deep Context Awareness',
    description: 'Remembers your brand voice, style preferences, and audience. No more starting from scratch every time.',
  },
  {
    icon: Shield,
    title: '100% Private & Secure',
    description: 'Your data stays yours. No training on your content, no selling your information. Enterprise-grade privacy.',
  },
];

const comparisonData = {
  headers: ['Feature', 'Use AI Writer', 'Jasper', 'Copy.ai'],
  rows: [
    { feature: 'Price', ours: '$5/mo', jasper: '$49/mo', copyai: '$49/mo' },
    { feature: 'Unlimited Words', ours: '✅', jasper: '✅', copyai: '✅' },
    { feature: 'Brand Voice Memory', ours: '✅', jasper: 'Partial', copyai: 'Partial' },
    { feature: 'Multilingual (EN + CN)', ours: '✅', jasper: '✅', copyai: 'Limited' },
    { feature: 'Context Window', ours: 'Deep', jasper: 'Standard', copyai: 'Standard' },
    { feature: 'Free Plan', ours: '10 gens/day', jasper: 'No', copyai: 'Limited' },
    { feature: 'Commercial License', ours: '✅', jasper: '✅', copyai: '✅' },
    { feature: 'API Access', ours: 'Coming Soon', jasper: 'Enterprise', copyai: 'Business' },
  ],
};

const EditorIllustration = () => (
  <div className="relative w-full max-w-md mx-auto lg:mx-0">
    <div className="bg-gray-800 rounded-2xl border border-gray-700 shadow-2xl overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 bg-gray-900 border-b border-gray-700">
        <div className="w-3 h-3 rounded-full bg-red-400" />
        <div className="w-3 h-3 rounded-full bg-yellow-400" />
        <div className="w-3 h-3 rounded-full bg-green-400" />
        <span className="ml-4 text-xs text-gray-500 font-mono">Use AI Writer — Editor</span>
      </div>
      <div className="p-6 space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-emerald-400 text-sm font-mono">Prompt:</span>
        </div>
        <div className="bg-gray-900 rounded-lg p-3 border border-gray-700">
          <p className="text-gray-300 text-xs leading-relaxed font-mono">
            &quot;Write a compelling blog intro about AI writing tools...&quot;
          </p>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-400 text-xs">Generating...</span>
          </div>
          <div className="flex gap-1">
            <div className="w-6 h-2 rounded bg-emerald-500/40" />
            <div className="w-4 h-2 rounded bg-emerald-500/60" />
            <div className="w-3 h-2 rounded bg-emerald-500/80" />
          </div>
        </div>
        <div className="bg-gray-900 rounded-lg p-3 border border-gray-700">
          <p className="text-gray-300 text-xs leading-relaxed">
            <span className="text-emerald-400">The best AI writing tools</span> in 2026 don&apos;t just generate text — they understand your <span className="text-violet-400">brand voice</span>, remember your <span className="text-amber-400">audience preferences</span>, and deliver polished drafts in seconds...
          </p>
        </div>
      </div>
    </div>
    <div className="absolute -top-4 -right-4 w-20 h-20 bg-emerald-500/20 rounded-full blur-xl" />
    <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-teal-500/10 rounded-full blur-xl" />
  </div>
);

export default function WriterPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Use AI Writer', href: '/writer', current: true },
          ]}
        />

        {/* Hero Section */}
        <section className="py-16 sm:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 mb-6">
                <span className="animate-pulse">🚀</span> Coming Soon
              </div>
              <h1 className="text-4xl sm:text-5xl font-extrabold mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                Meet Use AI Writer
              </h1>
              <p className="text-lg sm:text-xl text-gray-400 mb-8 leading-relaxed">
                The AI writing tool built for creators who refuse to overpay.
              </p>
              <Link
                href="/waitlist"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 hover:-translate-y-0.5 transition-all duration-300"
              >
                Join the Waitlist for Early Access
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            <div className="hidden lg:block">
              <EditorIllustration />
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-12">
          <h2 className="text-3xl font-bold text-center mb-10" style={{ fontFamily: 'Playfair Display, serif' }}>
            Why Choose Use AI Writer?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Comparison Table */}
        <section className="py-16">
          <h2 className="text-3xl font-bold text-center mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            The Numbers Speak for Themselves
          </h2>
          <p className="text-gray-400 text-center mb-10 max-w-lg mx-auto">
            Same core features. 90% lower price. Here&apos;s how we compare.
          </p>
          <div className="overflow-x-auto">
            <div className="min-w-[600px] bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-800">
                    {comparisonData.headers.map((h, i) => (
                      <th
                        key={i}
                        className={`px-4 py-4 font-semibold text-left ${
                          i === 1 ? 'bg-emerald-500/10 text-emerald-400' : 'text-gray-400'
                        }`}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {comparisonData.rows.map((row, i) => (
                    <tr key={i} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                      <td className="px-4 py-3 text-gray-300 font-medium">{row.feature}</td>
                      <td className="px-4 py-3 bg-emerald-500/5 text-emerald-400 font-semibold">{row.ours}</td>
                      <td className="px-4 py-3 text-gray-400">{row.jasper}</td>
                      <td className="px-4 py-3 text-gray-400">{row.copyai}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Use AI Writer saves you <span className="text-emerald-400 font-bold">$528/year</span> compared to Jasper.
            </p>
          </div>
        </section>

        {/* Domain Banner */}
        <section className="py-8">
          <div className="bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-emerald-500/10 border border-emerald-500/20 rounded-2xl p-8 text-center">
            <p className="text-lg sm:text-xl font-bold text-white mb-2">
              🚀 Launching soon at <span className="text-emerald-400">tryaiwriter.com</span>
            </p>
            <p className="text-gray-400">Early bird pricing available — join now and lock in $5/mo for life.</p>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-16 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            Ready to Write Smarter?
          </h2>
          <p className="text-gray-400 mb-8 max-w-lg mx-auto">
            Join the waitlist now and be among the first to shape this product.
          </p>
          <Link
            href="/waitlist"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 hover:-translate-y-0.5 transition-all duration-300"
          >
            Join the Waitlist for Early Access
            <ArrowRight className="w-5 h-5" />
          </Link>
        </section>
      </div>
      <Footer />
    </div>
  );
}
