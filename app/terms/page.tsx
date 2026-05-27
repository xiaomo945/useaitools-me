import Link from 'next/link';
import Footer from '@/app/components/Footer';

export const metadata = {
  title: 'Terms of Service - Use AI Tools',
  description: 'Terms of Service for useaitools.me',
};

export default function TermsOfServicePage() {
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
            Terms of Service
          </h1>

          <div className="space-y-6 text-slate-700 dark:text-gray-300 leading-relaxed">
            <p className="text-lg font-semibold text-slate-900 dark:text-white">
              Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>

            <p>
              Welcome to Use AI Tools. By accessing or using our website, you agree to be bound by these Terms of Service.
            </p>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
              Acceptance of Terms
            </h2>

            <p>
              By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.
            </p>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
              Use License
            </h2>

            <p>
              Permission is granted to temporarily view the materials on Use AI Tools&apos;s website for personal, non-commercial use only. This is the grant of a license, not a transfer of title.
            </p>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
              Disclaimer
            </h2>

            <p>
              The materials on Use AI Tools&apos;s website are provided on an &apos;as-is&apos; basis. We make no warranties, expressed or implied.
            </p>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
              Limitations
            </h2>

            <p>
              In no event shall Use AI Tools or its suppliers be liable for any damages arising out of the use or inability to use the materials on this website.
            </p>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
              Revisions and Errata
            </h2>

            <p>
              The materials appearing on Use AI Tools&apos;s website could include technical, typographical, or photographic errors. We do not warrant that any of the materials on this website are accurate, complete, or current.
            </p>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
              Links
            </h2>

            <p>
              Use AI Tools has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by Use AI Tools of the site. Use of any such linked website is at the user&apos;s own risk.
            </p>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
              Affiliate Program
            </h2>

            <p>
              We may participate in affiliate marketing programs. When you click on affiliate links and make purchases, we may earn commissions at no additional cost to you. For more information, please see our{' '}
              <Link href="/affiliate-disclosure" className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium">
                Affiliate Disclosure
              </Link>
              .
            </p>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
              Modifications
            </h2>

            <p>
              We may revise these terms of service for its website at any time without notice. By using this website you are agreeing to be bound by the then current version of these terms of service.
            </p>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
              Governing Law
            </h2>

            <p>
              These terms shall be governed by and construed in accordance with the laws applicable to the location of Use AI Tools.
            </p>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
              Contact Us
            </h2>

            <p>
              If you have any questions about these Terms of Service, please contact us at:
            </p>
            <p className="font-medium">
              <a href="mailto:affiliate@useaitools.me" className="text-emerald-600 dark:text-emerald-400 hover:underline">
                affiliate@useaitools.me
              </a>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
