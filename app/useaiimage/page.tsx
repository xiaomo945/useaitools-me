import Link from 'next/link';
import { ArrowRight, Sparkles, Palette, Shield, Check, Image as ImageIcon } from 'lucide-react';
import { Metadata } from 'next';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Use AI Image — Your Imagination, Visualized | useaiimage.com',
  description: 'Create stunning visuals in seconds with AI. Text to image, multiple art styles, commercial use allowed. No design skills needed.',
  openGraph: {
    title: 'Use AI Image — Your Imagination, Visualized',
    description: 'Create stunning visuals in seconds with AI. Text to image, multiple art styles, commercial use allowed.',
    url: 'https://useaiimage.com',
    siteName: 'Use AI Image',
    type: 'website',
  },
  alternates: {
    canonical: 'https://useaiimage.com',
  },
};

const schemaOrg = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Use AI Image',
  applicationCategory: 'DesignApplication',
  operatingSystem: 'Web',
  description: 'AI image generation tool. Create stunning visuals in seconds. Text to image, multiple art styles, commercial use allowed.',
  url: 'https://useaiimage.com',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    description: 'Free plan: 20 generations per day',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.7',
    ratingCount: '89',
    bestRating: '5',
  },
  featureList: [
    'Text to Image in Seconds',
    'Multiple Art Styles',
    'Commercial Use Allowed',
    'HD Resolution up to 4K',
    'No Watermarks',
  ],
};

const features = [
  {
    icon: Sparkles,
    title: 'Text to Image in Seconds',
    description: 'Describe what you want to see. Our AI generates high-quality images from your prompt in under 10 seconds.',
  },
  {
    icon: Palette,
    title: 'Multiple Art Styles',
    description: 'Photorealistic, anime, oil painting, watercolor, 3D render, pixel art — switch styles with one click.',
  },
  {
    icon: Shield,
    title: 'Commercial Use Allowed',
    description: 'Every generated image is yours to use commercially. No watermarks, no restrictions, no hidden fees.',
  },
];

const pricingPlans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for trying out the tool',
    features: ['20 generations per day', 'Standard resolution (512x512)', '5 style presets', 'Community support'],
    cta: 'Join Waitlist',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '$7',
    period: '/month',
    description: 'For creators and designers',
    features: ['Unlimited generations', 'HD resolution (up to 4K)', 'All styles + custom', 'Commercial license', 'Priority rendering'],
    cta: 'Join Waitlist',
    highlighted: true,
  },
  {
    name: 'Team',
    price: '$20',
    period: '/month',
    description: 'For agencies and studios',
    features: ['Everything in Pro', 'Up to 5 team members', 'Shared style libraries', 'API access', 'Brand consistency tools'],
    cta: 'Join Waitlist',
    highlighted: false,
  },
];

const DemoIllustration = () => (
  <div className="relative w-full max-w-2xl mx-auto">
    <div className="bg-gray-800 rounded-2xl border border-gray-700 shadow-2xl overflow-hidden">
      <div className="p-4 sm:p-6 border-b border-gray-700">
        <div className="flex items-center gap-2 mb-3">
          <ImageIcon className="w-5 h-5 text-violet-400" />
          <span className="text-sm font-semibold text-gray-300">Image Generator</span>
        </div>
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-700">
          <p className="text-gray-300 text-xs sm:text-sm leading-relaxed font-mono">
            &quot;A cozy coffee shop at sunrise, warm golden light, cinematic lighting&quot;
          </p>
          <div className="mt-3 flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full w-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full" />
            </div>
            <span className="text-violet-400 text-xs font-mono">100%</span>
          </div>
        </div>
      </div>
      <div className="p-4 sm:p-6">
        <p className="text-xs text-gray-500 mb-3">Generated Variations</p>
        <div className="grid grid-cols-2 gap-3">
          {[
            'from-violet-500/30 to-fuchsia-500/30',
            'from-blue-500/30 to-cyan-500/30',
            'from-amber-500/30 to-orange-500/30',
            'from-emerald-500/30 to-teal-500/30',
          ].map((gradient, i) => (
            <div key={i} className={`aspect-square rounded-xl bg-gradient-to-br ${gradient} border border-gray-700 flex items-center justify-center`}>
              <div className="text-center">
                <div className="w-8 h-8 mx-auto mb-2 rounded-full bg-white/10 flex items-center justify-center">
                  <ImageIcon className="w-4 h-4 text-white/60" />
                </div>
                <span className="text-white/50 text-[10px]">Variation {i + 1}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    <div className="absolute -top-6 -right-6 w-24 h-24 bg-violet-500/20 rounded-full blur-2xl" />
    <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-fuchsia-500/10 rounded-full blur-2xl" />
  </div>
);

export default function UseAIImagePage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Script id="schema-org" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Top Nav */}
        <nav className="flex items-center justify-between py-4 border-b border-gray-800/50">
          <Link href="/" className="text-lg font-bold text-violet-400 hover:text-violet-300 transition-colors">
            useaiimage.com
          </Link>
          <Link href="/waitlist" className="px-4 py-2 rounded-lg bg-violet-500/20 text-violet-400 text-sm font-semibold border border-violet-500/30 hover:bg-violet-500/30 transition-all duration-300">
            Join Waitlist
          </Link>
        </nav>

        {/* Hero */}
        <section className="py-20 sm:py-28 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-violet-500/20 text-violet-400 border border-violet-500/30 mb-8">
            <span className="animate-pulse">🎨</span> Coming Soon
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 font-serif">
            Use AI Image —{' '}
            <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              Your Imagination, Visualized
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-4 leading-relaxed">
            Create stunning visuals in seconds. No design skills needed.
          </p>
          <p className="text-sm text-gray-500 max-w-lg mx-auto mb-10">
            Text to image, multiple art styles, commercial use allowed. All for $7/mo.
          </p>
          <Link href="/waitlist" className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-semibold rounded-xl shadow-lg shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/30 hover:-translate-y-0.5 transition-all duration-300">
            Get Early Access
            <ArrowRight className="w-5 h-5" />
          </Link>
        </section>

        {/* Demo */}
        <section className="py-12">
          <h2 className="text-3xl font-bold text-center mb-10 font-serif">
            See How It Works
          </h2>
          <DemoIllustration />
          <p className="mt-8 text-center text-sm text-gray-500">
            Just type a prompt, choose a style, and get stunning images in seconds.
          </p>
        </section>

        {/* Features */}
        <section className="py-12">
          <h2 className="text-3xl font-bold text-center mb-10 font-serif">
            Why Choose Use AI Image?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-violet-500/30 hover:shadow-xl hover:shadow-violet-500/5 transition-all duration-300">
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
          <h2 className="text-3xl font-bold text-center mb-4 font-serif">
            Simple, Honest Pricing
          </h2>
          <p className="text-gray-400 text-center mb-10 max-w-lg mx-auto">
            No hidden fees. No surprise charges. Just the price you see.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <div key={index} className={`rounded-2xl p-6 flex flex-col transition-all duration-300 hover:-translate-y-1 ${plan.highlighted ? 'bg-gray-900 border-2 border-violet-500 shadow-xl shadow-violet-500/10' : 'bg-gray-900/60 border border-gray-800'}`}>
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
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                      <Check className="w-4 h-4 text-violet-400 flex-shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/waitlist" className={`block text-center py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${plan.highlighted ? 'bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-lg shadow-violet-500/25' : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'}`}>
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 text-center border-t border-gray-800/50">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 font-serif">
            Ready to Create Without Limits?
          </h2>
          <p className="text-gray-400 mb-8 max-w-lg mx-auto">
            Join the waitlist now and be among the first to shape this product.
          </p>
          <Link href="/waitlist" className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-semibold rounded-xl shadow-lg shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/30 hover:-translate-y-0.5 transition-all duration-300">
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
