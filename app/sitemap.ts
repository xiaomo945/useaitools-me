import { MetadataRoute } from 'next';
import fs from 'fs';
import path from 'path';

// 动态生成 sitemap
export const dynamic = 'force-dynamic';

// 分类名称映射
const categories = ['Image', 'Writing', 'Code', 'Video', 'Productivity', 'Audio'];
const categorySlugMap = (cat: string) => cat.toLowerCase();

// 加载工具数据
function loadTools() {
  const toolsPath = path.join(process.cwd(), 'data', 'tools.json');
  if (fs.existsSync(toolsPath)) {
    const data = fs.readFileSync(toolsPath, 'utf8');
    return JSON.parse(data);
  }
  return [];
}

// 加载博客文章数据
function loadBlogPosts() {
  const blogPostsPath = path.join(process.cwd(), 'data', 'blog-posts.json');
  if (fs.existsSync(blogPostsPath)) {
    const data = fs.readFileSync(blogPostsPath, 'utf8');
    return JSON.parse(data);
  }
  return [];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const tools = loadTools();
  const blogPosts = loadBlogPosts();
  const baseUrl = 'https://useaitools.me';
  
  const currentDate = new Date();
  
  const staticPages = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/compare`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/changelog`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.4,
    },
    {
      url: `${baseUrl}/deals`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/leaderboard`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/help`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.4,
    },
    {
      url: `${baseUrl}/dashboard`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/saved`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/submit`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/workflows`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.4,
    },
  ];

  const categoryPages = categories.map((category) => ({
    url: `${baseUrl}/category/${categorySlugMap(category)}`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const toolPages = tools.map((tool: { id: number }) => ({
    url: `${baseUrl}/tools/${tool.id}`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  const blogPostPages = blogPosts.map((post: { slug: string; date: string }) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [
    ...staticPages,
    ...categoryPages,
    ...toolPages,
    ...blogPostPages,
  ];
}
