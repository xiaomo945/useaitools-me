'use client';

import { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

export default function SoundToggle() {
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('useaitools_sound');
      setTimeout(() => setEnabled(stored !== 'disabled'), 0);
    } catch {}
  }, []);

  const toggle = () => {
    const next = !enabled;
    setEnabled(next);
    try {
      localStorage.setItem('useaitools_sound', next ? 'enabled' : 'disabled');
    } catch {}
  };

  return (
    <button
      onClick={toggle}
      className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 shadow-lg hover:shadow-xl hover:-translate-y-1 active:scale-95 transition-all duration-300 ease-out"
      aria-label={enabled ? 'Mute sound effects' : 'Enable sound effects'}
      title={enabled ? 'Sound on' : 'Sound off'}
    >
      {enabled ? (
        <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 dark:text-emerald-400" />
      ) : (
        <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 dark:text-slate-500" />
      )}
    </button>
  );
}
