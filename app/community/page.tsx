import { Metadata } from 'next';
import CommunityClient from './CommunityClient';

export const metadata: Metadata = {
  title: 'AI Tools Community – Discuss & Share | Use AI Tools',
  description: 'Join the AI tools community. Discuss features, share experiences, ask questions, and connect with other AI tool enthusiasts.',
  openGraph: {
    title: 'AI Tools Community – Discuss & Share | Use AI Tools',
    description: 'Join the AI tools community. Discuss features, share experiences, and connect with other AI tool enthusiasts.',
    url: 'https://useaitools.me/community',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Tools Community – Discuss & Share | Use AI Tools',
    description: 'Join the AI tools community. Discuss features, share experiences, and connect with other AI tool enthusiasts.',
  },
  alternates: {
    canonical: 'https://useaitools.me/community',
  },
};

export default function CommunityPage() {
  return <CommunityClient />;
}
