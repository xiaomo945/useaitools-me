import { MetadataRoute } from 'next';

/**
 * Single source of truth for /robots.txt.
 *
 * `public/robots.txt` used to exist alongside this route with `Allow: /` and no
 * disallows, so which one won depended on the Next.js version. It has been
 * deleted — this route is the only robots file now.
 *
 * /saved and /history are deliberately NOT disallowed: they are private,
 * per-visitor pages that carry `noindex` in their own metadata. Blocking them
 * here would stop crawlers from ever reading that `noindex`.
 */
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
