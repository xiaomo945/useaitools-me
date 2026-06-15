export interface BlogImage {
  url: string;
  alt: string;
  caption: string;
  position?: string;
  prompt?: string;
  image_url?: string;
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  date: string;
  description: string;
  style?: string;
  category: string;
  author?: string;
  reading_time?: string;
  featured?: boolean;
  images: BlogImage[];
  content: string;
  canonical_slug?: string;
}

declare module '@/data/blog-posts.json' {
  const value: BlogPost[];
  export default value;
}
