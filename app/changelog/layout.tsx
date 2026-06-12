import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Changelog – Latest Updates & Features – Use AI Tools',
  description: 'Track the latest updates, new features, and improvements to the Use AI Tools directory. Stay informed about new AI tools, content additions, and site enhancements.',
  openGraph: {
    title: 'Changelog – Latest Updates & Features – Use AI Tools',
    description: 'Track the latest updates, new features, and improvements to the Use AI Tools directory. Stay informed about new AI tools, content additions, and site enhancements.',
    siteName: 'Use AI Tools',
    type: 'website',
    url: 'https://useaitools.me/changelog',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Changelog – Latest Updates & Features – Use AI Tools',
    description: 'Track the latest updates, new features, and improvements to the Use AI Tools directory.',
  },
  alternates: {
    canonical: 'https://useaitools.me/changelog',
  },
};

const breadcrumbLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  'itemListElement': [
    { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': 'https://useaitools.me' },
    { '@type': 'ListItem', 'position': 2, 'name': 'Changelog', 'item': 'https://useaitools.me/changelog' },
  ],
};

const webPageLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  'name': 'Changelog – Use AI Tools',
  'description': 'Track the latest updates, new features, and improvements to the Use AI Tools directory.',
  'url': 'https://useaitools.me/changelog',
  'publisher': {
    '@type': 'Organization',
    'name': 'Use AI Tools',
    'logo': { '@type': 'ImageObject', 'url': 'https://useaitools.me/logo.png' },
  },
};

export default function ChangelogLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageLd) }} />
      {children}
    </>
  );
}