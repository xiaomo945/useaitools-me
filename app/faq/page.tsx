import type { Metadata } from 'next';
import Link from 'next/link';
import { Search, Heart, GitCompare, Bookmark, Star, Filter, ExternalLink } from 'lucide-react';

export const metadata: Metadata = {
  title: 'FAQ – Use AI Tools',
  description: 'Frequently asked questions about Use AI Tools directory. Learn how to search, compare, and save AI tools.',
};

const faqs = [
  {
    category: 'General',
    icon: Star,
    items: [
      {
        q: 'What is Use AI Tools?',
        a: 'Use AI Tools is a curated directory of 1,300+ AI tools across 6 categories: Writing, Image, Productivity, Code, Audio, and Video. We help you discover, compare, and choose the right AI tools for your needs.',
      },
      {
        q: 'Is this directory free to use?',
        a: 'Yes, completely free. You can search, filter, compare, and save tools without any cost. We may earn affiliate commissions when you sign up for tools through our links, but this never affects our recommendations.',
      },
      {
        q: 'How often is the directory updated?',
        a: 'We update the directory weekly with new tools, updated pricing, and fresh reviews. Our team manually reviews each tool before adding it to ensure quality.',
      },
    ],
  },
  {
    category: 'Search & Discovery',
    icon: Search,
    items: [
      {
        q: 'How does the search work?',
        a: 'Our search uses fuzzy matching to find tools even with typos. You can search by tool name, category, description, or use case. Try searching for "writing assistant" or "image generator" to see relevant results.',
      },
      {
        q: 'Can I filter tools by category or pricing?',
        a: 'Yes! Use the category buttons at the top to filter by Writing, Image, Productivity, Code, Audio, or Video. You can also filter by pricing type: Free, Freemium, Free Trial, Paid, or Open Source.',
      },
      {
        q: 'How do I sort the tools?',
        a: 'Click the sort dropdown above the tool grid to sort by Highest Rated, Most Reviewed, or Name (A-Z). This helps you find the best tools quickly.',
      },
    ],
  },
  {
    category: 'Save & Compare',
    icon: Heart,
    items: [
      {
        q: 'How do I save a tool?',
        a: 'Click the heart icon (❤️) on any tool card to save it. Saved tools are stored in your browser and accessible from the "Saved" page in the bottom navigation.',
      },
      {
        q: 'How do I compare tools?',
        a: 'Click the compare checkbox on tool cards to select up to 4 tools. Then click the "Compare" button to see a side-by-side comparison of features, pricing, and ratings.',
      },
      {
        q: 'Are my saved tools synced across devices?',
        a: 'Currently, saved tools are stored locally in your browser. If you clear your browser data, saved tools will be lost. We\'re working on account-based syncing for the future.',
      },
    ],
  },
  {
    category: 'Tool Reviews',
    icon: Star,
    items: [
      {
        q: 'How are tool ratings calculated?',
        a: 'Ratings are based on user reviews, feature completeness, pricing value, and our editorial assessment. Each tool is manually reviewed by our team before being added.',
      },
      {
        q: 'Can I submit a tool for review?',
        a: 'Yes! Visit our Submit Tool page to suggest an AI tool for inclusion. We review all submissions and add qualifying tools to the directory.',
      },
      {
        q: 'What do the pricing labels mean?',
        a: 'Free: Completely free with no paid tiers. Freemium: Free tier available with paid upgrades. Free Trial: Time-limited free trial. Paid: Requires payment. Open Source: Source code is publicly available.',
      },
    ],
  },
  {
    category: 'Keyboard Shortcuts',
    icon: Filter,
    items: [
      {
        q: 'What keyboard shortcuts are available?',
        a: 'Press Alt+/ (or Ctrl+/) to show the keyboard shortcuts panel. Key shortcuts: / to focus search, Alt+1-9 to open tool cards, Esc to close panels. On mobile, double-tap to save, swipe to change categories.',
      },
    ],
  },
  {
    category: 'Contact & Support',
    icon: ExternalLink,
    items: [
      {
        q: 'How can I contact you?',
        a: 'Follow us on Twitter/X @jiongxiaomo or Dev.to @xiaomo. You can also submit feedback through our Submit Tool page.',
      },
      {
        q: 'Can I advertise on Use AI Tools?',
        a: 'Yes, we offer sponsored listings and newsletter advertising. Visit our Advertise page for details on pricing and placement.',
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Everything you need to know about Use AI Tools
          </p>
        </div>

        {/* FAQ Sections */}
        <div className="space-y-10">
          {faqs.map((section) => {
            const Icon = section.icon;
            return (
              <section key={section.category}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                    {section.category}
                  </h2>
                </div>
                <div className="space-y-3">
                  {section.items.map((item, idx) => (
                    <details
                      key={idx}
                      className="group bg-white dark:bg-gray-900 rounded-xl border border-slate-200 dark:border-gray-800 overflow-hidden"
                    >
                      <summary className="flex items-center justify-between p-5 cursor-pointer list-none hover:bg-slate-50 dark:hover:bg-gray-800/50 transition-colors">
                        <h3 className="font-semibold text-slate-900 dark:text-white pr-4">
                          {item.q}
                        </h3>
                        <svg
                          className="w-5 h-5 text-slate-400 transition-transform group-open:rotate-180 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </summary>
                      <div className="px-5 pb-5 text-slate-600 dark:text-slate-400 leading-relaxed">
                        {item.a}
                      </div>
                    </details>
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center bg-gradient-to-br from-emerald-50/80 via-white to-teal-50/80 dark:from-emerald-950/60 dark:via-gray-900 dark:to-teal-950/60 backdrop-blur-xl border border-white/60 dark:border-emerald-500/10 shadow-xl rounded-3xl p-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
            Still have questions?
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            We&apos;re here to help. Reach out on social media or submit your question.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 hover:-translate-y-0.5 transition-all duration-300"
            >
              <Search className="w-4 h-4" />
              Explore Tools
            </Link>
            <Link
              href="/submit"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 text-slate-700 dark:text-slate-300 font-semibold rounded-xl hover:border-emerald-300 dark:hover:border-emerald-700 transition-all duration-300"
            >
              <Bookmark className="w-4 h-4" />
              Submit a Tool
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
