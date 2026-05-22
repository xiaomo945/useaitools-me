'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import Link from 'next/link';

const categories = [
  { label: 'Write content', icon: '✍️', href: '/category/writing', desc: 'AI writing, copywriting & content tools' },
  { label: 'Edit videos', icon: '🎬', href: '/category/video', desc: 'Video editing, generation & subtitles' },
  { label: 'Generate images', icon: '🎨', href: '/category/image', desc: 'Image generation, editing & design' },
];

export default function OnboardingGuide() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem('onboardingDismissed');
    if (!dismissed) {
      const timer = setTimeout(() => setShow(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const dismiss = () => {
    localStorage.setItem('onboardingDismissed', 'true');
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={dismiss}>
      <div
        className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-700 rounded-2xl shadow-2xl max-w-lg w-full p-8 relative animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={dismiss}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-gray-800"
          aria-label="Close onboarding guide"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            What do you want to do?
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Pick a category and we'll take you straight there.
          </p>
        </div>

        <div className="space-y-3 mb-6">
          {categories.map((cat) => (
            <Link
              key={cat.href}
              href={cat.href}
              onClick={dismiss}
              className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-600 hover:shadow-md hover:shadow-emerald-500/5 transition-all duration-300 group"
            >
              <span className="text-2xl">{cat.icon}</span>
              <div className="flex-1">
                <p className="font-semibold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {cat.label}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{cat.desc}</p>
              </div>
              <svg className="w-5 h-5 text-slate-400 group-hover:text-emerald-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={dismiss}
            className="text-sm text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors underline underline-offset-4"
          >
            Skip, just show me all tools
          </button>
        </div>
      </div>
    </div>
  );
}
