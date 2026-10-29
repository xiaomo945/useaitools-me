import type { Metadata } from 'next';
import { blogPosts } from '@/data/blog-posts';
import { BlogCategoryView, blogCategoryMetadata } from './BlogCategoryView';

export async function generateStaticParams() {
  const slugs = Array.from(new Set(blogPosts.map((p) => p.category.toLowerCase())));
  return slugs.map((slug) => ({ slug }));
}

// Without this, /blog/category/<anything> falls back to a generic shell and
// answers 200 with an empty list — an infinite soft-404 surface for crawlers.
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return blogCategoryMetadata(slug, 1);
}

/**
 * Page 1 of a category archive.
 *
 * Pages 2..N live at /blog/category/<slug>/page/<n>. They used to be
 * `/blog/category/<slug>?page=2`, which forced `searchParams` into the route and
 * with it a `no-store` response the CDN could not cache.
 */
export default async function BlogCategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <BlogCategoryView slug={slug} page={1} />;
}
