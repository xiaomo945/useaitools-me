import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard – Site Statistics – Use AI Tools',
  description: 'View site statistics, category distribution, tool counts, and weekly activity for the Use AI Tools directory.',
  openGraph: {
    title: 'Dashboard – Site Statistics – Use AI Tools',
    description: 'View site statistics, category distribution, tool counts, and weekly activity for the Use AI Tools directory.',
    siteName: 'Use AI Tools',
    type: 'website',
    url: 'https://useaitools.me/dashboard',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dashboard – Site Statistics – Use AI Tools',
    description: 'View site statistics, category distribution, tool counts, and weekly activity.',
  },
  alternates: {
    canonical: 'https://useaitools.me/dashboard',
  },
};

const breadcrumbLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  'itemListElement': [
    { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': 'https://useaitools.me' },
    { '@type': 'ListItem', 'position': 2, 'name': 'Dashboard', 'item': 'https://useaitools.me/dashboard' },
  ],
};

const webPageLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  'name': 'Dashboard – Use AI Tools',
  'description': 'View site statistics, category distribution, tool counts, and weekly activity.',
  'url': 'https://useaitools.me/dashboard',
  'publisher': {
    '@type': 'Organization',
    'name': 'Use AI Tools',
    'logo': { '@type': 'ImageObject', 'url': 'https://useaitools.me/logo.png' },
  },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageLd) }} />
      {children}
    </>
  );
}