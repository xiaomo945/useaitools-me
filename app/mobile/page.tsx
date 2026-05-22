import Link from 'next/link';
import { ArrowRight, Bell, WifiOff, Grid, Home } from 'lucide-react';
import Footer from '@/app/components/Footer';
import Breadcrumbs from '@/app/components/Breadcrumbs';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Use AI Tools — Coming to iOS & Android',
  description: 'Your favorite AI tools, now in your pocket. Get push notifications, offline access, and widget support for the best AI tools.',
  openGraph: {
    title: 'Use AI Tools — Coming to iOS & Android',
    description: 'Your favorite AI tools, now in your pocket.',
    url: 'https://useaitools.me/mobile',
    siteName: 'Use AI Tools',
  },
};

const features = [
  {
    icon: Bell,
    title: 'Push Notifications',
    description: 'Get notified when new AI tools launch or when your favorite tools update. Never miss a breakthrough.',
  },
  {
    icon: WifiOff,
    title: 'Offline Access',
    description: 'Save your favorite tools, read reviews, and browse categories — even without an internet connection.',
  },
  {
    icon: Grid,
    title: 'Widget Support',
    description: 'Quick-access widgets on your home screen for your most-used AI tools. One tap, instant access.',
  },
];

export default function MobilePage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Mobile App', href: '/mobile', current: true },
          ]}
        />

        {/* Hero Section */}
        <section className="py-12 sm:py-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 mb-6">
            <span className="animate-pulse">📱</span> Coming Soon
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            Use AI Tools
          </h1>
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent mb-4">
            Your Imagination, Visualized
          </h2>
          <p className="text-lg sm:text-xl text-slate-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed mb-10">
            Your favorite AI tools, now in your pocket.
          </p>

          {/* Download Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            {/* Google Play */}
            <div className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gray-200 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-center gap-3 opacity-60 cursor-not-allowed">
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
                <path d="M3 20.5V3.5C3 2.91 3.34 2.39 3.84 2.15L13.69 12L3.84 21.85C3.34 21.61 3 21.09 3 20.5Z" fill="currentColor"/>
                <path d="M16.81 15.12L6.05 21.34L14.54 12.85L16.81 15.12Z" fill="currentColor"/>
                <path d="M20.16 10.81C20.5 11.08 20.75 11.5 20.75 12C20.75 12.5 20.5 12.92 20.16 13.19L17.89 14.5L15.39 12L17.89 9.5L20.16 10.81Z" fill="currentColor"/>
                <path d="M6.05 2.66L16.81 8.88L14.54 11.15L6.05 2.66Z" fill="currentColor"/>
              </svg>
              <div className="text-left">
                <p className="text-xs text-gray-500 dark:text-gray-400">Coming Soon</p>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Google Play</p>
              </div>
            </div>
            {/* App Store */}
            <div className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gray-200 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-center gap-3 opacity-60 cursor-not-allowed">
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5C18.32 20.07 17.7 20.5 17 20.5C16.3 20.5 15.7 20.07 15.29 19.5C14.88 18.93 14.5 18.07 14.5 17.25C14.5 16.43 14.88 15.57 15.29 15C15.7 14.43 16.3 14 17 14C17.7 14 18.32 14.43 18.71 15C19.1 15.57 19.5 16.43 19.5 17.25C19.5 18.07 19.1 18.93 18.71 19.5ZM13 3.5C13.5 4 14 4.5 14.5 4.5C15 4.5 15.5 4 16 3.5C16.5 3 17 2.5 17.5 2.5C18 2.5 18.5 3 19 3.5C19.5 4 20 4.5 20 4.5C20 4.5 20.5 4 21 3.5C21.5 3 22 2.5 22 2.5C22 2.5 21.5 3 21 3.5C20.5 4 20 4.5 20 4.5C20 4.5 20.5 5 21 5.5C21.5 6 22 6.5 22 6.5C22 6.5 21.5 6 21 5.5C20.5 5 20 4.5 20 4.5C20 4.5 19.5 5 19 5.5C18.5 6 18 6.5 17.5 6.5C17 6.5 16.5 6 16 5.5C15.5 5 15 4.5 15 4.5C15 4.5 14.5 5 14 5.5C13.5 6 13 6.5 13 6.5C13 6.5 13.5 6 14 5.5C14.5 5 15 4.5 15 4.5C15 4.5 14.5 4 14 3.5C13.5 3 13 2.5 13 2.5C13 2.5 13.5 3 14 3.5ZM9 6.5C9 7.5 9.5 8.5 10 9C10.5 9.5 11.5 10 12 10C12.5 10 13.5 9.5 14 9C14.5 8.5 15 7.5 15 6.5C15 5.5 14.5 4.5 14 4C13.5 3.5 12.5 3 12 3C11.5 3 10.5 3.5 10 4C9.5 4.5 9 5.5 9 6.5Z"/>
              </svg>
              <div className="text-left">
                <p className="text-xs text-gray-500 dark:text-gray-400">Coming Soon</p>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">App Store</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-12">
          <h2 className="text-3xl font-bold text-center mb-10 text-slate-900 dark:text-white" style={{ fontFamily: 'Playfair Display, serif' }}>
            What&apos;s Coming
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-slate-600 dark:text-gray-300 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-16 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            Want Early Access?
          </h2>
          <p className="text-slate-600 dark:text-gray-300 mb-8 max-w-lg mx-auto">
            Join the waitlist and be the first to know when we launch on iOS and Android.
          </p>
          <Link
            href="/waitlist"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 hover:-translate-y-0.5 transition-all duration-300"
          >
            Join the Waitlist
            <ArrowRight className="w-5 h-5" />
          </Link>
        </section>

        <div className="text-center mt-8">
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
