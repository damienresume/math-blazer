/**
 * Tests for the heading level helper.
 */
import { describe, expect, it } from 'vitest';

import { HEADING_LEVELS, toHeadingLevel } from './headings';

describe('toHeadingLevel', () => {
  it('accepts the allowed levels as numbers and as text', () => {
    expect(toHeadingLevel(2)).toBe(2);
    expect(toHeadingLevel('4')).toBe(4);
  });

  it('uses level 3 for values that are not allowed', () => {
    expect(toHeadingLevel(1)).toBe(3);
    expect(toHeadingLevel(6)).toBe(3);
    expect(toHeadingLevel('abc')).toBe(3);
    expect(toHeadingLevel(undefined)).toBe(3);
  });

  it('never allows a level above 2 as the page title level', () => {
    expect(HEADING_LEVELS).not.toContain(1);
  });
});
