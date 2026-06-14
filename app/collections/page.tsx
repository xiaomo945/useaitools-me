'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { FolderPlus, Folder, Edit2, Trash2, Lock, Globe, LogIn, Plus, X } from 'lucide-react';
import Footer from '@/app/components/Footer';
import Breadcrumbs from '@/app/components/Breadcrumbs';

interface Collection {
  id: string;
  name: string;
  description: string | null;
  slug: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function CollectionsPage() {
  const { data: session, status } = useSession();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isPublic: false
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (status === 'authenticated') {
      loadCollections();
    } else if (status === 'unauthenticated') {
      setLoading(false);
    }
  }, [status]);

  const loadCollections = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/collections');
      if (res.ok) {
        const data = await res.json();
        setCollections(data.collections || []);
      }
    } catch (error) {
      console.error('加载收藏集合失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setSubmitting(true);
    try {
      const url = editingCollection 
        ? `/api/collections/${editingCollection.id}`
        : '/api/collections';
      
      const method = editingCollection ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        await loadCollections();
        setShowCreateModal(false);
        setEditingCollection(null);
        setFormData({ name: '', description: '', isPublic: false });
      } else {
        const data = await res.json();
        alert(data.error || '操作失败');
      }
    } catch (error) {
      console.error('提交失败:', error);
      alert('操作失败，请重试');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (collection: Collection) => {
    setEditingCollection(collection);
    setFormData({
      name: collection.name,
      description: collection.description || '',
      isPublic: collection.isPublic
    });
    setShowCreateModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这个收藏集合吗？')) return;

    try {
      const res = await fetch(`/api/collections/${id}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        await loadCollections();
      } else {
        alert('删除失败');
      }
    } catch (error) {
      console.error('删除失败:', error);
      alert('删除失败，请重试');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-gray-950 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <Breadcrumbs 
            items={[
              { label: 'Home', href: '/' },
              { label: 'Collections', href: '/collections', current: true }
            ]} 
          />

          <div className="text-center py-20">
            <div className="mx-auto w-20 h-20 mb-6 text-slate-300 dark:text-slate-600">
              <LogIn className="w-full h-full" />
            </div>
            <p className="text-slate-500 dark:text-slate-500 text-lg font-medium mb-4">
              Please log in to manage your collections.
            </p>
            <Link
              href="/api/auth/signin"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 hover:-translate-y-0.5 transition-all duration-300"
            >
              Sign In →
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <Breadcrumbs 
          items={[
            { label: 'Home', href: '/' },
            { label: 'Collections', href: '/collections', current: true }
          ]} 
        />

        {/* Page Header */}
        <div className="mb-10">
          <div className="bg-gradient-to-br from-indigo-50/80 via-white to-purple-50/80 dark:from-indigo-950/60 dark:via-gray-900 dark:to-purple-950/60 backdrop-blur-xl border border-white/60 dark:border-indigo-500/10 shadow-xl shadow-indigo-500/5 dark:shadow-2xl dark:shadow-indigo-500/5 rounded-3xl p-8 sm:p-12">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                  <Folder className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                    My Collections
                  </h1>
                  <p className="text-base sm:text-lg text-gray-500 dark:text-gray-400 mt-1">
                    Organize your favorite AI tools into custom collections
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setEditingCollection(null);
                  setFormData({ name: '', description: '', isPublic: false });
                  setShowCreateModal(true);
                }}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 hover:-translate-y-0.5 transition-all duration-300"
              >
                <Plus className="w-5 h-5" />
                New Collection
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-slate-200 dark:bg-gray-700 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <div className="h-5 bg-slate-200 dark:bg-gray-700 rounded w-3/4" />
                    <div className="h-3 bg-slate-200 dark:bg-gray-700 rounded w-1/2" />
                  </div>
                </div>
                <div className="h-4 bg-slate-200 dark:bg-gray-700 rounded w-full mb-2" />
                <div className="h-4 bg-slate-200 dark:bg-gray-700 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : collections.length === 0 ? (
          <div className="text-center py-20">
            <div className="mx-auto w-20 h-20 mb-6 text-slate-300 dark:text-slate-600">
              <FolderPlus className="w-full h-full" />
            </div>
            <p className="text-slate-500 dark:text-slate-500 text-lg font-medium mb-4">
              No collections yet. Create your first collection!
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 hover:-translate-y-0.5 transition-all duration-300"
            >
              <FolderPlus className="w-5 h-5" />
              Create Collection
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {collections.map((collection, index) => (
              <div
                key={collection.id}
                className="group bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-xl p-6 hover:border-indigo-300 dark:hover:border-indigo-700 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                    <Folder className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white truncate mb-1">
                      {collection.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      {collection.isPublic ? (
                        <span className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
                          <Globe className="w-3 h-3" />
                          Public
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                          <Lock className="w-3 h-3" />
                          Private
                        </span>
                      )}
                      <span className="text-xs text-slate-400 dark:text-slate-500">
                        {formatDate(collection.updatedAt)}
                      </span>
                    </div>
                  </div>
                </div>

                {collection.description && (
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
                    {collection.description}
                  </p>
                )}

                <div className="flex items-center gap-2 pt-4 border-t border-slate-100 dark:border-gray-800">
                  <Link
                    href={`/collections/${collection.slug}`}
                    className="flex-1 text-center px-4 py-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-colors text-sm"
                  >
                    View Tools
                  </Link>
                  <button
                    onClick={() => handleEdit(collection)}
                    className="p-2 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-lg transition-all"
                    title="Edit collection"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(collection.id)}
                    className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-all"
                    title="Delete collection"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowCreateModal(false)}>
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                {editingCollection ? 'Edit Collection' : 'New Collection'}
              </h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
                  placeholder="e.g., My Favorite Writing Tools"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white resize-none"
                  placeholder="Optional description..."
                  rows={3}
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isPublic"
                  checked={formData.isPublic}
                  onChange={e => setFormData({ ...formData, isPublic: e.target.checked })}
                  className="w-5 h-5 rounded border-slate-300 dark:border-gray-600 text-emerald-500 focus:ring-emerald-500"
                />
                <label htmlFor="isPublic" className="text-sm text-slate-700 dark:text-slate-300">
                  Make this collection public
                </label>
              </div>

              <div className="flex items-center gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-6 py-3 border border-slate-200 dark:border-gray-700 text-slate-700 dark:text-slate-300 font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !formData.name.trim()}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Saving...' : editingCollection ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
