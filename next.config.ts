import type { NextConfig } from "next";

const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
  {
    // Content Security Policy — XSS 防御核心
    // 允许 self、内联脚本/样式（Next.js 需要）、unsafe-eval（开发模式）、Google Fonts、分析服务
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://plausible.io https://www.clarity.ms",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' data: https://fonts.gstatic.com",
      "img-src 'self' data: blob: https: http:",
      "connect-src 'self' https://www.google-analytics.com https://www.googletagmanager.com https://plausible.io https://www.clarity.ms https://vitals.vercel-insights.com",
      "media-src 'self' https:",
      "frame-src 'self' https://www.youtube.com https://player.vimeo.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; '),
  },
];

/**
 * 联盟链接环境变量白名单
 *
 * 背景：AFFILIATE_* 变量默认只在服务端可见（Next.js 只把 NEXT_PUBLIC_* 内联进
 * 客户端 bundle）。但 HomeClient 等 'use client' 组件需要在浏览器端判断
 * 「这个工具有没有联盟链接」并渲染 CTA，否则 hasAffiliateLink() 恒为 false，
 * 按钮会退化成裸官网直链 —— 佣金归零。
 *
 * 这里显式内联到客户端。值本身只是带 affiliate id 的公开跳转链接
 * （本来就要出现在 <a href> 上），真正需要保密的是「不写进 git 仓库」，
 * 而这一点由 Vercel Environment Variables 保证，不受本配置影响。
 */
const AFFILIATE_ENV_KEYS = [
  'AFFILIATE_RYTR',
  'AFFILIATE_GRAMMARLY',
  'AFFILIATE_JASPER',
  'AFFILIATE_COPYAI',
  'AFFILIATE_QUILLBOT',
  'AFFILIATE_VEED',
  'AFFILIATE_PICTORY',
  'AFFILIATE_SYNTHESIA',
  'AFFILIATE_DESCRIPT',
  'AFFILIATE_MURF',
  'AFFILIATE_ELEVENLABS',
  'AFFILIATE_NOTION',
] as const;

const affiliateEnv = Object.fromEntries(
  AFFILIATE_ENV_KEYS.map((key) => [key, process.env[key] ?? '']),
) as Record<string, string>;

const nextConfig: NextConfig = {
  trailingSlash: false,
  skipTrailingSlashRedirect: true,

  // 让 AFFILIATE_* 在客户端组件里可读（见上方注释）
  env: affiliateEnv,

  // Security: 关闭 X-Powered-By 头，减少框架暴露
  poweredByHeader: false,

  // Quality: 开启 React 严格模式，及早发现潜在问题
  reactStrictMode: true,

  // Performance: Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year
    // Allow images from common sources
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'image.pollinations.ai',
      },
    ],
  },

  // Security & Performance: Headers
  async headers() {
    return [
      {
        // Apply security headers to all pages
        source: '/:path*',
        headers: securityHeaders,
      },
      {
        // Static assets - long-term cache
        source: '/:all*(svg|jpg|jpeg|png|gif|webp|avif|ico|woff|woff2|ttf|eot)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // API routes - short cache with revalidation
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=60, stale-while-revalidate=300',
          },
        ],
      },
      {
        // HTML pages - no cache, always revalidate
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
        ],
      },
    ];
  },

  // Performance: Optimize package imports
  experimental: {
    optimizePackageImports: ['lucide-react', '@heroicons/react'],
  },
};

export default nextConfig;
