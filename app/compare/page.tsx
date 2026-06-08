import type { Metadata } from 'next';
import CompareClient from './CompareClient';
import Footer from '@/app/components/Footer';

export const metadata: Metadata = {
  title: 'Compare AI Tools – Use AI Tools',
  description: 'Select 2-4 AI tools to compare side-by-side. Find the perfect match for your workflow based on pricing, features, ratings, and more.',
  openGraph: {
    title: 'Compare AI Tools – Use AI Tools',
    description: 'Side-by-side comparison of the best AI tools. Compare pricing, features, and ratings to find the perfect match.',
    type: 'website',
  },
  alternates: {
    canonical: 'https://useaitools.me/compare',
  },
};

export default function ComparePage() {
  return (
    <>
      <CompareClient />
      <Footer />
    </>
  );
}
