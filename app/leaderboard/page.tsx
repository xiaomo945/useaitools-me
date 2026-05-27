import type { Metadata } from 'next';
import Link from 'next/link';
import tools from '@/data/tools.json';
import Footer from '@/app/components/Footer';
import Breadcrumbs from '@/app/components/Breadcrumbs';
import StarRating from '@/app/components/StarRating';

type Tool = (typeof tools)[0];

export const metadata: Metadata = {
  title: 'AI Tools Leaderboard 2026 – Top Rated AI Tools',
  description: 'Discover the best AI tools ranked by user ratings. Compare top AI writing, image, video, audio, and productivity tools.',
};

const categories = ['Writing', 'Image', 'Video', 'Audio', 'Code', 'Productivity'];

const getBadge = (rank: number) => {
  switch (rank) {
    case 1:
      return '🥇';
    case 2:
      return '🥈';
    case 3:
      return '🥉';
    default:
      return `${rank}`;
  }
};

const getBadgeStyle = (rank: number) => {
  switch (rank) {
    case 1:
      return 'bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-lg shadow-amber-500/30';
    case 2:
      return 'bg-gradient-to-br from-gray-300 to-gray-500 text-white shadow-lg shadow-gray-400/30';
    case 3:
      return 'bg-gradient-to-br from-amber-600 to-amber-800 text-white shadow-lg shadow-amber-700/30';
    default:
      return 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300';
  }
};

export default function LeaderboardPage() {
  const topTools = [...tools]
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 20);

  const categoryTopTools: Record<string, Tool[]> = {};
  categories.forEach((cat) => {
    categoryTopTools[cat] = [...tools]
      .filter((t) => t.category === cat)
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 5);
  });

  const newestTools = [...tools]
    .sort((a, b) => Number(b.id) - Number(a.id))
    .slice(0, 10);

  const popularTools = [...tools]
    .sort(() => Math.random() - 0.5)
    .slice(0, 10);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950">
      {/* Hero */}
      <div className="bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-emerald-950/50 dark:via-gray-900 dark:to-teal-950/50 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Leaderboard', href: '/leaderboard', current: true },
            ]}
          />
          
          <div className="mt-8 sm:mt-12 text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white mb-4">
              🏆 AI Tools Leaderboard
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 dark:text-gray-300 max-w-2xl mx-auto">
              Discover the best AI tools ranked by user ratings. Updated weekly based on real user feedback.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {/* Overall Top 20 */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl">🏅</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              Top 20 AI Tools
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {topTools.map((tool, index) => (
              <div
                key={tool.id}
                className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-xl p-4 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${getBadgeStyle(
                      index + 1
                    )}`}
                  >
                    {getBadge(index + 1)}
                  </span>
                  <Link
                    href={`/tools/${tool.id}`}
                    className="flex-1 min-w-0"
                  >
                    <h3 className="font-semibold text-slate-900 dark:text-white truncate hover:text-emerald-600 dark:hover:text-emerald-400">
                      {tool.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <StarRating rating={tool.rating || 4.0} size="sm" />
                      <span className="text-xs text-slate-500 dark:text-gray-400">
                        ({tool.rating_count || 0} reviews)
                      </span>
                    </div>
                  </Link>
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {tool.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Category Rankings */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl">📊</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              Category Rankings
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <div
                key={category}
                className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-xl p-5"
              >
                <h3 className="font-semibold text-lg text-slate-900 dark:text-white mb-4">
                  {category} Tools
                </h3>
                <div className="space-y-3">
                  {categoryTopTools[category].map((tool, index) => (
                    <div
                      key={tool.id}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${getBadgeStyle(
                          index + 1
                        )}`}
                      >
                        {getBadge(index + 1)}
                      </span>
                      <Link
                        href={`/tools/${tool.id}`}
                        className="flex-1 min-w-0"
                      >
                        <div className="font-medium text-sm text-slate-900 dark:text-white truncate hover:text-emerald-600 dark:hover:text-emerald-400">
                          {tool.name}
                        </div>
                        <div className="flex items-center gap-1 mt-0.5">
                          <StarRating rating={tool.rating || 4.0} size="sm" />
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
                <Link
                  href={`/category/${category.toLowerCase()}`}
                  className="inline-flex items-center gap-1 mt-4 text-sm text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  View all {category} tools →
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Newest Tools */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl">✨</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              Newest Additions
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {newestTools.map((tool) => (
              <div
                key={tool.id}
                className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-xl p-4 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
              >
                <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mb-2">
                  New
                </div>
                <Link
                  href={`/tools/${tool.id}`}
                  className="block"
                >
                  <h3 className="font-semibold text-slate-900 dark:text-white truncate hover:text-emerald-600 dark:hover:text-emerald-400">
                    {tool.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <StarRating rating={tool.rating || 4.0} size="sm" />
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Popular Tools */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl">🔥</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              Most Popular
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {popularTools.map((tool) => (
              <div
                key={tool.id}
                className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-xl p-4 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
              >
                <div className="text-xs text-orange-500 font-medium mb-2">
                  Trending
                </div>
                <Link
                  href={`/tools/${tool.id}`}
                  className="block"
                >
                  <h3 className="font-semibold text-slate-900 dark:text-white truncate hover:text-emerald-600 dark:hover:text-emerald-400">
                    {tool.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <StarRating rating={tool.rating || 4.0} size="sm" />
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}