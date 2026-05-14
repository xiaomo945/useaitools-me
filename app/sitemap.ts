import { MetadataRoute } from 'next';

// 确保在 Vercel 生产环境中实时生成，并设置缓存时间
export const dynamic = 'force-dynamic';
export const revalidate = 3600; // 每小时重新生成一次

export default function sitemap(): MetadataRoute.Sitemap {
  const today = new Date();
  const dateStr = today.toISOString().split('T')[0];
  
  return [
    {
      url: 'https://useaitools.me',
      lastModified: new Date(dateStr),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
  ];
}
