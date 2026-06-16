/**
 * A/B Testing Utility for CTA Button Variants
 * Implements lightweight A/B testing without external dependencies
 */

export type CTAVariant = 'control' | 'variant_a' | 'variant_b' | 'variant_c';

export interface CTAConfig {
  text: string;
  color: 'emerald' | 'indigo' | 'slate';
  position: 'bottom' | 'middle';
}

export const CTA_VARIANTS: Record<CTAVariant, CTAConfig> = {
  control: {
    text: 'Visit Website',
    color: 'emerald',
    position: 'bottom',
  },
  variant_a: {
    text: 'Try It Free',
    color: 'emerald',
    position: 'bottom',
  },
  variant_b: {
    text: 'Get Started',
    color: 'indigo',
    position: 'bottom',
  },
  variant_c: {
    text: 'View Deals',
    color: 'slate',
    position: 'bottom',
  },
};

const STORAGE_KEY = 'ab_test_cta_variant';
const EXPIRY_DAYS = 30;

/**
 * Get or assign A/B test variant for current user
 * Uses localStorage to persist variant assignment
 */
export function getCTAVariant(): CTAConfig {
  if (typeof window === 'undefined') {
    return CTA_VARIANTS.control;
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const now = Date.now();
    
    if (stored) {
      const parsed = JSON.parse(stored);
      
      // Check if assignment has expired
      if (parsed.expiry && parsed.expiry > now) {
        return CTA_VARIANTS[parsed.variant as CTAVariant] || CTA_VARIANTS.control;
      }
    }

    // Assign new variant (equal distribution)
    const variants: CTAVariant[] = ['control', 'variant_a', 'variant_b', 'variant_c'];
    const randomIndex = Math.floor(Math.random() * variants.length);
    const assignedVariant = variants[randomIndex];

    const assignment = {
      variant: assignedVariant,
      assignedAt: now,
      expiry: now + EXPIRY_DAYS * 24 * 60 * 60 * 1000,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(assignment));
    
    return CTA_VARIANTS[assignedVariant];
  } catch {
    // localStorage unavailable or parse error, use control
    return CTA_VARIANTS.control;
  }
}

/**
 * Track CTA click event for A/B test analysis
 */
export function trackCTAClick(toolId: number, toolName: string, variant: CTAConfig): void {
  if (typeof window === 'undefined') return;

  try {
    // Store click event locally for batch upload
    const clicksKey = 'ab_test_cta_clicks';
    const existing = localStorage.getItem(clicksKey);
    const clicks = existing ? JSON.parse(existing) : [];
    
    clicks.push({
      toolId,
      toolName,
      variant: {
        text: variant.text,
        color: variant.color,
        position: variant.position,
      },
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
    });

    localStorage.setItem(clicksKey, JSON.stringify(clicks));

    // Send to API for real-time tracking
    fetch('/api/ab-test/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        toolId,
        toolName,
        variant: variant.text,
        color: variant.color,
        position: variant.position,
      }),
    }).catch(() => {
      // Silently fail - click is still stored locally
    });
  } catch {
    // Silently fail - don't break user experience
  }
}

/**
 * Get all stored CTA clicks for analysis
 */
export function getStoredCTAClicks(): Array<{
  toolId: number;
  toolName: string;
  variant: CTAConfig;
  timestamp: number;
}> {
  if (typeof window === 'undefined') return [];

  try {
    const clicksKey = 'ab_test_cta_clicks';
    const existing = localStorage.getItem(clicksKey);
    return existing ? JSON.parse(existing) : [];
  } catch {
    return [];
  }
}

/**
 * Clear stored CTA clicks (after successful upload)
 */
export function clearStoredCTAClicks(): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem('ab_test_cta_clicks');
  } catch {
    // Silently fail
  }
}
