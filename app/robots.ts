import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',        // Block API routes
          '/admin/',      // Block admin pages
          '/private/',    // Block private pages
          '/checkout/',   // Block checkout pages
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/private/',
          '/checkout/',
        ],
        crawlDelay: 1,
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
        ],
        crawlDelay: 2,
      },
    ],
    sitemap: 'https://useaitools.me/sitemap.xml',
    host: 'https://useaitools.me',
  };
}
