import { Metadata } from 'next';
import SavedClient from './SavedClient';

export const metadata: Metadata = {
  title: 'My Saved AI Tools – Personal Collection | Use AI Tools',
  description: 'Your personal collection of saved AI tools. Access your favorites anytime, export to CSV, and manage your AI toolkit with ease.',
  openGraph: {
    title: 'My Saved AI Tools – Personal Collection | Use AI Tools',
    description: 'Your personal collection of saved AI tools. Access your favorites anytime, export to CSV, and manage your AI toolkit.',
    url: 'https://useaitools.me/saved',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'My Saved AI Tools – Personal Collection | Use AI Tools',
    description: 'Your personal collection of saved AI tools. Access your favorites anytime, export to CSV, and manage your AI toolkit.',
  },
  alternates: {
    canonical: 'https://useaitools.me/saved',
  },
};

export default function SavedPage() {
  return <SavedClient />;
}
