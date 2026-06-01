import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Compare AI Tools Side by Side – Use AI Tools',
  description: 'Compare AI tools side by side. See features, pricing, ratings, and reviews for writing, image, video, audio, code, and productivity tools all in one place.',
  openGraph: {
    title: 'Compare AI Tools Side by Side – Use AI Tools',
    description: 'Compare AI tools side by side. See features, pricing, ratings, and reviews for writing, image, video, audio, code, and productivity tools all in one place.',
    siteName: 'Use AI Tools',
    type: 'website',
    url: 'https://useaitools.me/compare',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Compare AI Tools Side by Side – Use AI Tools',
    description: 'Compare AI tools side by side. See features, pricing, ratings, and reviews for writing, image, video, audio, code, and productivity tools all in one place.',
  },
  alternates: {
    canonical: 'https://useaitools.me/compare',
  },
};

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

export default function CompareLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
      {children}
    </>
  );
}
