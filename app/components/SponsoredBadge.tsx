/**
 * SponsoredBadge — 统一的赞助位标记组件
 *
 * 用于在工具卡片、详情页、对比页等位置一致地展示 "Sponsored" 标记，
 * 替代散落在各组件中的内联 "Sponsored" 小字。
 */

import { useTranslations } from 'next-intl';

interface SponsoredBadgeProps {
  /** 显示尺寸 */
  size?: 'sm' | 'md';
  /** 是否带图标 */
  withIcon?: boolean;
  /** 额外类名 */
  className?: string;
}

export default function SponsoredBadge({
  size = 'sm',
  withIcon = false,
  className = '',
}: SponsoredBadgeProps) {
  const t = useTranslations('common');
  const label = t('sponsored');

  const sizeClasses = {
    sm: 'text-[10px] px-1.5 py-0.5',
    md: 'text-xs px-2 py-1',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 font-medium ${sizeClasses[size]} ${className}`}
      aria-label={label}
    >
      {withIcon && <span aria-hidden="true">🏷️</span>}
      {label}
    </span>
  );
}
