import { MetadataRoute } from 'next';
import fs from 'fs';
import path from 'path';
import { generateSlugFromName } from '@/lib/slug';
import { toolsWorthIndexing } from '@/lib/toolQuality';
import { COMPARISON_SLUGS } from '@/lib/comparisons';

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

// 加载博客文章数据（分文件存储于 data/blog-posts/ 目录）
function loadBlogPosts(): { slug: string; date: string; category?: string }[] {
  const dir = path.join(process.cwd(), 'data', 'blog-posts');
  const posts: { slug: string; date: string; category?: string }[] = [];
  if (fs.existsSync(dir)) {
    const files = fs.readdirSync(dir).filter((f) => f.endsWith('.json'));
    for (const file of files) {
      try {
        const data = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'));
        if (data && data.slug) {
          posts.push({ slug: data.slug, date: data.date, category: data.category });
        }
      } catch {
        // 跳过损坏的 JSON 文件
      }
    }
  }
  return posts;
}

/**
 * Slugs that must stay out of the sitemap.
 *
 * `data/demoted-content.json` is written by the content audit: 56 articles that
 * are boilerplate shells (7/7 template headings, 60-83% boilerplate) and now
 * carry `noindex, follow`. Submitting a URL while telling Google not to index
 * it is contradictory and burns crawl budget, so they are filtered out here.
 */
function loadDemotedSlugs(): Set<string> {
  const demotedPath = path.join(process.cwd(), 'data', 'demoted-content.json');
  if (!fs.existsSync(demotedPath)) return new Set();
  try {
    const data = JSON.parse(fs.readFileSync(demotedPath, 'utf8'));
    return new Set<string>(Array.isArray(data?.demoted_slugs) ? data.demoted_slugs : []);
  } catch {
    // A corrupt audit file must not take the whole sitemap down with it.
    return new Set();
  }
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

function safeDate(value: string | undefined, fallback: Date): Date {
  if (!value) return fallback;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? fallback : d;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const tools = loadTools();
  const blogPosts = loadBlogPosts();
  const workflows = loadWorkflows();
  const sceneSlugs = loadScenes();
  const baseUrl = 'https://useaitools.me';

  const currentDate = new Date();

  // /history and /saved are deliberately absent: they are per-visitor pages
  // whose content is whatever the reader browsed or bookmarked, so there is no
  // stable page for a crawler. They carry `noindex` in their own layout.
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
    { url: `${baseUrl}/image`, lastModified: currentDate, changeFrequency: 'monthly' as const, priority: 0.6 },
    { url: `${baseUrl}/leaderboard`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.6 },
    { url: `${baseUrl}/help`, lastModified: currentDate, changeFrequency: 'monthly' as const, priority: 0.4 },
    { url: `${baseUrl}/press`, lastModified: currentDate, changeFrequency: 'monthly' as const, priority: 0.4 },
    { url: `${baseUrl}/privacy`, lastModified: currentDate, changeFrequency: 'monthly' as const, priority: 0.3 },
    { url: `${baseUrl}/scenes`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.7 },
    { url: `${baseUrl}/search`, lastModified: currentDate, changeFrequency: 'daily' as const, priority: 0.7 },
    { url: `${baseUrl}/submit`, lastModified: currentDate, changeFrequency: 'monthly' as const, priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: currentDate, changeFrequency: 'monthly' as const, priority: 0.3 },
    { url: `${baseUrl}/writer`, lastModified: currentDate, changeFrequency: 'monthly' as const, priority: 0.6 },
    { url: `${baseUrl}/workflows`, lastModified: currentDate, changeFrequency: 'monthly' as const, priority: 0.4 },
  ];

  const categoryPages = categories.map((category) => ({
    url: `${baseUrl}/category/${categorySlugMap(category)}`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Reuses the route's own pair list, so a comparison that 404s can never be
  // submitted (four of the eight previously listed URLs did exactly that).
  const comparisonPages = COMPARISON_SLUGS.map((slugs) => ({
    url: `${baseUrl}/compare/${slugs}`,
    lastModified: currentDate,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const scenePages = sceneSlugs.map((slug) => ({
    url: `${baseUrl}/scenes/${slug}`,
    lastModified: currentDate,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  // Canonical tool URLs: /tool/<slug>. The legacy /tools/<id> URLs 308-redirect
  // here, so they must not appear in the sitemap.
  // Only pages with something to say on their own, or backed by an article that
  // links to them. See lib/toolQuality.ts for the reasoning.
  const worthSubmitting = toolsWorthIndexing();
  const toolPages = (
    tools as unknown as {
      id: number;
      name: string;
      last_updated?: string;
      use_cases?: unknown[];
      pros_cons?: unknown;
      examples?: unknown[];
    }[]
  )
    .filter((tool) => worthSubmitting.has(tool.id))
    .map((tool) => {
      const slug = generateSlugFromName(tool.name);
      if (!slug) return null;
      return {
        url: `${baseUrl}/tool/${slug}`,
        lastModified: safeDate(tool.last_updated, currentDate),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);

  const demotedSlugs = loadDemotedSlugs();
  const liveBlogPosts = blogPosts.filter((post) => !demotedSlugs.has(post.slug));

  const blogPostPages = liveBlogPosts.map((post: { slug: string; date: string }) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: safeDate(post.date, currentDate),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  // Derived from the posts that survive the filter, so a category page is only
  // ever submitted when it still has published articles behind it.
  const blogCategoryPages = Array.from(
    new Set(
      liveBlogPosts.map((post) => (post.category || '').toLowerCase()).filter(Boolean),
    ),
  ).map((category) => ({
    url: `${baseUrl}/blog/category/${category}`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  // Workflow detail pages are routed by `id` (see app/workflows/[slug]/page.tsx,
  // generateStaticParams returns wf.id). Use the same key here so the sitemap
  // points at real, working URLs instead of /workflows/undefined.
  const workflowPages = workflows.map((wf: { id: string }) => ({
    url: `${baseUrl}/workflows/${wf.id}`,
    lastModified: currentDate,
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }));

  return [
    ...staticPages,
    ...categoryPages,
    ...comparisonPages,
    ...scenePages,
    ...toolPages,
    ...blogPostPages,
    ...blogCategoryPages,
    ...workflowPages,
  ];
}
