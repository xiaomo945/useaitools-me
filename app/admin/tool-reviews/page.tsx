import { Metadata } from 'next';
import ToolReviewsAdminClient from './ToolReviewsAdminClient';

export const metadata: Metadata = {
  title: 'Tool Reviews Admin | Use AI Tools',
  description: 'Manage tool reviews and ratings',
};

export default function ToolReviewsAdminPage() {
  return <ToolReviewsAdminClient />;
}
