import type { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';
import { blogPosts } from '@/data/blog-posts';
import toolsJson from '@/data/tools.json';

const baseUrl = 'https://useaitools.me';

const staticPaths = [
  '/',
  '/blog',
  '/tools',
  '/compare',
  '/category/writing',
  '/category/image',
  '/category/productivity',
  '/category/code',
  '/category/audio',
  '/category/video',
];

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

type ToolJsonItem = { id: number; name: string; category?: string };

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = staticPaths.map((path) => ({
    url: `${baseUrl}${path === '/' ? '' : path}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 1.0,
  }));

  // 1) 博客文章：直接用 data/blog-posts.ts 的数据（主数据源）
  const blogPostPages: MetadataRoute.Sitemap = (blogPosts || []).map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date) || now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  // 2) 工具详情页：优先读 prisma.tool，失败时回退到 tools.json
  let toolPages: MetadataRoute.Sitemap = [];
  try {
    const tools = (await prisma.tool.findMany({
      where: { isActive: true },
      select: { name: true, updatedAt: true, slug: true },
    })) as any[];

    if (tools && tools.length > 0) {
      toolPages = tools.map((tool: any) => {
        const toolSlug = tool.slug || slugify(tool.name);
        return {
          url: `${baseUrl}/tool/${toolSlug}`,
          lastModified: tool.updatedAt || now,
          changeFrequency: 'monthly',
          priority: 0.8,
        };
      });
    }
  } catch (_) {
    // prisma 不可用
  }

  if (toolPages.length === 0) {
    // 回退到 tools.json
    const toolsArr = (toolsJson as ToolJsonItem[]) || [];
    toolPages = toolsArr.map((t) => ({
      url: `${baseUrl}/tool/${slugify(t.name)}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    }));
  }

  return [...staticPages, ...blogPostPages, ...toolPages];
}
