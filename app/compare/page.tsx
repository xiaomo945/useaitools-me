import type { Metadata } from 'next';
import CompareClient from './CompareClient';
import Footer from '@/app/components/Footer';

const breadcrumbLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  'itemListElement': [
    {
      '@type': 'ListItem',
      'position': 1,
      'name': 'Home',
      'item': 'https://useaitools.me',
    },
    {
      '@type': 'ListItem',
      'position': 2,
      'name': 'Compare AI Tools',
      'item': 'https://useaitools.me/compare',
    },
  ],
};

const webPageLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  'name': 'Compare AI Tools Side by Side',
  'description': 'Compare AI tools side by side. See features, pricing, ratings, and reviews for writing, image, video, audio, code, and productivity tools all in one place.',
  'url': 'https://useaitools.me/compare',
  'publisher': {
    '@type': 'Organization',
    'name': 'Use AI Tools',
    'logo': {
      '@type': 'ImageObject',
      'url': 'https://useaitools.me/logo.png',
    },
  },
};

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageLd) }}
      />
      <CompareClient />
      <Footer />
    </>
  );
}
