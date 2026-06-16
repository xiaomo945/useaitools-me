'use client';

import { useEffect } from 'react';

export default function AccessibilityAudit() {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      Promise.all([
        import('@axe-core/react'),
        import('react'),
        import('react-dom'),
      ]).then(([axeModule, React, ReactDOM]) => {
        const axe = axeModule.default;
        axe(React, ReactDOM, 1000);
      }).catch(() => {
        // Silently fail in production
      });
    }
  }, []);

  return null;
}
