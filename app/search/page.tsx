import type { Metadata } from 'next';
import Footer from '@/app/components/Footer';
import SearchClient from './SearchClient';

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
    openGraph: {
      title,
      description,
    },
    alternates: {
      canonical: `https://useaitools.me/search${query ? `?q=${encodeURIComponent(query)}` : ''}`,
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
