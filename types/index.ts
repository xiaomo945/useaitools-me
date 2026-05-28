
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

// 从独立文件加载所有博客文章
function loadBlogPosts(): BlogPost[] {
  const blogPostsDir = path.join(process.cwd(), 'data', 'blog-posts');
  
  if (!fs.existsSync(blogPostsDir)) {
    return [];
  }

  const files = fs.readdirSync(blogPostsDir)
    .filter(file => file.endsWith('.json') && !file.includes('-')); // 只加载 {id}.json 文件

  const posts: BlogPost[] = [];
  
  for (const file of files) {
    try {
      const filePath = path.join(blogPostsDir, file);
      const content = fs.readFileSync(filePath, 'utf8');
      const post = JSON.parse(content) as BlogPost;
      posts.push(post);
    } catch (error) {
      console.error(`⚠️ 无法加载博客文件: ${file}`, error);
    }
  }

  // 按日期降序排序
  posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  return posts;
}

export const blogPosts: BlogPost[] = loadBlogPosts();

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

// 辅助函数：通过 slug 查找文章
export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find(post => post.slug === slug);
}

// 辅助函数：通过 id 查找文章
export function getBlogPostById(id: number): BlogPost | undefined {
  return blogPosts.find(post => post.id === id);
}
