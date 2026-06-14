import { Metadata } from 'next';
import BlogClient from './BlogClient';

export const metadata: Metadata = {
  title: 'Blog - AI Tools Insights & Reviews | Use AI Tools',
  description: 'Read in-depth reviews, comparisons, and insights about the best AI tools. Stay updated with the latest trends in artificial intelligence.',
  openGraph: {
    title: 'Blog - AI Tools Insights & Reviews | Use AI Tools',
    description: 'Read in-depth reviews, comparisons, and insights about the best AI tools. Stay updated with the latest trends in artificial intelligence.',
    url: 'https://useaitools.me/blog',
    siteName: 'Use AI Tools',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog - AI Tools Insights & Reviews | Use AI Tools',
    description: 'Read in-depth reviews, comparisons, and insights about the best AI tools. Stay updated with the latest trends in artificial intelligence.',
  },
  alternates: {
    canonical: 'https://useaitools.me/blog',
  },
};

export default function BlogPage() {
  return <BlogClient />;
}
