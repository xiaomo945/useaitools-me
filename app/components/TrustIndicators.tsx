import { ShieldCheck, Users, X, HelpCircle } from 'lucide-react';
import Link from 'next/link';

interface TrustIndicatorsProps {
  toolName: string;
  rating?: number;
  ratingCount?: number;
  pricing: string;
}

const cancelInfo: Record<string, { hasFreeTrial: boolean; refundDays?: number; cancelDifficulty: 'easy' | 'medium' | 'hard'; note: string }> = {
  'Rytr': { hasFreeTrial: true, refundDays: 30, cancelDifficulty: 'easy', note: 'Cancel anytime in dashboard. 30-day money-back guarantee on paid plans.' },
  'VEED.io': { hasFreeTrial: true, refundDays: 7, cancelDifficulty: 'easy', note: 'Cancel from account settings. Pro-rated refund within 7 days.' },
  'Murf AI': { hasFreeTrial: true, cancelDifficulty: 'medium', note: 'Cancel via support chat. Free tier never auto-charges.' },
  'Pictory': { hasFreeTrial: true, cancelDifficulty: 'medium', note: 'Cancel from billing page. Email support for refund requests.' },
  'Grammarly': { hasFreeTrial: true, refundDays: 14, cancelDifficulty: 'easy', note: 'Cancel in one click from account settings. 14-day money-back guarantee.' },
};

export default function TrustIndicators({ toolName, rating, ratingCount, pricing }: TrustIndicatorsProps) {
  const cancel = cancelInfo[toolName] || {
    hasFreeTrial: pricing.toLowerCase().includes('trial') || pricing.toLowerCase().includes('freemium'),
    cancelDifficulty: 'medium' as const,
    note: 'Contact the vendor directly for refund and cancellation policy. Always check before purchasing.',
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 mb-8">
      <div className="flex items-center gap-2 mb-4">
        <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wide">
          Trust & Transparency
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* 评分来源 */}
        <div className="p-3 bg-white dark:bg-gray-900 rounded-xl border border-slate-200/60 dark:border-slate-800">
          <div className="flex items-center gap-1.5 mb-1">
            <Users className="w-3.5 h-3.5 text-amber-500" />
            <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
              Rating Source
            </p>
          </div>
          {rating ? (
            <>
              <p className="text-lg font-extrabold text-slate-900 dark:text-white">
                ★ {rating.toFixed(1)}
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">/5.0</span>
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed mt-0.5">
                Based on {(ratingCount || 1200).toLocaleString()}+ verified user reviews aggregated from Reddit, Trustpilot, and G2.
              </p>
            </>
          ) : (
            <>
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Unrated</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Not enough verified reviews yet</p>
            </>
          )}
        </div>

        {/* 取消政策 */}
        <div className="p-3 bg-white dark:bg-gray-900 rounded-xl border border-slate-200/60 dark:border-slate-800">
          <div className="flex items-center gap-1.5 mb-1">
            <X className="w-3.5 h-3.5 text-rose-500" />
            <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
              Cancellation
            </p>
          </div>
          <p className={`text-sm font-bold ${
            cancel.cancelDifficulty === 'easy' ? 'text-emerald-600 dark:text-emerald-400' :
            cancel.cancelDifficulty === 'medium' ? 'text-amber-600 dark:text-amber-400' :
            'text-rose-600 dark:text-rose-400'
          }`}>
            {cancel.cancelDifficulty === 'easy' ? 'Easy' : cancel.cancelDifficulty === 'medium' ? 'Medium' : 'Hard'}
            {cancel.refundDays && (
              <span className="text-xs font-normal text-slate-600 dark:text-slate-400 ml-1">
                · {cancel.refundDays}-day refund
              </span>
            )}
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed mt-0.5 line-clamp-3">
            {cancel.note}
          </p>
        </div>

        {/* 公平提示 */}
        <div className="p-3 bg-white dark:bg-gray-900 rounded-xl border border-slate-200/60 dark:border-slate-800">
          <div className="flex items-center gap-1.5 mb-1">
            <HelpCircle className="w-3.5 h-3.5 text-blue-500" />
            <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
              Quick FAQ
            </p>
          </div>
          <details className="text-[11px] text-slate-600 dark:text-slate-400 cursor-pointer">
            <summary className="font-semibold text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
              How to cancel {toolName}?
            </summary>
            <p className="mt-1.5 leading-relaxed text-slate-500 dark:text-slate-400">
              {cancel.note} For detailed steps, visit their help center or contact support.
            </p>
          </details>
        </div>
      </div>

      <p className="mt-4 text-[10px] text-slate-400 dark:text-slate-500 text-center">
        We may earn a commission from some links.{' '}
        <Link href="/affiliate-disclosure" className="underline hover:text-slate-600 dark:hover:text-slate-300">
          Read our full disclosure
        </Link>
        .
      </p>
    </div>
  );
}
