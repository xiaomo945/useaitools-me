'use client';

import { useEffect } from 'react';
import { onCLS, onLCP, onTTFB, onINP } from 'web-vitals';

interface MetricData {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  id: string;
  navigationType: string;
  attribution?: Record<string, any>;
}

export default function WebVitals() {
  useEffect(() => {
    const sendMetric = (metric: MetricData) => {
      // 发送到分析 API
      if (navigator.sendBeacon) {
        const blob = new Blob([JSON.stringify({
          name: metric.name,
          value: metric.value,
          rating: metric.rating,
          delta: metric.delta,
          id: metric.id,
          navigationType: metric.navigationType,
          url: window.location.href,
          timestamp: new Date().toISOString(),
        })], { type: 'application/json' });
        
        navigator.sendBeacon('/api/analytics/web-vitals', blob);
      }

      // 开发环境日志
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Web Vitals] ${metric.name}: ${metric.value.toFixed(2)} (${metric.rating})`);
      }
    };

    // Cumulative Layout Shift (CLS)
    onCLS(sendMetric);

    // Largest Contentful Paint (LCP)
    onLCP(sendMetric);

    // Time to First Byte (TTFB)
    onTTFB(sendMetric);

    // Interaction to Next Paint (INP) - 替代 FID
    onINP(sendMetric);
  }, []);

  return null;
}
