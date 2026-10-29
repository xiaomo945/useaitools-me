import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { blogPosts } from '@/data/blog-posts';
import { POSTS_PER_PAGE } from '../../../../ArchiveUI';
import {
  BlogCategoryView,
  blogCategoryMetadata,
  categoryTotalPages,
} from '../../BlogCategoryView';

/**
 * Pages 2..N of a category archive.
 *
 * Replaces `/blog/category/<slug>?page=2`. Same reason as the main archive: a
 * route that reads `searchParams` cannot be prerendered, answers `no-store`, and
 * therefore cost a full origin render on every crawler hit.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  const slugs = Array.from(new Set(blogPosts.map((p) => p.category.toLowerCase())));

  return slugs.flatMap((slug) => {
    const total = categoryTotalPages(slug);
    // Page 1 is /blog/category/<slug>, so this route owns 2..N only.
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
  return blogCategoryMetadata(slug, Number.parseInt(page, 10) || 2);
}

export default async function BlogCategoryArchivePage({
  params,
}: {
  params: Promise<{ slug: string; page: string }>;
}) {
  const { slug, page } = await params;
  const n = Number.parseInt(page, 10);

  // A hand-typed /blog/category/x/page/99 must 404 rather than clamp to the last
  // page and answer 200 with content that already lives at another URL.
  if (!Number.isFinite(n) || n < 2 || n > categoryTotalPages(slug)) {
    notFound();
  }

  return <BlogCategoryView slug={slug} page={n} />;
}
