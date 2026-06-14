import { Metadata } from 'next';
import NotificationsClient from './NotificationsClient';

export const metadata: Metadata = {
  title: 'Notifications – Stay Updated | Use AI Tools',
  description: 'View your notifications and stay updated on AI tool discussions, replies, and system announcements.',
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: 'Notifications – Stay Updated | Use AI Tools',
    description: 'View your notifications and stay updated on AI tool discussions, replies, and system announcements.',
    url: 'https://useaitools.me/notifications',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Notifications – Stay Updated | Use AI Tools',
    description: 'View your notifications and stay updated on AI tool discussions, replies, and system announcements.',
  },
  alternates: {
    canonical: 'https://useaitools.me/notifications',
  },
};

export default function NotificationsPage() {
  return <NotificationsClient />;
}
