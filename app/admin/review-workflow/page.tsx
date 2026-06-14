import { Metadata } from 'next';
import ReviewWorkflowClient from './ReviewWorkflowClient';

export const metadata: Metadata = {
  title: '评测工作流管理 | Use AI Tools',
  description: '管理工具评测的创建、编辑和发布流程',
};

export default function ReviewWorkflowPage() {
  return <ReviewWorkflowClient />;
}
