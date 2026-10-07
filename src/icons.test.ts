/**
 * Tests for the shared icon data.
 *
 * PHP draws these icons from the same JSON file. A broken entry would show as an
 * empty space on the public page, so the tests check that every icon has a shape.
 */
import { describe, expect, it } from 'vitest';

import iconData from '../data/icons.json';
import { getIcon } from './icons';

describe('getIcon', () => {
  it('returns the shape of a known icon', () => {
    const shield = getIcon('shield');
    expect(shield?.filled).toBe(false);
    expect(shield?.paths.length).toBeGreaterThan(0);
  });

  it('returns undefined for an unknown icon instead of throwing', () => {
    expect(getIcon('does-not-exist')).toBeUndefined();
  });
});

describe('icons.json', () => {
  it('gives every icon at least one non-empty path', () => {
    for (const [name, icon] of Object.entries(iconData.icons)) {
      expect(icon.paths.length, `${name} has no paths`).toBeGreaterThan(0);
      expect(
        icon.paths.every((path) => path.trim() !== ''),
        `${name} has an empty path`,
      ).toBe(true);
    }
  });
});
