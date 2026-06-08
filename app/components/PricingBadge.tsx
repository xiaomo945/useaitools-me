import { Check, Gift, CreditCard } from 'lucide-react';

export type PricingTier = 'free' | 'freemium' | 'trial' | 'paid' | 'open_source' | 'unknown';

interface PricingBadgeProps {
  pricing: string;
  size?: 'sm' | 'md';
  showLabel?: boolean;
}

/**
 * 把字符串定价归类为 6 个清晰档位
 * 解决用户挑刺 #14：「Free Trial / Freemium / Free 傻傻分不清」
 */
export function classifyPricing(pricing: string): PricingTier {
  const p = pricing.toLowerCase().trim();
  if (p === 'free' || p.includes('100% free')) return 'free';
  if (p.includes('open source') || p.includes('opensource')) return 'open_source';
  if (p.includes('freemium')) return 'freemium';
  if (p.includes('free trial') || p.includes('trial')) return 'trial';
  if (p === 'paid' || p.includes('$') || p.includes('subscription')) return 'paid';
  return 'unknown';
}

const tierConfig: Record<PricingTier, {
  icon: typeof Check;
  label: string;
  shortLabel: string;
  classes: string;
  iconClasses: string;
}> = {
  free: {
    icon: Check,
    label: 'Free',
    shortLabel: 'Free',
    classes: 'bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/30',
    iconClasses: 'text-emerald-600 dark:text-emerald-400',
  },
  open_source: {
    icon: Check,
    label: 'Open Source',
    shortLabel: 'OSS',
    classes: 'bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/30',
    iconClasses: 'text-emerald-600 dark:text-emerald-400',
  },
  freemium: {
    icon: Gift,
    label: 'Freemium',
    shortLabel: 'Freemium',
    classes: 'bg-amber-50 dark:bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-500/30',
    iconClasses: 'text-amber-600 dark:text-amber-400',
  },
  trial: {
    icon: Gift,
    label: 'Free Trial',
    shortLabel: 'Trial',
    classes: 'bg-amber-50 dark:bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-500/30',
    iconClasses: 'text-amber-600 dark:text-amber-400',
  },
  paid: {
    icon: CreditCard,
    label: 'Paid',
    shortLabel: 'Paid',
    classes: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700',
    iconClasses: 'text-slate-600 dark:text-slate-400',
  },
  unknown: {
    icon: CreditCard,
    label: 'Paid',
    shortLabel: 'Paid',
    classes: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700',
    iconClasses: 'text-slate-600 dark:text-slate-400',
  },
};

export default function PricingBadge({ pricing, size = 'sm', showLabel = true }: PricingBadgeProps) {
  const tier = classifyPricing(pricing);
  const config = tierConfig[tier];
  const Icon = config.icon;

  const sizeClasses = size === 'sm'
    ? 'text-[10px] px-1.5 py-0.5 gap-0.5'
    : 'text-xs px-2 py-1 gap-1';

  const iconSize = size === 'sm' ? 'w-2.5 h-2.5' : 'w-3 h-3';

  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold border whitespace-nowrap ${config.classes} ${sizeClasses}`}
      title={config.label}
    >
      <Icon className={`${iconSize} ${config.iconClasses}`} />
      {showLabel && <span>{size === 'sm' ? config.shortLabel : config.label}</span>}
    </span>
  );
}

/**
 * 用于详情页 Hero 旁的大号价格徽章
 */
export function PricingHero({ pricing, monthlyPrice }: { pricing: string; monthlyPrice?: string }) {
  const tier = classifyPricing(pricing);
  const config = tierConfig[tier];
  const Icon = config.icon;

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${config.classes}`}>
      <Icon className={`w-4 h-4 ${config.iconClasses}`} />
      <span className="text-sm font-bold">{config.label}</span>
      {monthlyPrice && (
        <span className="text-sm font-bold border-l border-current/20 pl-2 ml-0.5">
          {monthlyPrice}
        </span>
      )}
    </div>
  );
}
