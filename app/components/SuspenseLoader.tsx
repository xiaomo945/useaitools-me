'use client';

import { useState, useEffect, Suspense } from 'react';

// Simulates loading for demo purposes
export function DelayedSuspense({
  children,
  fallback,
  delay = 800,
}: {
  children: React.ReactNode;
  fallback: React.ReactNode;
  delay?: number;
}) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  if (isLoading) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

// Simple suspense wrapper
export function withSuspense<P extends object>(
  Component: React.ComponentType<P>,
  Fallback: React.ReactNode,
  delay?: number
) {
  return function WithSuspense(props: P) {
    return (
      <DelayedSuspense fallback={Fallback} delay={delay}>
        <Component {...props} />
      </DelayedSuspense>
    );
  };
}
