'use client';

import { useSyncExternalStore, useCallback } from 'react';
import { Star, ThumbsUp } from 'lucide-react';

interface UserRatingProps {
  toolId: number;
  toolName: string;
}

type StoredRatings = {
  [toolId: string]: {
    userRating: number;
    communityRatings: number[];
  };
};

const STORAGE_KEY = 'useaitools_tool_ratings';

function loadRatings(): StoredRatings {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as StoredRatings) : {};
  } catch {
    return {};
  }
}

function saveRatings(ratings: StoredRatings) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ratings));
    // Notify same-tab subscribers
    window.dispatchEvent(new Event('useaitools:ratings-change'));
  } catch {
    // Ignore quota errors
  }
}

type RatingState = {
  userRating: number;
  communityAvg: number;
  reviewCount: number;
  hasRated: boolean;
};

const initialState: RatingState = {
  userRating: 0,
  communityAvg: 0,
  reviewCount: 0,
  hasRated: false,
};

function readStateFromStorage(toolId: number): RatingState {
  const ratings = loadRatings();
  const entry = ratings[String(toolId)];
  if (!entry) return initialState;
  const community = entry.communityRatings || [];
  const avg = community.length > 0
    ? Math.round((community.reduce((sum, r) => sum + r, 0) / community.length) * 10) / 10
    : 0;
  return {
    userRating: entry.userRating || 0,
    communityAvg: avg,
    reviewCount: community.length,
    hasRated: !!entry.userRating,
  };
}

// Stable empty state for SSR
const ssrState: RatingState = initialState;

function subscribe(callback: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  const handler = () => callback();
  window.addEventListener('storage', handler);
  window.addEventListener('useaitools:ratings-change', handler);
  return () => {
    window.removeEventListener('storage', handler);
    window.removeEventListener('useaitools:ratings-change', handler);
  };
}

export default function UserRating({ toolId, toolName }: UserRatingProps) {
  // useSyncExternalStore handles SSR/client hydration correctly:
  // - getServerSnapshot returns initialState (no localStorage access on server)
  // - getSnapshot reads from localStorage on client
  const state = useSyncExternalStore(
    subscribe,
    () => readStateFromStorage(toolId),
    () => ssrState,
  );

  const handleRate = useCallback((rating: number) => {
    const ratings = loadRatings();
    const key = String(toolId);
    const entry = ratings[key] || { userRating: 0, communityRatings: [] };

    if (entry.userRating && entry.userRating !== rating) {
      const idx = entry.communityRatings.indexOf(entry.userRating);
      if (idx >= 0) entry.communityRatings.splice(idx, 1);
    }
    if (!entry.userRating || entry.userRating !== rating) {
      entry.communityRatings.push(rating);
    }

    entry.userRating = rating;
    ratings[key] = entry;
    saveRatings(ratings);
  }, [toolId]);

  const { userRating, communityAvg, reviewCount, hasRated } = state;

  return (
    <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-2xl p-5 sm:p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ThumbsUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <h3 className="font-bold text-slate-900 dark:text-white">Community Rating</h3>
        </div>
        {reviewCount > 0 && (
          <span className="text-sm text-slate-500 dark:text-slate-400">
            <span className="font-semibold text-amber-500">{communityAvg.toFixed(1)}</span>
            {' '}·{' '}
            {reviewCount} {reviewCount === 1 ? 'review' : 'reviews'}
          </span>
        )}
      </div>

      <div className="flex items-center gap-3 mb-3">
        <div className="flex gap-1" role="radiogroup" aria-label={`Rate ${toolName}`}>
          {[1, 2, 3, 4, 5].map(star => (
            <button
              key={star}
              onClick={() => handleRate(star)}
              aria-label={`${star} star${star > 1 ? 's' : ''}`}
              role="radio"
              aria-checked={userRating === star}
              className={`transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40 rounded ${
                star <= userRating ? 'text-amber-400' : 'text-slate-300 dark:text-slate-600'
              }`}
            >
              <Star className={`w-7 h-7 ${star <= userRating ? 'fill-amber-400' : ''}`} />
            </button>
          ))}
        </div>
        {userRating > 0 && (
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            {userRating}.0
          </span>
        )}
      </div>

      {hasRated ? (
        <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
          Thanks for your rating! Tap another star to update.
        </p>
      ) : (
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Be the first to rate {toolName}. Your feedback helps other users decide.
        </p>
      )}
    </div>
  );
}
