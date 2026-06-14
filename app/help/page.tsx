import { prisma } from '@/lib/prisma'
import Link from 'next/link';
import Footer from '@/app/components/Footer';
import Breadcrumbs from '@/app/components/Breadcrumbs';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Help Center – Find Answers & Learn AI Tools',
  description: 'Complete guide to using Use AI Tools. Find tools by category, compare features, save favorites, submit new tools, and learn best practices.',
  keywords: ['AI tools help', 'AI tool guide', 'how to use AI tools', 'best AI tools for', 'AI tool comparison guide', 'AI tools FAQ'],
  alternates: { canonical: '/help' },
};

// ===== 通用 FAQ =====
const generalFaqs = [
  {
    question: 'How do I find the right AI tool?',
    answer: 'Use the search bar at the top of any page to search by name or description. You can also browse by category (Writing, Image, Productivity, Code, Audio, Video) or filter by pricing (Free, Freemium, Paid). Each tool has a detailed profile with features, pricing, and user ratings to help you decide.',
    links: [{ text: 'Browse all tools', href: '/' }],
  },
  {
    question: 'How do I compare AI tools?',
    answer: 'Visit the Compare page and select up to 3 tools you want to compare. You\'ll see a side-by-side comparison of features, pricing, ratings, and key differences — so you can make an informed decision quickly.',
    links: [{ text: 'Compare tools now', href: '/compare' }],
  },
  {
    question: 'How do I save my favorite tools?',
    answer: 'Click the heart icon on any tool card or detail page to save it to your favorites. Your saved tools are accessible from the "Saved" page in the navigation. You can create recommendation lists from your saved tools and share them with your team.',
    links: [{ text: 'View saved tools', href: '/saved' }],
  },
  {
    question: 'How do I submit a new AI tool?',
    answer: 'We welcome submissions! Visit the Submit Tool page and fill out the form with the tool name, URL, category, and brief description. Our team reviews submissions within 48 hours and adds quality tools to the directory.',
    links: [{ text: 'Submit a tool', href: '/submit' }],
  },
  {
    question: 'How does the affiliate disclosure work?',
    answer: 'Some links on our site are affiliate links, meaning we earn a small commission if you sign up through them — at no extra cost to you. This helps us keep the site running and free for everyone. We always prioritize honest recommendations over commissions. The sponsored content is always clearly marked.',
    links: [{ text: 'Affiliate Disclosure', href: '/affiliate-disclosure' }],
  },
  {
    question: 'Is my data safe and private?',
    answer: 'We take privacy seriously. Your saved tools, browsing history, and preferences are stored locally in your browser. Our analytics are privacy-friendly — no cookies, no personal tracking, no selling of data. Read our privacy policy for the full details.',
    links: [{ text: 'Privacy Policy', href: '/privacy' }],
  },
  {
    question: 'How often is the directory updated?',
    answer: 'We update our directory weekly with new tools, updated pricing, and fresh ratings. Check the Changelog page to see what\'s new in each release.',
    links: [{ text: 'View changelog', href: '/changelog' }],
  },
];

// ===== 分类专属 FAQ（根据分类特性定制） =====
const categoryFaqs = [
  {
    category: 'Writing',
    title: 'AI Writing Tools',
    icon: '✍️',
    color: 'emerald',
    items: [
      {
        q: 'What\'s the best AI writing tool for beginners?',
        a: 'If you\'re just getting started, try tools with free tiers and straightforward UX. Most writing tools support basic content creation, brainstorming, and grammar checking. Pay attention to output quality, tone customization, and whether it supports your language.',
      },
      {
        q: 'Can AI writing tools help with SEO?',
        a: 'Absolutely. Many modern AI writers include SEO optimization features like keyword analysis, meta description generation, content structure suggestions, and even internal linking recommendations. Look for tools that integrate with SEO platforms or have built-in SEO assistants.',
      },
      {
        q: 'Will Google penalize AI-generated content?',
        a: 'Google doesn\'t penalize content just because it\'s AI-generated — but it does penalize low-quality, unhelpful content regardless of how it\'s created. Always edit AI outputs, add personal insights, cite sources, and focus on providing real value to your readers.',
      },
    ],
  },
  {
    category: 'Image',
    title: 'AI Image Generation',
    icon: '🎨',
    color: 'amber',
    items: [
      {
        q: 'What\'s the difference between image generators?',
        a: 'Each excels in different areas: some are best for photorealistic portraits, others for artistic illustration, anime, logos, or concept art. Try a few to find which matches your style needs. Most offer free trial credits so you can experiment before committing.',
      },
      {
        q: 'How do I write good AI image prompts?',
        a: 'Great prompts include: subject description, style keywords (photorealistic, anime, watercolor), composition details (close-up, wide shot, overhead), lighting (golden hour, studio, rim light), and mood. Aim for 20-50 words — not too short, not too verbose.',
      },
      {
        q: 'Can I use AI images commercially?',
        a: 'Most major AI image generators allow commercial use for paid subscribers, but terms vary. Always check the specific license. Be particularly mindful if your workflow involves training data concerns, and never generate trademarked characters or mimic artists\' styles too closely.',
      },
    ],
  },
  {
    category: 'Video',
    title: 'AI Video Tools',
    icon: '🎬',
    color: 'rose',
    items: [
      {
        q: 'What can AI video tools actually do?',
        a: 'Modern AI video tools handle: video generation from text or images, editing assistance (auto-captioning, background removal, smart trimming), face swapping, avatar-based presenters, script-to-video workflows, and AI-assisted effects.',
      },
      {
        q: 'Do I need powerful hardware?',
        a: 'For cloud-based AI video tools, no — processing happens on their servers. For local AI video tools, GPU performance matters. Video generation is more compute-intensive than text or image generation, so expect longer wait times or cloud costs.',
      },
    ],
  },
  {
    category: 'Code',
    title: 'AI Coding Assistants',
    icon: '💻',
    color: 'blue',
    items: [
      {
        q: 'Are AI coding assistants reliable?',
        a: 'AI coding assistants are great for boilerplate, syntax help, code explanations, and refactoring suggestions. However, always review generated code — it may have bugs, security issues, or be outdated. Think of AI as a pair programmer, not a replacement.',
      },
      {
        q: 'Free vs paid coding assistants: what\'s the difference?',
        a: 'Free tiers typically offer basic autocomplete and simple Q&A. Paid tiers add: multi-file context awareness, better model quality, integration with more editors, security scanning, and team collaboration features. For professional developers, the upgrade usually pays for itself quickly.',
      },
    ],
  },
  {
    category: 'Productivity',
    title: 'AI Productivity Tools',
    icon: '⚡',
    color: 'indigo',
    items: [
      {
        q: 'How can AI help my daily workflow?',
        a: 'AI can summarize long meetings, auto-organize notes, draft emails, schedule tasks, create presentations, triage your inbox, and turn rough thoughts into structured documents. Start with one pain point and measure time saved.',
      },
      {
        q: 'Will AI tools replace me?',
        a: 'People who learn to use AI effectively will replace those who don\'t. AI augments human judgment rather than replacing it. The key is identifying which parts of your work can be automated, and doubling down on the parts where human context matters most.',
      },
    ],
  },
];

// ============ 页面渲染 ============
export default async function HelpPage() {
  // 实时统计 (有数据库用数据库，否则 fallback)
  let totalTools = 0;
  try {
    totalTools = await prisma.tool.count();
  } catch (e) {
    console.warn('[help] prisma.tool.count() 失败');
  }
  let categories: any[] = [];
  try {
    const grouped = await (prisma as any).tool.groupBy({
      by: ['category'],
      _count: { id: true },
      _avg: { rating: true },
      orderBy: { _count: { id: 'desc' } },
    });
    categories = grouped || [];
  } catch (e) {
    console.warn('[help] prisma.tool.groupBy() 失败');
  }

  const colorClassMap: Record<string, string> = {
    emerald: 'from-emerald-500 to-teal-500',
    amber: 'from-amber-500 to-orange-500',
    rose: 'from-rose-500 to-pink-500',
    blue: 'from-blue-500 to-cyan-500',
    indigo: 'from-indigo-500 to-violet-500',
  };

  return (
    <>
      {/* JSON-LD Structured Data: FAQPage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: generalFaqs.map(f => ({
              '@type': 'Question',
              name: f.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: f.answer,
              },
            })),
          }),
        }}
      />

      <div className="min-h-screen bg-slate-50 dark:bg-gray-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Help Center', href: '/help', current: true },
            ]}
          />

          {/* Hero */}
          <div className="text-center mb-14">
            <div className="inline-block px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-600 dark:text-emerald-400 text-sm font-semibold mb-6">
              💡 {totalTools} tools · {categories.length} categories · avg ★{avgRating}
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              Help Center
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Everything you need to know about finding, comparing, and getting the most out of AI tools.
            </p>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-12">
            {[
              { icon: '🔍', text: 'Browse Tools', href: '/' },
              { icon: '⚖️', text: 'Compare Tools', href: '/compare' },
              { icon: '📂', text: 'By Category', href: '/' },
              { icon: '📬', text: 'Submit a Tool', href: '/submit' },
            ].map(link => (
              <Link
                key={link.text}
                href={link.href}
                className="group p-4 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-2xl hover:border-emerald-500/50 dark:hover:border-emerald-500/50 hover:-translate-y-0.5 hover:shadow-md transition-all text-center"
              >
                <div className="text-xl mb-2">{link.icon}</div>
                <div className="text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {link.text}
                </div>
              </Link>
            ))}
          </div>

          {/* General FAQ */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 text-center" style={{ fontFamily: 'Playfair Display, serif' }}>
              Frequently Asked Questions
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-center mb-8">
              Quick answers to the most common questions
            </p>

            <div className="space-y-3">
              {generalFaqs.map((faq, index) => (
                <details
                  key={index}
                  className="group bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-2xl overflow-hidden hover:border-slate-300 dark:hover:border-gray-700 transition-colors"
                >
                  <summary className="flex items-center justify-between cursor-pointer p-5 hover:bg-slate-50 dark:hover:bg-gray-800/50 transition-colors list-none">
                    <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white pr-4">
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
                  <div className="px-5 pb-5">
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
          </div>

          {/* Category-specific FAQ */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 text-center" style={{ fontFamily: 'Playfair Display, serif' }}>
              Guide by Category
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-center mb-8">
              Tailored advice for different types of AI tools
            </p>

            <div className="space-y-6">
              {categoryFaqs.map((cat) => (
                <div
                  key={cat.category}
                  className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-3xl overflow-hidden"
                >
                  <div className={`px-6 py-5 bg-gradient-to-r ${colorClassMap[cat.color]} text-white`}>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{cat.icon}</span>
                      <div>
                        <h3 className="text-lg font-bold">{cat.title}</h3>
                        <p className="text-sm text-white/80 mt-0.5">
                          {categories.find((c: any) => c.category === cat.category)?._count.id || 0} tools in this category
                        </p>
                      </div>
                      <Link
                        href={`/category/${cat.category.toLowerCase()}`}
                        className="ml-auto text-sm font-semibold bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl transition-colors"
                      >
                        Browse →
                      </Link>
                    </div>
                  </div>

                  <div className="divide-y divide-slate-100 dark:divide-gray-800">
                    {cat.items.map((item, i) => (
                      <details key={i} className="group">
                        <summary className="flex items-center justify-between cursor-pointer p-5 hover:bg-slate-50 dark:hover:bg-gray-800/50 transition-colors list-none">
                          <h4 className="text-base font-semibold text-slate-900 dark:text-white pr-4">
                            {item.q}
                          </h4>
                          <svg
                            className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform duration-300 flex-shrink-0"
                            fill="none" stroke="currentColor" viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </summary>
                        <div className="px-5 pb-5">
                          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                            {item.a}
                          </p>
                        </div>
                      </details>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pro Tips Section */}
          <div className="mb-14 bg-gradient-to-br from-emerald-500/5 via-white to-teal-500/5 dark:from-emerald-500/10 dark:via-gray-900 dark:to-teal-500/10 rounded-3xl p-8 border border-emerald-200/50 dark:border-emerald-800/30">
            <div className="text-center mb-6">
              <span className="text-3xl">🚀</span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-3 mb-2">
                Pro Tips for Getting Started
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { n: '01', title: 'Start free, upgrade mindfully', body: 'Nearly every tool offers a free trial. Test before committing to a subscription.' },
                { n: '02', title: 'Focus on outcomes', body: 'Pick tools based on what you need to produce, not on what features they have.' },
                { n: '03', title: 'Build your toolkit', body: 'You\'ll likely use 3-5 tools regularly. Find the combo that fits your workflow.' },
              ].map(tip => (
                <div key={tip.n} className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-slate-200/50 dark:border-gray-800/50">
                  <div className="text-sm font-bold bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent mb-2">
                    {tip.n}
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white mb-1.5 text-sm">{tip.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{tip.body}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Contact CTA */}
          <div className="text-center bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-3xl p-8 sm:p-10">
            <div className="text-4xl mb-4">🤝</div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
              Still have questions?
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-lg mx-auto">
              Reach out to our team and we&apos;ll get back to you with a helpful answer.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <a
                href="mailto:affiliate@useaitools.me"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
              >
                Email Us
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-slate-300 dark:border-gray-700 text-slate-700 dark:text-slate-200 font-semibold rounded-xl hover:border-emerald-500/50 dark:hover:border-emerald-500/50 hover:bg-slate-50 dark:hover:bg-gray-800/50 transition-all duration-300"
              >
                Contact Form
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}
