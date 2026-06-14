import type { BlogPost } from '@/types';
import fs from 'fs';
import path from 'path';

// FAQ schema 条目类型（SEO 用）
export interface FaqItem {
  '@type': 'Question';
  name: string;
  acceptedAnswer: {
    '@type': 'Answer';
    text: string;
  };
}

// 我们在 BlogPost 基础上暴露 faq_schema 字段
export interface BlogPostWithFaq extends BlogPost {
  faq_schema?: {
    '@context': string;
    '@type': string;
    mainEntity: FaqItem[];
  };
}

const CACHE_KEY = 'blog-posts-cache-v1';
const globalCache = globalThis as unknown as {
  [CACHE_KEY]?: { posts: BlogPostWithFaq[]; slugMap: Map<string, BlogPostWithFaq> };
};

function normalizeSlug(slug: string): string {
  return slug
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function loadAllPosts(): { posts: BlogPostWithFaq[]; slugMap: Map<string, BlogPostWithFaq> } {
  if (globalCache[CACHE_KEY]) return globalCache[CACHE_KEY]!;

  const dirPath = path.join(process.cwd(), 'data', 'blog-posts');
  let files: string[] = [];
  try {
    files = fs.readdirSync(dirPath).filter((f) => f.endsWith('.json'));
  } catch (_) {
    // 目录不可读时返回空
    globalCache[CACHE_KEY] = { posts: [], slugMap: new Map() };
    return globalCache[CACHE_KEY]!;
  }

  // 1) 读取所有文件
  const rawList: (BlogPostWithFaq & { _file: string; _id: number })[] = [];
  for (const file of files) {
    try {
      const raw = fs.readFileSync(path.join(dirPath, file), 'utf8');
      const json = JSON.parse(raw);
      if (!json.slug || !json.content || json.content.length < 100) continue;
      const idNum = parseInt(file.replace('.json', ''), 10);
      rawList.push({
        _file: file,
        _id: Number.isFinite(idNum) ? idNum : rawList.length + 1,
        id: Number.isFinite(idNum) ? idNum : rawList.length + 1,
        title: String(json.title || 'Untitled Post'),
        slug: normalizeSlug(String(json.slug)),
        date: String(json.date || '2026-01-01'),
        description: String(json.description || json.title || ''),
        category: String(json.category || 'General'),
        author: json.author ? String(json.author) : 'Use AI Tools',
        reading_time: json.reading_time
          ? String(json.reading_time)
          : Math.max(3, Math.round((json.content || '').length / 1500)) + ' min read',
        featured: Boolean(json.featured),
        style: json.style ? String(json.style) : undefined,
        images: Array.isArray(json.images) ? json.images : [],
        content: String(json.content),
        faq_schema: json.faq_schema,
      });
    } catch (_) {
      // 单个文件解析失败，跳过
    }
  }

  // 2) slug 去重（保留内容较长的那篇）
  const slugMap = new Map<string, BlogPostWithFaq>();
  for (const item of rawList) {
    const existing = slugMap.get(item.slug);
    if (!existing) {
      slugMap.set(item.slug, item);
    } else {
      const existingLen = (existing as BlogPostWithFaq & { content: string }).content.length;
      if (item.content.length > existingLen) slugMap.set(item.slug, item);
    }
  }

  // 3) 按日期降序
  const posts: BlogPostWithFaq[] = Array.from(slugMap.values()).sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  globalCache[CACHE_KEY] = { posts, slugMap };
  return globalCache[CACHE_KEY]!;
}

// 导出主要内容
export const blogPosts: BlogPostWithFaq[] = loadAllPosts().posts;
export const blogPostBySlug = (slug: string): BlogPostWithFaq | undefined =>
  loadAllPosts().slugMap.get(slug);

export function getBlogPostsWithFaq(): BlogPostWithFaq[] {
  return blogPosts;
}

export default blogPosts;
