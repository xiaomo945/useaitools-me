import type { Metadata } from "next";

export const SITE_NAME = "Use AI Tools";
export const SITE_URL = "https://useaitools.me";
export const DEFAULT_DESC = "精选 1300+ AI 工具，覆盖写作、图像、视频、音频、编程和生产力。按分类浏览，对比评测，发现最适合你的 AI 工具。";

const DEFAULT_KEYWORDS = [
  "AI tools",
  "AI directory",
  "AI writing tools",
  "AI image generators",
  "AI coding assistants",
  "AI video tools",
  "AI audio tools",
  "AI productivity tools",
  "best AI tools",
  "AI tools comparison",
  "free AI tools",
  "AI tools 2026",
];

export interface BuildMetadataOptions {
  title?: string;
  description?: string;
  canonicalPath?: string;
  image?: string;
}

export function buildMetadata(options: BuildMetadataOptions = {}): Metadata {
  const { title, description, canonicalPath, image } = options;

  const fullTitle = title ? `${title} – ${SITE_NAME}` : `Best AI Tools Directory 2026 – Discover & Compare 1300+ AI Tools`;
  const desc = description || DEFAULT_DESC;
  const canonical = canonicalPath
    ? `${SITE_URL}${canonicalPath.startsWith("/") ? canonicalPath : `/${canonicalPath}`}`
    : SITE_URL;
  const ogImage = image
    ? (image.startsWith("http") ? image : `${SITE_URL}${image.startsWith("/") ? image : `/${image}`}`)
    : `${SITE_URL}/logo.png`;

  return {
    title: fullTitle,
    description: desc,
    keywords: DEFAULT_KEYWORDS,
    robots: "index, follow",
    alternates: {
      canonical,
      languages: {
        'en': canonicalPath || '/',
        'zh': `${canonicalPath || '/'}?lang=zh`,
      },
    },
    openGraph: {
      title: fullTitle,
      description: desc,
      siteName: SITE_NAME,
      type: "website",
      url: canonical,
      locale: 'en_US',
      alternateLocale: 'zh_CN',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: desc,
      site: "@jiongxiaomo",
      creator: "@jiongxiaomo",
      images: [ogImage],
    },
  };
}

export function generateKeywords(category?: string, toolName?: string): string[] {
  const base = [...DEFAULT_KEYWORDS];

  if (category) {
    const lower = category.toLowerCase();
    base.push(`${lower} AI tools`, `${lower} tools`, `best AI tools for ${lower}`);
  }

  if (toolName) {
    const lowerName = toolName.toLowerCase();
    base.push(
      lowerName,
      `${lowerName} AI tool`,
      `${lowerName} review`,
      `${lowerName} alternative`,
      `is ${lowerName} good`,
      `${lowerName} vs`,
      `${lowerName} free trial`,
      `${lowerName} pricing`,
      `${lowerName} features`,
      `${lowerName} tutorial`,
      `best ${lowerName}`,
      `${lowerName} review 2026`,
    );
  }

  return base;
}
