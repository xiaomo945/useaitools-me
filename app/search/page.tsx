import type { Metadata } from 'next';
import Footer from '@/app/components/Footer';
import SearchClient from './SearchClient';

// Metadata is derived from the query string, so this route cannot be prerendered.
export const dynamic = 'force-dynamic';

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ q?: string }> }): Promise<Metadata> {
  const { q } = await searchParams;
  const query = q || '';
  const title = query ? `Search results for "${query}" – Use AI Tools` : 'Search AI Tools – Use AI Tools';
  const description = query
    ? `Find the best AI tools matching "${query}". Handpicked directory of AI tools to boost your workflow.`
    : 'Search our handpicked directory of AI tools to find the perfect tools for your needs.';

  return {
    title,
    description,
    // Search result pages are the canonical example of a page that should never
    // be indexed: the same tools are already listed on the category pages, and
    // every query string (?q=...) minted another URL that competed with them.
    // The old canonical included the query, so it could not consolidate either.
    // `follow` stays on so the links to real tool pages still count.
    robots: { index: false, follow: true },
    openGraph: {
      title,
      description,
    },
  };
}

export default function SearchPage() {
  return (
    <>
      <SearchClient />
      <Footer />
    </>
  );
}
