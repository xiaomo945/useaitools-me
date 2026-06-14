'use client';

import React from 'react';
import Link from 'next/link';
import { Home, Calendar, Sparkles, FileText, Star, Trophy, Navigation, GitCompare, Mail, MessageSquare } from 'lucide-react';
import Footer from '@/app/components/Footer';

interface ChangelogItem {
  id: number;
  date: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  type: 'feature' | 'content' | 'improvement';
}

const changelogItems: ChangelogItem[] = [
  {
    id: 1,
    date: 'May 20, 2026',
    title: 'Added 5 new AI tools to the directory',
    description: 'We\'ve added 5 new cutting-edge AI tools across Writing, Image, and Productivity categories.',
    icon: <Sparkles className="w-5 h-5" />,
    type: 'feature',
  },
  {
    id: 2,
    date: 'May 18, 2026',
    title: 'New blog post: Best AI Tools for Small Business Owners',
    description: 'Comprehensive guide featuring the top AI tools to help small business owners automate workflows.',
    icon: <FileText className="w-5 h-5" />,
    type: 'content',
  },
  {
    id: 3,
    date: 'May 15, 2026',
    title: 'Added rating system to all tool pages',
    description: 'Users can now see ratings and reviews for each tool, helping you make better decisions.',
    icon: <Star className="w-5 h-5" />,
    type: 'feature',
  },
  {
    id: 4,
    date: 'May 12, 2026',
    title: 'Launched leaderboard page',
    description: 'Check out our leaderboard to see the most popular AI tools based on user ratings and usage.',
    icon: <Trophy className="w-5 h-5" />,
    type: 'feature',
  },
  {
    id: 5,
    date: 'May 10, 2026',
    title: 'Added mobile bottom navigation bar',
    description: 'Improved mobile experience with a convenient bottom navigation bar for easy access to key pages.',
    icon: <Navigation className="w-5 h-5" />,
    type: 'improvement',
  },
  {
    id: 6,
    date: 'May 8, 2026',
    title: 'New feature: Tool comparison now supports 3 tools',
    description: 'Compare up to 3 AI tools side by side to find the perfect fit for your needs.',
    icon: <GitCompare className="w-5 h-5" />,
    type: 'feature',
  },
  {
    id: 7,
    date: 'May 5, 2026',
    title: 'Added weekly newsletter subscription',
    description: 'Subscribe to our newsletter to get weekly updates on new AI tools and exclusive tips.',
    icon: <Mail className="w-5 h-5" />,
    type: 'feature',
  },
  {
    id: 8,
    date: 'May 1, 2026',
    title: 'Launched user review system',
    description: 'Share your experience with AI tools and read reviews from other users.',
    icon: <MessageSquare className="w-5 h-5" />,
    type: 'feature',
  },
];

const getTypeColors = (type: ChangelogItem['type']) => {
  switch (type) {
    case 'feature':
      return {
        bg: 'bg-emerald-100 dark:bg-emerald-500/20',
        text: 'text-emerald-700 dark:text-emerald-400',
        border: 'border-emerald-300 dark:border-emerald-500/30',
      };
    case 'content':
      return {
        bg: 'bg-blue-100 dark:bg-blue-500/20',
        text: 'text-blue-700 dark:text-blue-400',
        border: 'border-blue-300 dark:border-blue-500/30',
      };
    case 'improvement':
      return {
        bg: 'bg-amber-100 dark:bg-amber-500/20',
        text: 'text-amber-700 dark:text-amber-400',
        border: 'border-amber-300 dark:border-amber-500/30',
      };
    default:
      return {
        bg: 'bg-slate-100 dark:bg-slate-800',
        text: 'text-slate-700 dark:text-slate-400',
        border: 'border-slate-300 dark:border-slate-700',
      };
  }
};

const getTypeLabel = (type: ChangelogItem['type']) => {
  switch (type) {
    case 'feature':
      return 'New Feature';
    case 'content':
      return 'New Content';
    case 'improvement':
      return 'Improvement';
    default:
      return 'Update';
  }
};

export default function ChangelogClient() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 py-12 sm:py-16">
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

        {/* Page Header */}
        <div className="mb-12">
          <div className="bg-gradient-to-br from-indigo-50/80 via-white to-purple-50/80 dark:from-indigo-950/60 dark:via-gray-900 dark:to-purple-950/60 backdrop-blur-xl border border-white/60 dark:border-indigo-500/10 shadow-xl shadow-indigo-500/5 dark:shadow-2xl dark:shadow-indigo-500/5 rounded-3xl p-8 sm:p-12">
            <div className="text-center">
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-4">
                📝 Changelog
              </h1>
              <p className="text-base sm:text-lg text-gray-500 dark:text-gray-400">
                Track our latest updates and new features
              </p>
            </div>
          </div>
        </div>

        {/* Changelog Timeline */}
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-slate-200 dark:bg-gray-700" />

          <div className="space-y-6">
            {changelogItems.map((item, index) => {
              const typeColors = getTypeColors(item.type);

              return (
                <div
                  key={item.id}
                  className="relative pl-16 animate-fade-in-up"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    opacity: 0,
                    animationFillMode: 'forwards',
                  }}
                >
                  {/* Timeline Dot */}
                  <div className="absolute left-4 top-4 w-5 h-5 rounded-full bg-white dark:bg-gray-900 border-2 border-emerald-500 shadow-lg shadow-emerald-500/30" />

                  {/* Card */}
                  <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${typeColors.bg} ${typeColors.text} border ${typeColors.border}`}>
                            {item.icon}
                            {getTypeLabel(item.type)}
                          </span>
                          <span className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-gray-400">
                            <Calendar className="w-4 h-4" />
                            {item.date}
                          </span>
                        </div>
                        <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                          {item.title}
                        </h3>
                        <p className="text-slate-600 dark:text-gray-400">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Subscribe CTA */}
        <div className="mt-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">Stay Updated</h2>
          <p className="text-white/80 mb-6">
            Subscribe to our newsletter to get the latest AI tool updates delivered to your inbox weekly.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-emerald-600 font-semibold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
          >
            <Mail className="w-5 h-5" />
            Subscribe Now
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}
