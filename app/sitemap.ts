import { MetadataRoute } from 'next';
import toolsData from '@/data/tools.json';
import blogPostsData from '@/data/blog-posts.json';

// 确保在 Vercel 生产环境中实时生成，并设置缓存时间
export const dynamic = 'force-dynamic';
export const revalidate = 3600; // 每小时重新生成一次

// 分类名称映射，需要与实际路由匹配
const categories = ['Image', 'Writing', 'Code', 'Video', 'Productivity', 'Audio'];
const categorySlugMap = (cat: string) => cat.toLowerCase();

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
  toolsData.forEach((tool) => {
    sitemap.push({
      url: `https://useaitools.me/tools/${tool.id}`,
      lastModified: new Date(dateStr),
      changeFrequency: 'weekly',
      priority: 0.7,
    });
  });
  
  // 8. 博客文章页 - 使用文章发布日期
  blogPostsData.forEach((post) => {
    sitemap.push({
      url: `https://useaitools.me/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: 'monthly',
      priority: 0.75,
    });
  });
  
  return sitemap;
}
