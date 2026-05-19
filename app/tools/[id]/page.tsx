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
  category: 'Writing' | 'Image' | 'Productivity' | 'Code' | 'Audio' | 'Video' | 'Medical' | 'Finance' | 'Law' | 'Agriculture';
  pricing: string;
  url: string;
  affiliate_link: string;
  icon_url: string;
  examples?: any[];
  needs_vpn: boolean;
  languages: string[];
};

// 类型断言确保数据符合我们的类型要求
const typedTools = tools as Tool[];

// Helper function to check if a tool has affiliate link (environment variable or JSON field)
function hasAffiliateLink(tool: Tool): boolean {
  const envVarName = `AFFILIATE_${tool.name.toUpperCase().replace(/\s+/g, '_')}`;
  let shortEnvVarName = '';
  if (tool.name === 'VEED.io') {
    shortEnvVarName = 'AFFILIATE_VEED';
  } else if (tool.name === 'Murf AI') {
    shortEnvVarName = 'AFFILIATE_MURF';
  } else if (tool.name === 'Pictory') {
    shortEnvVarName = 'AFFILIATE_PICTORY';
  }
  const envLink = (shortEnvVarName && process.env[shortEnvVarName]) || process.env[envVarName];
  return !!(envLink || tool.affiliate_link);
}

// Helper function to get affiliate link from environment variable or fallback to JSON
function getAffiliateLink(tool: Tool): string {
  const envVarName = `AFFILIATE_${tool.name.toUpperCase().replace(/\s+/g, '_')}`;
  let shortEnvVarName = '';
  if (tool.name === 'VEED.io') {
    shortEnvVarName = 'AFFILIATE_VEED';
  } else if (tool.name === 'Murf AI') {
    shortEnvVarName = 'AFFILIATE_MURF';
  } else if (tool.name === 'Pictory') {
    shortEnvVarName = 'AFFILIATE_PICTORY';
  }
  const envLink = (shortEnvVarName && process.env[shortEnvVarName]) || process.env[envVarName];
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

  // Get related tools - smart recommendation algorithm
  const getRelatedTools = (): Tool[] => {
    // 1. 首先从同分类中筛选，排除当前工具
    let candidates = typedTools.filter(t => t.id !== tool.id);
    
    // 2. 计算每个工具与当前工具的匹配分数
    const scoredTools = candidates.map(t => {
      let score = 0;
      
      // 同分类 +3 分（最高优先级）
      if (t.category === tool.category) {
        score += 3;
      }
      
      // 相同定价模式 +2 分（第二优先级）
      if (t.pricing === tool.pricing) {
        score += 2;
      }
      
      // 定价模式相似（比如都是免费或都是付费）+1 分
      const isFree = (p: string) => ['Free', 'Freemium', 'Open Source'].includes(p);
      const isPaid = (p: string) => ['Paid', 'Free Trial'].includes(p);
      if ((isFree(t.pricing) && isFree(tool.pricing)) || (isPaid(t.pricing) && isPaid(tool.pricing))) {
        score += 1;
      }
      
      return { tool: t, score };
    });
    
    // 3. 按分数排序，分数相同则随机打乱
    scoredTools.sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      // 分数相同时随机排序，增加推荐多样性
      return Math.random() - 0.5;
    });
    
    // 4. 取前3个工具
    return scoredTools.slice(0, 3).map(st => st.tool);
  };
  
  const relatedTools = getRelatedTools().map(t => ({ ...t, affiliate_link: getAffiliateLink(t) }));

  return <ToolDetailClient tool={enrichedTool} relatedTools={relatedTools} />;
}
