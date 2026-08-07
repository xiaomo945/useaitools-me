'use client';

import { useEffect } from 'react';

const FALLBACK_TOOL_IMAGE = 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1600&h=900&fit=crop';

export default function ImageFallbackHandler() {
  useEffect(() => {
    const handler = (e: Event) => {
      const target = e.target as HTMLImageElement | null;
      if (!target || target.tagName !== 'IMG') return;
      const src = target.getAttribute('src') || '';
      const alreadyFallback = target.dataset.fallbackApplied === 'true';
      if (alreadyFallback) return;
      // Only handle non-next/image <img> tags with a visible path failure
      const brokenPatterns = [
        '/blog-images/',
        'placehold.co',
        'public/',
        '/example-',
        '/screenshot-',
      ];
      const matchesBroken = brokenPatterns.some((p) => src.includes(p));
      // Also handle any http(s) image that failed, but avoid infinite loops for clearly broken unsplash
      const isUnplash404 = /images\.unsplash\.com.*404|sig=/i.test(src) && src.includes('images.unsplash.com');
      if (!matchesBroken && !isUnplash404) return;
      target.dataset.fallbackApplied = 'true';
      target.onerror = null;
      target.setAttribute('src', FALLBACK_TOOL_IMAGE);
      target.classList.add('opacity-90');
    };

    window.addEventListener('error', handler, true);
    return () => window.removeEventListener('error', handler, true);
  }, []);

  return null;
}
