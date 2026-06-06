import Link from 'next/link';
import Footer from '@/app/components/Footer';
import Breadcrumbs from '@/app/components/Breadcrumbs';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Get Featured – Use AI Tools',
  description: 'Promote your AI tool to thousands of AI enthusiasts. Choose from Basic or Featured listing options on Use AI Tools.',
  openGraph: {
    title: 'Get Your AI Tool Featured on Use AI Tools',
    description: 'Reach thousands of AI enthusiasts looking for their next tool. Featured listings get priority review and homepage placement.',
  },
};

export default function FeaturedPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Submit Tool', href: '/submit' },
            { label: 'Get Featured', href: '/submit/featured', current: true },
          ]}
        />

        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            Get Your AI Tool Featured
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Reach thousands of AI enthusiasts looking for their next tool
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Basic Listing */}
          <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-3xl p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Basic Listing</h2>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-slate-900 dark:text-white">Free</span>
              </div>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                <span className="text-slate-600 dark:text-slate-400">Standard listing in our directory</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                <span className="text-slate-600 dark:text-slate-400">Review within 7 business days</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                <span className="text-slate-600 dark:text-slate-400">Category page placement</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                <span className="text-slate-600 dark:text-slate-400">Search index inclusion</span>
              </li>
            </ul>
            <Link
              href="/submit"
              className="block w-full text-center px-6 py-3 border border-slate-300 dark:border-gray-700 text-slate-700 dark:text-slate-300 font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-gray-800 transition-colors"
            >
              Submit for Free
            </Link>
          </div>

          {/* Featured Listing */}
          <div className="relative bg-white dark:bg-gray-900 border-2 border-emerald-500 dark:border-emerald-400 rounded-3xl p-8 shadow-xl shadow-emerald-500/10">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <span className="px-4 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm font-bold rounded-full shadow-lg">
                RECOMMENDED
              </span>
            </div>
            <div className="mb-6 pt-2">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Featured Listing</h2>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-emerald-600 dark:text-emerald-400">$19</span>
                <span className="text-slate-500 dark:text-slate-400">/listing</span>
              </div>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                <span className="text-slate-700 dark:text-slate-300 font-medium">Priority review within 48 hours</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                <span className="text-slate-700 dark:text-slate-300 font-medium">Homepage featured spot for 30 days</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                <span className="text-slate-700 dark:text-slate-300 font-medium">Dedicated review article on our blog</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                <span className="text-slate-700 dark:text-slate-300 font-medium">Social media promotion (X + Dev.to)</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                <span className="text-slate-700 dark:text-slate-300 font-medium">Staff Pick badge on your listing</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                <span className="text-slate-700 dark:text-slate-300 font-medium">Priority support via email</span>
              </li>
            </ul>
            <a
              href="mailto:affiliate@useaitools.me?subject=Featured%20Listing%20Inquiry"
              className="block w-full text-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
            >
              Get Featured Now
            </a>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-3xl p-8 text-center">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Have Questions?</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            We&apos;re happy to help you choose the right plan for your tool.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/help"
              className="inline-flex items-center gap-2 px-6 py-3 border border-slate-300 dark:border-gray-700 text-slate-700 dark:text-slate-300 font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-gray-800 transition-colors"
            >
              Visit Help Center
            </Link>
            <a
              href="mailto:affiliate@useaitools.me?subject=Featured%20Listing%20Question"
              className="inline-flex items-center gap-2 px-6 py-3 text-emerald-600 dark:text-emerald-400 font-semibold hover:underline"
            >
              Email Us
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
