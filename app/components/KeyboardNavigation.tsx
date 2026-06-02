'use client';

import { useState, useEffect, useCallback } from 'react';

const shortcuts = [
  { keys: ['Alt', '/'], description: 'Show keyboard shortcuts' },
  { keys: ['Ctrl', '/'], description: 'Show keyboard shortcuts' },
  { keys: ['Esc'], description: 'Close this panel' },
  { keys: ['/'], description: 'Focus search box' },
];

export default function KeyboardNavigation() {
  const [showHelp, setShowHelp] = useState(false);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const target = e.target as HTMLElement;
    const isInputFocused = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;

    if ((e.altKey || e.ctrlKey) && e.key === '/') {
      e.preventDefault();
      setShowHelp(prev => !prev);
      return;
    }

    if (e.key === 'Escape' && showHelp) {
      setShowHelp(false);
      return;
    }

    if (e.key === '/' && !isInputFocused) {
      e.preventDefault();
      const searchInput = document.querySelector('input[type="text"][placeholder*="Search"]') as HTMLInputElement;
      if (searchInput) {
        searchInput.focus();
      }
    }
  }, [showHelp]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (!showHelp) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in-up"
      onClick={() => setShowHelp(false)}
      role="dialog"
      aria-modal="true"
      aria-label="Keyboard shortcuts"
    >
      <div
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-gray-700 p-6 sm:p-8 max-w-md w-[90vw] mx-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">⌨️ Keyboard Shortcuts</h2>
          <button
            onClick={() => setShowHelp(false)}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200"
            aria-label="Close shortcuts panel"
          >
            <svg className="w-5 h-5 text-slate-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="space-y-3">
          {shortcuts.map((shortcut, index) => (
            <div key={index} className="flex items-center justify-between py-2">
              <span className="text-sm text-slate-600 dark:text-gray-300">{shortcut.description}</span>
              <div className="flex items-center gap-1">
                {shortcut.keys.map((key, ki) => (
                  <span key={ki} className="flex items-center gap-1">
                    {ki > 0 && <span className="text-xs text-slate-400 dark:text-gray-500">+</span>}
                    <kbd className="px-2 py-1 text-xs font-mono font-semibold bg-slate-100 dark:bg-gray-800 text-slate-700 dark:text-gray-300 border border-slate-200 dark:border-gray-700 rounded-md shadow-sm">
                      {key}
                    </kbd>
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="mt-6 text-xs text-center text-slate-400 dark:text-gray-500">
          Press <kbd className="px-1.5 py-0.5 text-xs font-mono bg-slate-100 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded">Esc</kbd> to close
        </p>
      </div>
    </div>
  );
}
