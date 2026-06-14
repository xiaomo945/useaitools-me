'use client';

import { useState, useEffect } from 'react';
import { Bell, Check, Trash2, Filter, ExternalLink } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Notification {
  id: string;
  type: 'tool_update' | 'discussion_reply' | 'system';
  title: string;
  content: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

export default function NotificationsClient() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  useEffect(() => {
    fetchNotifications();
  }, [filter]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filter === 'unread') {
        params.set('unreadOnly', 'true');
      }
      
      const res = await fetch(`/api/notifications?${params}`);
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
      }
    } catch (error) {
      console.error('获取通知失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationIds: string[]) => {
    try {
      const res = await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationIds }),
      });

      if (res.ok) {
        fetchNotifications();
      }
    } catch (error) {
      console.error('标记通知失败:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const res = await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markAllRead: true }),
      });

      if (res.ok) {
        fetchNotifications();
      }
    } catch (error) {
      console.error('标记所有通知失败:', error);
    }
  };

  const deleteNotification = async (notificationIds: string[]) => {
    try {
      const res = await fetch('/api/notifications', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationIds }),
      });

      if (res.ok) {
        fetchNotifications();
      }
    } catch (error) {
      console.error('删除通知失败:', error);
    }
  };

  const deleteAllRead = async () => {
    if (!confirm('确定要删除所有已读通知吗？')) return;
    
    try {
      const res = await fetch('/api/notifications', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deleteAllRead: true }),
      });

      if (res.ok) {
        fetchNotifications();
      }
    } catch (error) {
      console.error('删除已读通知失败:', error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'tool_update':
        return '🔧';
      case 'discussion_reply':
        return '💬';
      case 'system':
        return '📢';
      default:
        return '🔔';
    }
  };

  const getNotificationColor = (type: string, isRead: boolean) => {
    if (isRead) return 'bg-white dark:bg-gray-900';
    
    switch (type) {
      case 'tool_update':
        return 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800';
      case 'discussion_reply':
        return 'bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-800';
      case 'system':
        return 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800';
      default:
        return 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                <Bell className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                  通知中心
                </h1>
                <p className="text-slate-600 dark:text-slate-400 mt-1">
                  {unreadCount > 0 
                    ? `你有 ${unreadCount} 条未读通知`
                    : '暂无未读通知'}
                </p>
              </div>
            </div>
            
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl transition-colors"
              >
                <Check className="w-4 h-4" />
                全部已读
              </button>
            )}
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 mb-6">
            <Filter className="w-5 h-5 text-slate-500" />
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-emerald-500 text-white'
                  : 'bg-white dark:bg-gray-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-gray-800'
              }`}
            >
              全部
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'unread'
                  ? 'bg-emerald-500 text-white'
                  : 'bg-white dark:bg-gray-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-gray-800'
              }`}
            >
              未读
            </button>
            
            <div className="flex-1" />
            
            <button
              onClick={deleteAllRead}
              className="flex items-center gap-2 px-4 py-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              清除已读
            </button>
          </div>
        </div>

        {/* Notifications List */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-slate-200 dark:bg-gray-700 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <div className="h-5 bg-slate-200 dark:bg-gray-700 rounded w-3/4" />
                    <div className="h-4 bg-slate-200 dark:bg-gray-700 rounded w-full" />
                    <div className="h-3 bg-slate-200 dark:bg-gray-700 rounded w-1/4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-slate-100 dark:bg-gray-800 flex items-center justify-center">
              <Bell className="w-10 h-10 text-slate-400 dark:text-slate-600" />
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-lg mb-2">
              {filter === 'unread' ? '没有未读通知' : '暂无通知'}
            </p>
            <p className="text-slate-400 dark:text-slate-500 text-sm">
              {filter === 'unread' ? '所有通知都已阅读' : '当你收藏工具或参与讨论时，会收到相关通知'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`border rounded-xl p-6 transition-all ${getNotificationColor(
                  notification.type,
                  notification.isRead
                )}`}
              >
                <div className="flex items-start gap-4">
                  <div className="text-3xl">
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h3 className={`font-semibold ${
                        notification.isRead
                          ? 'text-slate-700 dark:text-slate-300'
                          : 'text-slate-900 dark:text-white'
                      }`}>
                        {notification.title}
                        {!notification.isRead && (
                          <span className="ml-2 inline-block w-2 h-2 bg-emerald-500 rounded-full" />
                        )}
                      </h3>
                      <span className="text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap">
                        {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                    
                    <p className="text-slate-600 dark:text-slate-400 mb-3">
                      {notification.content}
                    </p>
                    
                    <div className="flex items-center gap-3">
                      {notification.link && (
                        <a
                          href={notification.link}
                          className="flex items-center gap-1 text-sm text-emerald-600 dark:text-emerald-400 hover:underline"
                        >
                          查看详情
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                      
                      <div className="flex-1" />
                      
                      {!notification.isRead && (
                        <button
                          onClick={() => markAsRead([notification.id])}
                          className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400"
                        >
                          <Check className="w-4 h-4" />
                          标记已读
                        </button>
                      )}
                      
                      <button
                        onClick={() => deleteNotification([notification.id])}
                        className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400"
                      >
                        <Trash2 className="w-4 h-4" />
                        删除
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
