import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Tools Blog – Use AI Tools',
  description: 'In-depth comparisons, reviews, and guides for AI tools.',
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
