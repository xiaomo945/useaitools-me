'use client';

import { useState, useEffect } from 'react';

export default function NetworkStatus() {
  const [isOffline, setIsOffline] = useState(false);
  const [justRestored, setJustRestored] = useState(false);

  useEffect(() => {
    setIsOffline(!navigator.onLine);

    const handleOffline = () => {
      setIsOffline(true);
      setJustRestored(false);
    };

    const handleOnline = () => {
      setIsOffline(false);
      setJustRestored(true);
      const timer = setTimeout(() => setJustRestored(false), 2000);
      return () => clearTimeout(timer);
    };

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  if (!isOffline && !justRestored) return null;

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-[70] py-2.5 px-4 text-center text-sm font-semibold transition-all duration-500 ease-out ${
        isOffline
          ? 'bg-amber-500 text-white'
          : 'bg-emerald-500 text-white'
      }`}
      role="alert"
    >
      {isOffline ? (
        <span>⚠️ Network connection lost — some features may be unavailable</span>
      ) : (
        <span>✅ Network restored</span>
      )}
    </div>
  );
}
