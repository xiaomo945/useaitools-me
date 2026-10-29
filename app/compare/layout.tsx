import type { Metadata } from 'next';

// Deliberately no `alternates.canonical` here.
//
// A layout-level canonical is inherited by every route underneath it, so
// setting it to /compare made /compare/video, /compare/audio and
// /compare/writing each declare themselves duplicates of the hub - they could
// never be indexed for their own category. /compare itself declares its own
// canonical in app/compare/page.tsx. Any new page below /compare must do the
// same rather than rely on inheritance.

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
};

export default function CompareLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
