import blogIndexData from '@/data/blog-index.json';
import toolsData from '@/data/tools.json';
import fs from 'fs';
import path from 'path';

export interface BlogImage {
  url: string;
  alt: string;
  caption: string;
  position?: string;
  prompt?: string;
  image_url?: string;
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  date: string;
  description: string;
  style?: string;
  category: string;
  author?: string;
  reading_time?: string;
  featured?: boolean;
  images: BlogImage[];
  content: string;
}

export interface BlogPostMeta {
  id: number;
  title: string;
  slug: string;
  date: string;
  category: string;
  description: string;
  featured: boolean;
  thumbnail?: BlogImage;
}

export const blogIndex: BlogPostMeta[] = blogIndexData as BlogPostMeta[];

// 辅助函数：通过ID获取完整博客文章
export function getBlogPostById(id: number): BlogPost | null {
  try {
    const postPath = path.join(process.cwd(), 'data', 'blog-posts', `${id}.json`);
    const postContent = fs.readFileSync(postPath, 'utf8');
    return JSON.parse(postContent) as BlogPost;
  } catch {
    return null;
  }
}

// 辅助函数：通过slug获取完整博客文章
export function getBlogPostBySlug(slug: string): BlogPost | null {
  const meta = blogIndex.find(m => m.slug === slug);
  if (meta) {
    return getBlogPostById(meta.id);
  }
  return null;
}

// 获取所有完整博客文章
export function getAllBlogPosts(): BlogPost[] {
  return blogIndex.map(meta => getBlogPostById(meta.id)).filter(Boolean) as BlogPost[];
}

export interface ToolExample {
  prompt: string;
  image_url: string;
}

export interface RatingBreakdown {
  ease_of_use: {
    score: number;
    note: string;
  };
  output_quality: {
    score: number;
    note: string;
  };
  features: {
    score: number;
    note: string;
  };
  value_for_money: {
    score: number;
    note: string;
  };
  stability: {
    score: number;
    note: string;
  };
  support: {
    score: number;
    note: string;
  };
}

export interface UseCase {
  title: string;
  detail: string;
}

export interface ProsCons {
  pros: string[];
  cons: string[];
}

export interface Tool {
  id: number;
  name: string;
  description: string;
  category: string;
  pricing: string;
  url: string;
  affiliate_link: string;
  icon_url: string;
  examples: ToolExample[];
  needs_vpn: boolean;
  languages: string[];
  description_en?: string;
  rating?: number;
  rating_count?: number;
  rating_breakdown?: RatingBreakdown;
  use_cases?: UseCase[];
  pros_cons?: ProsCons;
  skill_level?: 'beginner' | 'intermediate' | 'advanced';
  best_for?: string[];
}

export const tools: Tool[] = toolsData as Tool[];
