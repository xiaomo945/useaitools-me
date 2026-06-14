import { Metadata } from 'next';
import CommunityDetailClient from './CommunityDetailClient';

export const metadata: Metadata = {
  title: 'Discussion – Community | Use AI Tools',
  description: 'Join the discussion about AI tools. Share your experiences, ask questions, and connect with other users.',
  openGraph: {
    title: 'Discussion – Community | Use AI Tools',
    description: 'Join the discussion about AI tools. Share your experiences, ask questions, and connect with other users.',
    url: 'https://useaitools.me/community',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Discussion – Community | Use AI Tools',
    description: 'Join the discussion about AI tools. Share your experiences, ask questions, and connect with other users.',
  },
  alternates: {
    canonical: 'https://useaitools.me/community',
  },
};

export default function CommunityDetailPage() {
  return <CommunityDetailClient />;
}
