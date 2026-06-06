import { ArrowRight, ThumbsUp } from 'lucide-react';

interface ToolVerdictProps {
  name: string;
  category: string;
  pricing: string;
  best_for?: string[];
  hasAffiliate: boolean;
  affiliateUrl: string;
}

// Pre-written verdicts for key affiliate tools
const toolVerdicts: Record<string, string> = {
  'Rytr': 'If you need a budget-friendly AI writer that handles 30+ languages without compromising quality, Rytr is your best bet under $9/month.',
  'VEED.io': 'The fastest way to add professional subtitles, AI voiceovers, and translations to your videos — all in the browser, no editing skills required.',
  'Murf AI': 'Turn any text into studio-quality voiceovers in minutes. Perfect for podcasts, presentations, and video narration without hiring voice actors.',
  'Pictory': 'Transform blog posts and scripts into engaging videos automatically — ideal for content creators who want to repurpose without extra effort.',
  'Grammarly': 'The essential writing assistant that catches mistakes you\'d miss and makes your emails, docs, and social posts sound more professional.',
};

// Generic verdict template by category
function generateVerdict(name: string, category: string, pricing: string, bestFor?: string[]): string {
  if (bestFor && bestFor.length > 0) {
    const topUse = bestFor[0];
    const priceHint = pricing.includes('Free')
      ? 'with a generous free plan'
      : pricing.includes('Freemium')
        ? 'starting free'
        : '';

    return `If ${topUse} is your main need, ${name} delivers exactly that${priceHint ? ` — ${priceHint}` : ''}. Try it and see if it fits your workflow.`;
  }

  return `${name} is a solid ${category.toLowerCase()} tool worth trying — test the free version first to see if it matches your needs.`;
}

export default function ToolVerdict({ name, category, pricing, best_for, hasAffiliate, affiliateUrl }: ToolVerdictProps) {
  const verdict = toolVerdicts[name] || generateVerdict(name, category, pricing, best_for);

  return (
    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/10 border border-emerald-200 dark:border-emerald-800/50 rounded-2xl p-5 sm:p-6 mb-8">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
          <ThumbsUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wide mb-1">
            Our Verdict
          </h3>
          <p className="text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed mb-3">
            {verdict}
          </p>
          {hasAffiliate && (
            <a
              href={affiliateUrl}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
            >
              Try {name} Free
              <ArrowRight className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
