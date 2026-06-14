import { Metadata } from 'next';
import SubmitClient from './SubmitClient';

export const metadata: Metadata = {
  title: 'Submit an AI Tool – Add to Directory | Use AI Tools',
  description: 'Know a great AI tool? Submit it to our directory and help others discover it. Free submission, reviewed within 48 hours.',
  openGraph: {
    title: 'Submit an AI Tool – Add to Directory | Use AI Tools',
    description: 'Know a great AI tool? Submit it to our directory and help others discover it.',
    url: 'https://useaitools.me/submit',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Submit an AI Tool – Add to Directory | Use AI Tools',
    description: 'Know a great AI tool? Submit it to our directory and help others discover it.',
  },
  alternates: {
    canonical: 'https://useaitools.me/submit',
  },
};

export default function SubmitPage() {
  return <SubmitClient />;
}
