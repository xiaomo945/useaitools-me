'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Check, Clock, ExternalLink, KeyRound } from 'lucide-react';

const TOKEN_STORAGE_KEY = 'uaic-sponsor-admin-token';

type AdminOrder = {
  id: string;
  title: string;
  description: string | null;
  targetUrl: string;
  status: string;
  amount: number;
  currency: string;
  startDate: string | null;
  endDate: string | null;
  clickCount: number;
  viewCount: number;
  buyerEmail: string | null;
  packageName: string | null;
  position: string | null;
  createdAt: string;
};

const STATUS_STYLE: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  paid: 'bg-blue-100 text-blue-800',
  active: 'bg-green-100 text-green-800',
  expired: 'bg-gray-100 text-gray-800',
  cancelled: 'bg-red-100 text-red-800',
};

export default function SponsoredOrdersAdminPage() {
  const [token, setToken] = useState('');
  const [tokenStored, setTokenStored] = useState(false);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState('');

  useEffect(() => {
    setTokenStored(Boolean(window.sessionStorage.getItem(TOKEN_STORAGE_KEY)));
  }, []);

  const loadOrders = useCallback(async (value: string) => {
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/sponsored-orders/admin', {
        headers: { 'x-sponsor-token': value },
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to load orders');
        setOrders([]);
        return;
      }
      setOrders(data.orders || []);
    } catch {
      setError('Network error while loading orders');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSaveToken = () => {
    if (!token.trim()) return;
    window.sessionStorage.setItem(TOKEN_STORAGE_KEY, token.trim());
    setTokenStored(true);
    loadOrders(token.trim());
  };

  const handleClearToken = () => {
    window.sessionStorage.removeItem(TOKEN_STORAGE_KEY);
    setTokenStored(false);
    setOrders([]);
  };

  const handleStatus = async (orderId: string, status: string) => {
    const value = window.sessionStorage.getItem(TOKEN_STORAGE_KEY)
    if (!value) return
    setBusy(orderId)
    setError('')
    try {
      const res = await fetch('/api/sponsored-orders/admin', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-sponsor-token': value,
        },
        body: JSON.stringify({ orderId, status }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Failed to update order')
        return
      }
      await loadOrders(value)
    } catch {
      setError('Network error while updating order')
    } finally {
      setBusy('')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Sponsored orders</h1>
            <p className="mt-1 text-sm text-gray-600">
              Confirm payment, then approve so the listing goes live.
            </p>
          </div>
          <Link
            href="/admin/sponsored"
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Ad slots admin
          </Link>
        </div>

        <div className="mb-8 rounded-lg border border-gray-200 bg-white p-4">
          <div className="flex items-center gap-2">
            <KeyRound className="h-4 w-4 text-gray-500" aria-hidden="true" />
            <label htmlFor="order-token" className="text-sm font-medium text-gray-700">
              Operator token
            </label>
          </div>
          <div className="mt-3 flex gap-2">
            <input
              id="order-token"
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="SPONSOR_ADMIN_TOKEN"
              className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={handleSaveToken}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Use
            </button>
            {tokenStored && (
              <button
                type="button"
                onClick={handleClearToken}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100"
              >
                Clear
              </button>
            )}
          </div>
          <p className="mt-2 text-xs text-gray-500">
            Stored in this browser session only. The same token unlocks the ad
            slot admin pages.
          </p>
        </div>

        {error && (
          <div role="alert" className="mb-6 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
            {error}
          </div>
        )}

        {loading && <p className="text-sm text-gray-500">Loading orders…</p>}

        {!loading && tokenStored && orders.length === 0 && (
          <p className="rounded-lg border border-gray-200 bg-white p-6 text-sm text-gray-500">
            No sponsored orders yet.
          </p>
        )}

        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="rounded-lg border border-gray-200 bg-white p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-base font-semibold text-gray-900">{order.title}</h2>
                  <p className="mt-0.5 text-sm text-gray-500">
                    {order.packageName}
                    {order.position ? ` · ${order.position}` : ''}
                    {' · '}
                    {order.currency === 'USD' ? '$' : ''}
                    {order.amount}
                    {order.currency !== 'USD' ? ` ${order.currency}` : ''}
                  </p>
                </div>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                    STATUS_STYLE[order.status] || 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {order.status}
                </span>
              </div>

              {order.description && <p className="mt-3 text-sm text-gray-700">{order.description}</p>}

              <div className="mt-3 space-y-1 text-sm text-gray-600">
                <p>
                  Destination:{' '}
                  <a
                    href={order.targetUrl}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="inline-flex items-center gap-1 text-blue-600 underline underline-offset-2 hover:text-blue-800"
                  >
                    {order.targetUrl}
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </p>
                <p>Buyer: {order.buyerEmail || 'unknown'}</p>
                <p>
                  Window:{' '}
                  {order.startDate
                    ? `${new Date(order.startDate).toLocaleDateString('en-US')} → ${
                        order.endDate ? new Date(order.endDate).toLocaleDateString('en-US') : '—'
                      }`
                    : 'not started'}
                </p>
                <p>
                  Performance: {order.viewCount} views · {order.clickCount} clicks
                </p>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {order.status !== 'active' && (
                  <button
                    type="button"
                    disabled={Boolean(busy)}
                    onClick={() => handleStatus(order.id, 'active')}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-green-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-60"
                  >
                    <Check className="h-4 w-4" />
                    {busy === order.id ? 'Working…' : 'Mark paid & go live'}
                  </button>
                )}
                {order.status !== 'cancelled' && order.status !== 'expired' && (
                  <button
                    type="button"
                    disabled={Boolean(busy)}
                    onClick={() => handleStatus(order.id, 'cancelled')}
                    className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-60"
                  >
                    Cancel
                  </button>
                )}
                {order.status === 'expired' && (
                  <span className="inline-flex items-center gap-1.5 text-sm text-gray-500">
                    <Clock className="h-4 w-4" /> Expired
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
