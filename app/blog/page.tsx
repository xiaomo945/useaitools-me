import type { Metadata } from 'next';
import { BlogIndexView, blogIndexMetadata } from './BlogIndexView';

/**
 * Page 1 of the blog archive.
 *
 * Pages 2..N live at /blog/page/<n> (`app/blog/page/[page]/page.tsx`) so that
 * every page is a real, prerenderable URL instead of `?page=n`. See
 * `archivePageHref` in ./ArchiveUI for why the query-string form had to go.
 */
export const metadata: Metadata = blogIndexMetadata(1);

export default function BlogPage() {
  return <BlogIndexView page={1} />;
}
