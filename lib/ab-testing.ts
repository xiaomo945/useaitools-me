/**
 * A/B Testing Utility
 * 
 * Simple client-side A/B testing with localStorage persistence.
 * Each test is identified by a unique key and has two variants.
 */

/**
 * Get or assign a variant for an A/B test.
 * Variant is persisted in localStorage so the same user always sees the same variant.
 */
export function getAbVariant(testKey: string): 'A' | 'B' {
  if (typeof window === 'undefined') return 'A'; // SSR fallback
  
  const storageKey = `ab_${testKey}`;
  
  // Check if user already has a variant assigned
  const stored = localStorage.getItem(storageKey);
  if (stored === 'A' || stored === 'B') {
    return stored;
  }
  
  // Assign new variant randomly (50/50 split)
  const variant = Math.random() < 0.5 ? 'A' : 'B';
  localStorage.setItem(storageKey, variant);
  
  return variant;
}

/**
 * Track an A/B test impression
 */
export function trackAbImpression(testKey: string, variant: 'A' | 'B', element: string) {
  // In a real implementation, this would send to an analytics service
  if (typeof window !== 'undefined') {
    console.log(`[A/B Test] ${testKey} - ${variant} - impression - ${element}`);
  }
}

/**
 * Track an A/B test conversion
 */
export function trackAbConversion(testKey: string, variant: 'A' | 'B', element: string) {
  // In a real implementation, this would send to an analytics service
  if (typeof window !== 'undefined') {
    console.log(`[A/B Test] ${testKey} - ${variant} - conversion - ${element}`);
  }
}
