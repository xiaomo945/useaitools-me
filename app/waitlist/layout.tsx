import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Join the Waitlist – Use AI Tools',
  description: 'Join the Use AI Tools waitlist to get early access to new features, exclusive AI tool recommendations, and product updates.',
  openGraph: {
    title: 'Join the Waitlist – Use AI Tools',
    description: 'Join the Use AI Tools waitlist to get early access to new features, exclusive AI tool recommendations, and product updates.',
    siteName: 'Use AI Tools',
    type: 'website',
    url: 'https://useaitools.me/waitlist',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Join the Waitlist – Use AI Tools',
    description: 'Join the Use AI Tools waitlist to get early access to new features and exclusive AI tool recommendations.',
  },
  alternates: {
    canonical: 'https://useaitools.me/waitlist',
  },
};

const breadcrumbLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  'itemListElement': [
    { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': 'https://useaitools.me' },
    { '@type': 'ListItem', 'position': 2, 'name': 'Join the Waitlist', 'item': 'https://useaitools.me/waitlist' },
  ],
};

const webPageLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  'name': 'Join the Waitlist – Use AI Tools',
  'description': 'Join the Use AI Tools waitlist to get early access to new features and exclusive AI tool recommendations.',
  'url': 'https://useaitools.me/waitlist',
  'publisher': {
    '@type': 'Organization',
    'name': 'Use AI Tools',
    'logo': { '@type': 'ImageObject', 'url': 'https://useaitools.me/logo.png' },
  },
};

export default function WaitlistLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageLd) }} />
      {children}
    </>
  );
}