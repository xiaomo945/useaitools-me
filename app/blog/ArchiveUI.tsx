import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const POSTS_PER_PAGE = 24;

export const CATEGORY_STATS = [
  { name: 'Writing', icon: '✍️' },
  { name: 'Image', icon: '🎨' },
  { name: 'Video', icon: '🎬' },
  { name: 'Audio', icon: '🎵' },
  { name: 'Code', icon: '💻' },
  { name: 'Productivity', icon: '⚡' },
];

const CATEGORY_COLORS: Record<string, { chip: string; bar: string; text: string }> = {
  writing: {
    chip: 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400',
    bar: 'bg-blue-500',
    text: 'text-blue-600 dark:text-blue-400',
  },
  image: {
    chip: 'bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400',
    bar: 'bg-violet-500',
    text: 'text-violet-600 dark:text-violet-400',
  },
  video: {
    chip: 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
    bar: 'bg-indigo-500',
    text: 'text-indigo-600 dark:text-indigo-400',
  },
  audio: {
    chip: 'bg-pink-50 dark:bg-pink-500/10 text-pink-600 dark:text-pink-400',
    bar: 'bg-pink-500',
    text: 'text-pink-600 dark:text-pink-400',
  },
  code: {
    chip: 'bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400',
    bar: 'bg-orange-500',
    text: 'text-orange-600 dark:text-orange-400',
  },
  productivity: {
    chip: 'bg-teal-50 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400',
    bar: 'bg-teal-500',
    text: 'text-teal-600 dark:text-teal-400',
  },
};

const FALLBACK_COLORS = {
  chip: 'bg-slate-100 dark:bg-gray-800 text-slate-600 dark:text-slate-300',
  bar: 'bg-slate-500',
  text: 'text-slate-600 dark:text-slate-300',
};

export function categoryColors(slug: string) {
  return CATEGORY_COLORS[slug] || FALLBACK_COLORS;
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/** Turn a list of posts into the light shape both archive pages render. */
export function toArchivePost(post: {
  id: number;
  title: string;
  slug: string;
  date: string;
  description: string;
  category: string;
}) {
  return {
    id: String(post.id),
    title: post.title,
    slug: post.slug,
    excerpt: post.description,
    publishedAt: post.date,
    category: { name: post.category, slug: post.category.toLowerCase() },
  };
}

export type ArchivePost = ReturnType<typeof toArchivePost>;

/**
 * Page numbers to show in the pager, with an ellipsis where a range is skipped.
 * Every number is a real <a href> so a crawler can walk the whole archive
 * without executing any JavaScript.
 */
function pageWindow(current: number, total: number): (number | 'gap')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const out: (number | 'gap')[] = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  if (start > 2) out.push('gap');
  for (let i = start; i <= end; i++) out.push(i);
  if (end < total - 1) out.push('gap');
  out.push(total);
  return out;
}

/**
 * Pagination lives in the path, never in a query string.
 *
 * `?page=2` used to be the pager's URL shape, and reading `searchParams` on the
 * server forces the whole route to render per request: Next answers with
 * `Cache-Control: private, no-store`, so the CDN can never hold the archive and
 * every crawler hit on /blog re-rendered ~200 KB of HTML at the origin. That was
 * a large part of the site's Fast Origin Transfer bill.
 *
 * Putting the page number in the path lets each page be prerendered at build
 * time and served from cache, and hands crawlers a plain static URL per page.
 */
export function archivePageHref(base: string, page: number): string {
  return page <= 1 ? base : `${base}/page/${page}`;
}

/**
 * Crawlable pagination. The archive used to page with `router.push()`, which
 * emits no anchors at all, so pages 2..N of the blog were unreachable for
 * anything that does not run the site's JavaScript.
 *
 * `base` is '/blog' for the index and '/blog/category/<slug>' for a category;
 * `archivePageHref` turns that into '/blog/page/2' and so on.
 */
export function ArchivePager({
  current,
  total,
  totalPosts,
  base,
}: {
  current: number;
  total: number;
  totalPosts: number;
  base: string;
}) {
  if (total <= 1) return null;

  const href = (page: number) => archivePageHref(base, page);

  const edge = 'pointer-events-none opacity-40';
  const normal =
    'bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-gray-800';

  return (
    <nav aria-label="Article pagination" className="mt-12 flex flex-col items-center gap-4">
      <div className="text-xs text-slate-500 dark:text-slate-400">
        Page <span className="font-semibold text-slate-700 dark:text-slate-300">{current}</span> of{' '}
        <span className="font-semibold text-slate-700 dark:text-slate-300">{total}</span>{' '}
        ({totalPosts} articles)
      </div>
      <div className="flex items-center gap-1.5">
        <Link
          href={href(current - 1)}
          aria-disabled={current === 1}
          className={`inline-flex items-center gap-1 px-3 py-2 text-sm font-semibold rounded-full border transition-all ${
            current === 1 ? edge : normal
          }`}
        >
          <ChevronLeft className="w-4 h-4" /> Prev
        </Link>
        {pageWindow(current, total).map((p, i) =>
          p === 'gap' ? (
            <span
              key={`gap-${i}`}
              className="px-2 text-slate-400 dark:text-slate-500 text-sm font-semibold"
            >
              …
            </span>
          ) : (
            <Link
              key={p}
              href={href(p)}
              aria-current={p === current ? 'page' : undefined}
              className={`min-w-[40px] h-10 px-3 inline-flex items-center justify-center text-sm font-semibold rounded-full transition-all ${
                p === current
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/25'
                  : normal
              }`}
            >
              {p}
            </Link>
          ),
        )}
        <Link
          href={href(current + 1)}
          aria-disabled={current === total}
          className={`inline-flex items-center gap-1 px-3 py-2 text-sm font-semibold rounded-full border transition-all ${
            current === total ? edge : normal
          }`}
        >
          Next <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </nav>
  );
}

/** One post card. Rendered server-side so its <a href> is in the raw HTML. */
export function ArchiveCard({ post }: { post: ArchivePost }) {
  const c = categoryColors(post.category.slug);
  return (
    <Link
      // Twelve cards per archive page, twenty-four pages of archives. Left on
      // the default, every one of them that enters the viewport pulls a full
      // RSC payload from the origin, for a reader who will open one.
      prefetch={false}
      href={`/blog/${post.slug}`}
      className="group bg-white dark:bg-gray-900 rounded-2xl border border-slate-200 dark:border-gray-800 overflow-hidden hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 ease-out"
    >
      <div className={`h-1.5 ${c.bar}`} />
      <div className="p-5">
        <span
          className={`inline-flex items-center text-[10px] font-bold px-2 py-1 rounded-full mb-3 ${c.chip}`}
        >
          {post.category.name}
        </span>
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3 leading-snug group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
          {post.title}
        </h3>
        <p className="text-xs text-slate-600 dark:text-slate-400 mb-4 leading-relaxed line-clamp-3">
          {post.excerpt}
        </p>
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-gray-800 text-[11px] text-slate-400">
          <span className="inline-flex items-center gap-1">{formatDate(post.publishedAt)}</span>
          <span className="font-semibold text-emerald-600 dark:text-emerald-400 group-hover:translate-x-0.5 transition-transform">
            Read →
          </span>
        </div>
      </div>
    </Link>
  );
}

/** Clamp a requested page number into the range that actually exists. */
export function clampPage(requested: number | undefined, totalPages: number): number {
  const n = Number.parseInt(String(requested ?? '1'), 10);
  if (!Number.isFinite(n)) return 1;
  return Math.min(Math.max(n, 1), totalPages);
}
