import { Metadata } from 'next';
import ChangelogClient from './ChangelogClient';

export const metadata: Metadata = {
  title: 'Changelog – Latest Updates & Features | Use AI Tools',
  description: 'Track the latest updates, new features, and improvements to Use AI Tools. Stay informed about our continuous enhancements.',
  openGraph: {
    title: 'Changelog – Latest Updates & Features | Use AI Tools',
    description: 'Track the latest updates, new features, and improvements to Use AI Tools.',
    url: 'https://useaitools.me/changelog',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Changelog – Latest Updates & Features | Use AI Tools',
    description: 'Track the latest updates, new features, and improvements to Use AI Tools.',
  },
  alternates: {
    canonical: 'https://useaitools.me/changelog',
  },
};

export default function ChangelogPage() {
  return <ChangelogClient />;
}
