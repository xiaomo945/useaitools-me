import fs from 'fs';
import path from 'path';
import type { BlogPost, BlogImage } from '@/types';

const postsDir = path.join(process.cwd(), 'data', 'blog-posts');

interface RawBlogImage {
  url: string;
  alt: string;
  caption?: string;
}

interface RawBlogPost {
  id: number;
  title: string;
  slug: string;
  date: string;
  description: string;
  style?: string;
  images?: RawBlogImage[];
  content: string;
  category: string;
  tldr?: string;
}

function parseReadingTime(content: string): string {
  const words = content.split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
}

function loadBlogPosts(): BlogPost[] {
  try {
    if (!fs.existsSync(postsDir)) {
      return [];
    }

    const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.json'));

    const posts = files.map(filename => {
      const filePath = path.join(postsDir, filename);
      const raw = JSON.parse(fs.readFileSync(filePath, 'utf-8')) as RawBlogPost;

      return {
        id: raw.id,
        title: raw.title,
        slug: raw.slug,
        date: raw.date,
        description: raw.description,
        style: raw.style,
        category: raw.category,
        author: 'xiaomo',
        reading_time: parseReadingTime(raw.content),
        featured: false,
        images: (raw.images || []).map((img) => ({
          url: img.url,
          alt: img.alt,
          caption: img.caption || '',
        })),
        content: raw.content,
        tldr: raw.tldr,
      };
    });

    return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.error('Failed to load blog posts:', error);
    return [];
  }
}

export const blogPosts: BlogPost[] = loadBlogPosts();
