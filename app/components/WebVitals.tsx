'use client';

import { useEffect } from 'react';

export default function WebVitals() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') return;

    const sendMetric = (name: string, value: number) => {
      const body = JSON.stringify({
        name,
        value,
        timestamp: Date.now(),
        url: window.location.href,
      });

      if (navigator.sendBeacon) {
        navigator.sendBeacon('/api/analytics', body);
      }
    };

    // LCP - Largest Contentful Paint
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      if (lastEntry) {
        sendMetric('LCP', lastEntry.startTime);
      }
    });
    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });

    // FID - First Input Delay
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if ('processingStart' in entry) {
          const fid = (entry as any).processingStart - entry.startTime;
          sendMetric('FID', fid);
        }
      });
    });
    fidObserver.observe({ type: 'first-input', buffered: true });

    // CLS - Cumulative Layout Shift
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (!(entry as any).hadRecentInput) {
          clsValue += (entry as any).value;
        }
      });
      sendMetric('CLS', clsValue);
    });
    clsObserver.observe({ type: 'layout-shift', buffered: true });

    // TTFB - Time to First Byte
    const navigationEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
    if (navigationEntries.length > 0) {
      sendMetric('TTFB', navigationEntries[0].responseStart);
    }

    return () => {
      lcpObserver.disconnect();
      fidObserver.disconnect();
      clsObserver.disconnect();
    };
  }, []);

  return null;
}
