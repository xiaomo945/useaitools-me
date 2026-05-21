'use client';

interface StarRatingProps {
  rating: number;
  showCount?: boolean;
  count?: number;
  size?: 'sm' | 'md' | 'lg';
}

export default function StarRating({ rating, showCount = false, count = 0, size = 'md' }: StarRatingProps) {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const renderStar = (index: number) => {
    const starValue = index + 1;
    const isFull = rating >= starValue;
    const isHalf = !isFull && rating >= starValue - 0.5;

    return (
      <svg
        key={index}
        className={`${sizeClasses[size]} transition-all duration-200 ${
          isFull || isHalf ? 'text-amber-400 fill-amber-400' : 'text-slate-300 dark:text-gray-600'
        }`}
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        {isFull ? (
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        ) : isHalf ? (
          <path d="M10 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L10 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L10 2z" />
        ) : (
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" fill="none" stroke="currentColor" strokeWidth="2" />
        )}
      </svg>
    );
  };

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex">
        {[0, 1, 2, 3, 4].map(renderStar)}
      </div>
      {showCount && count > 0 && (
        <span className="text-sm text-slate-500 dark:text-gray-400">
          · {count.toLocaleString()} reviews
        </span>
      )}
    </div>
  );
}