import Link from 'next/link';
import { getAllBlogPosts, blogIndex, type BlogPost } from '@/types';
import { Home } from 'lucide-react';
import Footer from '@/app/components/Footer';
import { Metadata } from 'next';

// Calculate estimated reading time
const calculateReadTime = (content: string): { minutes: number; display: string } => {
  const wordsPerMinute = 200;
  // Strip HTML tags and markdown
  const plainText = content
    .replace(/<[^>]*>/g, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\[\[link:[^\|]+\|([^\]]+)\]\]/g, '$1');
  const wordCount = plainText.trim().split(/\s+/).length;
  const readTime = Math.ceil(wordCount / wordsPerMinute);
  return {
    minutes: readTime,
    display: `⏱️ ${readTime} min read`
  };
};

// Format relative date
const formatRelativeDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) {
    return 'yesterday';
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else if (diffDays < 14) {
    return 'last week';
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} weeks ago`;
  } else if (diffDays < 60) {
    return 'last month';
  } else {
    const months = Math.floor(diffDays / 30);
    return `${months} months ago`;
  }
};

export const metadata: Metadata = {
  title: 'AI Tools Blog – Use AI Tools',
  description: 'In-depth comparisons, reviews, and guides for AI tools.',
};

export default function BlogPage() {
  const allBlogPosts = getAllBlogPosts();
  
  // Blog CollectionPage Schema
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    'name': 'AI Tools Blog - Use AI Tools',
    'description': 'In-depth comparisons, reviews, and guides for AI tools.',
    'url': 'https://useaitools.me/blog',
    'publisher': {
      '@type': 'Organization',
      'name': 'Use AI Tools',
      'logo': {
        '@type': 'ImageObject',
        'url': 'https://useaitools.me/logo.png'
      }
    },
    'author': {
      '@type': 'Organization',
      'name': 'Use AI Tools'
    },
    'mainEntity': {
      '@type': 'ItemList',
      'numberOfItems': blogIndex.length,
      'itemListElement': blogIndex.map((post, index) => ({
        '@type': 'ListItem',
        'position': index + 1,
        'name': post.title,
        'url': `https://useaitools.me/blog/${post.slug}`,
        'description': post.description
      }))
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen bg-slate-50 dark:bg-gray-950 py-12 sm:py-16 grid-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {/* Back to Home Link */}
          <div className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white transition-colors duration-300"
            >
              <Home className="w-5 h-5" />
              <span className="font-medium">Back to Home</span>
            </Link>
          </div>

          {/* Blog Header */}
          <div className="mb-10">
            <div className="bg-gradient-to-br from-purple-50/80 via-white to-indigo-50/80 dark:from-purple-950/60 dark:via-gray-900 dark:to-indigo-950/60 backdrop-blur-xl border border-white/60 dark:border-purple-500/10 shadow-xl shadow-purple-500/5 dark:shadow-2xl dark:shadow-purple-500/5 rounded-3xl p-8 sm:p-12">
              <div className="text-center">
                <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-4">
                  AI Tools Blog
                </h1>
                <p className="text-base sm:text-lg text-gray-500 dark:text-gray-400">
                  In-depth comparisons, reviews, and guides for AI tools.
                </p>
              </div>
            </div>
          </div>

          {/* Blog Posts List */}
          <div className="space-y-6">
            {allBlogPosts.map((post) => {
              const { display: readTime } = calculateReadTime(post.content);
              const relativeDate = formatRelativeDate(post.date);
              return (
                <div
                  key={post.id}
                  className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-out"
                >
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-slate-500 dark:text-gray-400">
                        {relativeDate}
                      </span>
                      <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                        {readTime}
                      </span>
                    </div>
                    <Link href={`/blog/${post.slug}`}>
                      <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300">
                        {post.title}
                      </h2>
                    </Link>
                    <p className="text-slate-600 dark:text-gray-300 leading-relaxed sm:leading-loose text-base">
                      {post.description}
                    </p>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors duration-300"
                    >
                      Read More →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}
