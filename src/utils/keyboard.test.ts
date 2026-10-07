/**
 * Tests for the keyboard movement helper.
 *
 * These cover the WAI-ARIA accordion keyboard rules: arrows move between headers
 * with wrap around, and Home and End jump to the first and last header.
 */
import { describe, expect, it } from 'vitest';

import { isAccordionKey, nextHeaderIndex } from './keyboard';

describe('isAccordionKey', () => {
  it('accepts the four accordion keys', () => {
    expect(isAccordionKey('ArrowUp')).toBe(true);
    expect(isAccordionKey('ArrowDown')).toBe(true);
    expect(isAccordionKey('Home')).toBe(true);
    expect(isAccordionKey('End')).toBe(true);
  });

  it('ignores every other key, so typing and tabbing keep working', () => {
    expect(isAccordionKey('Tab')).toBe(false);
    expect(isAccordionKey('Enter')).toBe(false);
    expect(isAccordionKey('a')).toBe(false);
    expect(isAccordionKey('ArrowLeft')).toBe(false);
  });
});

describe('nextHeaderIndex', () => {
  it('moves down to the next header', () => {
    expect(nextHeaderIndex(0, 3, 'ArrowDown')).toBe(1);
    expect(nextHeaderIndex(1, 3, 'ArrowDown')).toBe(2);
  });

  it('moves up to the previous header', () => {
    expect(nextHeaderIndex(2, 3, 'ArrowUp')).toBe(1);
    expect(nextHeaderIndex(1, 3, 'ArrowUp')).toBe(0);
  });

  it('wraps around at both ends', () => {
    expect(nextHeaderIndex(2, 3, 'ArrowDown')).toBe(0);
    expect(nextHeaderIndex(0, 3, 'ArrowUp')).toBe(2);
  });

  it('jumps to the first and last header with Home and End', () => {
    expect(nextHeaderIndex(1, 3, 'Home')).toBe(0);
    expect(nextHeaderIndex(1, 3, 'End')).toBe(2);
  });

  it('clamps an out of range current index before moving', () => {
    expect(nextHeaderIndex(99, 3, 'ArrowDown')).toBe(0);
    expect(nextHeaderIndex(-5, 3, 'ArrowUp')).toBe(2);
  });

  it('returns zero when there are no headers', () => {
    expect(nextHeaderIndex(0, 0, 'ArrowDown')).toBe(0);
  });
});
