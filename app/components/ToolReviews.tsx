'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import type { Tool } from '@/types';

interface Review {
  id: string;
  rating: number;
  title: string;
  content: string;
  pros: string[] | null;
  cons: string[] | null;
  isApproved: boolean;
  createdAt: string;
  user: {
    name: string | null;
    image: string | null;
  };
}

interface ToolReviewsProps {
  tool: Tool;
}

export default function ToolReviews({ tool }: ToolReviewsProps) {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [pros, setPros] = useState('');
  const [cons, setCons] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  // 获取评论
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`/api/tools/${tool.id}/reviews`);
        if (response.ok) {
          const data = await response.json();
          setReviews(data);
        }
      } catch (error) {
        console.error('Failed to fetch reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [tool.id]);

  // 计算平均评分
  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  // 提交评论
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session?.user) {
      alert('Please sign in to write a review');
      return;
    }

    if (!title.trim() || !content.trim() || rating < 1) {
      alert('Please fill in all required fields');
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(`/api/tools/${tool.id}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating,
          title: title.trim(),
          content: content.trim(),
          pros: pros.trim() ? pros.split('\n').filter(p => p.trim()) : null,
          cons: cons.trim() ? cons.split('\n').filter(c => c.trim()) : null,
        }),
      });

      if (response.ok) {
        const newReview = await response.json();
        setReviews([newReview, ...reviews]);
        setShowForm(false);
        setTitle('');
        setContent('');
        setPros('');
        setCons('');
        setRating(5);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to submit review');
      }
    } catch (error) {
      console.error('Failed to submit review:', error);
      alert('Failed to submit review');
    } finally {
      setSubmitting(false);
    }
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
        {session?.user ? (
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
          >
            {showForm ? 'Cancel' : 'Write a Review'}
          </button>
        ) : (
          <div className="text-sm text-slate-500 dark:text-slate-400">
            Please sign in to write a review
          </div>
        )}
      </div>

      {/* 评论表单 */}
      {showForm && session?.user && (
        <form onSubmit={handleSubmit} className="mb-8 p-6 bg-slate-50 dark:bg-gray-800/50 rounded-2xl border border-slate-200 dark:border-gray-700">
          <div className="mb-4">
            <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
              Rating <span className="text-red-500">*</span>
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
                  aria-label={`Rate ${star} stars`}
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
            <label htmlFor="reviewTitle" className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="reviewTitle"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Summarize your experience"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="reviewContent" className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
              Your Review <span className="text-red-500">*</span>
            </label>
            <textarea
              id="reviewContent"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
              placeholder="Share your experience with this tool..."
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="reviewPros" className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                Pros (one per line)
              </label>
              <textarea
                id="reviewPros"
                value={pros}
                onChange={(e) => setPros(e.target.value)}
                rows={3}
                className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                placeholder="Easy to use&#10;Great features"
              />
            </div>
            <div>
              <label htmlFor="reviewCons" className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                Cons (one per line)
              </label>
              <textarea
                id="reviewCons"
                value={cons}
                onChange={(e) => setCons(e.target.value)}
                rows={3}
                className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                placeholder="Expensive&#10;Limited free plan"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full px-5 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      )}

      {/* 评论列表 */}
      {loading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 mx-auto mb-3 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-600 dark:text-slate-400">Loading reviews...</p>
        </div>
      ) : reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="p-5 bg-slate-50 dark:bg-gray-800/50 rounded-2xl border border-slate-200 dark:border-gray-700"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  {review.user.image ? (
                    <img
                      src={review.user.image}
                      alt={review.user.name || 'User'}
                      className="w-10 h-10 rounded-full"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-semibold">
                      {(review.user.name || 'U').charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {review.user.name || 'Anonymous'}
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
                </div>
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                {review.title}
              </h3>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-3">
                {review.content}
              </p>
              {(review.pros?.length || review.cons?.length) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                  {review.pros && review.pros.length > 0 && (
                    <div className="p-3 bg-emerald-50 dark:bg-emerald-900/10 rounded-lg border border-emerald-100 dark:border-emerald-900/30">
                      <div className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 mb-1">Pros</div>
                      <ul className="space-y-1">
                        {review.pros.map((pro, i) => (
                          <li key={i} className="text-sm text-slate-700 dark:text-slate-300 flex items-start gap-1.5">
                            <span className="text-emerald-500 mt-0.5">+</span>
                            <span>{pro}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {review.cons && review.cons.length > 0 && (
                    <div className="p-3 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-100 dark:border-red-900/30">
                      <div className="text-xs font-semibold text-red-700 dark:text-red-400 mb-1">Cons</div>
                      <ul className="space-y-1">
                        {review.cons.map((con, i) => (
                          <li key={i} className="text-sm text-slate-700 dark:text-slate-300 flex items-start gap-1.5">
                            <span className="text-red-500 mt-0.5">-</span>
                            <span>{con}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
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
