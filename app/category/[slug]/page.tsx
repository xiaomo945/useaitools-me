import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  CATEGORY_SLUGS,
  CategoryView,
  categoryMetadata,
  resolveCategory,
} from './CategoryView';

/**
 * The six categories are a fixed set, so they are prerendered at build time.
 *
 * Without this the route had no `generateStaticParams`, which makes Next render
 * it on demand for every single request and mark the response
 * `private, no-cache, no-store` — the CDN can never cache it. Category hubs sit
 * in the main navigation, so every crawler sweep paid for a full server render
 * of each one.
 *
 * `dynamicParams` is deliberately left at its default (`true`) instead of being
 * set to `false`. `/category/Writing` has been a live URL for a long time and
 * returns the same list as `/category/writing`; 404-ing it would drop whatever
 * Google has indexed under the capitalised form. The lowercase six are cached,
 * the capitalised variants still render on demand and canonicalise to lowercase
 * via `categoryMetadata`.
 */
export function generateStaticParams() {
  return CATEGORY_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = resolveCategory(slug);
  if (!category) return { title: 'Not Found – Use AI Tools' };
  return categoryMetadata(category, 1);
}

/** Page 1 of a category listing. Pages 2..N live at /category/<slug>/page/<n>. */
export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = resolveCategory(slug);
  if (!category) notFound();

  return <CategoryView category={category} page={1} />;
}
