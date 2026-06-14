'use client';

import { useState, useEffect } from 'react';
import type { Tool } from '@/types';

interface Review {
  id: string;
  toolId: number;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
  upvotes: number;
}

interface ToolReviewsProps {
  tool: Tool;
}

const REVIEWS_STORAGE_KEY = 'tool-reviews';

export default function ToolReviews({ tool }: ToolReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [userName, setUserName] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);

  // 加载评论数据
  useEffect(() => {
    const stored = localStorage.getItem(REVIEWS_STORAGE_KEY);
    if (stored) {
      try {
        const allReviews = JSON.parse(stored) as Record<number, Review[]>;
        setReviews(allReviews[tool.id] || []);
      } catch (e) {
        console.error('Failed to parse reviews:', e);
      }
    }
  }, [tool.id]);

  // 计算平均评分
  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  // 提交评论
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!userName.trim() || !comment.trim() || rating < 1) {
      alert('Please fill in all fields');
      return;
    }

    const newReview: Review = {
      id: `review-${Date.now()}`,
      toolId: tool.id,
      userName: userName.trim(),
      rating,
      comment: comment.trim(),
      createdAt: new Date().toISOString(),
      upvotes: 0,
    };

    const updatedReviews = [newReview, ...reviews];
    setReviews(updatedReviews);

    // 保存到 localStorage
    const stored = localStorage.getItem(REVIEWS_STORAGE_KEY);
    const allReviews = stored ? JSON.parse(stored) : {};
    allReviews[tool.id] = updatedReviews;
    localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(allReviews));

    // 重置表单
    setShowForm(false);
    setUserName('');
    setRating(5);
    setComment('');
  };

  // 点赞评论
  const handleUpvote = (reviewId: string) => {
    const updatedReviews = reviews.map(r =>
      r.id === reviewId ? { ...r, upvotes: r.upvotes + 1 } : r
    );
    setReviews(updatedReviews);

    const stored = localStorage.getItem(REVIEWS_STORAGE_KEY);
    const allReviews = stored ? JSON.parse(stored) : {};
    allReviews[tool.id] = updatedReviews;
    localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(allReviews));
  };

  return (
    <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-3xl p-8 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            User Reviews
          </h2>
          {reviews.length > 0 && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className={`w-5 h-5 ${star <= Math.round(averageRating) ? 'text-amber-400' : 'text-slate-300 dark:text-slate-600'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                {averageRating.toFixed(1)}
              </span>
              <span className="text-sm text-slate-500 dark:text-slate-400">
                ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
              </span>
            </div>
          )}
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
        >
          {showForm ? 'Cancel' : 'Write a Review'}
        </button>
      </div>

      {/* 评论表单 */}
      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 p-6 bg-slate-50 dark:bg-gray-800/50 rounded-2xl border border-slate-200 dark:border-gray-700">
          <div className="mb-4">
            <label htmlFor="userName" className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
              Your Name
            </label>
            <input
              type="text"
              id="userName"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Enter your name"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
              Rating
            </label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="focus:outline-none"
                >
                  <svg
                    className={`w-8 h-8 transition-colors ${
                      star <= (hoveredRating || rating) ? 'text-amber-400' : 'text-slate-300 dark:text-slate-600'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </button>
              ))}
              <span className="ml-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                {rating} / 5
              </span>
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="comment" className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
              Your Review
            </label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
              placeholder="Share your experience with this tool..."
              required
            />
          </div>

          <button
            type="submit"
            className="w-full px-5 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
          >
            Submit Review
          </button>
        </form>
      )}

      {/* 评论列表 */}
      {reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="p-5 bg-slate-50 dark:bg-gray-800/50 rounded-2xl border border-slate-200 dark:border-gray-700"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {review.userName}
                    </span>
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          className={`w-4 h-4 ${star <= review.rating ? 'text-amber-400' : 'text-slate-300 dark:text-slate-600'}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <time className="text-xs text-slate-500 dark:text-slate-400">
                    {new Date(review.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </time>
                </div>
                <button
                  onClick={() => handleUpvote(review.id)}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm font-semibold text-slate-600 dark:text-slate-400 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-700 rounded-lg hover:border-emerald-300 dark:hover:border-emerald-600 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                  {review.upvotes}
                </button>
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {review.comment}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 dark:bg-gray-800 flex items-center justify-center">
            <svg className="w-8 h-8 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <p className="text-slate-600 dark:text-slate-400 mb-2">
            No reviews yet
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-500">
            Be the first to share your experience!
          </p>
        </div>
      )}
    </div>
  );
}
