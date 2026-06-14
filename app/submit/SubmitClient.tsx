'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Share2, Check } from 'lucide-react';

export default function SubmitClient() {
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    category: '',
    description: '',
    email: session?.user?.email || '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    let processedValue = value;

    if (name === 'name' && typeof processedValue === 'string' && processedValue.length > 0) {
      processedValue = processedValue.charAt(0).toUpperCase() + processedValue.slice(1);
    }

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
    setError('');

    try {
      const response = await fetch('/api/submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSubmitted(true);
      } else {
        setError(data.error || '提交失败，请重试');
      }
    } catch (error) {
      console.error('Submission failed:', error);
      setError('提交失败，请重试。您的数据已保留。');
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
      <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-3xl p-8 shadow-lg text-center">
        <div className="text-5xl mb-4">🎉</div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-4">
          Thanks for your submission!
        </h2>
        <p className="text-base text-gray-600 dark:text-gray-400 mb-8">
          We'll review your tool soon and let you know if it gets added to our directory.
        </p>

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
          <button
            onClick={() => setSubmitted(false)}
            className="inline-flex items-center gap-2 px-6 py-3 border border-slate-300 dark:border-gray-700 text-slate-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-gray-700 transition-all duration-300"
          >
            Submit Another Tool
          </button>
        </div>
      </div>
    );
  }

  return (
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
          <label htmlFor="email" className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
            Your Email <span className="text-rose-500">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-300 dark:focus:border-emerald-600 transition-all duration-300"
            placeholder="your@email.com"
          />
          <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
            We'll notify you when your submission is reviewed
          </p>
        </div>

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
  );
}
