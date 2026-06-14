import { Metadata } from 'next';
import CollectionsClient from './CollectionsClient';

export const metadata: Metadata = {
  title: 'My Collections – Organize AI Tools | Use AI Tools',
  description: 'Create and manage custom collections of your favorite AI tools. Organize tools by category, project, or preference for easy access.',
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: 'My Collections – Organize AI Tools | Use AI Tools',
    description: 'Create and manage custom collections of your favorite AI tools. Organize tools by category, project, or preference for easy access.',
    url: 'https://useaitools.me/collections',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'My Collections – Organize AI Tools | Use AI Tools',
    description: 'Create and manage custom collections of your favorite AI tools. Organize tools by category, project, or preference for easy access.',
  },
  alternates: {
    canonical: 'https://useaitools.me/collections',
  },
};

export default function CollectionsPage() {
  return <CollectionsClient />;
}
