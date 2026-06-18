import Link from 'next/link';
import { ArrowRight, Zap, Brain, Shield, Check } from 'lucide-react';
import { Metadata } from 'next';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Use AI Pen — Simple, Affordable AI Writing | useaipen.com',
  description: 'Use AI Pen is the simple AI writing tool for everyone. Write blog posts, emails, and social content in seconds. Only $3/mo for unlimited generations.',
  openGraph: {
    title: 'Use AI Pen — Simple, Affordable AI Writing',
    description: 'Use AI Pen is the simple AI writing tool for everyone. Write blog posts, emails, and social content in seconds.',
    url: 'https://useaipen.com',
    siteName: 'Use AI Pen',
    type: 'website',
  },
  alternates: {
    canonical: 'https://useaipen.com',
  },
};

const schemaOrg = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Use AI Pen',
  applicationCategory: 'WritingApplication',
  operatingSystem: 'Web',
  description: 'Simple AI writing tool for everyone. Write blog posts, emails, and social content in seconds. Only $3/mo.',
  url: 'https://useaipen.com',
  offers: {
    '@type': 'Offer',
    price: '3',
    priceCurrency: 'USD',
    description: 'Pro plan: $3/month, unlimited generations',
  },
  featureList: [
    'Simple Interface',
    'Fast Generation',
    'Affordable Pricing',
    'Multilingual Support',
    'No Account Required for Free Plan',
  ],
};

const features = [
  {
    icon: Zap,
    title: 'Simple Interface',
    description: 'No complex settings, no overwhelming menus. Just type and get results. Designed for everyone, not just power users.',
  },
  {
    icon: Brain,
    title: 'Smart Writing',
    description: 'Powered by the latest AI models. Understands context, tone, and intent to produce natural-sounding content.',
  },
  {
    icon: Shield,
    title: 'Affordable for All',
    description: 'Only $3/month for unlimited generations. The most affordable AI writing tool on the market.',
  },
];

const pricingPlans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'No account needed',
    features: ['5 generations per day', 'Basic templates', 'English language'],
    cta: 'Start Writing',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '$3',
    period: '/month',
    description: 'For daily writers',
    features: ['Unlimited generations', 'All templates', 'English + Chinese + 10 more', 'Priority support'],
    cta: 'Join Waitlist',
    highlighted: true,
  },
];

export default function UseAIPenPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Script id="schema-org" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Top Nav */}
        <nav className="flex items-center justify-between py-4 border-b border-gray-800/50">
          <Link href="/" className="text-lg font-bold text-teal-400 hover:text-teal-300 transition-colors">
            useaipen.com
          </Link>
          <Link href="/waitlist" className="px-4 py-2 rounded-lg bg-teal-500/20 text-teal-400 text-sm font-semibold border border-teal-500/30 hover:bg-teal-500/30 transition-all duration-300">
            Join Waitlist
          </Link>
        </nav>

        {/* Hero */}
        <section className="py-20 sm:py-28 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-teal-500/20 text-teal-400 border border-teal-500/30 mb-8">
            <span className="animate-pulse">✏️</span> Coming Soon
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 font-serif">
            Use AI Pen —{' '}
            <span className="bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">
              Write Simply, Write Smart
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-4 leading-relaxed">
            The AI writing tool for everyone. No complexity, no high prices.
          </p>
          <p className="text-sm text-gray-500 max-w-lg mx-auto mb-10">
            Just type your prompt and get results in seconds. Only $3/month for unlimited writing.
          </p>
          <Link href="/waitlist" className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-semibold rounded-xl shadow-lg shadow-teal-500/25 hover:shadow-xl hover:shadow-teal-500/30 hover:-translate-y-0.5 transition-all duration-300">
            Get Early Access
            <ArrowRight className="w-5 h-5" />
          </Link>
        </section>

        {/* Features */}
        <section className="py-12">
          <h2 className="text-3xl font-bold text-center mb-10 font-serif">
            Why Use AI Pen?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-teal-500/30 hover:shadow-xl hover:shadow-teal-500/5 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-teal-500/20 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-teal-400" />
                </div>
                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing */}
        <section className="py-16">
          <h2 className="text-3xl font-bold text-center mb-4 font-serif">
            Simple Pricing, Real Value
          </h2>
          <p className="text-gray-400 text-center mb-10 max-w-lg mx-auto">
            We believe AI writing should be accessible to everyone.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <div key={index} className={`rounded-2xl p-6 flex flex-col transition-all duration-300 hover:-translate-y-1 ${plan.highlighted ? 'bg-gray-900 border-2 border-teal-500 shadow-xl shadow-teal-500/10' : 'bg-gray-900/60 border border-gray-800'}`}>
                {plan.highlighted && (
                  <span className="self-center px-3 py-1 rounded-full text-xs font-semibold bg-teal-500 text-white mb-4">
                    Best Value
                  </span>
                )}
                <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
                <p className="text-gray-500 text-sm mb-4">{plan.description}</p>
                <div className="mb-6">
                  <span className="text-4xl font-extrabold">{plan.price}</span>
                  <span className="text-gray-500 text-sm ml-1">{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                      <Check className="w-4 h-4 text-teal-400 flex-shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/waitlist" className={`block text-center py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${plan.highlighted ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-lg shadow-teal-500/25' : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'}`}>
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 text-center border-t border-gray-800/50">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 font-serif">
            Ready to Start Writing?
          </h2>
          <p className="text-gray-400 mb-8 max-w-lg mx-auto">
            Join the waitlist now and be among the first to use Use AI Pen.
          </p>
          <Link href="/waitlist" className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-semibold rounded-xl shadow-lg shadow-teal-500/25 hover:shadow-xl hover:shadow-teal-500/30 hover:-translate-y-0.5 transition-all duration-300">
            Get Early Access
            <ArrowRight className="w-5 h-5" />
          </Link>
          <div className="mt-8">
            <Link href="/" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">
              ← Back to useaitools.me
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
