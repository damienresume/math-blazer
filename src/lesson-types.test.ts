/**
 * Tests for the lesson type definitions.
 *
 * The lesson types exist in two places on purpose: `data/lesson-types.json` for PHP
 * and `src/lesson-types.ts` for TypeScript. These tests fail as soon as the two
 * stop matching, which is the guarantee that lets both exist.
 */
import { describe, expect, it } from 'vitest';

import lessonTypesJson from '../data/lesson-types.json';
import { getIcon } from './icons';
import {
  DEFAULT_LESSON_TYPE,
  LESSON_TYPE_KEYS,
  LESSON_TYPE_LABELS,
  getLessonTypeIconName,
  isLessonTypeKey,
} from './lesson-types';

describe('lesson types', () => {
  it('has the same keys in the JSON file and in TypeScript, in the same order', () => {
    const jsonKeys = lessonTypesJson.types.map((entry) => entry.key);
    expect(jsonKeys).toEqual([...LESSON_TYPE_KEYS]);
  });

  it('has the same English labels in the JSON file and in TypeScript', () => {
    // The test runs without loaded translations, so LESSON_TYPE_LABELS holds the
    // English source text and must equal the labels PHP reads from the JSON file.
    // Comparing whole objects also fails when a key is missing on either side.
    const labelsFromJson = Object.fromEntries(lessonTypesJson.types.map((entry) => [entry.key, entry.label]));
    expect(labelsFromJson).toEqual(LESSON_TYPE_LABELS);
  });

  it('gives every lesson type an icon that exists in icons.json', () => {
    const missing = LESSON_TYPE_KEYS.filter((key) => {
      const iconName = getLessonTypeIconName(key);
      return iconName === undefined || getIcon(iconName) === undefined;
    });
    expect(missing).toEqual([]);
  });

  it('uses the first type of the JSON file as the default type, as PHP does', () => {
    expect(lessonTypesJson.types[0]?.key).toBe(DEFAULT_LESSON_TYPE);
  });

  it('rejects strings that are not lesson type keys', () => {
    expect(isLessonTypeKey('video')).toBe(true);
    expect(isLessonTypeKey('podcast')).toBe(false);
    expect(isLessonTypeKey('')).toBe(false);
  });
});
