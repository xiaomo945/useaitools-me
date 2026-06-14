import { SITE_NAME, SITE_URL } from "@/lib/seo";

export type PageType = "home" | "tool" | "blog" | "category";

export interface StructuredDataToolProps {
  name: string;
  description?: string;
  price?: string;
  priceCurrency?: string;
  ratingValue?: number;
  ratingCount?: number;
  url?: string;
  image?: string;
  category?: string;
  features?: string[];
}

export interface StructuredDataBlogProps {
  title: string;
  description?: string;
  datePublished?: string;
  dateModified?: string;
  authorName?: string;
  image?: string;
  canonicalPath?: string;
}

export interface StructuredDataCategoryProps {
  category: string;
  description?: string;
  canonicalPath?: string;
  image?: string;
}

export interface StructuredDataProps {
  pageType: PageType;
  tool?: StructuredDataToolProps;
  blog?: StructuredDataBlogProps;
  category?: StructuredDataCategoryProps;
}

function buildHomeSchema(): object {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        name: SITE_NAME,
        url: SITE_URL,
        description: "精选 1300+ AI 工具，覆盖写作、图像、视频、音频、编程和生产力。按分类浏览，对比评测，发现最适合你的 AI 工具。",
        inLanguage: "en",
        potentialAction: {
          "@type": "SearchAction",
          target: `${SITE_URL}/?search={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        name: SITE_NAME,
        url: SITE_URL,
        logo: {
          "@type": "ImageObject",
          url: `${SITE_URL}/logo.png`,
          width: 200,
          height: 200,
        },
        sameAs: [
          "https://x.com/jiongxiaomo",
          "https://github.com/xiaomo945",
        ],
      },
    ],
  };
}

function buildToolSchema(tool: StructuredDataToolProps): object {
  const name = tool.name.trim();
  const description = tool.description
    ? tool.description.trim()
    : `${name} 是一款 AI 工具，可在 Use AI Tools 目录中查看评测和对比。`;
  const url = tool.url || SITE_URL;
  const image = tool.image || `${SITE_URL}/logo.png`;
  const price = tool.price;
  const priceCurrency = tool.priceCurrency || "USD";
  const ratingValue = tool.ratingValue || 4.5;
  const ratingCount = tool.ratingCount || 120;

  const base: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name,
    description,
    url,
    image,
    applicationCategory: "AIApplication",
    operatingSystem: "Web",
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
  };

  if (tool.category) {
    base.applicationSubCategory = tool.category;
  }

  if (price) {
    base.offers = {
      "@type": "Offer",
      price: price === "Free" || price === "0" ? "0" : price,
      priceCurrency,
      availability: "https://schema.org/InStock",
      url,
    };
  }

  if (ratingValue && ratingCount) {
    base.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue,
      ratingCount,
      bestRating: 5,
      worstRating: 1,
    };
  }

  if (tool.features && tool.features.length > 0) {
    base.featureList = tool.features.join(", ");
  }

  return base;
}

function buildBlogSchema(blog: StructuredDataBlogProps): object {
  const title = blog.title.trim();
  const description = blog.description || title;
  const now = new Date().toISOString();
  const datePublished = blog.datePublished || now;
  const dateModified = blog.dateModified || now;
  const authorName = blog.authorName || SITE_NAME;
  const image = blog.image || `${SITE_URL}/logo.png`;
  const canonical = blog.canonicalPath
    ? `${SITE_URL}${blog.canonicalPath.startsWith("/") ? blog.canonicalPath : `/${blog.canonicalPath}`}`
    : SITE_URL;

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    image,
    datePublished,
    dateModified,
    author: {
      "@type": "Organization",
      name: authorName,
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonical,
    },
  };
}

function buildCategorySchema(category: StructuredDataCategoryProps): object {
  const name = `${category.category} AI Tools – ${SITE_NAME}`;
  const description =
    category.description ||
    `精选 ${category.category} 类 AI 工具，对比功能、价格和用户评价，找到最适合你的选择。`;
  const image = category.image || `${SITE_URL}/logo.png`;
  const canonical = category.canonicalPath
    ? `${SITE_URL}${category.canonicalPath.startsWith("/") ? category.canonicalPath : `/${category.canonicalPath}`}`
    : SITE_URL;

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description,
    url: canonical,
    image,
    inLanguage: "en",
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
}

export default function StructuredData(props: StructuredDataProps): React.ReactElement {
  const { pageType, tool, blog, category } = props;

  let schema: object;

  switch (pageType) {
    case "tool":
      schema = buildToolSchema(tool || { name: "AI Tool" });
      break;
    case "blog":
      schema = buildBlogSchema(blog || { title: "AI Tools Guide" });
      break;
    case "category":
      schema = buildCategorySchema(category || { category: "AI Tools" });
      break;
    case "home":
    default:
      schema = buildHomeSchema();
      break;
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
