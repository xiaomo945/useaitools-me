import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Browsing History – Recently Viewed AI Tools – Use AI Tools',
  description: 'View your recently explored AI tools. Track your browsing history across Writing, Image, Video, Audio, Code, and Productivity categories.',
  openGraph: {
    title: 'Browsing History – Recently Viewed AI Tools – Use AI Tools',
    description: 'View your recently explored AI tools. Track your browsing history across Writing, Image, Video, Audio, Code, and Productivity categories.',
    siteName: 'Use AI Tools',
    type: 'website',
    url: 'https://useaitools.me/history',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Browsing History – Recently Viewed AI Tools – Use AI Tools',
    description: 'View your recently explored AI tools. Track your browsing history across all categories.',
  },
  alternates: {
    canonical: 'https://useaitools.me/history',
  },
};

const breadcrumbLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  'itemListElement': [
    { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': 'https://useaitools.me' },
    { '@type': 'ListItem', 'position': 2, 'name': 'Browsing History', 'item': 'https://useaitools.me/history' },
  ],
};

const webPageLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  'name': 'Browsing History – Use AI Tools',
  'description': 'View your recently explored AI tools. Track your browsing history across all categories.',
  'url': 'https://useaitools.me/history',
  'publisher': {
    '@type': 'Organization',
    'name': 'Use AI Tools',
    'logo': { '@type': 'ImageObject', 'url': 'https://useaitools.me/logo.png' },
  },
};

export default function HistoryLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageLd) }} />
      {children}
    </>
  );
}