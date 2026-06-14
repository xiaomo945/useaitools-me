import type { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = staticPaths.map((path: any) => ({
    url: `${baseUrl}${path === '/' ? '' : path}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 1.0,
  }));

  try {
    const [tools, blogPosts] = await Promise.all([
      prisma.tool.findMany({
      where: { isActive: true },
      select: { name: true, updatedAt: true, slug: true },
    }),
      prisma.blogPost.findMany({
      where: { isPublished: true },
      select: { slug: true, updatedAt: true },
    }),
    ]);

    const toolPages: MetadataRoute.Sitemap = tools.map((tool: any) => {
      const toolSlug = tool.slug || slugify(tool.name);
      return {
        url: `${baseUrl}/tool/${toolSlug}`,
        lastModified: tool.updatedAt || now,
        changeFrequency: 'monthly',
        priority: 0.8,
      };
    });

    const blogPostPages: MetadataRoute.Sitemap = blogPosts.map((post: any) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.updatedAt || now,
      changeFrequency: 'weekly',
      priority: 0.7,
    }));

    return [...staticPages, ...toolPages, ...blogPostPages];
  } catch {
    return staticPages;
  }
}
