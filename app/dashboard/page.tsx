import { Metadata } from 'next';
import DashboardClient from './DashboardClient';

export const metadata: Metadata = {
  title: 'Dashboard – Site Statistics & Health | Use AI Tools',
  description: 'View site statistics, tool distribution, and activity overview. Monitor the health and growth of our AI tools directory.',
  openGraph: {
    title: 'Dashboard – Site Statistics & Health | Use AI Tools',
    description: 'View site statistics, tool distribution, and activity overview.',
    url: 'https://useaitools.me/dashboard',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dashboard – Site Statistics & Health | Use AI Tools',
    description: 'View site statistics, tool distribution, and activity overview.',
  },
  alternates: {
    canonical: 'https://useaitools.me/dashboard',
  },
};

export default function DashboardPage() {
  return <DashboardClient />;
}
