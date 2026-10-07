/**
 * Tests for the id generator.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';

import { createId } from './id';

describe('createId', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns a different id on every call', () => {
    const ids = new Set(Array.from({ length: 100 }, () => createId()));
    expect(ids.size).toBe(100);
  });

  it('uses crypto.randomUUID when the browser provides it', () => {
    vi.stubGlobal('crypto', { randomUUID: () => 'fixed-id' });
    expect(createId()).toBe('fixed-id');
  });

  it('falls back to a generated id on pages without crypto.randomUUID', () => {
    vi.stubGlobal('crypto', {});
    expect(createId()).toMatch(/^[a-z0-9]+-[a-z0-9]+$/);
  });
});
