import fs from 'fs';
import path from 'path';

// ============ 类型定义 ============

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  date: string;
  category: string;
  description: string;
  style: string;
  author: string;
  reading_time: number;
  featured: boolean;
  content: string;
  images: any[];
}

export interface BlogPostIndex {
  id: number;
  title: string;
  slug: string;
  date: string;
  category: string;
  description: string;
  featured: boolean;
  thumbnail: any;
}

export interface Tool {
  id: number;
  name: string;
  description: string;
  description_en: string;
  category: string;
  pricing: string;
  url: string;
  affiliate_link: string;
  icon_url: string;
  examples: any[];
  needs_vpn: boolean;
  languages: string[];
  rating: number;
  rating_count: number;
  rating_breakdown: any;
  last_updated: string;
  skill_level: string;
  best_for: string[];
}

export interface BlogLink {
  from_id: number;
  to_id: string | number;
  type: string;
}

// ============ 数据缓存 ============

let blogIndexCache: BlogPostIndex[] | null = null;
let toolsCache: Tool[] | null = null;

function getBlogIndexPath(): string {
  return path.join(process.cwd(), 'data', 'blog-index.json');
}

function getBlogPostsDir(): string {
  return path.join(process.cwd(), 'data', 'blog-posts');
}

function getToolsPath(): string {
  return path.join(process.cwd(), 'data', 'tools.json');
}

function loadBlogIndex(): BlogPostIndex[] {
  if (blogIndexCache) return blogIndexCache;
  try {
    const data = JSON.parse(fs.readFileSync(getBlogIndexPath(), 'utf8'));
    blogIndexCache = data;
    return data;
  } catch {
    return [];
  }
}

function loadTools(): Tool[] {
  if (toolsCache) return toolsCache;
  try {
    const data = JSON.parse(fs.readFileSync(getToolsPath(), 'utf8'));
    toolsCache = data;
    return data;
  } catch {
    return [];
  }
}

// ============ 博客文章操作 ============

/**
 * 获取博客文章索引（不含完整内容）
 */
export function getBlogIndex(): BlogPostIndex[] {
  return loadBlogIndex();
}

/**
 * 按slug获取完整文章
 */
export function getBlogPostBySlug(slug: string): BlogPost | null {
  const index = loadBlogIndex();
  const meta = index.find(m => m.slug === slug);
  if (!meta) return null;
  return getBlogPostById(meta.id);
}

/**
 * 按id获取文章
 */
export function getBlogPostById(id: number): BlogPost | null {
  try {
    const postPath = path.join(getBlogPostsDir(), `${id}.json`);
    if (!fs.existsSync(postPath)) return null;
    const post = JSON.parse(fs.readFileSync(postPath, 'utf8'));
    return {
      ...post,
      featured: Boolean(post.featured),
      images: post.images || []
    };
  } catch {
    return null;
  }
}

/**
 * 按分类获取文章
 */
export function getBlogPostsByCategory(category: string): BlogPostIndex[] {
  const index = loadBlogIndex();
  return index.filter(post => post.category === category);
}

/**
 * 获取置顶文章
 */
export function getFeaturedBlogPosts(): BlogPostIndex[] {
  const index = loadBlogIndex();
  return index.filter(post => post.featured).slice(0, 20);
}

/**
 * 搜索文章
 */
export function searchBlogPosts(query: string): BlogPostIndex[] {
  const index = loadBlogIndex();
  const searchQuery = query.toLowerCase();
  return index.filter(post => 
    post.title.toLowerCase().includes(searchQuery) ||
    post.description.toLowerCase().includes(searchQuery)
  );
}

/**
 * 获取文章的内链
 */
export function getBlogPostLinks(fromId: number): BlogLink[] {
  const post = getBlogPostById(fromId);
  if (!post) return [];
  
  const links: BlogLink[] = [];
  const content = post.content;
  
  // 提取工具链接
  const toolLinkRegex = /\[\[link:\/tools\/(\d+)\|([^\]]+)\]\]/g;
  let match;
  while ((match = toolLinkRegex.exec(content)) !== null) {
    links.push({ from_id: fromId, to_id: parseInt(match[1]), type: 'tool' });
  }
  
  // 提取博客链接
  const blogLinkRegex = /\[\[link:\/blog\/([^|]+)\|([^\]]+)\]\]/g;
  while ((match = blogLinkRegex.exec(content)) !== null) {
    links.push({ from_id: fromId, to_id: match[1], type: 'blog' });
  }
  
  // 提取分类链接
  const categoryLinkRegex = /\[\[link:\/category\/([^|]+)\|([^\]]+)\]\]/g;
  while ((match = categoryLinkRegex.exec(content)) !== null) {
    links.push({ from_id: fromId, to_id: 0, type: `category:${match[1]}` });
  }
  
  return links;
}

/**
 * 获取文章总数
 */
export function getBlogPostCount(): number {
  return loadBlogIndex().length;
}

// ============ 工具操作 ============

/**
 * 获取所有工具
 */
export function getAllTools(): Tool[] {
  return loadTools();
}

/**
 * 按id获取工具
 */
export function getToolById(id: number): Tool | null {
  const tools = loadTools();
  return tools.find(t => t.id === id) || null;
}

/**
 * 按分类获取工具
 */
export function getToolsByCategory(category: string): Tool[] {
  const tools = loadTools();
  return tools.filter(t => t.category === category);
}

/**
 * 获取工具总数
 */
export function getToolCount(): number {
  return loadTools().length;
}

/**
 * 获取所有分类
 */
export function getAllCategories(): string[] {
  const index = loadBlogIndex();
  const categories = new Set(index.map(p => p.category));
  return Array.from(categories).sort();
}

// ============ 关闭数据库 ============

export function closeDb(): void {
  blogIndexCache = null;
  toolsCache = null;
}
