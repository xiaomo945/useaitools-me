import Link from 'next/link';
import Footer from '@/app/components/Footer';
import { Metadata } from 'next';
import Breadcrumbs from '@/app/components/Breadcrumbs';

export const metadata: Metadata = {
  title: 'How We Make Money – Use AI Tools',
  description: 'Transparency about our business model. Learn about affiliate links and our own products.',
  openGraph: {
    title: 'How We Make Money – Use AI Tools',
    description: 'Transparency about our business model. Learn about affiliate links and our own products.',
  },
};

export default function HowWeMakeMoneyPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    'name': 'How We Make Money - Use AI Tools',
    'description': 'Transparency about our business model, including affiliate links and our own products.',
    'url': 'https://useaitools.me/how-we-make-money',
    'publisher': {
      '@type': 'Organization',
      'name': 'Use AI Tools',
      'logo': {
        '@type': 'ImageObject',
        'url': 'https://useaitools.me/logo.png'
      }
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
              { label: 'How We Make Money', href: '/how-we-make-money', current: true }
            ]} 
          />
          
          <div className="mb-12" />

          {/* Hero */}
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
              <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
                How We Make Money
              </span>
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Honest and transparent about how we operate. No hidden agendas, just clear information.
            </p>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-emerald-300 dark:via-emerald-700/40 to-transparent mb-12" />

          {/* Affiliate Links */}
          <section className="mb-12">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 sm:p-10 shadow-sm border border-slate-200 dark:border-gray-800">
              <div className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center text-2xl">
                    🔗
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Affiliate Links</h2>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg mb-4">
                When you click on some links to AI tools on our site, we may earn a commission from the tool provider. 
                This is called an affiliate link.
              </p>
              <div className="bg-emerald-50 dark:bg-emerald-950/20 rounded-xl p-6 mb-6 border border-emerald-200 dark:border-emerald-800/30">
                <h3 className="font-semibold text-emerald-900 dark:text-emerald-200 mb-2">Key Facts:</h3>
                <ul className="space-y-2 text-emerald-800 dark:text-emerald-300">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 mt-0.5">✓</span>
                    <span>No extra cost to you—you pay the same price as going directly</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 mt-0.5">✓</span>
                    <span>Commissions come from the tool provider, not from you</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 mt-0.5">✓</span>
                    <span>Helps us keep this directory free and maintained</span>
                  </li>
                </ul>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg">
                Affiliate links are how many independent directories and review sites operate. 
                They allow us to spend time researching, testing, and writing about AI tools without charging you directly.
              </p>
            </div>
          </section>

          {/* Our Own Tools */}
          <section className="mb-12">
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 rounded-2xl p-8 sm:p-10 border border-emerald-200/50 dark:border-emerald-800/30">
              <div className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center text-2xl">
                    🛠️
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Our Own Products</h2>
              </div>
              <p className="text-slate-700 dark:text-slate-200 leading-relaxed text-lg mb-6">
                In addition to affiliate links, we build and sell our own AI tools. This is the most sustainable way for us to operate 
                and gives us full control over the products we recommend.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-emerald-200 dark:border-emerald-800/50">
                  <div className="text-3xl mb-3">🖋️</div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">Use AI Writer</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">
                    Affordable AI writing tool built for creators who want premium quality without the enterprise price tag.
                  </p>
                  <Link
                    href="/writer"
                    className="text-emerald-600 dark:text-emerald-400 font-medium hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
                  >
                    Learn more →
                  </Link>
                </div>
                <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-violet-200 dark:border-violet-800/50">
                  <div className="text-3xl mb-3">🎨</div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">Use AI Image</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">
                    Fast, affordable AI image generation with multiple styles and commercial use allowed.
                  </p>
                  <Link
                    href="/image"
                    className="text-violet-600 dark:text-violet-400 font-medium hover:text-violet-700 dark:hover:text-violet-300 transition-colors"
                  >
                    Learn more →
                  </Link>
                </div>
              </div>
              <p className="text-slate-700 dark:text-slate-200 leading-relaxed text-lg">
                Building our own tools means we can guarantee quality, control pricing, and listen directly to our users. 
                Every purchase of our tools supports the continued development of this directory.
              </p>
            </div>
          </section>

          {/* Our Promise */}
          <section className="mb-12">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 sm:p-10 shadow-sm border border-slate-200 dark:border-gray-800">
              <div className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center text-2xl">
                    🤝
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Our Promise to You</h2>
              </div>
              <div className="space-y-4">
                <div className="flex gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                  <div className="text-amber-600 dark:text-amber-400 text-2xl flex-shrink-0 mt-0.5">1.</div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-1">Honest Recommendations First</h3>
                    <p className="text-slate-600 dark:text-slate-300">
                      Affiliate links never influence which tools we recommend or how we review them. We recommend tools based on merit, not commission potential.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                  <div className="text-amber-600 dark:text-amber-400 text-2xl flex-shrink-0 mt-0.5">2.</div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-1">Clear Disclosure</h3>
                    <p className="text-slate-600 dark:text-slate-300">
                      We clearly mark affiliate relationships and are transparent about which tools are our own. You always know what you&apos;re clicking on.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                  <div className="text-amber-600 dark:text-amber-400 text-2xl flex-shrink-0 mt-0.5">3.</div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-1">No Pay-to-Play</h3>
                    <p className="text-slate-600 dark:text-slate-300">
                      We don&apos;t accept payment for better rankings or featured spots. Every tool earns its position based on quality and user fit.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                  <div className="text-amber-600 dark:text-amber-400 text-2xl flex-shrink-0 mt-0.5">4.</div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-1">Independent Testing</h3>
                    <p className="text-slate-600 dark:text-slate-300">
                      We test tools ourselves and base reviews on real-world usage, not just marketing materials.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Why This Matters */}
          <section className="mb-12">
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 rounded-2xl p-8 sm:p-10 border border-indigo-200/50 dark:border-indigo-800/30">
              <div className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center text-2xl">
                    💡
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Why This Matters</h2>
              </div>
              <p className="text-slate-700 dark:text-slate-200 leading-relaxed text-lg mb-4">
                The internet is full of content that exists just to make money, not to help people. We&apos;re trying to do something different.
              </p>
              <p className="text-slate-700 dark:text-slate-200 leading-relaxed text-lg">
                By being transparent about how we make money, we&apos;re building trust. We want you to feel confident that when you read a review or click a link, 
                it&apos;s because we genuinely think that tool is good, not just because it pays well.
              </p>
              <p className="text-slate-700 dark:text-slate-200 leading-relaxed text-lg mt-4">
                Thank you for supporting Use AI Tools. Your trust means everything to us, and we work hard to earn it every day.
              </p>
            </div>
          </section>

          {/* Questions */}
          <section className="mb-12">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 sm:p-10 shadow-sm border border-slate-200 dark:border-gray-800 text-center">
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center text-2xl">
                    ❓
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Have Questions?</h2>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg mb-6">
                If you have any questions about our business model, affiliate links, or anything else, please don&apos;t hesitate to reach out.
              </p>
              <a
                href="mailto:affiliate@useaitools.me"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 hover:-translate-y-0.5 transition-all duration-300 text-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Email Us
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
