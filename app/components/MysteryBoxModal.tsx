'use client';

import { memo } from 'react';
import Link from 'next/link';

interface Tool {
  id: number;
  name: string;
  category: string;
  description: string;
  rating?: number;
}

interface ColorScheme {
  bg: string;
  bgDark: string;
  text: string;
  textLight: string;
}

interface MysteryBoxModalProps {
  show: boolean;
  tool: Tool | null;
  revealed: boolean;
  hints: string[];
  mysteryCount: number;
  onClose: () => void;
  onReveal: () => void;
  onTryAnother: () => void;
  getCategoryColors: (category: string) => ColorScheme;
}

const MysteryBoxModal = memo(function MysteryBoxModal({
  show,
  tool,
  revealed,
  hints,
  mysteryCount,
  onClose,
  onReveal,
  onTryAnother,
  getCategoryColors,
}: MysteryBoxModalProps) {
  if (!show || !tool) return null;

  const colors = getCategoryColors(tool.category);

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-gray-700 max-w-md w-full overflow-hidden pointer-events-auto animate-fade-in-up">
          {!revealed ? (
            <div className="p-6 sm:p-8 text-center">
              <div className="text-6xl mb-4 animate-bounce">🎁</div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">What's inside?</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Here are some clues...</p>
              <div className="space-y-3 mb-8">
                {hints.map((hint, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 px-4 py-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl text-left"
                  >
                    <span className="text-lg">💡</span>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{hint}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={onReveal}
                className="w-full px-6 py-3 bg-gradient-to-r from-amber-400 to-orange-400 dark:from-amber-500 dark:to-orange-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 text-lg"
              >
                🎁 Reveal!
              </button>
            </div>
          ) : (
            <div className="p-6 sm:p-8 text-center">
              <div className="text-4xl mb-2">🎉</div>
              <p className="text-xs font-semibold text-amber-500 mb-3 uppercase tracking-wider">You discovered</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{tool.name}</h3>
              <div className="flex items-center justify-center gap-2 mb-3">
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${colors.bg} text-white`}>
                  {tool.category}
                </span>
                <span className="text-amber-500 font-semibold text-sm">★ {tool.rating || '4.5'}</span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">{tool.description}</p>
              <div className="flex flex-col gap-3">
                <Link
                  href={`/tools/${tool.id}`}
                  onClick={onClose}
                  className="w-full px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  View Details →
                </Link>
                {mysteryCount < 3 ? (
                  <button
                    onClick={onTryAnother}
                    className="w-full px-6 py-3 border-2 border-slate-200 dark:border-gray-700 text-slate-700 dark:text-slate-300 font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-gray-800 transition-all duration-300"
                  >
                    🎲 Try Another
                  </button>
                ) : (
                  <p className="text-xs text-slate-400 dark:text-slate-500">Come back tomorrow for more mystery boxes!</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
});

export default MysteryBoxModal;
