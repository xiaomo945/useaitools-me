'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface ABTestConfig {
  id: string;
  name: string;
  variants: {
    id: string;
    weight: number; // 0-100
    value: any;
  }[];
  startDate: string;
  endDate?: string;
}

interface ABTestContextType {
  getVariant: (testId: string) => string | null;
  trackConversion: (testId: string, variantId: string, metric: string) => void;
  activeTests: ABTestConfig[];
}

const ABTestContext = createContext<ABTestContextType | null>(null);

// Predefined A/B tests
const AB_TESTS: ABTestConfig[] = [
  {
    id: 'cta-button-text',
    name: 'CTA Button Text Test',
    variants: [
      { id: 'control', weight: 50, value: 'Visit Website' },
      { id: 'variant-a', weight: 25, value: 'Try It Free' },
      { id: 'variant-b', weight: 25, value: 'Get Started' },
    ],
    startDate: '2026-06-14',
  },
  {
    id: 'cta-button-color',
    name: 'CTA Button Color Test',
    variants: [
      { id: 'control', weight: 50, value: 'emerald-600' },
      { id: 'variant-a', weight: 25, value: 'indigo-600' },
      { id: 'variant-b', weight: 25, value: 'slate-800' },
    ],
    startDate: '2026-06-14',
  },
];

export function ABTestProvider({ children }: { children: ReactNode }) {
  const [assignments, setAssignments] = useState<Record<string, string>>({});

  // Load assignments from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('ab-test-assignments');
    if (stored) {
      setAssignments(JSON.parse(stored));
    }
  }, []);

  // Assign variant for a test
  const assignVariant = (testId: string): string => {
    const test = AB_TESTS.find((t) => t.id === testId);
    if (!test) return 'control';

    // Check if already assigned
    if (assignments[testId]) {
      return assignments[testId];
    }

    // Random assignment based on weights
    const rand = Math.random() * 100;
    let cumulative = 0;
    let assigned = 'control';

    for (const variant of test.variants) {
      cumulative += variant.weight;
      if (rand <= cumulative) {
        assigned = variant.id;
        break;
      }
    }

    // Save assignment
    const newAssignments = { ...assignments, [testId]: assigned };
    setAssignments(newAssignments);
    localStorage.setItem('ab-test-assignments', JSON.stringify(newAssignments));

    // Track assignment
    fetch('/api/ab-test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        testId,
        variantId: assigned,
        event: 'assignment',
      }),
    }).catch(console.error);

    return assigned;
  };

  const getVariant = (testId: string): string | null => {
    return assignments[testId] || assignVariant(testId);
  };

  const trackConversion = (testId: string, variantId: string, metric: string) => {
    fetch('/api/ab-test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        testId,
        variantId,
        event: 'conversion',
        metric,
      }),
    }).catch(console.error);
  };

  return (
    <ABTestContext.Provider
      value={{
        getVariant,
        trackConversion,
        activeTests: AB_TESTS,
      }}
    >
      {children}
    </ABTestContext.Provider>
  );
}

export function useABTest() {
  const context = useContext(ABTestContext);
  if (!context) {
    throw new Error('useABTest must be used within an ABTestProvider');
  }
  return context;
}

// Helper hook for specific tests
export function useVariant(testId: string): string | null {
  const { getVariant } = useABTest();
  return getVariant(testId);
}
