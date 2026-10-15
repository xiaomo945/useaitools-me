import type { Metadata } from "next";

export const SITE_NAME = "Use AI Tools";
export const SITE_URL = "https://useaitools.me";
export const DEFAULT_DESC = "A handpicked directory of 500+ AI tools for writing, image, video, audio, code and productivity. Compare features, pricing and alternatives side by side.";

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
  noindex?: boolean;
}

export function buildMetadata(options: BuildMetadataOptions = {}): Metadata {
  const { title, description, canonicalPath, image, noindex } = options;

  const fullTitle = title ? `${title} – ${SITE_NAME}` : `Best AI Tools Directory 2026 – Discover & Compare 500+ AI Tools`;
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
    robots: noindex ? "noindex, follow" : "index, follow",
    // No `alternates.languages` (hreflang) here on purpose.
    //
    // These used to declare `zh` -> `<path>?lang=zh`, but the site has no
    // `[locale]` route segment and no i18n config in next.config.ts, so
    // `?lang=zh` served the same English HTML under a second URL. That is a
    // duplicate-content signal, not a translation signal.
    //
    // The plan is bilingual two-site / real locale routing. When that lands,
    // hreflang goes back here — with `x-default` plus one entry per real,
    // rendered locale URL (e.g. `/zh/...`), never a query parameter.
    alternates: {
      canonical,
    },
    openGraph: {
      title: fullTitle,
      description: desc,
      siteName: SITE_NAME,
      type: "website",
      url: canonical,
      locale: 'en_US',
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

// Object form of the same `noindex, follow` convention used by buildMetadata().
// `follow: true` matters on demoted pages: the URL stays indexable-adjacent so
// crawlers keep walking its outbound links into the rest of the site.
export function robotsDirective(noindex = false): Metadata["robots"] {
  return noindex ? { index: false, follow: true } : { index: true, follow: true };
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
