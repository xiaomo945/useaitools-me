import { Metadata } from 'next';
import ToolReviewTemplatesAdminClient from './ToolReviewTemplatesAdminClient';

export const metadata: Metadata = {
  title: '评测模板管理 - Use AI Tools',
  description: '管理工具评测的标准模板',
};

export default function ToolReviewTemplatesAdminPage() {
  return <ToolReviewTemplatesAdminClient />;
}
