import { Metadata } from 'next';
import HistoryClient from './HistoryClient';

export const metadata: Metadata = {
  title: 'Browsing History – Recently Viewed Tools | Use AI Tools',
  description: 'View your browsing history and recently explored AI tools. Track your activity and quickly access tools you\'ve previously viewed.',
  openGraph: {
    title: 'Browsing History – Recently Viewed Tools | Use AI Tools',
    description: 'View your browsing history and recently explored AI tools.',
    url: 'https://useaitools.me/history',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Browsing History – Recently Viewed Tools | Use AI Tools',
    description: 'View your browsing history and recently explored AI tools.',
  },
  alternates: {
    canonical: 'https://useaitools.me/history',
  },
};

export default function HistoryPage() {
  return <HistoryClient />;
}
