import type { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';
import { blogPosts } from '@/data/blog-posts';
import toolsJson from '@/data/tools.json';

const baseUrl = 'https://useaitools.me';

const BLOG_CATEGORY_DESCRIPTIONS: Record<string, string> = {
  writing: 'AI writing tool reviews, copywriting AI comparisons, and content generation guides.',
  image: 'Hands-on reviews and comparisons of AI image generators and art tools.',
  video: 'AI video generation, editing tools, and text-to-video platform comparisons.',
  audio: 'Reviews of AI audio tools, voice cloning, text-to-speech, and podcast platforms.',
  code: 'AI coding assistants, code generation tools, and developer AI workflows.',
  productivity: 'AI productivity tools, task automation, and workspace optimization guides.',
};

type ToolJsonItem = { id: number; name: string; category?: string };

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // === 1) Core static pages ===
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/blog`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/tools`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/compare`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/category/writing`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/category/image`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/category/productivity`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/category/code`, lastModified: now, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${baseUrl}/category/audio`, lastModified: now, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${baseUrl}/category/video`, lastModified: now, changeFrequency: 'weekly', priority: 0.6 },
  ];

  // === 2) Blog category pages (dynamic: based on categories found in posts) ===
  const categoriesSeen = new Set<string>();
  (blogPosts || []).forEach((post: any) => {
    const slug = (post.category || '').toLowerCase();
    if (slug) categoriesSeen.add(slug);
  });

  const blogCategoryPages: MetadataRoute.Sitemap = Array.from(categoriesSeen).map((slug) => ({
    url: `${baseUrl}/blog/category/${slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.6,
  }));

  // === 3) Blog posts (with recent priority boost) ===
  const sortedBlogPosts = (blogPosts || [])
    .slice()
    .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const blogPostPages: MetadataRoute.Sitemap = sortedBlogPosts.map((post: any, idx: number) => {
    const isRecent = idx < 20;
    return {
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.date) || now,
      changeFrequency: isRecent ? 'weekly' : 'monthly',
      priority: isRecent ? 0.8 : 0.6,
    };
  });

  // === 4) Tool pages ===
  let toolPages: MetadataRoute.Sitemap = [];
  try {
    const tools = (await prisma.tool.findMany({
      where: { isActive: true },
      select: { name: true, updatedAt: true, slug: true, createdAt: true },
      orderBy: [{ rating: 'desc' }, { reviewCount: 'desc' }],
    })) as any[];

    if (tools && tools.length > 0) {
      toolPages = tools.map((tool: any, idx: number) => {
        const toolSlug = tool.slug || slugify(tool.name);
        return {
          url: `${baseUrl}/tool/${toolSlug}`,
          lastModified: tool.updatedAt || tool.createdAt || now,
          changeFrequency: idx < 30 ? 'weekly' : 'monthly',
          priority: idx < 30 ? 0.75 : 0.5,
        };
      });
    }
  } catch (_) {
    // prisma unavailable, fallback below
  }

  // Fallback to tools.json
  if (toolPages.length === 0) {
    const toolsArr = (toolsJson as ToolJsonItem[]) || [];
    toolPages = toolsArr.map((t, idx) => ({
      url: `${baseUrl}/tool/${slugify(t.name)}`,
      lastModified: now,
      changeFrequency: idx < 30 ? 'weekly' : 'monthly',
      priority: idx < 30 ? 0.75 : 0.5,
    }));
  }

  return [...staticPages, ...blogCategoryPages, ...blogPostPages, ...toolPages];
}
