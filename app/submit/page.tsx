import Link from 'next/link';
import Footer from '@/app/components/Footer';
import SubmitClient from './SubmitClient';

const categories = [
  { slug: 'writing', name: 'Writing AI Tools', description: 'AI writing assistants, copywriting tools, and content generators.' },
  { slug: 'image', name: 'Image AI Tools', description: 'AI image generators, photo editors, and design tools.' },
  { slug: 'video', name: 'Video AI Tools', description: 'AI video editors, text-to-video, and animation tools.' },
  { slug: 'audio', name: 'Audio AI Tools', description: 'AI voice generators, music creation, and podcast tools.' },
  { slug: 'code', name: 'Code AI Tools', description: 'AI coding assistants, code reviewers, and developer tools.' },
  { slug: 'productivity', name: 'Productivity AI Tools', description: 'AI productivity tools, note-taking, and automation tools.' },
];

const benefits = [
  {
    icon: '🆓',
    title: 'Free Listing',
    description: 'Get your AI tool listed in our curated directory at no cost. Approved tools receive a dedicated profile page with full details.',
  },
  {
    icon: '🔗',
    title: 'SEO Backlinks',
    description: 'Benefit from high-quality backlinks to your website from our directory pages, boosting your search engine rankings and domain authority.',
  },
  {
    icon: '🎯',
    title: 'Targeted Audience',
    description: 'Reach 50,000+ monthly visitors actively searching for the best AI tools in your category. Connect with users who need exactly what you offer.',
  },
  {
    icon: '📈',
    title: 'Monthly Traffic',
    description: 'Our directory grows month over month with dedicated SEO efforts, content marketing, and social media promotion, driving consistent traffic to listed tools.',
  },
];

export default function SubmitPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950">
      {/* Hero Section with H1 */}
      <section className="py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <Link href="/" className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium inline-flex items-center justify-center gap-2 mb-8">
            ← Back to Home
          </Link>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-6">
            Submit Your AI Tool to Our Directory
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Have you built an amazing AI tool? Submit it to our curated directory and reach thousands of users actively searching for the best AI writing tools, image generators, video editors, audio production tools, coding assistants, and productivity software. Free listing for approved tools — get discovered today!
          </p>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
              Benefits of Listing Your AI Tool
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Joining our directory gives your AI tool exposure, credibility, and valuable SEO benefits.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="text-4xl mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{benefit.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Submission Form Section */}
      <section className="pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
              Submit Your AI Tool
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Fill out the form below to submit your tool. Our team reviews every submission within 48 hours.
            </p>
          </div>
          <SubmitClient />
        </div>
      </section>

      {/* How It Works */}
      <section className="pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 dark:from-emerald-500/5 dark:to-teal-500/5 border border-emerald-200/50 dark:border-emerald-800/30 rounded-3xl p-8 sm:p-12">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-8 text-center">
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 text-white text-xl font-bold rounded-2xl mb-4 shadow-lg">1</div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Submit Your Tool</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  Fill out our simple submission form with details about your AI tool, including name, website URL, category, and description.
                </p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 text-white text-xl font-bold rounded-2xl mb-4 shadow-lg">2</div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Our Team Reviews</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  Our editorial team carefully reviews each submission within 48 hours to ensure quality and relevance to our directory.
                </p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 text-white text-xl font-bold rounded-2xl mb-4 shadow-lg">3</div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Get Listed & Discovered</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  Upon approval, your tool gets a dedicated profile page and is featured in our AI tool directory for thousands of visitors to discover.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
              Tool Categories We Accept
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Browse our existing categories to see where your AI tool fits best.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/category/${category.slug}`}
                className="block bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-2xl p-6 hover:border-emerald-300 dark:hover:border-emerald-700 hover:shadow-lg transition-all duration-300"
              >
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{category.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{category.description}</p>
              </Link>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 text-emerald-600 dark:text-emerald-400 font-semibold hover:text-emerald-700 dark:hover:text-emerald-300 transition-all duration-300"
            >
              Explore all AI tools →
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
