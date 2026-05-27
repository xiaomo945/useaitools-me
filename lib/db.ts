import Database from 'better-sqlite3';
import path from 'path';

// 数据库连接（使用单例模式）
let db: Database.Database | null = null;

function getDb(): Database.Database {
  if (!db) {
    const dbPath = path.join(process.cwd(), 'data', 'useaitools.db');
    db = new Database(dbPath, { readonly: true });
    // WAL mode not compatible with readonly - skip it
    try { db.pragma('journal_mode = DELETE'); } catch {}
  }
  return db;
}

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
  to_id: number;
  type: string;
}

// ============ 博客文章操作 ============

/**
 * 获取博客文章索引（不含完整内容）
 */
export function getBlogIndex(): BlogPostIndex[] {
  const database = getDb();
  const posts = database.prepare(`
    SELECT id, title, slug, date, category, description, featured
    FROM blog_posts
    ORDER BY date DESC, id DESC
  `).all() as any[];

  return posts.map(post => ({
    ...post,
    featured: Boolean(post.featured),
    thumbnail: null
  }));
}

/**
 * 按slug获取完整文章
 */
export function getBlogPostBySlug(slug: string): BlogPost | null {
  const database = getDb();
  const post = database.prepare(`
    SELECT * FROM blog_posts WHERE slug = ?
  `).get(slug) as any;

  if (!post) return null;

  return {
    ...post,
    featured: Boolean(post.featured),
    images: JSON.parse(post.images || '[]')
  };
}

/**
 * 按id获取文章
 */
export function getBlogPostById(id: number): BlogPost | null {
  const database = getDb();
  const post = database.prepare(`
    SELECT * FROM blog_posts WHERE id = ?
  `).get(id) as any;

  if (!post) return null;

  return {
    ...post,
    featured: Boolean(post.featured),
    images: JSON.parse(post.images || '[]')
  };
}

/**
 * 按分类获取文章
 */
export function getBlogPostsByCategory(category: string): BlogPostIndex[] {
  const database = getDb();
  const posts = database.prepare(`
    SELECT id, title, slug, date, category, description, featured
    FROM blog_posts
    WHERE category = ?
    ORDER BY date DESC, id DESC
  `).all(category) as any[];

  return posts.map(post => ({
    ...post,
    featured: Boolean(post.featured),
    thumbnail: null
  }));
}

/**
 * 获取置顶文章
 */
export function getFeaturedBlogPosts(): BlogPostIndex[] {
  const database = getDb();
  const posts = database.prepare(`
    SELECT id, title, slug, date, category, description, featured
    FROM blog_posts
    WHERE featured = 1
    ORDER BY date DESC, id DESC
    LIMIT 20
  `).all() as any[];

  return posts.map(post => ({
    ...post,
    featured: true,
    thumbnail: null
  }));
}

/**
 * 搜索文章
 */
export function searchBlogPosts(query: string): BlogPostIndex[] {
  const database = getDb();
  const searchQuery = `%${query}%`;
  const posts = database.prepare(`
    SELECT id, title, slug, date, category, description, featured
    FROM blog_posts
    WHERE title LIKE ? OR description LIKE ? OR content LIKE ?
    ORDER BY date DESC, id DESC
  `).all(searchQuery, searchQuery, searchQuery) as any[];

  return posts.map(post => ({
    ...post,
    featured: Boolean(post.featured),
    thumbnail: null
  }));
}

/**
 * 获取文章的内链
 */
export function getBlogPostLinks(fromId: number): BlogLink[] {
  const database = getDb();
  return database.prepare(`
    SELECT from_id, to_id, type FROM blog_links WHERE from_id = ?
  `).all(fromId) as BlogLink[];
}

/**
 * 获取文章总数
 */
export function getBlogPostCount(): number {
  const database = getDb();
  const result = database.prepare(`
    SELECT COUNT(*) as count FROM blog_posts
  `).get() as any;
  return result.count;
}

// ============ 工具操作 ============

/**
 * 获取所有工具
 */
export function getAllTools(): Tool[] {
  const database = getDb();
  const tools = database.prepare(`
    SELECT * FROM tools ORDER BY id ASC
  `).all() as any[];

  return tools.map(tool => ({
    ...tool,
    needs_vpn: Boolean(tool.needs_vpn),
    examples: JSON.parse(tool.examples || '[]'),
    languages: JSON.parse(tool.languages || '["English"]'),
    rating_breakdown: JSON.parse(tool.rating_breakdown || '{}'),
    best_for: JSON.parse(tool.best_for || '[]')
  }));
}

/**
 * 按id获取工具
 */
export function getToolById(id: number): Tool | null {
  const database = getDb();
  const tool = database.prepare(`
    SELECT * FROM tools WHERE id = ?
  `).get(id) as any;

  if (!tool) return null;

  return {
    ...tool,
    needs_vpn: Boolean(tool.needs_vpn),
    examples: JSON.parse(tool.examples || '[]'),
    languages: JSON.parse(tool.languages || '["English"]'),
    rating_breakdown: JSON.parse(tool.rating_breakdown || '{}'),
    best_for: JSON.parse(tool.best_for || '[]')
  };
}

/**
 * 按分类获取工具
 */
export function getToolsByCategory(category: string): Tool[] {
  const database = getDb();
  const tools = database.prepare(`
    SELECT * FROM tools WHERE category = ? ORDER BY id ASC
  `).all(category) as any[];

  return tools.map(tool => ({
    ...tool,
    needs_vpn: Boolean(tool.needs_vpn),
    examples: JSON.parse(tool.examples || '[]'),
    languages: JSON.parse(tool.languages || '["English"]'),
    rating_breakdown: JSON.parse(tool.rating_breakdown || '{}'),
    best_for: JSON.parse(tool.best_for || '[]')
  }));
}

/**
 * 获取工具总数
 */
export function getToolCount(): number {
  const database = getDb();
  const result = database.prepare(`
    SELECT COUNT(*) as count FROM tools
  `).get() as any;
  return result.count;
}

/**
 * 获取所有分类
 */
export function getAllCategories(): string[] {
  const database = getDb();
  const categories = database.prepare(`
    SELECT DISTINCT category FROM blog_posts ORDER BY category
  `).all() as any[];
  return categories.map(c => c.category);
}

// ============ 关闭数据库 ============

export function closeDb(): void {
  if (db) {
    db.close();
    db = null;
  }
}
