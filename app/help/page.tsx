import Link from 'next/link';
import Footer from '@/app/components/Footer';
import Breadcrumbs from '@/app/components/Breadcrumbs';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Help Center – Use AI Tools',
  description: 'Find answers to common questions about using Use AI Tools directory.',
  openGraph: {
    title: 'Help Center – Use AI Tools',
    description: 'Find answers to common questions about using Use AI Tools directory.',
    url: 'https://useaitools.me/help',
    siteName: 'Use AI Tools',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Help Center – Use AI Tools',
    description: 'Find answers to common questions about using Use AI Tools directory.',
  },
  alternates: {
    canonical: 'https://useaitools.me/help',
  },
};

const faqs = [
  {
    question: 'How do I find the right AI tool?',
    answer: 'Use the search bar at the top of any page to search by name or description. You can also browse by category (Writing, Image, Productivity, Code, Audio, Video) or filter by pricing (Free, Freemium, Paid). Each tool has a detailed profile with features, pricing, and user reviews to help you decide.',
    links: [{ text: 'Browse all tools', href: '/' }],
  },
  {
    question: 'How do I compare tools?',
    answer: 'Navigate to the Compare page and select up to 3 tools you want to compare. You\'ll see a side-by-side comparison of features, pricing, ratings, and an AI-generated recommendation to help you choose.',
    links: [{ text: 'Compare tools now', href: '/compare' }],
  },
  {
    question: 'How do I save my favorite tools?',
    answer: 'Click the heart icon on any tool card or detail page to save it to your favorites. Your saved tools are accessible from the "Saved" page in the navigation. You can also create recommendation lists from your saved tools and share them with others.',
    links: [{ text: 'View saved tools', href: '/saved' }],
  },
  {
    question: 'How do I submit a new tool?',
    answer: 'We welcome submissions! Visit the "Submit Tool" page and fill out the form with the tool\'s name, URL, category, and a brief description. Our team reviews submissions within 48 hours.',
    links: [{ text: 'Submit a tool', href: '/submit' }],
  },
  {
    question: 'How does the affiliate disclosure work?',
    answer: 'Some links on our site are affiliate links, meaning we earn a small commission if you sign up through them — at no extra cost to you. This helps us keep the site running and free for everyone. We always prioritize honest recommendations over commissions. Read our full disclosure for more details.',
    links: [{ text: 'Affiliate Disclosure', href: '/affiliate-disclosure' }],
  },
  {
    question: 'Is my data safe?',
    answer: 'We take privacy seriously. Your saved tools, browsing history, and preferences are stored locally in your browser (localStorage). We do not send this data to any server. Our analytics are privacy-friendly and do not use cookies or track personal information.',
  },
  {
    question: 'How often is the directory updated?',
    answer: 'We update our directory weekly with new tools, updated pricing, and fresh reviews. Follow us on X (@jiongxiaomo) or check the Changelog page to see what\'s new.',
    links: [{ text: 'View changelog', href: '/changelog' }],
  },
];

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Help Center', href: '/help', current: true },
          ]}
        />

        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            Help Center
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Find answers to common questions about using our AI tools directory.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <details
              key={index}
              className="group bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-2xl overflow-hidden"
            >
              <summary className="flex items-center justify-between cursor-pointer p-6 hover:bg-slate-50 dark:hover:bg-gray-800/50 transition-colors">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white pr-4">
                  {faq.question}
                </h3>
                <svg
                  className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform duration-300 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 pb-6">
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                  {faq.answer}
                </p>
                {faq.links && faq.links.length > 0 && (
                  <div className="flex flex-wrap gap-3">
                    {faq.links.map((link, i) => (
                      <Link
                        key={i}
                        href={link.href}
                        className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
                      >
                        {link.text}
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </details>
          ))}
        </div>

        <div className="mt-12 text-center bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-3xl p-8">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
            Still have questions?
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Reach out to us and we&apos;ll get back to you as soon as possible.
          </p>
          <a
            href="mailto:affiliate@useaitools.me"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
          >
            Contact Us
          </a>
        </div>
      </div>
      <Footer />
    </div>
  );
}
