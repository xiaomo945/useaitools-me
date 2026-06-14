import { Metadata } from 'next';
import BlogPostClient from './BlogPostClient';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/blog/${slug}`, {
      cache: 'no-store',
    });
    
    if (!res.ok) {
      return {
        title: 'Blog Post Not Found',
        description: 'The blog post you are looking for does not exist.',
      };
    }
    
    const post = await res.json();
    
    return {
      title: post.metaTitle || `${post.title} | Use AI Tools`,
      description: post.metaDescription || post.excerpt,
      openGraph: {
        title: post.metaTitle || post.title,
        description: post.metaDescription || post.excerpt,
        images: post.coverImage ? [{ url: post.coverImage }] : [],
      },
    };
  } catch (error) {
    return {
      title: 'Blog Post | Use AI Tools',
      description: 'Read in-depth reviews and insights about AI tools.',
    };
  }
}

export default async function BlogPostPage({ params }: Props) {
  return <BlogPostClient params={params} />;
}
