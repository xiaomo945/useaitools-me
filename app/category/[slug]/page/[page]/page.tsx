import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  CATEGORY_SLUGS,
  CategoryView,
  categoryMetadata,
  categoryTotalPages,
  resolveCategory,
} from '../../CategoryView';

/**
 * Pages 2..N of a category listing.
 *
 * `/category/code` used to render all 481 tools in one response — 4.3 MB of
 * HTML, and the six category pages together came to roughly 11 MB per crawl
 * sweep. Splitting the grid into pages keeps each response around 400 KB and
 * lets every page be prerendered and served from cache.
 *
 * These pages are `noindex, follow` (see `categoryMetadata`): they exist to
 * split a large listing into cacheable chunks, not to be search results of their
 * own, but the 48 tool links on each still pass through.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return CATEGORY_SLUGS.flatMap((slug) => {
    const category = resolveCategory(slug);
    if (!category) return [];
    const total = categoryTotalPages(category);
    // Page 1 is /category/<slug>, so this route owns 2..N only.
    return Array.from({ length: Math.max(0, total - 1) }, (_, i) => ({
      slug,
      page: String(i + 2),
    }));
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; page: string }>;
}): Promise<Metadata> {
  const { slug, page } = await params;
  const category = resolveCategory(slug);
  if (!category) return { title: 'Not Found – Use AI Tools' };
  return categoryMetadata(category, Number.parseInt(page, 10) || 2);
}

export default async function CategoryArchivePage({
  params,
}: {
  params: Promise<{ slug: string; page: string }>;
}) {
  const { slug, page } = await params;
  const category = resolveCategory(slug);
  if (!category) notFound();

  const n = Number.parseInt(page, 10);
  // A hand-typed /category/code/page/99 must 404 rather than clamp to the last
  // page and answer 200 with content that already lives at another URL.
  if (!Number.isFinite(n) || n < 2 || n > categoryTotalPages(category)) {
    notFound();
  }

  return <CategoryView category={category} page={n} />;
}
