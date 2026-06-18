/**
 * 转化追踪工具
 * 与 Plausible 自定义事件集成，同时支持 dataLayer (Google Tag Manager)
 */

declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: Record<string, string | number> }) => void;
    dataLayer?: Array<Record<string, unknown>>;
  }
}

export type TrackEvent =
  | 'search'
  | 'filter'
  | 'tool_click'
  | 'compare'
  | 'save'
  | 'blog_read'
  | 'cta_click'
  | 'ab_variant_view'
  | 'gold_picks_click'
  | 'share';

interface TrackOptions {
  tool_name?: string;
  category?: string;
  query?: string;
  ab_variant?: string;
  cta_text?: string;
  position?: string;
  [key: string]: string | number | undefined;
}

/**
 * 追踪事件
 */
export function track(event: TrackEvent, props?: TrackOptions): void {
  if (typeof window === 'undefined') return;

  // Plausible
  if (window.plausible) {
    window.plausible(event, { props: props as Record<string, string | number> });
  }

  // GTM dataLayer
  if (window.dataLayer) {
    window.dataLayer.push({
      event,
      ...props,
      timestamp: new Date().toISOString(),
    });
  }

  // 开发环境日志
  if (process.env.NODE_ENV === 'development') {
    console.log('[Track]', event, props);
  }
}

/**
 * 追踪 CTA 按钮点击
 */
export function trackCtaClick(toolName: string, ctaText: string, position: string, isAffiliate: boolean): void {
  track('cta_click', {
    tool_name: toolName,
    cta_text: ctaText,
    position,
    is_affiliate: isAffiliate ? '1' : '0',
  });
}

/**
 * 追踪 Gold Picks 推荐点击
 */
export function trackGoldPicksClick(toolName: string, rank: number): void {
  track('gold_picks_click', {
    tool_name: toolName,
    rank: rank + 1,
  });
}

/**
 * 追踪 A/B 测试变体曝光
 */
export function trackAbVariantView(experimentId: string, variant: string): void {
  track('ab_variant_view', {
    ab_variant: `${experimentId}:${variant}`,
  });
}
