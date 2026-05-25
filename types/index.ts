import blogPostsData from '@/data/blog-posts.json';
import toolsData from '@/data/tools.json';

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

export const blogPosts: BlogPost[] = blogPostsData as BlogPost[];

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
