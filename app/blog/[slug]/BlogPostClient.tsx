'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Calendar, User, Eye, Tag, ExternalLink } from 'lucide-react';
import Footer from '@/app/components/Footer';
import Breadcrumbs from '@/app/components/Breadcrumbs';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string | null;
  coverImageAlt: string | null;
  publishedAt: string;
  viewCount: number;
  author: {
    name: string;
    image: string | null;
  };
  category: {
    name: string;
    slug: string;
  };
  tags: string[];
  relatedToolIds: string[];
}

interface Props {
  params: Promise<{ slug: string }>;
}

export default function BlogPostClient({ params }: Props) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { slug } = await params;
        const res = await fetch(`/api/blog/${slug}`);
        
        if (!res.ok) {
          throw new Error('Failed to fetch blog post');
        }
        
        const data = await res.json();
        setPost(data);
      } catch (err) {
        setError('Failed to load blog post');
        console.error('Error fetching blog post:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [params]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-gray-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-slate-200 dark:bg-gray-700 rounded w-3/4" />
            <div className="h-64 bg-slate-200 dark:bg-gray-700 rounded-xl" />
            <div className="space-y-3">
              <div className="h-4 bg-slate-200 dark:bg-gray-700 rounded" />
              <div className="h-4 bg-slate-200 dark:bg-gray-700 rounded" />
              <div className="h-4 bg-slate-200 dark:bg-gray-700 rounded w-5/6" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-gray-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-20">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              Post Not Found
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mb-8">
              {error || 'The blog post you are looking for does not exist.'}
            </p>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Breadcrumbs
          items={[
            { label: 'Blog', href: '/blog' },
            { label: post.title, href: `/blog/${post.slug}`, current: true },
          ]}
        />

        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </Link>

        <article className="bg-white dark:bg-gray-900 rounded-xl shadow-sm overflow-hidden">
          {post.coverImage && (
            <div className="aspect-video overflow-hidden relative">
              <Image
                src={post.coverImage}
                alt={post.coverImageAlt || post.title}
                fill
                className="object-cover"
                sizes="(max-width: 1200px) 100vw, 1200px"
                priority
              />
            </div>
          )}

          <div className="p-8 sm:p-12">
            <div className="mb-6">
              <Link
                href={`/blog?category=${post.category.slug}`}
                className="inline-block px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full text-sm font-medium hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors"
              >
                {post.category.name}
              </Link>
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 dark:text-slate-400 mb-8 pb-8 border-b border-slate-200 dark:border-gray-800">
              <div className="flex items-center gap-2">
                {post.author.image ? (
                  <div className="relative w-8 h-8 rounded-full overflow-hidden">
                    <Image
                      src={post.author.image}
                      alt={post.author.name}
                      fill
                      className="object-cover"
                      sizes="32px"
                    />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-gray-700 flex items-center justify-center">
                    <User className="w-4 h-4" />
                  </div>
                )}
                <span className="font-medium text-slate-900 dark:text-white">
                  {post.author.name}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(post.publishedAt)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>{post.viewCount} views</span>
              </div>
            </div>

            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p className="text-xl text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                {post.excerpt}
              </p>

              <div
                className="prose-headings:text-slate-900 dark:prose-headings:text-white prose-p:text-slate-700 dark:prose-p:text-slate-300 prose-strong:text-slate-900 dark:prose-strong:text-white prose-a:text-emerald-600 dark:prose-a:text-emerald-400 prose-code:text-emerald-600 dark:prose-code:text-emerald-400"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </div>

            {post.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t border-slate-200 dark:border-gray-800">
                <div className="flex flex-wrap items-center gap-2">
                  <Tag className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                  {post.tags.map((tag, index) => (
                    <Link
                      key={index}
                      href={`/blog?tag=${tag}`}
                      className="px-3 py-1 bg-slate-100 dark:bg-gray-800 text-slate-700 dark:text-slate-300 rounded-full text-sm hover:bg-slate-200 dark:hover:bg-gray-700 transition-colors"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {post.relatedToolIds && post.relatedToolIds.length > 0 && (
              <div className="mt-8 p-6 bg-slate-50 dark:bg-gray-800/50 rounded-xl">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                  Related Tools
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {post.relatedToolIds.map((toolId) => (
                    <Link
                      key={toolId}
                      href={`/tools/${toolId}`}
                      className="flex items-center gap-3 p-4 bg-white dark:bg-gray-900 rounded-lg hover:shadow-md transition-shadow"
                    >
                      <ExternalLink className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      <span className="text-slate-900 dark:text-white font-medium">
                        View Tool Details
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </article>

        <div className="mt-12 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to All Posts
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}
