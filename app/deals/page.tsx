import Link from 'next/link';
import Footer from '@/app/components/Footer';
import { Metadata } from 'next';
import Breadcrumbs from '@/app/components/Breadcrumbs';

export const metadata: Metadata = {
  title: 'Best AI Tool Deals & Discounts 2026 – Use AI Tools',
  description: 'Save big on top AI tools. Exclusive deals on Grammarly, Rytr, Jasper, VEED.io, Canva, Synthesia & more. Curated discounts updated weekly.',
  openGraph: {
    title: 'Best AI Tool Deals & Discounts 2026 – Use AI Tools',
    description: 'Save big on top AI tools. Exclusive deals on Grammarly, Rytr, Jasper, VEED.io, Canva, Synthesia & more. Curated discounts updated weekly.',
    url: 'https://useaitools.me/deals',
    siteName: 'Use AI Tools',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Best AI Tool Deals & Discounts 2026 – Use AI Tools',
    description: 'Save big on top AI tools. Exclusive deals on Grammarly, Rytr, Jasper, VEED.io, Canva, Synthesia & more. Curated discounts updated weekly.',
  },
  alternates: {
    canonical: 'https://useaitools.me/deals',
  },
};

interface Deal {
  name: string;
  toolId: number;
  originalPrice: string;
  dealPrice: string;
  benefit: string;
  badge: string;
}

const deals: Deal[] = [
  {
    name: 'GrammarlyGO',
    toolId: 90,
    originalPrice: 'From $30/mo',
    dealPrice: 'Start Free',
    benefit: 'AI-powered writing assistant with tone & style suggestions',
    badge: 'Free Plan Available',
  },
  {
    name: 'Rytr',
    toolId: 23,
    originalPrice: 'From $9/mo',
    dealPrice: 'Start Free',
    benefit: 'Generate high-quality content in 30+ languages instantly',
    badge: '30% Recurring Commission',
  },
  {
    name: 'VEED.io',
    toolId: 51,
    originalPrice: 'From $24/mo',
    dealPrice: 'Start Free',
    benefit: 'Professional video editing with AI auto-subtitles & effects',
    badge: 'Free Tier Included',
  },
  {
    name: 'Jasper',
    toolId: 18,
    originalPrice: 'From $49/mo',
    dealPrice: '7-Day Free Trial',
    benefit: 'Enterprise-grade AI writing for marketing teams & brands',
    badge: 'Free Trial',
  },
  {
    name: 'Canva Magic Design',
    toolId: 4,
    originalPrice: 'From $13/mo',
    dealPrice: 'Start Free',
    benefit: 'AI-powered design & presentation creation in seconds',
    badge: 'Free Plan Available',
  },
  {
    name: 'Pictory',
    toolId: 201,
    originalPrice: 'From $25/mo',
    dealPrice: 'Start Free Trial',
    benefit: 'Turn long-form content into short branded videos with AI',
    badge: 'Up to 50% Off',
  },
  {
    name: 'Synthesia',
    toolId: 96,
    originalPrice: 'From $29/mo',
    dealPrice: 'Create Free Demo',
    benefit: 'Create professional AI avatar videos without a camera',
    badge: 'Free Demo',
  },
  {
    name: 'ElevenLabs',
    toolId: 8,
    originalPrice: 'From $5/mo',
    dealPrice: 'Start Free',
    benefit: 'Ultra-realistic AI voice generation & cloning in 29 languages',
    badge: 'Free Tier Available',
  },
];

export default function DealsPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    'name': 'Best AI Tool Deals & Discounts 2026',
    'description': 'Save big on top AI tools. Exclusive deals on Grammarly, Rytr, Jasper, VEED.io, Canva, Synthesia & more. Curated discounts updated weekly.',
    'url': 'https://useaitools.me/deals',
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
              { label: 'Deals', href: '/deals', current: true },
            ]}
          />

          {/* Hero */}
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
              <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
                Exclusive AI Tool Deals
              </span>
              <br />
              <span className="text-slate-900 dark:text-white">&amp; Discounts</span>
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Save big on the best AI tools. Curated deals updated weekly.
            </p>
          </div>

          {/* Deal Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
            {deals.map((deal) => (
              <div
                key={deal.toolId}
                className="relative bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm border border-slate-200/60 dark:border-gray-800/80 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/5"
              >
                {/* Special Deal Badge */}
                <div className="absolute -top-3 left-4">
                  <span className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-semibold rounded-full shadow-lg shadow-emerald-500/25">
                    {deal.badge}
                  </span>
                </div>

                <div className="pt-4">
                  {/* Tool Name */}
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                    {deal.name}
                  </h3>

                  {/* Pricing */}
                  <div className="mb-3">
                    <span className="text-sm text-slate-400 dark:text-slate-500 line-through">
                      {deal.originalPrice}
                    </span>
                    <span className="ml-2 text-lg font-extrabold bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
                      {deal.dealPrice}
                    </span>
                  </div>

                  {/* Key Benefit */}
                  <p className="text-sm text-slate-600 dark:text-slate-300 mb-5 leading-relaxed">
                    {deal.benefit}
                  </p>

                  {/* CTA Button */}
                  <Link
                    href={`/tools/${deal.toolId}`}
                    className="block w-full text-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-lg shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 hover:-translate-y-0.5 transition-all duration-300 active:scale-[0.98]"
                    aria-label={`Claim deal for ${deal.name}`}
                  >
                    Claim This Deal
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-emerald-300 dark:via-emerald-700/40 to-transparent mb-16" />

          {/* Trust Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
            <div className="flex flex-col items-center text-center p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-slate-200/60 dark:border-gray-800/80">
              <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
                Verified Deals
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Every deal is manually verified for accuracy and availability.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-slate-200/60 dark:border-gray-800/80">
              <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
                Updated Weekly
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Fresh deals every week so you never miss a discount.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-slate-200/60 dark:border-gray-800/80">
              <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
                No Hidden Fees
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                What you see is what you pay. Transparent pricing, always.
              </p>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 rounded-2xl p-8 sm:p-10 border border-emerald-200/50 dark:border-emerald-800/30 text-center">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-4">
              Never Miss a Deal
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-xl mx-auto mb-8 leading-relaxed">
              Get weekly deal alerts delivered to your inbox. Be the first to know when new discounts drop.
            </p>
            <Link
              href="/waitlist"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 hover:-translate-y-0.5 transition-all duration-300 text-lg"
            >
              Subscribe for Deal Alerts
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
