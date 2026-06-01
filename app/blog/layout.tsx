import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Tools Blog – Comparisons, Reviews & Guides – Use AI Tools',
  description: 'In-depth comparisons, reviews, and guides for AI tools. Discover the best AI writing, image, video, audio, coding, and productivity tools with expert analysis.',
  openGraph: {
    title: 'AI Tools Blog – Comparisons, Reviews & Guides – Use AI Tools',
    description: 'In-depth comparisons, reviews, and guides for AI tools. Discover the best AI writing, image, video, audio, coding, and productivity tools with expert analysis.',
    siteName: 'Use AI Tools',
    type: 'website',
    url: 'https://useaitools.me/blog',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Tools Blog – Comparisons, Reviews & Guides – Use AI Tools',
    description: 'In-depth comparisons, reviews, and guides for AI tools. Discover the best AI writing, image, video, audio, coding, and productivity tools with expert analysis.',
  },
  alternates: {
    canonical: 'https://useaitools.me/blog',
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
      'name': 'Blog',
      'item': 'https://useaitools.me/blog',
    },
  ],
};

const collectionLd = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  'name': 'AI Tools Blog',
  'description': 'In-depth comparisons, reviews, and guides for AI tools.',
  'url': 'https://useaitools.me/blog',
  'publisher': {
    '@type': 'Organization',
    'name': 'Use AI Tools',
    'logo': {
      '@type': 'ImageObject',
      'url': 'https://useaitools.me/logo.png',
    },
  },
};

export default function BlogLayout({
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionLd) }}
      />
      {children}
    </>
  );
}
