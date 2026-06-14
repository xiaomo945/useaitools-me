import { Metadata } from 'next';
import NewDiscussionClient from './NewDiscussionClient';

export const metadata: Metadata = {
  title: 'New Discussion – Community | Use AI Tools',
  description: 'Start a new discussion about AI tools. Share your experiences, ask questions, and connect with other users in our community.',
  openGraph: {
    title: 'New Discussion – Community | Use AI Tools',
    description: 'Start a new discussion about AI tools. Share your experiences, ask questions, and connect with other users in our community.',
    url: 'https://useaitools.me/community/new',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'New Discussion – Community | Use AI Tools',
    description: 'Start a new discussion about AI tools. Share your experiences, ask questions, and connect with other users in our community.',
  },
  alternates: {
    canonical: 'https://useaitools.me/community/new',
  },
};

export default function NewDiscussionPage() {
  return <NewDiscussionClient />;
}
