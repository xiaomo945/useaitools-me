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

// 加载博客文章数据（从 data/blog-posts/ 目录扫描所有 JSON 文件）
function loadBlogPosts(): { slug: string; date: string }[] {
  const blogPostsDir = path.join(process.cwd(), 'data', 'blog-posts');
  if (!fs.existsSync(blogPostsDir)) return [];

  return fs.readdirSync(blogPostsDir)
    .filter((f: string) => f.endsWith('.json'))
    .map((f: string) => {
      const slug = f.replace('.json', '');
      try {
        const data = JSON.parse(fs.readFileSync(path.join(blogPostsDir, f), 'utf8'));
        return { slug: data.slug || slug, date: data.date || '2026-01-01' };
      } catch {
        return { slug, date: '2026-01-01' };
      }
    });
}

// 加载工作流数据
function loadWorkflows() {
  const workflowsPath = path.join(process.cwd(), 'data', 'workflows.json');
  if (fs.existsSync(workflowsPath)) {
    const data = fs.readFileSync(workflowsPath, 'utf8');
    return JSON.parse(data);
  }
  return [];
}

// 加载场景数据
function loadScenes(): string[] {
  const scenesPath = path.join(process.cwd(), 'data', 'scenes.ts');
  if (fs.existsSync(scenesPath)) {
    const content = fs.readFileSync(scenesPath, 'utf8');
    const slugRegex = /slug:\s*'([^']+)'/g;
    const slugs: string[] = [];
    let match;
    while ((match = slugRegex.exec(content)) !== null) {
      slugs.push(match[1]);
    }
    return slugs;
  }
  return [];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const tools = loadTools();
  const blogPosts = loadBlogPosts();
  const workflows = loadWorkflows();
  const sceneSlugs = loadScenes();
  const baseUrl = 'https://useaitools.me';
  
  const currentDate = new Date();
  
  const staticPages = [
    { url: baseUrl, lastModified: currentDate, changeFrequency: 'daily' as const, priority: 1 },
    { url: `${baseUrl}/about`, lastModified: currentDate, changeFrequency: 'monthly' as const, priority: 0.5 },
    { url: `${baseUrl}/blog`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/compare`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.7 },
    { url: `${baseUrl}/compare/video`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.6 },
    { url: `${baseUrl}/compare/writing`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.6 },
    { url: `${baseUrl}/compare/audio`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.6 },
    { url: `${baseUrl}/changelog`, lastModified: currentDate, changeFrequency: 'monthly' as const, priority: 0.4 },
    { url: `${baseUrl}/contact`, lastModified: currentDate, changeFrequency: 'monthly' as const, priority: 0.4 },
    { url: `${baseUrl}/deals`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.6 },
    { url: `${baseUrl}/history`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.5 },
    { url: `${baseUrl}/leaderboard`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.6 },
    { url: `${baseUrl}/help`, lastModified: currentDate, changeFrequency: 'monthly' as const, priority: 0.4 },
    { url: `${baseUrl}/dashboard`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.5 },
    { url: `${baseUrl}/privacy`, lastModified: currentDate, changeFrequency: 'monthly' as const, priority: 0.3 },
    { url: `${baseUrl}/saved`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.5 },
    { url: `${baseUrl}/scenes`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.7 },
    { url: `${baseUrl}/search`, lastModified: currentDate, changeFrequency: 'daily' as const, priority: 0.7 },
    { url: `${baseUrl}/submit`, lastModified: currentDate, changeFrequency: 'monthly' as const, priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: currentDate, changeFrequency: 'monthly' as const, priority: 0.3 },
    { url: `${baseUrl}/workflows`, lastModified: currentDate, changeFrequency: 'monthly' as const, priority: 0.4 },
  ];

  const categoryPages = categories.map((category) => ({
    url: `${baseUrl}/category/${categorySlugMap(category)}`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const scenePages = sceneSlugs.map((slug) => ({
    url: `${baseUrl}/scenes/${slug}`,
    lastModified: currentDate,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
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

  const workflowPages = workflows.map((wf: { slug: string }) => ({
    url: `${baseUrl}/workflows/${wf.slug}`,
    lastModified: currentDate,
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }));

  return [
    ...staticPages,
    ...categoryPages,
    ...scenePages,
    ...toolPages,
    ...blogPostPages,
    ...workflowPages,
  ];
}
