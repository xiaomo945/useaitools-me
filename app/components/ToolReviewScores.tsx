'use client';

interface ReviewDimension {
  name: string;
  description: string;
  score: number;
}

interface ToolReviewScoresProps {
  scores: {
    easeOfUse: number;
    outputQuality: number;
    features: number;
    valueForMoney: number;
    stability: number;
    support: number;
  };
  compact?: boolean;
}

export default function ToolReviewScores({ scores, compact = false }: ToolReviewScoresProps) {
  const dimensions: ReviewDimension[] = [
    { name: 'Ease of Use', description: 'How intuitive and easy to learn', score: scores.easeOfUse },
    { name: 'Output Quality', description: 'The quality and consistency of results', score: scores.outputQuality },
    { name: 'Features', description: 'Range and depth of available features', score: scores.features },
    { name: 'Value for Money', description: 'Pricing relative to value delivered', score: scores.valueForMoney },
    { name: 'Stability', description: 'Reliability and uptime', score: scores.stability },
    { name: 'Support', description: 'Customer support and community', score: scores.support },
  ];

  const Star = ({ filled, half }: { filled: boolean; half?: boolean }) => (
    <svg 
      className={`w-4 h-4 transition-all duration-200 ${
        filled || half ? 'text-emerald-600 fill-emerald-600' : 'text-slate-300 dark:text-gray-600'
      }`}
      viewBox="0 0 20 20" 
      fill="currentColor"
    >
      {filled ? (
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8 2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      ) : half ? (
        <>
          <defs>
            <linearGradient id="halfGradient">
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="50%" stopColor="transparent" />
            </linearGradient>
          </defs>
          <path d="M10 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L10 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L10 2z" fill="url(#halfGradient)" stroke="currentColor" strokeWidth="0.5" />
        </>
      ) : (
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8 2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" fill="none" stroke="currentColor" strokeWidth="1.5" />
      )}
    </svg>
  );

  const renderStars = (score: number) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      const filled = score >= i + 1;
      const half = !filled && score >= i + 0.5;
      stars.push(<Star key={i} filled={filled} half={half} />);
    }
    return stars;
  };

  const overallScore = Object.values(scores).reduce((a, b) => a + b, 0) / 6;

  if (compact) {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div className="flex">{renderStars(overallScore)}</div>
          <span className="text-sm font-semibold text-slate-700 dark:text-gray-300">
            {overallScore.toFixed(1)}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 p-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl">
        <div className="text-5xl font-bold text-emerald-600 dark:text-emerald-400">
          {overallScore.toFixed(1)}
        </div>
        <div>
          <div className="flex mb-1">{renderStars(overallScore)}</div>
          <p className="text-sm text-slate-600 dark:text-gray-400">
            Overall rating across 6 categories
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {dimensions.map((dim) => (
          <div 
            key={dim.name}
            className="flex items-center justify-between p-3 bg-white dark:bg-gray-900 rounded-xl border border-slate-200 dark:border-gray-800"
            title={dim.description}
          >
            <span className="text-sm font-medium text-slate-700 dark:text-gray-300 font-sans">
              {dim.name}
            </span>
            <div className="flex items-center gap-2">
              <div className="flex">{renderStars(dim.score)}</div>
              <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 w-8 text-right">
                {dim.score.toFixed(1)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
