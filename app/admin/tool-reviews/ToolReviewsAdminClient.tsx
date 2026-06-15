'use client';

import { useState, useEffect } from 'react';
import { Star, Plus, Edit, Trash2, Eye, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import Footer from '@/app/components/Footer';

interface ToolReview {
  id: string;
  overallRating: number | null;
  recommendation: string | null;
  blogPost: {
    id: string;
    title: string;
    slug: string;
    publishedAt: string;
  };
  tool: {
    id: string;
    name: string;
    slug: string;
    iconUrl: string | null;
    category: string;
  };
  template: {
    id: string;
    name: string;
  } | null;
}

interface Tool {
  id: string;
  name: string;
  slug: string;
  category: string;
}

interface BlogPost {
  id: string;
  title: string;
  slug: string;
}

interface ReviewTemplate {
  id: string;
  name: string;
  sections: any[];
  ratingDimensions: any[];
}

export default function ToolReviewsAdminClient() {
  const [reviews, setReviews] = useState<ToolReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState<ToolReview | null>(null);

  const fetchReviews = async () => {
    try {
      const res = await fetch('/api/tool-reviews');
      if (res.ok) {
        const data = await res.json();
        setReviews(data.reviews);
      }
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTools = async () => {
    try {
      const res = await fetch('/api/tools');
      if (res.ok) {
        const data = await res.json();
        // Tools data handling
      }
    } catch (error) {
      console.error('Failed to fetch tools:', error);
    }
  };

  const fetchBlogPosts = async () => {
    try {
      const res = await fetch('/api/blog');
      if (res.ok) {
        const data = await res.json();
        // Blog posts data handling
      }
    } catch (error) {
      console.error('Failed to fetch blog posts:', error);
    }
  };

  const fetchTemplates = async () => {
    try {
      const res = await fetch('/api/tool-review-templates');
      if (res.ok) {
        const data = await res.json();
        // Templates data handling
      }
    } catch (error) {
      console.error('Failed to fetch templates:', error);
    }
  };

  useEffect(() => {
    fetchReviews();
    fetchTools();
    fetchBlogPosts();
    fetchTemplates();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这个评测吗？')) return;

    try {
      const res = await fetch(`/api/tool-reviews/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setReviews(reviews.filter(r => r.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete review:', error);
    }
  };

  const getRecommendationBadge = (recommendation: string | null) => {
    const badges = {
      'highly-recommended': { text: '强烈推荐', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
      'recommended': { text: '推荐', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
      'neutral': { text: '中立', color: 'bg-slate-100 text-slate-700 dark:bg-gray-800 dark:text-slate-400' },
      'not-recommended': { text: '不推荐', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
    };

    if (!recommendation || !badges[recommendation as keyof typeof badges]) {
      return null;
    }

    const badge = badges[recommendation as keyof typeof badges];
    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${badge.color}`}>
        {badge.text}
      </span>
    );
  };

  const renderStars = (rating: number | null) => {
    if (!rating) return <span className="text-slate-400">未评分</span>;
    
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-slate-300 dark:text-gray-600'
            }`}
          />
        ))}
        <span className="ml-1 text-sm text-slate-600 dark:text-slate-400">
          {rating.toFixed(1)}
        </span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            工具评测管理
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            管理和创建工具的专业评测文章
          </p>
        </div>

        <div className="mb-6 flex justify-between items-center">
          <div className="text-sm text-slate-600 dark:text-slate-400">
            共 {reviews.length} 个评测
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            创建评测
          </button>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-900 rounded-xl p-6 animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-200 dark:bg-gray-700 rounded" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-200 dark:bg-gray-700 rounded w-1/3" />
                    <div className="h-3 bg-slate-200 dark:bg-gray-700 rounded w-1/4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-xl">
            <p className="text-slate-500 dark:text-slate-400 text-lg mb-4">
              暂无评测文章
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
            >
              <Plus className="w-4 h-4" />
              创建第一个评测
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="bg-white dark:bg-gray-900 rounded-xl p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start gap-4">
                  {review.tool.iconUrl ? (
                    <img
                      src={review.tool.iconUrl}
                      alt={review.tool.name}
                      className="w-12 h-12 rounded-lg"
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold">
                      {review.tool.name.charAt(0)}
                    </div>
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
                          {review.blogPost.title}
                        </h3>
                        <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                          <span>{review.tool.name}</span>
                          <span>•</span>
                          <span>{review.tool.category}</span>
                          {review.template && (
                            <>
                              <span>•</span>
                              <span>{review.template.name}</span>
                            </>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {getRecommendationBadge(review.recommendation)}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-4">
                        {renderStars(review.overallRating)}
                        <span className="text-sm text-slate-500 dark:text-slate-400">
                          {new Date(review.blogPost.publishedAt).toLocaleDateString('zh-CN')}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          href={`/blog/${review.blogPost.slug}`}
                          className="p-2 text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                          title="查看评测"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => setSelectedReview(review)}
                          className="p-2 text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                          title="编辑"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(review.id)}
                          className="p-2 text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                          title="删除"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
