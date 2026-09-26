import Link from 'next/link';
import Footer from '@/app/components/Footer';
import { Metadata } from 'next';
import Breadcrumbs from '@/app/components/Breadcrumbs';

export const metadata: Metadata = {
  title: 'Advertise on Use AI Tools — Reach AI Buyers',
  description: 'Put your AI tool in front of thousands of active buyers. Categories from $50, homepage features $150, in-content placements $300 per 30 days.',
  openGraph: {
    title: 'Advertise on Use AI Tools — Reach AI Buyers',
    description: 'Put your AI tool in front of thousands of active buyers. Categories from $50, homepage features $150, in-content placements $300 per 30 days.',
    url: 'https://useaitools.me/advertise',
    siteName: 'Use AI Tools',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Advertise on Use AI Tools — Reach AI Buyers',
    description: 'Put your AI tool in front of thousands of active buyers. Choose from homepage features, category banners, tool recommendations, blog sponsorships, and newsletter ads.',
  },
  alternates: {
    canonical: 'https://useaitools.me/advertise',
  },
};

interface AdOption {
  icon: string;
  title: string;
  price: string;
  description: string;
  features: string[];
  popular?: boolean;
  cta: string;
}

/**
 * Rates must match the packages sold on /sponsored. These quotes used to read
 * $15-$49 while the checkout listed $50-$300, and every visitor who compared
 * the two pages bounced. One rate card, two views of it.
 */
const adOptions: AdOption[] = [
  {
    icon: '📂',
    title: 'Category Placement',
    price: '$50 / 30 days',
    description: 'Sidebar placement on the category pages your buyers browse',
    features: [
      'Sidebar placement on your chosen category',
      'Reaches users already interested in your niche',
      '6 categories: Writing, Image, Code, Audio, Video, Productivity',
      'Click and view tracking included',
    ],
    cta: 'Choose this package',
  },
  {
    icon: '🏠',
    title: 'Homepage Feature',
    price: '$150 / 30 days',
    description: 'Featured position on the homepage for 30 days',
    features: [
      'Premium position on the homepage',
      'Visible to all visitors immediately',
      'Includes tool name, logo, and tagline',
      'Priority placement, 30-day rotation',
    ],
    popular: true,
    cta: 'Choose this package',
  },
  {
    icon: '📝',
    title: 'In-Content Placement',
    price: '$300 / 30 days',
    description: 'Best available placement inside the content flow',
    features: [
      'Placement alongside related editorial content',
      'Includes product description and CTA link',
      'Multi-position display',
      'Custom performance report',
    ],
    cta: 'Choose this package',
  },
];

export default function AdvertisePage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    'name': 'Advertise on Use AI Tools',
    'description': 'Put your AI tool in front of thousands of active buyers with homepage features, category banners, tool recommendations, blog sponsorships, and newsletter ads.',
    'url': 'https://useaitools.me/advertise',
    'publisher': {
      '@type': 'Organization',
      'name': 'Use AI Tools',
      'logo': {
        '@type': 'ImageObject',
        'url': 'https://useaitools.me/logo.png',
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen bg-slate-50 dark:bg-gray-950 py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {/* Breadcrumbs */}
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Advertise', href: '/advertise', current: true },
            ]}
          />

          {/* Hero */}
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
              <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
                Advertise on Use AI Tools
              </span>
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Put your AI tool in front of thousands of active buyers searching for the right solution.
            </p>
          </div>

          {/* How buying works — there is no instant checkout yet */}
          <div className="mb-16 rounded-2xl border border-amber-200 bg-amber-50 dark:border-amber-900/40 dark:bg-amber-950/30 p-6 sm:p-8">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
              How it works
            </h2>
            <ol className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-sm text-slate-700 dark:text-slate-300">
              <li>
                <span className="font-semibold text-slate-900 dark:text-white">1. Request</span>
                <br />
                Pick a package and submit your listing details.
              </li>
              <li>
                <span className="font-semibold text-slate-900 dark:text-white">2. Pay</span>
                <br />
                We confirm the payment by email before going live.
              </li>
              <li>
                <span className="font-semibold text-slate-900 dark:text-white">3. Go live</span>
                <br />
                Your ad goes up for the agreed 30 days.
              </li>
              <li>
                <span className="font-semibold text-slate-900 dark:text-white">4. Track</span>
                <br />
                Watch clicks and views from your account.
              </li>
            </ol>
            <p className="mt-4 text-xs text-slate-600 dark:text-slate-400">
              Prices are per 30 days and match the packages listed below. A listing
              is only shown after the payment is confirmed — nobody gets a slot by
              submitting a request alone.
            </p>
          </div>

          {/* Audience Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
            <div className="text-center p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-slate-200/60 dark:border-gray-800/80">
              <div className="text-4xl font-extrabold bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent mb-2">
                1,300+
              </div>
              <div className="text-slate-600 dark:text-slate-300 font-medium">AI Tools Listed</div>
            </div>
            <div className="text-center p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-slate-200/60 dark:border-gray-800/80">
              <div className="text-4xl font-extrabold bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent mb-2">
                700+
              </div>
              <div className="text-slate-600 dark:text-slate-300 font-medium">Articles Published</div>
            </div>
            <div className="text-center p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-slate-200/60 dark:border-gray-800/80">
              <div className="text-4xl font-extrabold bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent mb-2">
                1,100+
              </div>
              <div className="text-slate-600 dark:text-slate-300 font-medium">Google Indexed Pages</div>
            </div>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-emerald-300 dark:via-emerald-700/40 to-transparent mb-16" />

          {/* Advertising Options */}
          <div className="mb-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
              Choose Your Advertising Option
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-xl mx-auto">
              Flexible options for every budget. No long-term contracts required.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {adOptions.map((option) => (
              <div
                key={option.title}
                className={`relative bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/5 ${
                  option.popular
                    ? 'border-emerald-300 dark:border-emerald-700 ring-1 ring-emerald-200 dark:ring-emerald-800/50'
                    : 'border-slate-200/60 dark:border-gray-800/80'
                }`}
              >
                {option.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-semibold rounded-full shadow-lg shadow-emerald-500/25">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-5 pt-2">
                  <div className="text-4xl mb-3">{option.icon}</div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
                    {option.title}
                  </h3>
                  <div className="text-2xl font-extrabold bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
                    {option.price}
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    {option.description}
                  </p>
                </div>

                <ul className="space-y-3 mb-6" role="list">
                  {option.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
                      <svg
                        className="w-4 h-4 mt-0.5 flex-shrink-0 text-emerald-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link
                  href={`/sponsored?package=${encodeURIComponent(option.title)}`}
                  className={`block w-full text-center px-6 py-3 rounded-lg font-semibold transition-all duration-300 active:scale-[0.98] ${
                    option.popular
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 hover:-translate-y-0.5'
                      : 'bg-slate-900 dark:bg-white text-white dark:text-gray-900 hover:bg-slate-800 dark:hover:bg-gray-100 hover:-translate-y-0.5'
                  }`}
                  aria-label={`${option.cta} for ${option.title}`}
                >
                  {option.cta}
                </Link>
              </div>
            ))}
          </div>

          {/* Custom Packages */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 rounded-2xl p-8 sm:p-10 border border-emerald-200/50 dark:border-emerald-800/30 text-center">
            <div className="text-4xl mb-4">🤝</div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-4">
              Need Something Custom?
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-xl mx-auto mb-8 leading-relaxed">
              We offer custom advertising packages tailored to your goals. Whether you need a multi-channel campaign, exclusive category sponsorship, or a bespoke content partnership — let&apos;s talk.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 hover:-translate-y-0.5 transition-all duration-300 text-lg"
            >
              Contact Us for Custom Packages
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          {/* Back Home */}
          <div className="text-center mt-12">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium transition-colors duration-300 text-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Back to Home
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
