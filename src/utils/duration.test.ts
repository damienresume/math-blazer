/**
 * Tests for the duration formatting and totals helpers.
 *
 * These cover the numbers in the editor summary bar. The same rules are written in
 * render.php for the public page, and the verification step compares both outputs.
 */
import { describe, expect, it } from 'vitest';

import { formatMinutes, sumMinutes, sumXp } from './duration';

describe('formatMinutes', () => {
  it('formats less than one hour as minutes', () => {
    expect(formatMinutes(0)).toBe('0 min');
    expect(formatMinutes(45)).toBe('45 min');
    expect(formatMinutes(59)).toBe('59 min');
  });

  it('formats whole hours without a minutes part', () => {
    expect(formatMinutes(60)).toBe('1 h');
    expect(formatMinutes(120)).toBe('2 h');
  });

  it('formats mixed values as hours and minutes', () => {
    expect(formatMinutes(90)).toBe('1 h 30 min');
    expect(formatMinutes(61)).toBe('1 h 1 min');
  });

  it('treats broken input as zero instead of printing NaN', () => {
    expect(formatMinutes(-15)).toBe('0 min');
    expect(formatMinutes(Number.NaN)).toBe('0 min');
    expect(formatMinutes(Number.POSITIVE_INFINITY)).toBe('0 min');
  });

  it('rounds decimals to whole minutes', () => {
    expect(formatMinutes(44.6)).toBe('45 min');
  });
});

describe('sumMinutes', () => {
  it('adds up the minutes of all lessons', () => {
    const lessons = [{ minutes: 10 }, { minutes: 25 }, { minutes: 5 }];
    expect(sumMinutes(lessons)).toBe(40);
  });

  it('ignores broken values instead of breaking the total', () => {
    const lessons = [{ minutes: 10 }, { minutes: Number.NaN }, { minutes: -5 }];
    expect(sumMinutes(lessons)).toBe(10);
  });

  it('returns zero for an empty list', () => {
    expect(sumMinutes([])).toBe(0);
  });
});

describe('sumXp', () => {
  it('adds up the XP of all lessons', () => {
    const lessons = [{ xp: 10 }, { xp: 50 }, { xp: 15 }];
    expect(sumXp(lessons)).toBe(75);
  });

  it('returns zero for an empty list', () => {
    expect(sumXp([])).toBe(0);
  });
});
