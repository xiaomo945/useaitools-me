'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Share2, Copy, Check } from 'lucide-react';
import Footer from '@/app/components/Footer';

export default function SubmitToolPage() {
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    category: '',
    description: '',
    pricing: '',
    needs_vpn: false,
    tier: 'free' as 'free' | 'expedited' | 'sponsored',
    contactEmail: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [submissionData, setSubmissionData] = useState<{
    tier: string;
    paymentRequired: boolean;
    paymentAmount: number;
    toolName: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    let processedValue = type === 'checkbox' && 'checked' in e.target ? (e.target as HTMLInputElement).checked : value;
    
    // Auto-capitalize tool name
    if (name === 'name' && typeof processedValue === 'string' && processedValue.length > 0) {
      processedValue = processedValue.charAt(0).toUpperCase() + processedValue.slice(1);
    }
    
    // Auto-prefix URL with https://
    if (name === 'url' && typeof processedValue === 'string') {
      const trimmed = processedValue.trim();
      if (trimmed && !trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
        processedValue = 'https://' + trimmed;
      }
    }
    
    setFormData(prev => ({ ...prev, [name]: processedValue }));
  };

  const suggestCategory = (name: string): string => {
    const lower = name.toLowerCase();
    const keywords: Record<string, string[]> = {
      'Writing': ['write', 'writer', 'writing', 'text', 'copy', 'blog', 'article', 'content', 'grammar', 'spell'],
      'Image': ['image', 'photo', 'picture', 'art', 'design', 'draw', 'illustration', 'visual', 'midjourney', 'dall-e', 'stable diffusion'],
      'Video': ['video', 'movie', 'film', 'animation', 'clip', 'edit', 'youtube', 'tiktok'],
      'Audio': ['audio', 'music', 'sound', 'voice', 'speech', 'podcast', 'tts', 'sing'],
      'Code': ['code', 'coding', 'developer', 'programming', 'debug', 'github', 'copilot', 'ide'],
      'Productivity': ['productivity', 'task', 'project', 'note', 'organize', 'schedule', 'calendar', 'notion', 'slack'],
    };
    for (const [category, words] of Object.entries(keywords)) {
      if (words.some(w => lower.includes(w))) return category;
    }
    return '';
  };

  const suggestedCategory = formData.name ? suggestCategory(formData.name) : '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('/api/submit-tool', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (data.success) {
        setSubmissionData({
          tier: formData.tier,
          paymentRequired: data.paymentRequired || false,
          paymentAmount: data.paymentAmount || 0,
          toolName: formData.name,
        });
        setSubmitted(true);
      }
    } catch (error) {
      console.error('Submission failed:', error);
      setError('Submission failed. Please try again. Your data has been preserved.');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    const text = `I just submitted a new AI tool to Use AI Tools! Check it out: https://useaitools.me`;
    
    if (navigator.share) {
      await navigator.share({
        title: 'Submit a Tool',
        text,
        url: 'https://useaitools.me/submit',
      });
    } else {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-gray-950 py-12 sm:py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-3xl p-8 shadow-lg text-center">
            <div className="text-5xl mb-4">🎉</div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-4">
              Thanks for your submission!
            </h1>
            <p className="text-base text-gray-600 dark:text-gray-400 mb-6">
              {submissionData?.tier === 'free' 
                ? `We'll review "${submissionData?.toolName}" soon and let you know if it gets added to our directory.`
                : submissionData?.tier === 'expedited'
                ? `Your expedited submission for "${submissionData?.toolName}" has been received!`
                : `Your sponsored submission for "${submissionData?.toolName}" has been received!`
              }
            </p>

            {/* Payment Required Notice */}
            {submissionData?.paymentRequired && (
              <div className="mb-8 p-6 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <svg className="w-6 h-6 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  <h2 className="text-lg font-bold text-emerald-900 dark:text-emerald-100">Payment Required</h2>
                </div>
                <p className="text-sm text-emerald-800 dark:text-emerald-200 mb-4">
                  {submissionData.tier === 'expedited' 
                    ? 'Complete your payment to proceed with 24-hour priority review.'
                    : 'Complete your payment to activate your featured listing.'
                  }
                </p>
                <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mb-4">
                  ${submissionData.paymentAmount}
                  {submissionData.tier === 'sponsored' && <span className="text-sm font-semibold text-slate-500">/month</span>}
                </div>
                <button
                  onClick={() => {
                    // TODO: Integrate with Stripe/LemonSqueezy payment
                    alert('Payment integration coming soon! Please contact us at hello@useaitools.me');
                  }}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
                >
                  Proceed to Payment
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </div>
            )}
            
            {/* Share Buttons */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <button
                onClick={handleShare}
                className="inline-flex items-center gap-2 px-6 py-3 border border-slate-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-slate-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-gray-700 transition-all duration-300"
              >
                {copied ? (
                  <>
                    <Check className="w-5 h-5" />
                    Link copied!
                  </>
                ) : (
                  <>
                    <Share2 className="w-5 h-5" />
                    Share with friends
                  </>
                )}
              </button>
              <a
                href="https://x.com/intent/tweet?text=I%20just%20submitted%20a%20new%20AI%20tool%20to%20Use%20AI%20Tools%20directory!%20Check%20it%20out%20https://useaitools.me"
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 transition-all duration-300"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                X
              </a>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
              >
                Back to Home
              </Link>
              <Link
                href="/submit"
                className="inline-flex items-center gap-2 px-6 py-3 border border-slate-300 dark:border-gray-700 text-slate-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-gray-700 transition-all duration-300"
              >
                Submit Another Tool
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 py-12 sm:py-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <Link href="/" className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium flex items-center justify-center gap-2 mb-6">
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </Link>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-4">
            Submit a Tool
          </h1>
          <p className="text-base text-gray-600 dark:text-gray-400">
            Know a great AI tool that should be in our directory? Let us know!
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-3xl p-8 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Tool Name <span className="text-rose-500">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-300 dark:focus:border-emerald-600 transition-all duration-300"
                placeholder="e.g. ChatGPT"
              />
            </div>

            <div>
              <label htmlFor="url" className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Website URL <span className="text-rose-500">*</span>
              </label>
              <input
                id="url"
                name="url"
                type="url"
                value={formData.url}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-300 dark:focus:border-emerald-600 transition-all duration-300"
                placeholder="https://..."
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Category <span className="text-rose-500">*</span>
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-300 dark:focus:border-emerald-600 transition-all duration-300"
              >
                <option value="">Select a category...</option>
                <option value="Writing">Writing</option>
                <option value="Image">Image</option>
                <option value="Productivity">Productivity</option>
                <option value="Code">Code</option>
                <option value="Audio">Audio</option>
                <option value="Video">Video</option>
              </select>
              {suggestedCategory && !formData.category && (
                <p className="mt-1.5 text-xs text-emerald-600 dark:text-emerald-400">
                  💡 Suggestion: <button type="button" onClick={() => setFormData(prev => ({ ...prev, category: suggestedCategory }))} className="underline font-semibold">{suggestedCategory}</button>
                </p>
              )}
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Description <span className="text-rose-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                required
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-300 dark:focus:border-emerald-600 transition-all duration-300 resize-none"
                placeholder="Tell us about this tool and why it's great..."
              />
            </div>

            <div>
              <label htmlFor="pricing" className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Pricing Model
              </label>
              <select
                id="pricing"
                name="pricing"
                value={formData.pricing}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-300 dark:focus:border-emerald-600 transition-all duration-300"
              >
                <option value="">Select pricing...</option>
                <option value="Free">Free</option>
                <option value="Freemium">Freemium</option>
                <option value="Free Trial">Free Trial</option>
                <option value="Paid">Paid</option>
                <option value="Open Source">Open Source</option>
              </select>
            </div>

            <div className="flex items-center gap-3">
              <input
                id="needs_vpn"
                name="needs_vpn"
                type="checkbox"
                checked={formData.needs_vpn}
                onChange={handleInputChange}
                className="w-5 h-5 rounded border-slate-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-emerald-600 focus:ring-emerald-500/50"
              />
              <label htmlFor="needs_vpn" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Requires VPN to access
              </label>
            </div>

            {/* Submission Tier Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                Submission Option
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Free Tier */}
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, tier: 'free' }))}
                  className={`relative p-4 rounded-xl border-2 text-left transition-all duration-300 ${
                    formData.tier === 'free'
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                      : 'border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-slate-300 dark:hover:border-gray-600'
                  }`}
                >
                  <div className="font-bold text-lg text-slate-900 dark:text-white mb-1">Free</div>
                  <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mb-2">$0</div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">
                    Standard review<br/>7-14 days
                  </div>
                </button>

                {/* Expedited Tier */}
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, tier: 'expedited' }))}
                  className={`relative p-4 rounded-xl border-2 text-left transition-all duration-300 ${
                    formData.tier === 'expedited'
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                      : 'border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-slate-300 dark:hover:border-gray-600'
                  }`}
                >
                  <div className="absolute -top-2 -right-2 px-2 py-0.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-bold rounded-full shadow-md">
                    POPULAR
                  </div>
                  <div className="font-bold text-lg text-slate-900 dark:text-white mb-1">Expedited</div>
                  <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mb-2">$29</div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">
                    Priority review<br/>24 hours
                  </div>
                </button>

                {/* Sponsored Tier */}
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, tier: 'sponsored' }))}
                  className={`relative p-4 rounded-xl border-2 text-left transition-all duration-300 ${
                    formData.tier === 'sponsored'
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                      : 'border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-slate-300 dark:hover:border-gray-600'
                  }`}
                >
                  <div className="absolute -top-2 -right-2 px-2 py-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-[10px] font-bold rounded-full shadow-md">
                    PREMIUM
                  </div>
                  <div className="font-bold text-lg text-slate-900 dark:text-white mb-1">Sponsored</div>
                  <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mb-2">$99<span className="text-sm font-semibold text-slate-500">/mo</span></div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">
                    Homepage featured<br/>+ Sponsored badge
                  </div>
                </button>
              </div>
            </div>

            {/* Contact Email for Paid Tiers */}
            {formData.tier !== 'free' && (
              <div>
                <label htmlFor="contactEmail" className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Contact Email <span className="text-rose-500">*</span>
                </label>
                <input
                  id="contactEmail"
                  name="contactEmail"
                  type="email"
                  value={formData.contactEmail}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-300 dark:focus:border-emerald-600 transition-all duration-300"
                  placeholder="your@email.com"
                />
                <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                  We'll send payment receipt and status updates to this email
                </p>
              </div>
            )}

            {error && (
              <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-sm font-medium">
                {error}
              </div>
            )}

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  'Submit Tool'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}