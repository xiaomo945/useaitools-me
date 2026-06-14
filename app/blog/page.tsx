import { Metadata } from 'next';
import BlogClient from './BlogClient';

export const metadata: Metadata = {
  title: 'Blog - AI Tools Insights & Reviews | Use AI Tools',
  description: 'Read in-depth reviews, comparisons, and insights about the best AI tools. Stay updated with the latest trends in artificial intelligence.',
};

export default function BlogPage() {
  return <BlogClient />;
}
