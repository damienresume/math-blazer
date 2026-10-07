/**
 * Helpers for lesson durations and course totals.
 *
 * The editor preview uses these functions for the summary bar, and the unit tests
 * check them. The public page formats the same numbers in `render.php`, and the
 * verification step compares both outputs so they cannot drift apart.
 */
import { __, sprintf } from '@wordpress/i18n';

import type { Lesson } from '../types';

/**
 * Turns a number that may be broken into a safe whole count.
 *
 * Attribute values come from saved content, so a lesson can hold a negative number,
 * a decimal, or something that is not a number at all. Every public function in this
 * file cleans its input with this helper, so one bad lesson cannot produce "NaN min"
 * in the interface.
 *
 * @param value The raw value from a lesson attribute.
 *
 * @return A whole number of zero or more.
 */
function toSafeCount(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }
  return Math.max(0, Math.round(value));
}

/**
 * Formats a minute count for display, for example "45 min", "2 h" or "1 h 30 min".
 *
 * Hours and minutes are split because long courses are easier to compare in hours.
 * The strings go through the translation functions, so other languages can reorder
 * the numbers.
 *
 * @param totalMinutes The number of minutes to format.
 *
 * @return The text to display.
 */
export function formatMinutes(totalMinutes: number): string {
  const safeMinutes = toSafeCount(totalMinutes);
  const hours = Math.floor(safeMinutes / 60);
  const minutes = safeMinutes % 60;

  if (hours === 0) {
    return sprintf(
      /* translators: %d: a number of minutes. */
      __('%d min', 'math-blazer'),
      minutes,
    );
  }

  if (minutes === 0) {
    return sprintf(
      /* translators: %d: a number of hours. */
      __('%d h', 'math-blazer'),
      hours,
    );
  }

  return sprintf(
    /* translators: 1: a number of hours. 2: a number of minutes. */
    __('%1$d h %2$d min', 'math-blazer'),
    hours,
    minutes,
  );
}

/**
 * Adds up the minutes of a list of lessons.
 *
 * @param lessons The lessons to add up. Only the minutes field is read.
 *
 * @return The total number of minutes.
 */
export function sumMinutes(lessons: readonly Pick<Lesson, 'minutes'>[]): number {
  return lessons.reduce((total, lesson) => total + toSafeCount(lesson.minutes), 0);
}

/**
 * Adds up the XP of a list of lessons.
 *
 * @param lessons The lessons to add up. Only the xp field is read.
 *
 * @return The total XP reward.
 */
export function sumXp(lessons: readonly Pick<Lesson, 'xp'>[]): number {
  return lessons.reduce((total, lesson) => total + toSafeCount(lesson.xp), 0);
}
