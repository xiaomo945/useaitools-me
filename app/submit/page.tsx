'use client';

import { useState } from 'react';
import Link from 'next/link';
import Footer from '@/app/components/Footer';

export default function SubmitToolPage() {
  const [formData, setFormData] = useState({
    toolName: '',
    websiteUrl: '',
    description: '',
    category: '',
    yourEmail: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
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
            <p className="text-base text-gray-600 dark:text-gray-400 mb-8">
              We'll review your tool soon and let you know if it gets added to our directory.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 py-12 sm:py-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <Link href="/" className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium flex items-center justify-center gap-2 mb-6">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
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
              <label htmlFor="toolName" className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Tool Name <span className="text-emerald-600 dark:text-emerald-400">*</span>
              </label>
              <input
                id="toolName"
                name="toolName"
                type="text"
                value={formData.toolName}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-300 dark:focus:border-emerald-600 transition-all duration-300"
                placeholder="e.g. ChatGPT"
              />
            </div>

            <div>
              <label htmlFor="websiteUrl" className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Website URL <span className="text-emerald-600 dark:text-emerald-400">*</span>
              </label>
              <input
                id="websiteUrl"
                name="websiteUrl"
                type="url"
                value={formData.websiteUrl}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-300 dark:focus:border-emerald-600 transition-all duration-300"
                placeholder="https://..."
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-300 dark:focus:border-emerald-600 transition-all duration-300 resize-none"
                placeholder="Tell us about this tool and why it's great..."
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
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
            </div>

            <div>
              <label htmlFor="yourEmail" className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Your Email
              </label>
              <input
                id="yourEmail"
                name="yourEmail"
                type="email"
                value={formData.yourEmail}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-300 dark:focus:border-emerald-600 transition-all duration-300"
                placeholder="your@email.com"
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
              >
                Submit Tool
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
