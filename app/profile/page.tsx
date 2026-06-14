import { Metadata } from 'next';
import ProfileClient from './ProfileClient';

export const metadata: Metadata = {
  title: 'My Profile – User Dashboard | Use AI Tools',
  description: 'View your profile, track your activity, see your favorite AI tools, and manage your preferences on Use AI Tools.',
  openGraph: {
    title: 'My Profile – User Dashboard | Use AI Tools',
    description: 'View your profile, track your activity, see your favorite AI tools, and manage your preferences.',
    url: 'https://useaitools.me/profile',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'My Profile – User Dashboard | Use AI Tools',
    description: 'View your profile, track your activity, see your favorite AI tools, and manage your preferences.',
  },
  alternates: {
    canonical: 'https://useaitools.me/profile',
  },
};

export default function ProfilePage() {
  return <ProfileClient />;
}
