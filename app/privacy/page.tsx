import Link from 'next/link';
import Footer from '@/app/components/Footer';

export const metadata = {
  title: 'Privacy Policy - Use AI Tools',
  description: 'Privacy Policy for useaitools.me',
};

export default function PrivacyPolicyPage() {
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
            Privacy Policy
          </h1>

          <div className="space-y-6 text-slate-700 dark:text-gray-300 leading-relaxed">
            <p className="text-lg font-semibold text-slate-900 dark:text-white">
              Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>

            <p>
              Welcome to Use AI Tools. This Privacy Policy explains how we collect, use, and protect your information when you visit our website.
            </p>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
              Information We Collect
            </h2>

            <p>
              We collect information automatically when you visit our website, including:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Browser type and version</li>
              <li>Device type and operating system</li>
              <li>Pages visited and time spent on pages</li>
              <li>Referring website URLs</li>
              <li>Anonymized IP address</li>
            </ul>

            <p>
              If you choose to subscribe to our newsletter, we collect your email address.
            </p>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
              How We Use Your Information
            </h2>

            <p>
              We use the information we collect to:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Improve our website and user experience</li>
              <li>Analyze website traffic and usage patterns</li>
              <li>Send you newsletters (if you&apos;ve subscribed)</li>
              <li>Monitor and prevent fraudulent activity</li>
            </ul>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
              Cookies and Tracking
            </h2>

            <p>
              We use cookies and similar tracking technologies to enhance your browsing experience. You can control cookie settings through your browser.
            </p>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
              Third-Party Services
            </h2>

            <p>
              We may use third-party services for:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Website analytics (Vercel Analytics, Microsoft Clarity)</li>
              <li>Newsletter delivery</li>
              <li>Affiliate marketing programs</li>
            </ul>

            <p>
              These third parties may have access to anonymized information about your visit.
            </p>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
              Data Security
            </h2>

            <p>
              We take reasonable measures to protect your information from unauthorized access, use, or disclosure.
            </p>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
              Your Rights
            </h2>

            <p>
              Depending on your location, you may have rights including:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Access to your personal information</li>
              <li>Correction of inaccurate information</li>
              <li>Deletion of your personal information</li>
              <li>Unsubscribe from communications</li>
            </ul>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
              Children&apos;s Privacy
            </h2>

            <p>
              Our website is not intended for children under 13. We do not knowingly collect information from children under 13.
            </p>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
              Changes to This Policy
            </h2>

            <p>
              We may update this Privacy Policy from time to time. Any changes will be posted on this page.
            </p>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-8 mb-4">
              Contact Us
            </h2>

            <p>
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <p className="font-medium">
              <a href="mailto:affiliate@useaitools.me" className="text-emerald-600 dark:text-emerald-400 hover:underline">
                affiliate@useaitools.me
              </a>
            </p>

            <div className="mt-10 p-6 rounded-xl bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700">
              <p className="text-slate-700 dark:text-gray-300">
                💡 For questions about affiliate links, please see our{' '}
                <Link href="/affiliate-disclosure" className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium">
                  Affiliate Disclosure
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
