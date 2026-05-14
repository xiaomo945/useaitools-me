import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import tools from '@/data/tools.json';
import Footer from '@/app/components/Footer';
import ToolDetailClient from './ToolDetailClient';

type Tool = {
  id: number;
  name: string;
  description: string;
  category: 'Writing' | 'Image' | 'Productivity' | 'Code' | 'Audio' | 'Video';
  pricing: string;
  url: string;
  affiliate_link: string;
  icon_url: string;
};

// 类型断言确保数据符合我们的类型要求
const typedTools = tools as Tool[];

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const toolId = parseInt(id);
  const tool = typedTools.find(t => t.id === toolId);
  
  if (!tool) {
    return {
      title: 'Tool Not Found – Use AI Tools',
      description: 'The tool you are looking for could not be found.'
    };
  }
  
  const title = `${tool.name} – Use AI Tools`;
  const description = tool.description.slice(0, 160);
  
  return {
    title,
    description,
    openGraph: {
      title,
      description
    }
  };
}

export default async function ToolDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const toolId = parseInt(id);
  const tool = typedTools.find(t => t.id === toolId);

  if (!tool) {
    notFound();
  }

  // Get related tools from the same category
  const relatedTools = typedTools
    .filter(t => t.category === tool.category && t.id !== tool.id)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);

  return <ToolDetailClient tool={tool} relatedTools={relatedTools} />;
}
