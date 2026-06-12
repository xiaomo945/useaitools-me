import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us – Use AI Tools',
  description: 'Get in touch with the Use AI Tools team. Reach out for affiliate partnerships, tool submissions, feedback, or general inquiries.',
  openGraph: {
    title: 'Contact Us – Use AI Tools',
    description: 'Get in touch with the Use AI Tools team. Reach out for affiliate partnerships, tool submissions, feedback, or general inquiries.',
    siteName: 'Use AI Tools',
    type: 'website',
    url: 'https://useaitools.me/contact',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Us – Use AI Tools',
    description: 'Get in touch with the Use AI Tools team for partnerships, feedback, or inquiries.',
  },
  alternates: {
    canonical: 'https://useaitools.me/contact',
  },
};

const breadcrumbLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  'itemListElement': [
    { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': 'https://useaitools.me' },
    { '@type': 'ListItem', 'position': 2, 'name': 'Contact Us', 'item': 'https://useaitools.me/contact' },
  ],
};

const webPageLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  'name': 'Contact Us – Use AI Tools',
  'description': 'Get in touch with the Use AI Tools team for affiliate partnerships, tool submissions, feedback, or general inquiries.',
  'url': 'https://useaitools.me/contact',
  'publisher': {
    '@type': 'Organization',
    'name': 'Use AI Tools',
    'logo': { '@type': 'ImageObject', 'url': 'https://useaitools.me/logo.png' },
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageLd) }} />
      {children}
    </>
  );
}