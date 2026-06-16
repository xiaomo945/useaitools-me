'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { ArrowLeft, Send, Trash2, Eye, MessageSquare, Pin, Lock } from 'lucide-react';
import Footer from '@/app/components/Footer';
import Breadcrumbs from '@/app/components/Breadcrumbs';

interface DiscussionDetail {
  id: string;
  title: string;
  content: string;
  category: string;
  viewCount: number;
  commentCount: number;
  likeCount: number;
  isPinned: boolean;
  isLocked: boolean;
  createdAt: string;
  user: {
    id: string;
    name: string;
    image: string;
  };
  tool?: {
    id: string;
    name: string;
    slug: string;
  } | null;
  comments: {
    id: string;
    content: string;
    createdAt: string;
    user: {
      id: string;
      name: string;
      image: string;
    };
  }[];
}

export default function CommunityDetailClient() {
  const params = useParams();
  const { data: session } = useSession();
  const [discussion, setDiscussion] = useState<DiscussionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadDiscussion = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/discussions/${params.id}`);
      if (res.ok) {
        const data = await res.json();
        setDiscussion(data);
      }
    } catch (error) {
      console.error('加载讨论失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDiscussion();
  }, [params.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !session) return;

    setSubmitting(true);
    try {
      const res = await fetch(`/api/discussions/${params.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newComment }),
      });

      if (res.ok) {
        setNewComment('');
        await loadDiscussion();
      } else {
        const data = await res.json();
        alert(data.error || '提交失败');
      }
    } catch (error) {
      console.error('提交评论失败:', error);
      alert('提交失败，请重试');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('确定要删除这条评论吗？')) return;

    try {
      const res = await fetch(`/api/discussions/${params.id}/comments/${commentId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        await loadDiscussion();
      } else {
        alert('删除失败');
      }
    } catch (error) {
      console.error('删除评论失败:', error);
      alert('删除失败，请重试');
    }
  };

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'general':
        return 'General';
      case 'tool-review':
        return 'Tool Review';
      case 'feature-request':
        return 'Feature Request';
      case 'help':
        return 'Help';
      default:
        return cat;
    }
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'general':
        return 'bg-slate-500/10 text-slate-600 dark:text-slate-400';
      case 'tool-review':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400';
      case 'feature-request':
        return 'bg-purple-500/10 text-purple-600 dark:text-purple-400';
      case 'help':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400';
      default:
        return 'bg-slate-500/10 text-slate-600 dark:text-slate-400';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-gray-950 py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-slate-200 dark:bg-gray-700 rounded w-3/4" />
            <div className="h-4 bg-slate-200 dark:bg-gray-700 rounded w-1/4" />
            <div className="h-32 bg-slate-200 dark:bg-gray-700 rounded" />
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-20 bg-slate-200 dark:bg-gray-700 rounded" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!discussion) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-gray-950 py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center py-20">
          <p className="text-slate-500 dark:text-slate-500 text-lg">
            Discussion not found.
          </p>
          <Link
            href="/community"
            className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-emerald-500 text-white font-semibold rounded-xl hover:bg-emerald-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Community
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Community', href: '/community' },
            { label: discussion.title, href: `/community/${discussion.id}`, current: true },
          ]}
        />

        {/* Discussion Header */}
        <div className="mb-8">
          <Link
            href="/community"
            className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Community
          </Link>

          <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-2xl p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-4">
              {discussion.isPinned && (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  <Pin className="w-3 h-3" />
                  Pinned
                </span>
              )}
              {discussion.isLocked && (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-500/10 text-slate-600 dark:text-slate-400">
                  <Lock className="w-3 h-3" />
                  Locked
                </span>
              )}
              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getCategoryColor(discussion.category)}`}>
                {getCategoryLabel(discussion.category)}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
              {discussion.title}
            </h1>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-3">
                {discussion.user.image ? (
                  <img
                    src={discussion.user.image}
                    alt={discussion.user.name}
                    className="w-10 h-10 rounded-full"
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                    {discussion.user.name?.charAt(0) || 'U'}
                  </div>
                )}
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">
                    {discussion.user.name}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {formatDate(discussion.createdAt)}
                  </p>
                </div>
              </div>

              {discussion.tool && (
                <Link
                  href={`/tools/${discussion.tool.slug}`}
                  className="ml-auto px-3 py-1 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg text-sm font-semibold hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors"
                >
                  {discussion.tool.name}
                </Link>
              )}
            </div>

            <div className="prose dark:prose-invert max-w-none">
              <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                {discussion.content}
              </p>
            </div>

            <div className="flex items-center gap-6 mt-6 pt-6 border-t border-slate-200 dark:border-gray-800 text-sm text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {discussion.viewCount} views
              </span>
              <span className="flex items-center gap-1">
                <MessageSquare className="w-4 h-4" />
                {discussion.commentCount} comments
              </span>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Comments ({discussion.commentCount})
          </h2>

          {discussion.comments.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-2xl">
              <MessageSquare className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
              <p className="text-slate-500 dark:text-slate-500">
                No comments yet. Be the first to comment!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {discussion.comments.map((comment) => (
                <div
                  key={comment.id}
                  className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-xl p-6"
                >
                  <div className="flex items-start gap-4">
                    {comment.user.image ? (
                      <img
                        src={comment.user.image}
                        alt={comment.user.name}
                        className="w-10 h-10 rounded-full flex-shrink-0"
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                        {comment.user.name?.charAt(0) || 'U'}
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {comment.user.name}
                        </span>
                        <span className="text-sm text-slate-500 dark:text-slate-400">
                          {formatDate(comment.createdAt)}
                        </span>
                        {(session?.user as any)?.id === comment.user.id && (
                          <button
                            onClick={() => handleDeleteComment(comment.id)}
                            className="ml-auto p-1 text-slate-400 hover:text-rose-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Comment Form */}
          {session ? (
            discussion.isLocked ? (
              <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl p-6 text-center">
                <Lock className="w-8 h-8 text-amber-600 dark:text-amber-400 mx-auto mb-2" />
                <p className="text-amber-700 dark:text-amber-300 font-semibold">
                  This discussion is locked. No new comments can be added.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitComment} className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  {session.user?.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name || 'User'}
                      className="w-10 h-10 rounded-full flex-shrink-0"
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                      {session.user?.name?.charAt(0) || 'U'}
                    </div>
                  )}

                  <div className="flex-1">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Write a comment..."
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white resize-none"
                      rows={4}
                      required
                    />
                    <div className="flex items-center justify-between mt-3">
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Commenting as {session.user?.name}
                      </p>
                      <button
                        type="submit"
                        disabled={submitting || !newComment.trim()}
                        className="inline-flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-lg shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {submitting ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Send className="w-4 h-4" />
                        )}
                        {submitting ? 'Posting...' : 'Post Comment'}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            )
          ) : (
            <div className="bg-slate-50 dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-xl p-6 text-center">
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                Please log in to join the discussion.
              </p>
              <Link
                href="/api/auth/signin"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 hover:-translate-y-0.5 transition-all duration-300"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
