'use client';

import { useState, useEffect } from 'react';
import { Mail, Bell, BellOff, Save, Loader2 } from 'lucide-react';
import { useSession } from 'next-auth/react';

interface EmailSubscription {
  id: string;
  userId: string;
  categories: string;
  frequency: string;
  emailFormat: string;
  isActive: boolean;
  lastEmailSentAt: string | null;
  createdAt: string;
  updatedAt: string;
}

const CATEGORIES = [
  { value: 'writing', label: 'Writing Tools', description: 'AI writing assistants, content generators, copywriting tools' },
  { value: 'image', label: 'Image Tools', description: 'AI image generators, photo editors, design tools' },
  { value: 'video', label: 'Video Tools', description: 'AI video generators, editors, animation tools' },
  { value: 'audio', label: 'Audio Tools', description: 'AI audio generators, music tools, voice synthesis' },
  { value: 'code', label: 'Code Tools', description: 'AI coding assistants, code generators, development tools' },
  { value: 'productivity', label: 'Productivity Tools', description: 'AI productivity boosters, automation, workflow tools' },
];

const FREQUENCIES = [
  { value: 'daily', label: 'Daily', description: 'Get updates every day' },
  { value: 'weekly', label: 'Weekly', description: 'Get updates once a week' },
  { value: 'monthly', label: 'Monthly', description: 'Get updates once a month' },
];

const FORMATS = [
  { value: 'html', label: 'HTML', description: 'Rich formatted emails with images' },
  { value: 'text', label: 'Plain Text', description: 'Simple text-only emails' },
];

export default function EmailPreferencesClient() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [subscription, setSubscription] = useState<EmailSubscription | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [frequency, setFrequency] = useState('weekly');
  const [emailFormat, setEmailFormat] = useState('html');
  const [isActive, setIsActive] = useState(true);

  const fetchSubscription = async () => {
    try {
      const response = await fetch('/api/email-subscription');
      if (response.ok) {
        const data = await response.json();
        if (data.subscription) {
          setSubscription(data.subscription);
          setSelectedCategories(JSON.parse(data.subscription.categories || '[]'));
          setFrequency(data.subscription.frequency);
          setEmailFormat(data.subscription.emailFormat);
          setIsActive(data.subscription.isActive);
        }
      }
    } catch (error) {
      console.error('Failed to fetch subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscription();
  }, []);

  const handleSave = async () => {
    if (!session) {
      alert('Please sign in to manage email subscriptions');
      return;
    }

    setSaving(true);
    try {
      const response = await fetch('/api/email-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          categories: selectedCategories,
          frequency,
          emailFormat,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setSubscription(data.subscription);
        alert('Subscription preferences saved successfully!');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to save preferences');
      }
    } catch (error) {
      console.error('Failed to save subscription:', error);
      alert('Failed to save preferences');
    } finally {
      setSaving(false);
    }
  };

  const handleUnsubscribe = async () => {
    if (!confirm('Are you sure you want to unsubscribe from all email notifications?')) {
      return;
    }

    setSaving(true);
    try {
      const response = await fetch('/api/email-subscription', {
        method: 'DELETE',
      });

      if (response.ok) {
        setIsActive(false);
        alert('Successfully unsubscribed from email notifications');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to unsubscribe');
      }
    } catch (error) {
      console.error('Failed to unsubscribe:', error);
      alert('Failed to unsubscribe');
    } finally {
      setSaving(false);
    }
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                Email Preferences
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Customize your email notifications and recommendations
              </p>
            </div>
          </div>
        </div>

        {/* Subscription Status */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {isActive ? (
                <>
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                    <Bell className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">Subscribed</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      You're receiving email notifications
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    <BellOff className="w-5 h-5 text-slate-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">Unsubscribed</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      You're not receiving any email notifications
                    </p>
                  </div>
                </>
              )}
            </div>
            <button
              onClick={isActive ? handleUnsubscribe : handleSave}
              disabled={saving}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                isActive
                  ? 'bg-red-100 hover:bg-red-200 text-red-700 dark:bg-red-900/30 dark:hover:bg-red-900/50 dark:text-red-400'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              } disabled:opacity-50`}
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : isActive ? (
                'Unsubscribe'
              ) : (
                'Resubscribe'
              )}
            </button>
          </div>
        </div>

        {/* Category Preferences */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 p-6 mb-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
            Category Preferences
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Choose which categories you want to receive updates about
          </p>
          <div className="space-y-3">
            {CATEGORIES.map(category => (
              <label
                key={category.value}
                className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  selectedCategories.includes(category.value)
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category.value)}
                  onChange={() => toggleCategory(category.value)}
                  className="mt-1 w-5 h-5 rounded border-slate-300 dark:border-gray-600 text-emerald-600 focus:ring-emerald-500"
                />
                <div className="flex-1">
                  <div className="font-semibold text-slate-900 dark:text-white">
                    {category.label}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    {category.description}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Email Frequency */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 p-6 mb-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
            Email Frequency
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            How often would you like to receive email updates?
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {FREQUENCIES.map(freq => (
              <button
                key={freq.value}
                onClick={() => setFrequency(freq.value)}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  frequency === freq.value
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
              >
                <div className="font-semibold text-slate-900 dark:text-white mb-1">
                  {freq.label}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  {freq.description}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Email Format */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 p-6 mb-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
            Email Format
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Choose your preferred email format
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {FORMATS.map(format => (
              <button
                key={format.value}
                onClick={() => setEmailFormat(format.value)}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  emailFormat === format.value
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
              >
                <div className="font-semibold text-slate-900 dark:text-white mb-1">
                  {format.label}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  {format.description}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold rounded-xl shadow-lg transition-all disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Save Preferences
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
