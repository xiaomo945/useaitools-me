import { Metadata } from 'next';
import EmailPreferencesClient from './EmailPreferencesClient';

export const metadata: Metadata = {
  title: 'Email Preferences – Customize Notifications | Use AI Tools',
  description: 'Manage your email subscription preferences. Choose which AI tool categories to follow and how often you want to receive updates.',
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: 'Email Preferences – Customize Notifications | Use AI Tools',
    description: 'Manage your email subscription preferences. Choose which AI tool categories to follow and how often you want to receive updates.',
    url: 'https://useaitools.me/email-preferences',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Email Preferences – Customize Notifications | Use AI Tools',
    description: 'Manage your email subscription preferences. Choose which AI tool categories to follow and how often you want to receive updates.',
  },
  alternates: {
    canonical: 'https://useaitools.me/email-preferences',
  },
};

export default function EmailPreferencesPage() {
  return <EmailPreferencesClient />;
}
