import { Metadata } from 'next';
import WaitlistClient from './WaitlistClient';

export const metadata: Metadata = {
  title: 'Join the Waitlist – Use AI Writer Coming Soon | Use AI Tools',
  description: 'Be among the first to try Use AI Writer, our affordable and context-aware AI writing tool. Join the waitlist for early bird pricing.',
  openGraph: {
    title: 'Join the Waitlist – Use AI Writer Coming Soon | Use AI Tools',
    description: 'Be among the first to try Use AI Writer, our affordable and context-aware AI writing tool. Join the waitlist for early bird pricing.',
    url: 'https://useaitools.me/waitlist',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Join the Waitlist – Use AI Writer Coming Soon | Use AI Tools',
    description: 'Be among the first to try Use AI Writer, our affordable and context-aware AI writing tool. Join the waitlist for early bird pricing.',
  },
  alternates: {
    canonical: 'https://useaitools.me/waitlist',
  },
};

export default function WaitlistPage() {
  return <WaitlistClient />;
}
