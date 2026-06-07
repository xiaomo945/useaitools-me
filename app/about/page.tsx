import Link from 'next/link';
import Footer from '@/app/components/Footer';
import { Metadata } from 'next';
import Breadcrumbs from '@/app/components/Breadcrumbs';
import tools from '@/data/tools.json';

export const metadata: Metadata = {
  title: 'About – Use AI Tools',
  description: 'Discover our story, built in public by an indie maker. 50+ AI tools curated for you.',
  openGraph: {
    title: 'About – Use AI Tools',
    description: 'Discover our story, built in public by an indie maker. 50+ AI tools curated for you.',
  },
};

export default function AboutPage() {
  const toolCount = tools.length;
  
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    'name': 'About Use AI Tools',
    'description': 'Curated AI tools directory built in public by an indie maker.',
    'url': 'https://useaitools.me/about',
    'publisher': {
      '@type': 'Organization',
      'name': 'Use AI Tools',
      'logo': {
        '@type': 'ImageObject',
        'url': 'https://useaitools.me/logo.png'
      }
    },
    'author': {
      '@type': 'Person',
      'name': 'Indie Maker'
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen bg-slate-50 dark:bg-gray-950 py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {/* Breadcrumbs */}
          <Breadcrumbs 
            items={[
              { label: 'Home', href: '/' },
              { label: 'About', href: '/about', current: true }
            ]} 
          />
          
          <div className="mb-12" />

          {/* Hero */}
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
              <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
                About Use AI Tools
              </span>
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Your trusted guide to discovering and comparing the best AI tools.
            </p>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-emerald-300 dark:via-emerald-700/40 to-transparent mb-12" />

          {/* Introduction */}
          <section className="mb-12">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 sm:p-10 shadow-sm border border-slate-200 dark:border-gray-800">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">What is Use AI Tools?</h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg">
                Use AI Tools is a curated directory designed to help you discover, compare, and choose the perfect AI tools for your workflow. 
                We carefully select and categorize the best AI tools available, making it easier than ever to find what you need.
              </p>
            </div>
          </section>

          {/* Built in Public Story */}
          <section className="mb-12">
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 rounded-2xl p-8 sm:p-10 border border-emerald-200/50 dark:border-emerald-800/30">
              <div className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center text-2xl">
                    🚀
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Built in Public</h2>
                  <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">From an internet café in Baoding, China</p>
                </div>
              </div>
              <p className="text-slate-700 dark:text-slate-200 leading-relaxed text-lg">
                This project started with a simple idea—what if we could make AI tools accessible to everyone? 
                Built from scratch by a taxi driver working out of an internet café in Baoding, China, 
                with zero budget and a lot of passion. Every line of code, every tool added, and every design decision 
                has been made with care and transparency.
              </p>
              <p className="text-slate-700 dark:text-slate-200 leading-relaxed text-lg mt-4">
                This isn&apos;t just another directory—it&apos;s a testament to what one person can build with determination, 
                curiosity, and the power of AI. We&apos;re building in public, sharing our journey, and growing together with our community.
              </p>
            </div>
          </section>

          {/* Website Stats */}
          <section className="mb-12">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 sm:p-10 shadow-sm border border-slate-200 dark:border-gray-800">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Our Directory at a Glance</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                  <div className="text-4xl font-extrabold bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent mb-2">
                    {toolCount}
                  </div>
                  <div className="text-slate-600 dark:text-slate-300 font-medium">AI Tools</div>
                </div>
                <div className="text-center p-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                  <div className="text-4xl font-extrabold bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent mb-2">
                    6
                  </div>
                  <div className="text-slate-600 dark:text-slate-300 font-medium">Categories</div>
                </div>
                <div className="text-center p-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                  <div className="text-4xl font-extrabold bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent mb-2">
                    100%
                  </div>
                  <div className="text-slate-600 dark:text-slate-300 font-medium">Curated</div>
                </div>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-6">
                Every tool in our directory includes detailed descriptions, pricing information, and honest reviews. 
                We cover 6 key categories: Writing, Image, Productivity, Code, Audio, and Video.
              </p>
            </div>
          </section>

          {/* Trust Statement */}
          <section className="mb-12">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 sm:p-10 shadow-sm border border-slate-200 dark:border-gray-800">
              <div className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center text-2xl">
                    🛡️
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Your Trust Matters</h2>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg">
                We believe in transparency. Use AI Tools earns commission through affiliate links when you sign up for tools through our site. 
                However, this never affects our recommendations or reviews—our independence is non-negotiable.
              </p>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg mt-4">
                Best of all, there&apos;s no extra cost to you. The price you pay is the same whether you use our links or go directly. 
                Affiliate links simply help us keep the lights on and continue building this valuable resource for the community.
              </p>
              <div className="mt-6">
                <Link
                  href="/affiliate-disclosure"
                  className="inline-flex items-center gap-2 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium transition-colors duration-300"
                >
                  Read our full affiliate disclosure →
                </Link>
              </div>
            </div>
          </section>

          {/* Update Frequency */}
          <section className="mb-12">
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 rounded-2xl p-8 sm:p-10 border border-amber-200/50 dark:border-amber-800/30">
              <div className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center text-2xl">
                    🔄
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Always Fresh</h2>
              </div>
              <p className="text-slate-700 dark:text-slate-200 leading-relaxed text-lg">
                The AI landscape moves fast—really fast. That&apos;s why we update our directory weekly, 
                adding new tools, updating existing ones, and removing anything that&apos;s no longer relevant. 
                You can trust that our recommendations are always current and useful.
              </p>
            </div>
          </section>

          {/* How We Review */}
          <section className="mb-12" id="how-we-review">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 sm:p-10 shadow-sm border border-slate-200 dark:border-gray-800">
              <div className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-500 rounded-xl flex items-center justify-center text-2xl">
                    🔬
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">How We Review &amp; Rate Tools</h2>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg mb-8">
                Every tool in our directory is evaluated against a consistent set of criteria. Here&apos;s exactly how we do it:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {[
                  { icon: '🎯', title: 'Ease of Use', desc: 'Can a beginner get productive results within 10 minutes? We test the onboarding flow, UI clarity, and learning curve.' },
                  { icon: '⭐', title: 'Output Quality', desc: 'Does the tool deliver accurate, relevant, and professional results? We test real-world use cases, not just demos.' },
                  { icon: '🧩', title: 'Features', desc: 'Breadth and depth of capabilities. Does it solve one problem well, or many problems adequately? We value focused excellence.' },
                  { icon: '💰', title: 'Value for Money', desc: 'Pricing relative to competitors and actual usage. A $9 tool that replaces a $49 tool scores higher than an overpriced one.' },
                  { icon: '🔒', title: 'Stability & Privacy', desc: 'Uptime, response speed, data handling practices. We flag tools with known privacy issues or frequent outages.' },
                  { icon: '🤝', title: 'Support & Community', desc: 'Quality of documentation, customer support responsiveness, and whether there&apos;s an active user community.' },
                ].map((item, i) => (
                  <div key={i} className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xl">{item.icon}</span>
                      <h3 className="font-semibold text-slate-900 dark:text-white">{item.title}</h3>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>

              {/* Rating Scale */}
              <div className="p-6 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/50 rounded-xl">
                <h3 className="font-semibold text-emerald-700 dark:text-emerald-300 mb-3">Our Rating Scale</h3>
                <div className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                  <div className="flex items-start gap-3">
                    <span className="font-bold text-amber-500 flex-shrink-0">★★★★★ (4.5+)</span>
                    <span>Exceptional — Best in class, highly recommended</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="font-bold text-amber-500 flex-shrink-0">★★★★ (4.0–4.4)</span>
                    <span>Excellent — Strong choice, minor areas for improvement</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="font-bold text-slate-500 flex-shrink-0">★★★ (3.0–3.9)</span>
                    <span>Good — Solid tool with notable limitations</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="font-bold text-slate-400 flex-shrink-0">★★ (2.0–2.9)</span>
                    <span>Fair — Works but has significant drawbacks</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="font-bold text-slate-400 flex-shrink-0">★ (1.0–1.9)</span>
                    <span>Poor — Not recommended, better alternatives exist</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 text-sm text-slate-500 dark:text-slate-400">
                <p>
                  Ratings are based on our hands-on testing combined with aggregated user feedback from platforms like Reddit, Trustpilot, and verified user reviews. 
                  Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}.
                </p>
              </div>
            </div>
          </section>

          {/* Contact */}
          <section className="mb-12">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 sm:p-10 shadow-sm border border-slate-200 dark:border-gray-800 text-center">
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center text-2xl">
                    💬
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Get in Touch</h2>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg mb-6">
                Have a tool recommendation? Want to partner with us? Just want to say hello? We&apos;d love to hear from you!
              </p>
              <a
                href="mailto:affiliate@useaitools.me"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 hover:-translate-y-0.5 transition-all duration-300 text-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                affiliate@useaitools.me
              </a>
            </div>
          </section>

          {/* Back Home */}
          <div className="text-center">
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
