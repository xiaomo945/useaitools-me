/**
 * Product Hunt 发布素材清单页
 *
 * 聚合 PRODUCT_HUNT_LAUNCH_KIT.md 中的文案素材和视觉素材状态，
 * 方便发布前快速检查就绪度。
 */

import Link from 'next/link';
import { Check, X, AlertCircle, ArrowLeft } from 'lucide-react';

interface AssetItem {
  name: string;
  description: string;
  status: 'ready' | 'pending' | 'missing';
  location?: string;
}

interface AssetCategory {
  title: string;
  emoji: string;
  items: AssetItem[];
}

const assetCategories: AssetCategory[] = [
  {
    title: 'Copywriting',
    emoji: '✍️',
    items: [
      {
        name: 'Tagline',
        description: 'One-liner for PH listing (60 chars max)',
        status: 'ready',
        location: 'PRODUCT_HUNT_LAUNCH_KIT.md',
      },
      {
        name: 'Description',
        description: 'Detailed product description (150-300 words)',
        status: 'ready',
        location: 'PRODUCT_HUNT_LAUNCH_KIT.md',
      },
      {
        name: 'Maker Comment',
        description: 'First comment from the maker telling the story',
        status: 'ready',
        location: 'PRODUCT_HUNT_LAUNCH_KIT.md',
      },
      {
        name: 'Twitter Thread',
        description: 'Launch day Twitter/X thread',
        status: 'ready',
        location: 'PRODUCT_HUNT_LAUNCH_KIT.md',
      },
      {
        name: 'Reddit Post',
        description: 'r/SideProject launch post',
        status: 'ready',
        location: 'PRODUCT_HUNT_LAUNCH_KIT.md',
      },
    ],
  },
  {
    title: 'Visual Assets',
    emoji: '🎨',
    items: [
      {
        name: 'Product Logo (240×240)',
        description: 'Square logo for PH listing',
        status: 'ready',
        location: 'public/logo.png',
      },
      {
        name: 'Gallery Screenshot 1 (640×360)',
        description: 'Homepage hero section',
        status: 'pending',
      },
      {
        name: 'Gallery Screenshot 2 (640×360)',
        description: 'Tool detail page',
        status: 'pending',
      },
      {
        name: 'Gallery Screenshot 3 (640×360)',
        description: 'Compare feature',
        status: 'pending',
      },
      {
        name: 'Demo Video (60-90s)',
        description: 'Product demo video for PH gallery',
        status: 'missing',
      },
    ],
  },
  {
    title: 'Technical Readiness',
    emoji: '⚙️',
    items: [
      {
        name: 'Production Deploy',
        description: 'Latest build deployed to useaitools.me',
        status: 'ready',
        location: 'Vercel',
      },
      {
        name: 'Analytics Tracking',
        description: 'Vercel Analytics + Plausible + Clarity active',
        status: 'ready',
        location: 'app/layout.tsx',
      },
      {
        name: 'UTM Parameters',
        description: 'UTM tags configured for PH traffic',
        status: 'ready',
        location: 'PRODUCT_HUNT_LAUNCH_KIT.md',
      },
      {
        name: 'Performance (Core Web Vitals)',
        description: 'LCP ≤2.5s, CLS ≤0.1, INP ≤200ms',
        status: 'ready',
        location: '/dashboard/performance',
      },
      {
        name: 'SEO Schema',
        description: 'Article + BreadcrumbList + FAQPage JSON-LD',
        status: 'ready',
        location: 'Blog & Compare pages',
      },
    ],
  },
  {
    title: 'Launch Day Checklist',
    emoji: '🚀',
    items: [
      {
        name: 'Schedule Launch Time',
        description: 'Tuesday/Wednesday/Thursday, 12:01 AM PT',
        status: 'pending',
      },
      {
        name: 'Notify Supporters',
        description: 'DM 20+ supporters for early upvotes',
        status: 'pending',
      },
      {
        name: 'Cross-post Social',
        description: 'Twitter, LinkedIn, Reddit, Indie Hackers',
        status: 'pending',
      },
      {
        name: 'Monitor & Respond',
        description: 'Reply to all PH comments within 1 hour',
        status: 'pending',
      },
    ],
  },
];

function StatusIcon({ status }: { status: AssetItem['status'] }) {
  if (status === 'ready') {
    return <Check className="w-5 h-5 text-emerald-600" aria-label="Ready" />;
  }
  if (status === 'pending') {
    return <AlertCircle className="w-5 h-5 text-amber-500" aria-label="Pending" />;
  }
  return <X className="w-5 h-5 text-red-500" aria-label="Missing" />;
}

function statusLabel(status: AssetItem['status']): string {
  if (status === 'ready') return 'Ready';
  if (status === 'pending') return 'Pending';
  return 'Missing';
}

export default function LaunchKitPage() {
  const allItems = assetCategories.flatMap((c) => c.items);
  const readyCount = allItems.filter((i) => i.status === 'ready').length;
  const totalCount = allItems.length;
  const readinessPct = Math.round((readyCount / totalCount) * 100);

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-gray-950 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-2">
            🚀 Product Hunt Launch Kit
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Track readiness across copywriting, visual assets, technical setup, and launch day tasks.
          </p>
        </div>

        {/* Readiness Summary */}
        <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Overall Readiness
            </h2>
            <span className="text-3xl font-extrabold text-emerald-600">
              {readinessPct}%
            </span>
          </div>
          <div className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500"
              style={{ width: `${readinessPct}%` }}
            />
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-3">
            {readyCount} of {totalCount} items ready
          </p>
        </div>

        {/* Asset Categories */}
        <div className="space-y-6">
          {assetCategories.map((category) => {
            const categoryReady = category.items.filter((i) => i.status === 'ready').length;
            return (
              <section
                key={category.title}
                className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-2xl p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    <span className="mr-2">{category.emoji}</span>
                    {category.title}
                  </h2>
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    {categoryReady}/{category.items.length} ready
                  </span>
                </div>
                <ul className="space-y-3">
                  {category.items.map((item) => (
                    <li
                      key={item.name}
                      className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-gray-800/50"
                    >
                      <div className="flex-shrink-0 mt-0.5">
                        <StatusIcon status={item.status} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-slate-900 dark:text-white">
                            {item.name}
                          </span>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                              item.status === 'ready'
                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                                : item.status === 'pending'
                                ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                                : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                            }`}
                          >
                            {statusLabel(item.status)}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                          {item.description}
                        </p>
                        {item.location && (
                          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 font-mono">
                            📁 {item.location}
                          </p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>

        {/* Reference */}
        <div className="mt-8 p-5 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-xl">
          <p className="text-sm text-emerald-800 dark:text-emerald-300">
            <strong>📖 Full launch kit:</strong> See{' '}
            <code className="px-1.5 py-0.5 bg-emerald-100 dark:bg-emerald-900/40 rounded text-xs">
              PRODUCT_HUNT_LAUNCH_KIT.md
            </code>{' '}
            for complete copywriting templates, UTM parameters, and launch day timeline.
          </p>
        </div>
      </div>
    </main>
  );
}
