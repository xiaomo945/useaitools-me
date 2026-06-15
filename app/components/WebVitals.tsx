'use client';

import { useEffect } from 'react';

export default function WebVitals() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') return;

    const sendMetric = (name: string, value: number, rating: string) => {
      const body = JSON.stringify({
        name,
        value: Math.round(value),
        rating,
        timestamp: Date.now(),
        url: window.location.href,
      });

      if (navigator.sendBeacon) {
        navigator.sendBeacon('/api/analytics', body);
      }
    };

    const getRating = (name: string, value: number): string => {
      const thresholds: Record<string, [number, number]> = {
        LCP: [2500, 4000],
        FID: [100, 300],
        INP: [200, 500],
        CLS: [0.1, 0.25],
        TTFB: [800, 1800],
        FCP: [1800, 3000],
      };
      const [good, poor] = thresholds[name] || [0, 0];
      if (value <= good) return 'good';
      if (value <= poor) return 'needs-improvement';
      return 'poor';
    };

    const observers: PerformanceObserver[] = [];

    // LCP - Largest Contentful Paint
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        if (lastEntry) {
          sendMetric('LCP', lastEntry.startTime, getRating('LCP', lastEntry.startTime));
        }
      });
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
      observers.push(lcpObserver);
    } catch {}

    // FID - First Input Delay (legacy, kept for compatibility)
    try {
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if ('processingStart' in entry) {
            const fid = (entry as PerformanceEventTiming).processingStart - entry.startTime;
            sendMetric('FID', fid, getRating('FID', fid));
          }
        });
      });
      fidObserver.observe({ type: 'first-input', buffered: true });
      observers.push(fidObserver);
    } catch {}

    // INP - Interaction to Next Paint (modern FID replacement)
    try {
      const inpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const maxDuration = entries.reduce((max, entry) => {
          const duration = (entry as PerformanceEventTiming).duration;
          return duration > max ? duration : max;
        }, 0);
        if (maxDuration > 0) {
          sendMetric('INP', maxDuration, getRating('INP', maxDuration));
        }
      });
      inpObserver.observe({ type: 'event', buffered: true });
      observers.push(inpObserver);
    } catch {}

    // CLS - Cumulative Layout Shift
    try {
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
          }
        });
        sendMetric('CLS', clsValue, getRating('CLS', clsValue));
      });
      clsObserver.observe({ type: 'layout-shift', buffered: true });
      observers.push(clsObserver);
    } catch {}

    // TTFB - Time to First Byte
    try {
      const navigationEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
      if (navigationEntries.length > 0) {
        const ttfb = navigationEntries[0].responseStart;
        sendMetric('TTFB', ttfb, getRating('TTFB', ttfb));
      }
    } catch {}

    // FCP - First Contentful Paint
    try {
      const fcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const firstEntry = entries[0];
        if (firstEntry) {
          sendMetric('FCP', firstEntry.startTime, getRating('FCP', firstEntry.startTime));
        }
      });
      fcpObserver.observe({ type: 'paint', buffered: true });
      observers.push(fcpObserver);
    } catch {}

    return () => {
      observers.forEach((obs) => obs.disconnect());
    };
  }, []);

  return null;
}
