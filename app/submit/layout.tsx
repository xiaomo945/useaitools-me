import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Submit Your AI Tool – Use AI Tools Directory',
  description: 'Submit your AI tool to our curated directory. Free listing for approved tools. Reach 50,000+ monthly visitors searching for the best AI tools.',
  keywords: ['submit AI tool', 'AI tool directory', 'list your AI tool', 'submit software to directory', 'AI tool review'],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Submit Your AI Tool – Use AI Tools Directory',
    description: 'Submit your AI tool to our curated directory. Free listing for approved tools. Reach 50,000+ monthly visitors searching for the best AI tools.',
    siteName: 'Use AI Tools',
    type: 'website',
    url: 'https://useaitools.me/submit',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Submit Your AI Tool – Use AI Tools Directory',
    description: 'Submit your AI tool to our curated directory. Free listing for approved tools. Reach 50,000+ monthly visitors searching for the best AI tools.',
  },
  alternates: {
    canonical: 'https://useaitools.me/submit',
  },
};

const organizationLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  'name': 'Use AI Tools',
  'url': 'https://useaitools.me',
  'logo': {
    '@type': 'ImageObject',
    'url': 'https://useaitools.me/logo.png',
  },
  'description': 'A curated directory of the best AI tools for writing, image generation, video editing, audio production, coding, and productivity.',
  'sameAs': [
    'https://x.com/useaitools',
  ],
};

const webSiteLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  'name': 'Use AI Tools',
  'url': 'https://useaitools.me',
  'description': 'Discover and compare the best AI tools. A curated directory of AI-powered software and services.',
  'potentialAction': {
    '@type': 'SearchAction',
    'target': 'https://useaitools.me/?q={search_term_string}',
    'query-input': 'required name=search_term_string',
  },
};

const breadcrumbLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  'itemListElement': [
    { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': 'https://useaitools.me' },
    { '@type': 'ListItem', 'position': 2, 'name': 'Submit Your AI Tool', 'item': 'https://useaitools.me/submit' },
  ],
};

const webPageLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  'name': 'Submit Your AI Tool – Use AI Tools Directory',
  'description': 'Submit your AI tool to our curated directory. Free listing for approved tools. Reach 50,000+ monthly visitors searching for the best AI tools.',
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageLd) }} />
      {children}
    </>
  );
}