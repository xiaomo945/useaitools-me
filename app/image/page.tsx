import Link from 'next/link';
import { ArrowRight, Sparkles, Palette, Shield, Image as ImageIcon } from 'lucide-react';
import Footer from '@/app/components/Footer';
import Breadcrumbs from '@/app/components/Breadcrumbs';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Use AI Image — Your Imagination, Visualized',
  description: 'Create stunning visuals in seconds with AI. Text to image, multiple art styles, commercial use allowed. No design skills needed.',
  openGraph: {
    title: 'Use AI Image — Your Imagination, Visualized',
    description: 'Create stunning visuals in seconds with AI. Text to image, multiple art styles, commercial use allowed.',
    url: 'https://useaitools.me/image',
    siteName: 'Use AI Image',
  },
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

const demoPrompts = [
  'A cozy coffee shop at sunrise, warm golden light, cinematic lighting',
  'A futuristic cityscape with flying cars, neon lights, cyberpunk style',
  'A cute cat wearing a tiny astronaut helmet floating in space, cartoon style',
  'A serene Japanese garden in autumn, red maple leaves, peaceful atmosphere',
];

const DemoIllustration = () => (
  <div className="relative w-full max-w-2xl mx-auto">
    <div className="bg-gray-800 rounded-2xl border border-gray-700 shadow-2xl overflow-hidden">
      {/* Prompt Input Area */}
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

      {/* Generated Images Grid */}
      <div className="p-4 sm:p-6">
        <p className="text-xs text-gray-500 mb-3">Generated Variations</p>
        <div className="grid grid-cols-2 gap-3">
          {[
            'from-violet-500/30 to-fuchsia-500/30',
            'from-blue-500/30 to-cyan-500/30',
            'from-amber-500/30 to-orange-500/30',
            'from-emerald-500/30 to-teal-500/30',
          ].map((gradient, i) => (
            <div
              key={i}
              className={`aspect-square rounded-xl bg-gradient-to-br ${gradient} border border-gray-700 flex items-center justify-center`}
            >
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

        {/* Hero Section */}
        <section className="py-16 sm:py-24 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-violet-500/20 text-violet-400 border border-violet-500/30 mb-8">
            <span className="animate-pulse">🎨</span> Coming Soon
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            Use AI Image —{' '}
            <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              Your Imagination, Visualized
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Create stunning visuals in seconds. No design skills needed.
          </p>
          <Link
            href="/waitlist"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-semibold rounded-xl shadow-lg shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/30 hover:-translate-y-0.5 transition-all duration-300"
          >
            Get Early Access
            <ArrowRight className="w-5 h-5" />
          </Link>
        </section>

        {/* Demo Section */}
        <section className="py-12">
          <h2 className="text-3xl font-bold text-center mb-10" style={{ fontFamily: 'Playfair Display, serif' }}>
            See How It Works
          </h2>
          <DemoIllustration />
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Just type a prompt, choose a style, and get stunning images in seconds.
            </p>
          </div>
        </section>

        {/* Features */}
        <section className="py-12">
          <h2 className="text-3xl font-bold text-center mb-10" style={{ fontFamily: 'Playfair Display, serif' }}>
            Why Choose Use AI Image?
          </h2>
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

        {/* Domain Banner */}
        <section className="py-8">
          <div className="bg-gradient-to-r from-violet-500/10 via-fuchsia-500/10 to-violet-500/10 border border-violet-500/20 rounded-2xl p-8 text-center">
            <p className="text-lg sm:text-xl font-bold text-white mb-2">
              🎨 Launching soon at <span className="text-violet-400">useaiimage.com</span>
            </p>
            <p className="text-gray-400">Early bird pricing available — join the waitlist to lock in the best price.</p>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-16 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            Ready to Create Without Limits?
          </h2>
          <p className="text-gray-400 mb-8 max-w-lg mx-auto">
            Join the waitlist now and be among the first to shape this product.
          </p>
          <Link
            href="/waitlist"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-semibold rounded-xl shadow-lg shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/30 hover:-translate-y-0.5 transition-all duration-300"
          >
            Get Early Access
            <ArrowRight className="w-5 h-5" />
          </Link>
        </section>
      </div>
      <Footer />
    </div>
  );
}
