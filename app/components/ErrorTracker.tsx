'use client';

import { useEffect } from 'react';

interface ErrorReport {
  message: string;
  stack?: string;
  url: string;
  userAgent: string;
  timestamp: string;
  type: string;
}

export default function ErrorTracker() {
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      const report: ErrorReport = {
        message: event.message,
        stack: event.error?.stack,
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        type: 'uncaught_exception',
      };
      sendErrorReport(report);
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason;
      const report: ErrorReport = {
        message: reason?.message || String(reason),
        stack: reason?.stack,
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        type: 'unhandled_rejection',
      };
      sendErrorReport(report);
    };

    const sendErrorReport = (report: ErrorReport) => {
      // 使用 sendBeacon 确保页面卸载时也能发送
      if (navigator.sendBeacon) {
        const blob = new Blob([JSON.stringify(report)], { type: 'application/json' });
        navigator.sendBeacon('/api/analytics/errors', blob);
      }

      // 开发环境日志
      if (process.env.NODE_ENV === 'development') {
        console.error('[ErrorTracker]', report.type, report.message);
      }
    };

    // 监听全局错误
    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  return null;
}
