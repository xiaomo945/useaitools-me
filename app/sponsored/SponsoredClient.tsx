'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Check, Clock, AlertCircle } from 'lucide-react';

export interface SponsoredPackage {
  id: string;
  name: string;
  displayName: string;
  description: string | null;
  price: number;
  currency: string;
  duration: number;
  position: string;
  features: string[];
}

interface SponsoredOrder {
  id: string;
  title: string;
  status: string;
  startDate: string;
  endDate: string;
  amount: number;
  clickCount: number;
  viewCount: number;
  package: {
    name: string;
    position: string;
  };
}

type PayMethod = { label: string; url: string; kind: string };

type PaymentInstructions = {
  status: string;
  amount: number;
  currency: string;
  needsOperatorApproval: boolean;
  method: PayMethod;
  steps: string[];
};

const STATUS_LABELS: Record<string, { text: string; className: string }> = {
  active: { text: 'Live', className: 'bg-green-100 text-green-800' },
  paid: { text: 'Paid · awaiting setup', className: 'bg-blue-100 text-blue-800' },
  pending: { text: 'Pending payment', className: 'bg-yellow-100 text-yellow-800' },
  expired: { text: 'Expired', className: 'bg-gray-100 text-gray-800' },
  cancelled: { text: 'Cancelled', className: 'bg-red-100 text-red-800' },
};

/**
 * The only stateful part of the sales page: sign-in prompt, the buyer's own
 * orders, the request form and the post-submission payment receipt. Everything
 * that a crawler or a reader without JavaScript needs (headline, rate card,
 * package features) is rendered by the surrounding server component instead.
 */
export default function SponsoredClient({
  packages,
  seedLoaded,
}: {
  packages: SponsoredPackage[];
  seedLoaded: boolean;
}) {
  const { data: session } = useSession();
  const [orders, setOrders] = useState<SponsoredOrder[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<string>('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    targetUrl: '',
    imageUrl: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [receipt, setReceipt] = useState<{
    orderId: string;
    title: string;
    amount: number;
    currency: string;
    startDate: string;
    endDate: string;
    packageName: string;
    position: string;
    method: PayMethod;
    steps: string[];
  } | null>(null);

  useEffect(() => {
    if (!session) return;
    fetch('/api/sponsored-orders')
      .then((res) => (res.ok ? res.json() : { orders: [] }))
      .then((data) => setOrders(data.orders || []))
      .catch(() => setOrders([]));
  }, [session, receipt]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!session) {
      setFormError('Please sign in first so we can attach the order to your account.');
      return;
    }
    if (!selectedPackage) {
      setFormError('Please choose a package.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/sponsored-orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packageId: selectedPackage,
          title: formData.title,
          description: formData.description,
          targetUrl: formData.targetUrl,
          imageUrl: formData.imageUrl || null,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setReceipt({
          orderId: data.order.id,
          title: data.order.title,
          amount: data.order.amount,
          currency: data.payment?.currency || 'USD',
          startDate: data.order.startDate,
          endDate: data.order.endDate,
          packageName: data.order.package.name,
          position: data.order.package.position,
          method: data.payment?.method || { label: 'your operator', url: '', kind: 'link' },
          steps: data.payment?.steps || [],
        });
        setShowForm(false);
        setFormData({ title: '', description: '', targetUrl: '', imageUrl: '' });
        setSelectedPackage('');
      } else {
        setFormError(data.error || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Failed to submit:', error);
      setFormError('Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {!session && (
        <div className="max-w-3xl mx-auto mb-12 rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">
          Sign in to request a listing. If you do not have an account yet,{' '}
          <a href="/api/auth/signin" className="mx-1 font-medium underline underline-offset-2">
            create one
          </a>{' '}
          and come back — your order is tracked against your account.
        </div>
      )}

      {receipt && (
        <div className="mb-12 rounded-xl border border-amber-200 bg-amber-50 p-6">
          <div className="flex items-start gap-3">
            <Clock className="mt-0.5 h-6 w-6 shrink-0 text-amber-600" aria-hidden="true" />
            <div>
              <h2 className="text-lg font-semibold text-amber-900">
                Request received — payment needed to go live
              </h2>
              <p className="mt-1 text-sm text-amber-800">
                Your listing is queued as <strong>pending</strong>. It stays invisible to
                visitors until payment is verified. Order ID{' '}
                <code className="rounded bg-amber-100 px-1.5 py-0.5 font-mono text-xs">
                  {receipt.orderId}
                </code>
                .
              </p>
              <ol className="mt-4 space-y-2 text-sm text-amber-900">
                {receipt.steps.map((step, index) => (
                  <li key={index} className="flex gap-2">
                    <span className="font-medium">{index + 1}.</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>

              {receipt.method?.url && (
                <a
                  href={receipt.method.url}
                  {...(receipt.method.kind === 'link'
                    ? { target: '_blank', rel: 'noopener noreferrer nofollow' }
                    : {})}
                  className="mt-4 inline-block rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-amber-700"
                >
                  Go to payment page
                </a>
              )}

              <p className="mt-4 text-xs text-amber-700">
                Amount due: {receipt.currency === 'USD' ? '$' : ''}
                {receipt.amount}
                {receipt.currency !== 'USD' ? ` ${receipt.currency}` : ''}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setReceipt(null)}
            className="mt-4 text-sm font-medium text-amber-900 underline underline-offset-2"
          >
            Dismiss
          </button>
        </div>
      )}

      {session && orders.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your listings</h2>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Package
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Window
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Performance
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => {
                  const status = STATUS_LABELS[order.status] || {
                    text: order.status,
                    className: 'bg-gray-100 text-gray-800',
                  };
                  return (
                    <tr key={order.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {order.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.package.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex items-center gap-1 text-xs leading-5 font-semibold rounded-full ${status.className}`}
                        >
                          {order.status === 'pending' && <Clock className="h-3 w-3" />}
                          {order.status === 'active' && <Check className="h-3 w-3" />}
                          {order.status === 'cancelled' && <AlertCircle className="h-3 w-3" />}
                          {status.text}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.startDate && new Date(order.startDate).toLocaleDateString('en-US')}
                        {' - '}
                        {order.endDate && new Date(order.endDate).toLocaleDateString('en-US')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        Clicks {order.clickCount} · Views {order.viewCount}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="mb-12">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Packages</h2>
            {!seedLoaded && (
              <p className="mt-1 text-sm text-amber-700">
                Showing the standard rate card. Active packages will replace these once the
                catalog is loaded.
              </p>
            )}
          </div>
          {session && (
            <button
              type="button"
              onClick={() => setShowForm(!showForm)}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              {showForm ? 'Cancel' : 'Request a listing'}
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className={`relative bg-white rounded-lg shadow-lg overflow-hidden ${
                pkg.name === 'pro' ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              {pkg.name === 'pro' && (
                <div className="absolute top-0 right-0 bg-blue-500 px-4 py-1 text-sm font-semibold text-white">
                  Most popular
                </div>
              )}

              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{pkg.displayName}</h3>
                <p className="text-gray-600 mb-4">{pkg.description}</p>

                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">${pkg.price}</span>
                  <span className="text-gray-600">/{pkg.duration} days</span>
                </div>

                <div className="mb-4">
                  <span className="text-sm font-semibold text-gray-700 capitalize">
                    Placement: {pkg.position}
                  </span>
                </div>

                <ul className="space-y-3 mb-6">
                  {pkg.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <svg
                        className="mr-2 h-6 w-6 flex-shrink-0 text-green-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                {session && showForm && (
                  <button
                    type="button"
                    onClick={() => setSelectedPackage(pkg.id)}
                    className={`w-full rounded-lg py-3 px-4 font-semibold transition-colors ${
                      selectedPackage === pkg.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    {selectedPackage === pkg.id ? 'Selected' : 'Choose this package'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {session && showForm && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Listing details</h2>
          {formError && (
            <div
              role="alert"
              className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800"
            >
              {formError}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="sp-title" className="mb-2 block text-sm font-medium text-gray-700">
                Headline <span className="text-red-600">*</span>
              </label>
              <input
                id="sp-title"
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. The best AI writing assistant for teams"
              />
            </div>

            <div>
              <label htmlFor="sp-desc" className="mb-2 block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="sp-desc"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                placeholder="One or two sentences about what you are promoting."
              />
            </div>

            <div>
              <label htmlFor="sp-url" className="mb-2 block text-sm font-medium text-gray-700">
                Destination URL <span className="text-red-600">*</span>
              </label>
              <input
                id="sp-url"
                type="url"
                required
                value={formData.targetUrl}
                onChange={(e) => setFormData({ ...formData, targetUrl: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                placeholder="https://your-website.com"
              />
            </div>

            <div>
              <label htmlFor="sp-image" className="mb-2 block text-sm font-medium text-gray-700">
                Image URL
              </label>
              <input
                id="sp-image"
                type="url"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                placeholder="https://your-website.com/og-image.png"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? 'Submitting…' : 'Submit request'}
            </button>
          </form>
        </div>
      )}
    </>
  );
}
