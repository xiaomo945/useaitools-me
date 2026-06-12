import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Saved Tools – Your AI Tool Favorites – Use AI Tools',
  description: 'Your curated collection of favorite AI tools. Save, compare, and export your top picks across Writing, Image, Video, Audio, Code & Productivity categories.',
  openGraph: {
    title: 'Saved Tools – Your AI Tool Favorites – Use AI Tools',
    description: 'Your curated collection of favorite AI tools. Save, compare, and export your top picks across Writing, Image, Video, Audio, Code & Productivity categories.',
    siteName: 'Use AI Tools',
    type: 'website',
    url: 'https://useaitools.me/saved',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Saved Tools – Your AI Tool Favorites – Use AI Tools',
    description: 'Your curated collection of favorite AI tools. Save, compare, and export your top picks.',
  },
  alternates: {
    canonical: 'https://useaitools.me/saved',
  },
};

const breadcrumbLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  'itemListElement': [
    { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': 'https://useaitools.me' },
    { '@type': 'ListItem', 'position': 2, 'name': 'Saved Tools', 'item': 'https://useaitools.me/saved' },
  ],
};

const webPageLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  'name': 'Saved Tools – Your AI Tool Favorites',
  'description': 'Your curated collection of favorite AI tools. Save, compare, and export your top picks.',
  'url': 'https://useaitools.me/saved',
  'publisher': {
    '@type': 'Organization',
    'name': 'Use AI Tools',
    'logo': { '@type': 'ImageObject', 'url': 'https://useaitools.me/logo.png' },
  },
};

export default function SavedLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageLd) }} />
      {children}
    </>
  );
}