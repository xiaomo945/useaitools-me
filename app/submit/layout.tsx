import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Submit a Tool – Use AI Tools',
  description: 'Submit a new AI tool to the Use AI Tools directory. Help the community discover the best AI writing, image, video, audio, code, and productivity tools.',
  openGraph: {
    title: 'Submit a Tool – Use AI Tools',
    description: 'Submit a new AI tool to the Use AI Tools directory. Help the community discover the best AI writing, image, video, audio, code, and productivity tools.',
    siteName: 'Use AI Tools',
    type: 'website',
    url: 'https://useaitools.me/submit',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Submit a Tool – Use AI Tools',
    description: 'Submit a new AI tool to the Use AI Tools directory. Help the community discover the best AI tools.',
  },
  alternates: {
    canonical: 'https://useaitools.me/submit',
  },
};

const breadcrumbLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  'itemListElement': [
    { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': 'https://useaitools.me' },
    { '@type': 'ListItem', 'position': 2, 'name': 'Submit a Tool', 'item': 'https://useaitools.me/submit' },
  ],
};

const webPageLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  'name': 'Submit a Tool – Use AI Tools',
  'description': 'Submit a new AI tool to the Use AI Tools directory. Help the community discover the best AI tools.',
  'url': 'https://useaitools.me/submit',
  'publisher': {
    '@type': 'Organization',
    'name': 'Use AI Tools',
    'logo': { '@type': 'ImageObject', 'url': 'https://useaitools.me/logo.png' },
  },
};

export default function SubmitLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageLd) }} />
      {children}
    </>
  );
}