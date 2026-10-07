/**
 * Pure functions for the lesson list of a level.
 *
 * The editor components call these functions and pass the result to
 * `setAttributes()`. Keeping the list logic here, away from React, means the rules
 * (what a new lesson looks like, how rows move, how bad saved data is repaired) can
 * be tested without a browser. Every function returns a new array and never changes
 * the one it receives, because the block editor needs a new array to see a change.
 */
import { DEFAULT_LESSON_TYPE, isLessonTypeKey } from '../lesson-types';
import type { Lesson } from '../types';
import { createId } from './id';

/** The minutes a new lesson starts with. Editors change it for each lesson. */
const DEFAULT_MINUTES = 10;

/** The XP a new lesson starts with. Editors change it for each lesson. */
const DEFAULT_XP = 10;

/**
 * Creates a new lesson with sensible starting values.
 *
 * @param overrides Values that replace the defaults.
 *
 * @return A new lesson with its own id.
 */
export function createLesson(overrides: Partial<Lesson> = {}): Lesson {
  return {
    id: createId(),
    title: '',
    type: DEFAULT_LESSON_TYPE,
    minutes: DEFAULT_MINUTES,
    xp: DEFAULT_XP,
    isFreePreview: false,
    previewUrl: '',
    ...overrides,
  };
}

/**
 * Tells TypeScript that a value is a plain object whose keys can be read.
 *
 * @param value The value to check.
 *
 * @return Whether the value is an object that is not null and not an array.
 */
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Reads a text value and falls back to an empty string.
 *
 * @param value The raw value.
 *
 * @return The value when it is a string, otherwise an empty string.
 */
function toText(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

/**
 * Reads a whole number of zero or more and falls back to zero.
 *
 * @param value The raw value. Numbers and numeric strings are both accepted.
 *
 * @return A whole number of zero or more.
 */
function toCount(value: unknown): number {
  const number = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(number) ? Math.max(0, Math.round(number)) : 0;
}

/**
 * Turns the text of a number input into a whole number.
 *
 * An empty or invalid input becomes zero, which hides the minutes or the XP chip.
 *
 * @param input The text from an input field.
 *
 * @return A whole number of zero or more.
 */
export function parseWholeNumber(input: string): number {
  return toCount(input);
}

/**
 * Repairs one lesson that came from saved content.
 *
 * The `lessons` attribute is stored as plain JSON, so nothing stops it from holding
 * a lesson with a missing field or a wrong type, for example after a manual edit in
 * the code editor. This function gives every field a valid value, so the editor never
 * has to guard against bad data.
 *
 * @param raw   The raw lesson from the attribute.
 * @param index The position of the lesson, used to build an id when the lesson has none.
 *
 * @return A complete, valid lesson.
 */
export function normalizeLesson(raw: unknown, index: number): Lesson {
  const record = isRecord(raw) ? raw : {};
  const type = toText(record.type);
  const id = toText(record.id);

  return {
    // A fixed fallback id keeps React keys stable between renders.
    id: id !== '' ? id : `lesson-${index}`,
    title: toText(record.title),
    type: isLessonTypeKey(type) ? type : DEFAULT_LESSON_TYPE,
    minutes: toCount(record.minutes),
    xp: toCount(record.xp),
    isFreePreview: record.isFreePreview === true,
    previewUrl: toText(record.previewUrl),
  };
}

/**
 * Repairs the whole lesson list that came from saved content.
 *
 * @param raw The raw value of the `lessons` attribute.
 *
 * @return A list of complete, valid lessons. A value that is not a list gives an empty list.
 */
export function normalizeLessons(raw: unknown): Lesson[] {
  return Array.isArray(raw) ? raw.map(normalizeLesson) : [];
}

/**
 * Keeps only the lessons that visitors will see: the lessons that have a title.
 *
 * A lesson without a title would show an empty row, so the public page leaves it out,
 * and the totals do not count it. The editor warns about such a lesson.
 *
 * PHP copy: `sanitize_lessons()` in `includes/helpers.php`.
 *
 * @param lessons The lessons to filter.
 *
 * @return A new list without the untitled lessons.
 */
export function getVisibleLessons(lessons: readonly Lesson[]): Lesson[] {
  return lessons.filter((lesson) => lesson.title.trim() !== '');
}

/**
 * Changes some fields of one lesson.
 *
 * @param lessons The current lessons.
 * @param id      The id of the lesson to change.
 * @param changes The fields to change.
 *
 * @return A new list with the changed lesson.
 */
export function updateLesson(lessons: readonly Lesson[], id: string, changes: Partial<Lesson>): Lesson[] {
  return lessons.map((lesson) => (lesson.id === id ? { ...lesson, ...changes } : lesson));
}

/**
 * The directions in which a lesson can move.
 */
export type MoveDirection = 'up' | 'down';

/**
 * Moves one lesson one place up or down.
 *
 * A lesson that is already at the start or the end of the list stays where it is.
 *
 * @param lessons   The current lessons.
 * @param id        The id of the lesson to move.
 * @param direction The direction to move in.
 *
 * @return A new list with the lesson moved.
 */
export function moveLesson(lessons: readonly Lesson[], id: string, direction: MoveDirection): Lesson[] {
  const index = lessons.findIndex((lesson) => lesson.id === id);
  const target = direction === 'up' ? index - 1 : index + 1;
  const next = [...lessons];

  if (index === -1 || target < 0 || target >= lessons.length) {
    return next;
  }

  const moved = next[index];
  const neighbor = next[target];
  if (!moved || !neighbor) {
    return next;
  }

  next[index] = neighbor;
  next[target] = moved;
  return next;
}

/**
 * Copies one lesson and places the copy directly after the original.
 *
 * The copy gets a new id, so the two rows can be changed independently.
 *
 * @param lessons The current lessons.
 * @param id      The id of the lesson to copy.
 *
 * @return A new list that includes the copy.
 */
export function duplicateLesson(lessons: readonly Lesson[], id: string): Lesson[] {
  const index = lessons.findIndex((lesson) => lesson.id === id);
  const original = lessons[index];

  if (!original) {
    return [...lessons];
  }

  return [...lessons.slice(0, index + 1), { ...original, id: createId() }, ...lessons.slice(index + 1)];
}

/**
 * Removes one lesson.
 *
 * @param lessons The current lessons.
 * @param id      The id of the lesson to remove.
 *
 * @return A new list without the lesson.
 */
export function removeLesson(lessons: readonly Lesson[], id: string): Lesson[] {
  return lessons.filter((lesson) => lesson.id !== id);
}
