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
  examples?: any[];
};

// 类型断言确保数据符合我们的类型要求
const typedTools = tools as Tool[];

// Helper function to get affiliate link from environment variable or fallback to JSON
function getAffiliateLink(tool: Tool): string {
  const envVarName = `AFFILIATE_${tool.name.toUpperCase().replace(/\s+/g, '_')}`;
  const shortEnvVarName = tool.name === 'VEED.io' ? 'AFFILIATE_VEED' : '';
  const envLink = process.env[envVarName] || (shortEnvVarName && process.env[shortEnvVarName]);
  return envLink || tool.affiliate_link;
}

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

  // Enrich tool with affiliate link from environment variable
  const enrichedTool = {
    ...tool,
    affiliate_link: getAffiliateLink(tool)
  };

  // Get related tools from the same category and enrich them too
  const relatedTools = typedTools
    .filter(t => t.category === tool.category && t.id !== tool.id)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3)
    .map(t => ({ ...t, affiliate_link: getAffiliateLink(t) }));

  return <ToolDetailClient tool={enrichedTool} relatedTools={relatedTools} />;
}
