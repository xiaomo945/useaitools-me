import { describe, it, expect } from 'vitest';
import {
  levenshteinDistance,
  fuzzyMatchScore,
  highlightSearchTerm,
} from './fuzzySearch';

describe('lib/fuzzySearch', () => {
  describe('levenshteinDistance', () => {
    it('returns 0 for identical strings', () => {
      expect(levenshteinDistance('hello', 'hello')).toBe(0);
    });

    it('returns string length for empty vs non-empty', () => {
      expect(levenshteinDistance('', 'hello')).toBe(5);
      expect(levenshteinDistance('hello', '')).toBe(5);
    });

    it('returns 0 for two empty strings', () => {
      expect(levenshteinDistance('', '')).toBe(0);
    });

    it('calculates single substitution', () => {
      expect(levenshteinDistance('cat', 'bat')).toBe(1);
    });

    it('calculates single insertion', () => {
      expect(levenshteinDistance('cat', 'cats')).toBe(1);
    });

    it('calculates single deletion', () => {
      expect(levenshteinDistance('cats', 'cat')).toBe(1);
    });

    it('calculates multiple edits', () => {
      expect(levenshteinDistance('kitten', 'sitting')).toBe(3);
    });
  });

  describe('fuzzyMatchScore', () => {
    it('returns high score for exact match', () => {
      const score = fuzzyMatchScore('rytr', 'Rytr');
      expect(score).toBeGreaterThan(0.5);
    });

    it('returns positive score for partial match', () => {
      const score = fuzzyMatchScore('ryt', 'Rytr');
      expect(score).toBeGreaterThan(0);
    });

    it('returns 0 or negative for no match', () => {
      const score = fuzzyMatchScore('xyz', 'Rytr');
      expect(score).toBeLessThanOrEqual(0);
    });

    it('is case insensitive', () => {
      const score1 = fuzzyMatchScore('RYTR', 'Rytr');
      const score2 = fuzzyMatchScore('rytr', 'rytr');
      expect(score1).toBe(score2);
    });
  });

  describe('highlightSearchTerm', () => {
    it('wraps matched term in <mark> tag', () => {
      const result = highlightSearchTerm('Rytr is great', 'rytr');
      expect(result).toContain('<mark');
      expect(result).toContain('Rytr');
    });

    it('returns original text when no match', () => {
      const result = highlightSearchTerm('Hello world', 'xyz');
      expect(result).toBe('Hello world');
    });

    it('handles empty query', () => {
      const result = highlightSearchTerm('Hello world', '');
      expect(result).toBe('Hello world');
    });
  });
});
