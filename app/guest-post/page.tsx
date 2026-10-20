import { Metadata } from 'next';
import Link from 'next/link';
import { PenTool, FileText, CheckCircle, ArrowRight, Users, TrendingUp, Globe } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Submit a Guest Post - Use AI Tools',
  description: 'Write for Use AI Tools and share your AI tool reviews, hands-on experience and industry insights with thousands of AI enthusiasts.',
};

const benefits = [
  {
    icon: Users,
    title: 'Reach a Targeted Audience',
    description: 'Our readers are active AI tool users, so your content reaches exactly the audience you want.'
  },
  {
    icon: TrendingUp,
    title: 'Build Your Authority',
    description: 'Publishing on a specialized platform helps you establish expertise and influence in the AI space.'
  },
  {
    icon: Globe,
    title: 'Earn Quality Backlinks',
    description: 'Every contribution includes your author bio and website link, giving your SEO a boost.'
  }
];

const guidelines = [
  {
    title: 'Topics',
    items: [
      'In-depth AI tool reviews (after 2+ weeks of hands-on use)',
      'Tool comparison analyses (at least 3 tools)',
      'AI tool tutorials and tips',
      'Industry trend analysis and insights',
      'Real-world case studies and success stories'
    ]
  },
  {
    title: 'Content Requirements',
    items: [
      'Length: 1,500–3,000 words',
      'Original content not published anywhere else',
      'Include real screenshots or data from actual use',
      'Objective and unbiased toward any specific product',
      'Deliver practical value and actionable advice'
    ]
  },
  {
    title: 'Formatting',
    items: [
      'Submit your draft in Markdown',
      'Use a clear heading hierarchy (H2/H3)',
      'Add relevant images (at least 3)',
      'Include official links to the tools',
      'Provide an author bio and contact details'
    ]
  }
];

const topics = [
  'Best AI Writing Tools for Content Creators in 2026',
  'How to Use AI Image Generators Effectively',
  'AI Video Editing Tools: A Complete Guide',
  'Productivity Boost: AI Tools for Remote Workers',
  'AI Code Assistants: Which One is Right for You?',
  'The Future of AI Audio Tools for Podcasters'
];

export default function GuestPostPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 dark:from-gray-950 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 rounded-full text-sm font-semibold mb-6">
            <PenTool className="w-4 h-4" />
            Content Collaboration
          </div>
          <h1 className="text-5xl font-bold text-slate-900 dark:text-white mb-6">
            Submit a Guest Post
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            Share your hands-on experience with AI tools, connect with thousands of AI enthusiasts, and build your authority in the AI space
          </p>
        </section>

        {/* Benefits */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-12">
            Why Write for Us?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div key={index} className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg border border-slate-200 dark:border-gray-800 hover:shadow-xl transition-shadow">
                  <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-500/20 rounded-xl flex items-center justify-center mb-6">
                    <Icon className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300">
                    {benefit.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Guidelines */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-12">
            Submission Guidelines
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {guidelines.map((section, index) => (
              <div key={index} className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg border border-slate-200 dark:border-gray-800">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-emerald-600" />
                  {section.title}
                </h3>
                <ul className="space-y-3">
                  {section.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-slate-600 dark:text-slate-300">
                      <span className="text-emerald-600 mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Suggested Topics */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-12">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              Suggested Topics
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {topics.map((topic, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-colors">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-emerald-100 flex-shrink-0" />
                    <span className="text-white font-medium">{topic}</span>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-emerald-100 text-center mt-6 text-sm">
              Of course, you're also welcome to pitch any other AI tool-related topic
            </p>
          </div>
        </section>

        {/* Submission Process */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-12">
            How to Submit
          </h2>
          <div className="max-w-3xl mx-auto">
            <div className="space-y-6">
              {[
                { step: '1', title: 'Prepare Your Draft', desc: 'Write your article following the guidelines above, making sure it is original and genuinely useful.' },
                { step: '2', title: 'Send Us an Email', desc: 'Send your article to guest@useaitools.me along with your author bio and contact details.' },
                { step: '3', title: 'Review & Feedback', desc: 'We review and reply within 3 business days, and may suggest a few revisions.' },
                { step: '4', title: 'Publish', desc: 'Once approved, your article goes live within 1–2 days and we will let you know.' }
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                    {item.step}
                  </div>
                  <div className="flex-1 bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-gray-800">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                      {item.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-slate-200 dark:border-gray-800 p-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Ready to Submit?
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 mb-8">
              Send your article to our inbox and kick off your journey as a contributor
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a
                href="mailto:guest@useaitools.me?subject=Guest Post Submission"
                className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 inline-flex items-center gap-2"
              >
                <PenTool className="w-5 h-5" />
                Submit via Email
              </a>
              <Link
                href="/blog"
                className="px-8 py-4 bg-white dark:bg-gray-800 hover:bg-slate-50 dark:hover:bg-gray-700 text-slate-900 dark:text-white font-semibold rounded-xl border-2 border-slate-200 dark:border-gray-700 transition-all duration-300 transform hover:scale-105 inline-flex items-center gap-2"
              >
                Browse Blog Examples
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-6">
              We can't wait to read what you've been working on!
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
