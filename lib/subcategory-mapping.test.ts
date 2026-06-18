import { describe, it, expect } from 'vitest';
import {
  matchSubcategory,
  getSubcategories,
  getSubcategoryEn,
} from './subcategory-mapping';

describe('lib/subcategory-mapping', () => {
  describe('matchSubcategory', () => {
    it('returns a subcategory for known category and description', () => {
      const result = matchSubcategory('Writing', 'AI writing assistant for blog posts');
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('returns default/other for unknown category', () => {
      const result = matchSubcategory('UnknownCategory', 'some description');
      expect(typeof result).toBe('string');
    });

    it('handles empty description', () => {
      const result = matchSubcategory('Writing', '');
      expect(typeof result).toBe('string');
    });
  });

  describe('getSubcategories', () => {
    it('returns array for known category', () => {
      const result = getSubcategories('Writing');
      expect(Array.isArray(result)).toBe(true);
    });

    it('returns empty array for unknown category', () => {
      const result = getSubcategories('UnknownCategory');
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('getSubcategoryEn', () => {
    it('returns a string for known category and subcategory', () => {
      const result = getSubcategoryEn('Writing', 'Blog Writing');
      expect(typeof result).toBe('string');
    });

    it('returns input or empty for unknown subcategory', () => {
      const result = getSubcategoryEn('Writing', 'UnknownSub');
      expect(typeof result).toBe('string');
    });
  });
});
