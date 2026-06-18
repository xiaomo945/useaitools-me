/**
 * 日期与数字格式化工具（单一真源）
 * 消除全项目 formatDate / formatRelativeDate / formatNumber 的重复实现。
 */

/**
 * 绝对日期格式化：如 "Jun 18, 2026"
 */
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * 相对日期格式化：如 "Just now"、"5m ago"、"2h ago"、"3d ago"，超过 7 天回退绝对日期。
 */
export function formatRelativeDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  if (diff < 60_000) return 'Just now';
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  if (diff < 604_800_000) return `${Math.floor(diff / 86_400_000)}d ago`;
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * 数字千分位格式化：如 12345 → "12,345"
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}
