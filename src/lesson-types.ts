/**
 * Lesson types for TypeScript.
 *
 * The list of lesson types is defined in `data/lesson-types.json`, which PHP also
 * reads. This file adds what only TypeScript needs: a union type for the keys,
 * translated labels and a type guard. Everything else about a lesson type, such as
 * its icon, is read from the JSON file, so it is written down only once.
 */
import { __ } from '@wordpress/i18n';

import lessonTypesData from '../data/lesson-types.json';

/**
 * The lesson type keys, in display order.
 *
 * The same keys live in `data/lesson-types.json`. They are repeated here because a
 * JSON import gives TypeScript plain strings, and plain strings cannot form a union
 * type. The list is `as const`, so TypeScript turns it into the exact union of the
 * keys. The unit test in `lesson-types.test.ts` fails when this list and the JSON
 * file stop matching.
 */
export const LESSON_TYPE_KEYS = ['video', 'math-game', 'quiz', 'boss-challenge', 'worksheet'] as const;

/**
 * One of the lesson type keys, for example 'math-game'.
 */
export type LessonTypeKey = (typeof LESSON_TYPE_KEYS)[number];

/**
 * The lesson type that a new lesson starts with, and that replaces an unknown saved type.
 *
 * It is the first type in the list. PHP uses the first type of
 * `data/lesson-types.json` for the same purpose, so both languages agree.
 */
export const DEFAULT_LESSON_TYPE: LessonTypeKey = LESSON_TYPE_KEYS[0];

/**
 * Tells TypeScript that a plain string is a valid lesson type key.
 *
 * Saved content can hold any string, for example after a plugin update changes the
 * type list. Code that reads saved data uses this check before treating the string
 * as a LessonTypeKey.
 *
 * @param value The string to check.
 *
 * @return Whether the string is one of the known lesson type keys.
 */
export function isLessonTypeKey(value: string): value is LessonTypeKey {
  return (LESSON_TYPE_KEYS as readonly string[]).includes(value);
}

/**
 * The translated display label for each lesson type.
 *
 * The labels are written as literal strings because the WordPress translation tools
 * can only find literal strings. The English text must equal the `label` field in
 * `data/lesson-types.json`, and the unit test checks that. Typing the object as a
 * Record over LessonTypeKey makes TypeScript report a missing label when a key is
 * added to the list.
 */
export const LESSON_TYPE_LABELS: Record<LessonTypeKey, string> = {
  video: __('Video', 'math-blazer'),
  'math-game': __('Math game', 'math-blazer'),
  quiz: __('Quiz', 'math-blazer'),
  'boss-challenge': __('Boss challenge', 'math-blazer'),
  worksheet: __('Worksheet', 'math-blazer'),
};

/**
 * Returns the icon name of a lesson type, as written in `data/lesson-types.json`.
 *
 * @param key The lesson type key.
 *
 * @return The icon name, or undefined when the JSON file has no entry for the key.
 */
export function getLessonTypeIconName(key: LessonTypeKey): string | undefined {
  return lessonTypesData.types.find((entry) => entry.key === key)?.icon;
}
