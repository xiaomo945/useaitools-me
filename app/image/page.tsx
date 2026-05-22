import Link from 'next/link';
import { ArrowRight, Sparkles, Wand2, Palette, Shield, Check } from 'lucide-react';
import Footer from '@/app/components/Footer';
import Breadcrumbs from '@/app/components/Breadcrumbs';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Use AI Image — Generate Stunning Visuals in Seconds',
  description: 'The AI image generation tool built for creators who refuse to overpay. Fast rendering, commercial license, 100% private. Join the waitlist.',
  openGraph: {
    title: 'Use AI Image — Generate Stunning Visuals in Seconds',
    description: 'The AI image generation tool built for creators who refuse to overpay. Fast rendering, commercial license, 100% private.',
    url: 'https://useaitools.me/image',
    siteName: 'Use AI Image',
  },
};

const features = [
  {
    icon: Sparkles,
    title: 'Instant Generation',
    description: 'From text prompt to high-res image in under 10 seconds. No waiting in queues.',
  },
  {
    icon: Palette,
    title: 'Style Transfer',
    description: 'Photorealistic, anime, oil painting, 3D render — switch styles instantly with one click.',
  },
  {
    icon: Shield,
    title: 'Commercial License',
    description: 'Every generated image is yours to use commercially. No watermarks, no restrictions.',
  },
];

const pricingPlans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for trying out the tool',
    features: [
      '20 generations per day',
      'Standard resolution (512x512)',
      '5 style presets',
      'Community support',
    ],
    cta: 'Join Waitlist',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '$7',
    period: '/month',
    description: 'For creators and designers',
    features: [
      'Unlimited generations',
      'HD resolution (up to 4K)',
      'All styles + custom',
      'Commercial license',
      'Priority rendering',
    ],
    cta: 'Join Waitlist',
    highlighted: true,
  },
  {
    name: 'Team',
    price: '$20',
    period: '/month',
    description: 'For agencies and studios',
    features: [
      'Everything in Pro',
      'Up to 5 team members',
      'Shared style libraries',
      'API access',
      'Brand consistency tools',
    ],
    cta: 'Join Waitlist',
    highlighted: false,
  },
];

export default function ImagePage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Use AI Image', href: '/image', current: true },
          ]}
        />

        {/* Hero */}
        <section className="py-16 sm:py-24 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-violet-500/20 text-violet-400 border border-violet-500/30 mb-8">
            <span className="animate-pulse">🎨</span> Coming Soon
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6">
            Use AI Image —{' '}
            <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              Generate Stunning Visuals in Seconds
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            The AI image generation tool built for creators who refuse to overpay.
          </p>
          <Link
            href="/waitlist"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-semibold rounded-xl shadow-lg shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/30 hover:-translate-y-0.5 transition-all duration-300"
          >
            Join the Waitlist
            <ArrowRight className="w-5 h-5" />
          </Link>
        </section>

        {/* Features */}
        <section className="py-12">
          <h2 className="text-3xl font-bold text-center mb-10">Why Choose Use AI Image?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-violet-500/30 hover:shadow-xl hover:shadow-violet-500/5 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-violet-400" />
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
                    ? 'bg-gray-900 border-2 border-violet-500 shadow-xl shadow-violet-500/10'
                    : 'bg-gray-900/60 border border-gray-800'
                }`}
              >
                {plan.highlighted && (
                  <span className="self-center px-3 py-1 rounded-full text-xs font-semibold bg-violet-500 text-white mb-4">
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
                      <Check className="w-4 h-4 text-violet-400 flex-shrink-0 mt-0.5" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/waitlist"
                  className={`block text-center py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
                    plan.highlighted
                      ? 'bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-lg shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/30'
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
          <div className="flex flex-wrap items-center justify-center gap-4 text-violet-400 font-mono text-sm">
            <span className="px-4 py-2 rounded-lg bg-gray-900 border border-gray-800">useaiimage.me</span>
            <span className="px-4 py-2 rounded-lg bg-gray-900 border border-gray-800">useaigen.art</span>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Ready to Create Without Limits?</h2>
          <p className="text-gray-400 mb-8 max-w-lg mx-auto">
            Join the waitlist now and lock in early bird pricing for life.
          </p>
          <Link
            href="/waitlist"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-semibold rounded-xl shadow-lg shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/30 hover:-translate-y-0.5 transition-all duration-300"
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
