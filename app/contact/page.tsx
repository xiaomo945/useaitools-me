import { Metadata } from 'next';
import ContactClient from './ContactClient';

export const metadata: Metadata = {
  title: 'Contact Us – Get in Touch | Use AI Tools',
  description: 'Have questions, suggestions, or partnership ideas? Contact the Use AI Tools team. We respond within 48 hours.',
  openGraph: {
    title: 'Contact Us – Get in Touch | Use AI Tools',
    description: 'Have questions, suggestions, or partnership ideas? Contact the Use AI Tools team.',
    url: 'https://useaitools.me/contact',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Us – Get in Touch | Use AI Tools',
    description: 'Have questions, suggestions, or partnership ideas? Contact the Use AI Tools team.',
  },
  alternates: {
    canonical: 'https://useaitools.me/contact',
  },
};

export default function ContactPage() {
  return <ContactClient />;
}
