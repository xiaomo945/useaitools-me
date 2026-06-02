'use client';

import { useState, useEffect, useCallback } from 'react';

export default function ExternalLinkToast() {
  const [domain, setDomain] = useState<string | null>(null);

  const handleExternalLink = useCallback((e: Event) => {
    const { domain: d } = (e as CustomEvent).detail;
    setDomain(d);
  }, []);

  useEffect(() => {
    window.addEventListener('useaitools:external-link', handleExternalLink);
    return () => window.removeEventListener('useaitools:external-link', handleExternalLink);
  }, [handleExternalLink]);

  useEffect(() => {
    if (!domain) return;
    const timer = setTimeout(() => setDomain(null), 1500);
    return () => clearTimeout(timer);
  }, [domain]);

  if (!domain) return null;

  return (
    <div className="fixed bottom-24 md:bottom-6 left-1/2 -translate-x-1/2 z-[55] animate-fade-in-up pointer-events-none">
      <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-900/90 dark:bg-white/90 text-white dark:text-slate-900 rounded-full shadow-2xl text-sm font-medium backdrop-blur-md">
        <span>🔗</span>
        <span>Redirecting to <span className="font-bold">{domain}</span>...</span>
      </div>
    </div>
  );
}
