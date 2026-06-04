import { MetadataRoute } from 'next';
import fs from 'fs';
import path from 'path';

// 动态生成 sitemap，不使用静态缓存
export const dynamic = 'force-dynamic';

// 分类名称映射，需要与实际路由匹配
const categories = ['Image', 'Writing', 'Code', 'Video', 'Productivity', 'Audio'];
const categorySlugMap = (cat: string) => cat.toLowerCase();

// 直接加载工具数据
function loadTools() {
  const toolsPath = path.join(process.cwd(), 'data', 'tools.json');
  if (fs.existsSync(toolsPath)) {
    const data = fs.readFileSync(toolsPath, 'utf8');
    return JSON.parse(data);
  }
  return [];
}

// 直接加载博客文章数据
function loadBlogPosts() {
  const blogPostsDir = path.join(process.cwd(), 'data', 'blog-posts');
  
  if (!fs.existsSync(blogPostsDir)) {
    return [];
  }

  const files = fs.readdirSync(blogPostsDir)
    .filter(file => file.endsWith('.json') && !file.includes('-') && !file.includes('NaN'));

  const posts = [];
  
  for (const file of files) {
    try {
      const filePath = path.join(blogPostsDir, file);
      const content = fs.readFileSync(filePath, 'utf8');
      const post = JSON.parse(content);
      posts.push(post);
    } catch (error) {
      console.error(`⚠️ 无法加载博客文件: ${file}`, error);
    }
  }

  // 按日期降序排序
  posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  return posts;
}

const tools = loadTools();
const blogPosts = loadBlogPosts();

export default function sitemap(): MetadataRoute.Sitemap {
  const today = new Date();
  const dateStr = today.toISOString().split('T')[0];
  
  const sitemap: MetadataRoute.Sitemap = [];
  
  // 1. 首页 - 最高优先级
  sitemap.push({
    url: 'https://useaitools.me',
    lastModified: new Date(dateStr),
    changeFrequency: 'daily',
    priority: 1.0,
  });
  
  // 2. 博客列表页
  sitemap.push({
    url: 'https://useaitools.me/blog',
    lastModified: new Date(dateStr),
    changeFrequency: 'weekly',
    priority: 0.9,
  });
  
  // 3. 工具对比页
  sitemap.push({
    url: 'https://useaitools.me/compare',
    lastModified: new Date(dateStr),
    changeFrequency: 'weekly',
    priority: 0.8,
  });

  // 3.1 分类对比页
  sitemap.push({
    url: 'https://useaitools.me/compare/writing',
    lastModified: new Date(dateStr),
    changeFrequency: 'weekly',
    priority: 0.85,
  });
  sitemap.push({
    url: 'https://useaitools.me/compare/video',
    lastModified: new Date(dateStr),
    changeFrequency: 'weekly',
    priority: 0.85,
  });
  sitemap.push({
    url: 'https://useaitools.me/compare/audio',
    lastModified: new Date(dateStr),
    changeFrequency: 'weekly',
    priority: 0.85,
  });

  // 4. Affiliate Disclosure 页面
  sitemap.push({
    url: 'https://useaitools.me/affiliate-disclosure',
    lastModified: new Date(dateStr),
    changeFrequency: 'monthly',
    priority: 0.6,
  });

  // 5. 其他页面
  sitemap.push({
    url: 'https://useaitools.me/about',
    lastModified: new Date(dateStr),
    changeFrequency: 'monthly',
    priority: 0.6,
  });
  sitemap.push({
    url: 'https://useaitools.me/changelog',
    lastModified: new Date(dateStr),
    changeFrequency: 'weekly',
    priority: 0.7,
  });
  sitemap.push({
    url: 'https://useaitools.me/leaderboard',
    lastModified: new Date(dateStr),
    changeFrequency: 'weekly',
    priority: 0.7,
  });
  sitemap.push({
    url: 'https://useaitools.me/saved',
    lastModified: new Date(dateStr),
    changeFrequency: 'daily',
    priority: 0.5,
  });
  sitemap.push({
    url: 'https://useaitools.me/search',
    lastModified: new Date(dateStr),
    changeFrequency: 'daily',
    priority: 0.5,
  });
  sitemap.push({
    url: 'https://useaitools.me/submit',
    lastModified: new Date(dateStr),
    changeFrequency: 'monthly',
    priority: 0.5,
  });
  sitemap.push({
    url: 'https://useaitools.me/history',
    lastModified: new Date(dateStr),
    changeFrequency: 'weekly',
    priority: 0.5,
  });
  
  // 6. 分类页面 - 中等优先级
  categories.forEach((category) => {
    sitemap.push({
      url: `https://useaitools.me/category/${categorySlugMap(category)}`,
      lastModified: new Date(dateStr),
      changeFrequency: 'weekly',
      priority: 0.85,
    });
  });
  
  // 7. 工具详情页 - 使用工具自身的更新日期（如果有的话）
  tools.forEach((tool: any) => {
    sitemap.push({
      url: `https://useaitools.me/tools/${tool.id}`,
      lastModified: new Date(dateStr),
      changeFrequency: 'weekly',
      priority: 0.7,
    });
  });
  
  // 8. 博客文章页 - 使用文章发布日期
  blogPosts.forEach((post: any) => {
    sitemap.push({
      url: `https://useaitools.me/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: 'monthly',
      priority: 0.75,
    });
  });
  
  return sitemap;
}
