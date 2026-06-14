import { Metadata } from 'next';
import RecommendationsClient from './RecommendationsClient';

export const metadata: Metadata = {
  title: 'Personalized Recommendations – AI Tools for You | Use AI Tools',
  description: 'Discover AI tools personalized to your preferences. Get recommendations based on your interests, recent activity, and saved tools.',
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: 'Personalized Recommendations – AI Tools for You | Use AI Tools',
    description: 'Discover AI tools personalized to your preferences. Get recommendations based on your interests, recent activity, and saved tools.',
    url: 'https://useaitools.me/recommendations',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Personalized Recommendations – AI Tools for You | Use AI Tools',
    description: 'Discover AI tools personalized to your preferences. Get recommendations based on your interests, recent activity, and saved tools.',
  },
  alternates: {
    canonical: 'https://useaitools.me/recommendations',
  },
};

export default function RecommendationsPage() {
  return <RecommendationsClient />;
}
