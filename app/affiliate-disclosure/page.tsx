import Link from 'next/link';

export default function AffiliateDisclosurePage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 py-12 sm:py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Back to Home Link */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white transition-colors duration-300"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="font-medium">Back to Home</span>
          </Link>
        </div>

        {/* Main Content */}
        <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-2xl shadow-xl p-8 sm:p-12">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-8" style={{ fontFamily: 'Playfair Display, serif' }}>
            Affiliate Disclosure
          </h1>

          <div className="space-y-6 text-slate-700 dark:text-gray-300 leading-relaxed">
            <p className="text-lg font-semibold text-slate-900 dark:text-white">
              Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>

            <p>
              Welcome to Use AI Tools! We believe in transparency and want you to understand how we operate.
            </p>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
              Affiliate Links
            </h2>

            <p>
              Use AI Tools participates in various affiliate marketing programs, which means we may earn commissions from purchases or sign-ups made through our links to partner websites or products.
            </p>

            <p>
              When you click on an affiliate link and make a purchase or sign up for a service, we receive a small commission at <strong>no additional cost to you</strong>.
            </p>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
              No Impact on Your Cost
            </h2>

            <p>
              Our affiliate relationships do <strong>not</strong> affect the price you pay for products or services you find through Use AI Tools. The pricing remains the same whether you use our affiliate links or not.
            </p>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
              Our Commitment to Neutrality
            </h2>

            <p>
              We are committed to providing honest, unbiased recommendations. Our reviews and rankings are based on our own research and analysis, not on affiliate commissions. We only recommend tools that we genuinely believe are valuable to our users.
            </p>

            <p>
              We do not accept payment for positive reviews or favorable rankings.
            </p>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
              FTC Compliance
            </h2>

            <p>
              This disclosure complies with the Federal Trade Commission (FTC) guidelines for affiliate marketing.
            </p>

            <div className="mt-10 p-6 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50">
              <p className="text-emerald-900 dark:text-emerald-300">
                💡 If you have any questions about our affiliate relationships, feel free to reach out!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
