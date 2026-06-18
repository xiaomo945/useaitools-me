import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  resolveAffiliateLink,
  hasAffiliateLink,
  getAffiliateLink,
  getDynamicCTA,
} from './affiliate';

describe('lib/affiliate', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('resolveAffiliateLink', () => {
    it('returns env link when AFFILIATE_* is set (short name)', () => {
      process.env.AFFILIATE_RYTR = 'https://rytr.me/?via=useaitools';
      const link = resolveAffiliateLink({ name: 'Rytr', affiliate_link: '' });
      expect(link).toBe('https://rytr.me/?via=useaitools');
    });

    it('returns env link when AFFILIATE_* is set (full name)', () => {
      process.env.AFFILIATE_MIDJOURNEY = 'https://midjourney.com/?ref=useaitools';
      const link = resolveAffiliateLink({ name: 'Midjourney', affiliate_link: '' });
      expect(link).toBe('https://midjourney.com/?ref=useaitools');
    });

    it('falls back to tool.affiliate_link when env not set', () => {
      const link = resolveAffiliateLink({
        name: 'Unknown Tool',
        affiliate_link: 'https://example.com/affiliate',
      });
      expect(link).toBe('https://example.com/affiliate');
    });

    it('returns empty string when no link configured', () => {
      const link = resolveAffiliateLink({ name: 'Unknown Tool', affiliate_link: '' });
      expect(link).toBe('');
    });

    it('handles null affiliate_link', () => {
      const link = resolveAffiliateLink({ name: 'Unknown Tool', affiliate_link: null });
      expect(link).toBe('');
    });
  });

  describe('hasAffiliateLink', () => {
    it('returns true when env link exists', () => {
      process.env.AFFILIATE_RYTR = 'https://rytr.me';
      expect(hasAffiliateLink({ name: 'Rytr', affiliate_link: '' })).toBe(true);
    });

    it('returns true when affiliate_link field exists', () => {
      expect(
        hasAffiliateLink({ name: 'Unknown', affiliate_link: 'https://example.com' })
      ).toBe(true);
    });

    it('returns false when no link configured', () => {
      expect(hasAffiliateLink({ name: 'Unknown', affiliate_link: '' })).toBe(false);
    });
  });

  describe('getAffiliateLink', () => {
    it('appends UTM parameters to valid URL', () => {
      process.env.AFFILIATE_RYTR = 'https://rytr.me/?via=useaitools';
      const link = getAffiliateLink({ name: 'Rytr', affiliate_link: '' });
      expect(link).toContain('utm_source=useaitools');
      expect(link).toContain('utm_medium=referral');
      expect(link).toContain('utm_campaign=staff_pick');
    });

    it('returns empty string when no link configured', () => {
      expect(getAffiliateLink({ name: 'Unknown', affiliate_link: '' })).toBe('');
    });

    it('preserves existing query params', () => {
      process.env.AFFILIATE_RYTR = 'https://rytr.me/?via=useaitools';
      const link = getAffiliateLink({ name: 'Rytr', affiliate_link: '' });
      expect(link).toContain('via=useaitools');
      expect(link).toContain('utm_source=useaitools');
    });
  });

  describe('getDynamicCTA', () => {
    it('returns "Visit Website" when no affiliate', () => {
      expect(getDynamicCTA('Free', false)).toBe('Visit Website');
    });

    it('returns "Try Free" for free tools with affiliate', () => {
      expect(getDynamicCTA('Free', true)).toBe('Try Free');
      expect(getDynamicCTA('Open Source', true)).toBe('Try Free');
    });

    it('returns "Try Free" for freemium tools with affiliate (contains "free")', () => {
      // 注意：'Freemium' 包含 'free' 子串，先匹配 free 分支
      expect(getDynamicCTA('Freemium', true)).toBe('Try Free');
    });

    it('returns "View Pricing" for paid tools with affiliate', () => {
      expect(getDynamicCTA('Paid', true)).toBe('View Pricing');
      expect(getDynamicCTA('$10/month', true)).toBe('View Pricing');
    });

    it('returns "Try It Free" as default for affiliate tools', () => {
      expect(getDynamicCTA('Custom', true)).toBe('Try It Free');
    });
  });
});
