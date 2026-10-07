/**
 * Tests for the plain text helpers.
 */
import { describe, expect, it } from 'vitest';

import { hasText, toPlainText } from './text';

describe('toPlainText', () => {
  it('removes tags and trims spaces', () => {
    expect(toPlainText('  <strong>Level</strong> one ')).toBe('Level one');
  });

  it('returns an empty string for markup without text', () => {
    expect(toPlainText('<br>')).toBe('');
    expect(toPlainText('   ')).toBe('');
  });
});

describe('hasText', () => {
  it('is true when there is visible text', () => {
    expect(hasText('Fractions')).toBe(true);
    expect(hasText('<em>Fractions</em>')).toBe(true);
  });

  it('is false for empty values and values with only tags', () => {
    expect(hasText('')).toBe(false);
    expect(hasText('<br>')).toBe(false);
  });
});
