import Link from 'next/link';
import { ArrowRight, Zap, Brain, Shield, Check } from 'lucide-react';
import Footer from '@/app/components/Footer';
import Breadcrumbs from '@/app/components/Breadcrumbs';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Use AI Writer — Write Better, Faster, Cheaper',
  description: 'The AI writing tool built for creators who refuse to overpay. Fast drafts, context-aware, 100% private. Join the waitlist for early access.',
  openGraph: {
    title: 'Use AI Writer — Write Better, Faster, Cheaper',
    description: 'The AI writing tool built for creators who refuse to overpay. Fast drafts, context-aware, 100% private.',
    url: 'https://useaitools.me/writer',
    siteName: 'Use AI Writer',
  },
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

const pricingPlans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for trying out the tool',
    features: [
      '10 generations per day',
      'Basic templates',
      'English language',
      'Community support',
    ],
    cta: 'Join Waitlist',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '$5',
    period: '/month',
    description: 'For creators who write daily',
    features: [
      'Unlimited generations',
      'All templates + custom',
      'English + Chinese',
      'Context memory',
      'Priority support',
    ],
    cta: 'Join Waitlist',
    highlighted: true,
  },
  {
    name: 'Team',
    price: '$15',
    period: '/month',
    description: 'For small teams and agencies',
    features: [
      'Everything in Pro',
      'Up to 5 team members',
      'Shared brand profiles',
      'Collaboration tools',
      'Analytics dashboard',
    ],
    cta: 'Join Waitlist',
    highlighted: false,
  },
];

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

        {/* Hero */}
        <section className="py-16 sm:py-24 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 mb-8">
            <span className="animate-pulse">🚀</span> Coming Soon
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6">
            Use AI Writer —{' '}
            <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              Write Better, Faster, Cheaper
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            The AI writing tool built for creators who refuse to overpay.
          </p>
          <Link
            href="/waitlist"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 hover:-translate-y-0.5 transition-all duration-300"
          >
            Join the Waitlist
            <ArrowRight className="w-5 h-5" />
          </Link>
        </section>

        {/* Features */}
        <section className="py-12">
          <h2 className="text-3xl font-bold text-center mb-10">Why Choose Use AI Writer?</h2>
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

        {/* Pricing */}
        <section className="py-16">
          <h2 className="text-3xl font-bold text-center mb-4">Simple, Honest Pricing</h2>
          <p className="text-gray-400 text-center mb-10 max-w-lg mx-auto">
            No hidden fees. No surprise charges. Just the price you see.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`rounded-2xl p-6 flex flex-col transition-all duration-300 hover:-translate-y-1 ${
                  plan.highlighted
                    ? 'bg-gray-900 border-2 border-emerald-500 shadow-xl shadow-emerald-500/10'
                    : 'bg-gray-900/60 border border-gray-800'
                }`}
              >
                {plan.highlighted && (
                  <span className="self-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500 text-white mb-4">
                    Most Popular
                  </span>
                )}
                <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
                <p className="text-gray-500 text-sm mb-4">{plan.description}</p>
                <div className="mb-6">
                  <span className="text-4xl font-extrabold">{plan.price}</span>
                  <span className="text-gray-500 text-sm ml-1">{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                      <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/waitlist"
                  className={`block text-center py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
                    plan.highlighted
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Domains Preview */}
        <section className="py-12 text-center">
          <p className="text-gray-500 text-sm mb-4">Coming soon at:</p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-emerald-400 font-mono text-sm">
            <span className="px-4 py-2 rounded-lg bg-gray-900 border border-gray-800">tryaiwriter.com</span>
            <span className="px-4 py-2 rounded-lg bg-gray-900 border border-gray-800">useaipen.com</span>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Ready to Write Smarter?</h2>
          <p className="text-gray-400 mb-8 max-w-lg mx-auto">
            Join the waitlist now and lock in early bird pricing for life.
          </p>
          <Link
            href="/waitlist"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 hover:-translate-y-0.5 transition-all duration-300"
          >
            Join Waitlist
            <ArrowRight className="w-5 h-5" />
          </Link>
        </section>
      </div>
      <Footer />
    </div>
  );
}
