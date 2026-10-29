import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { blogPosts } from '@/data/blog-posts';
import { POSTS_PER_PAGE } from '../../ArchiveUI';
import { BlogIndexView, blogIndexMetadata } from '../../BlogIndexView';

/**
 * Pages 2..N of the blog archive.
 *
 * These used to be `/blog?page=2`, which meant the route had to read
 * `searchParams`, render on every request and answer `Cache-Control:
 * private, no-store` — so the CDN could never hold it and crawlers forced a
 * fresh origin render of the whole archive each time. As static paths they are
 * prerendered once at build and served from cache.
 */
export const dynamicParams = false;

function totalArchivePages(): number {
  return Math.max(1, Math.ceil(blogPosts.length / POSTS_PER_PAGE));
}

export function generateStaticParams() {
  // Page 1 is /blog, so this route only owns 2..N.
  const total = totalArchivePages();
  return Array.from({ length: Math.max(0, total - 1) }, (_, i) => ({
    page: String(i + 2),
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ page: string }>;
}): Promise<Metadata> {
  const { page } = await params;
  return blogIndexMetadata(Number.parseInt(page, 10) || 2);
}

export default async function BlogArchivePage({
  params,
}: {
  params: Promise<{ page: string }>;
}) {
  const { page } = await params;
  const n = Number.parseInt(page, 10);

  // A hand-typed /blog/page/999 must 404 rather than silently clamp to the last
  // page and answer 200 with content that already lives at another URL.
  if (!Number.isFinite(n) || n < 2 || n > totalArchivePages()) {
    notFound();
  }

  return <BlogIndexView page={n} />;
}
