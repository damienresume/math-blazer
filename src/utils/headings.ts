/**
 * Helpers for the heading level setting.
 *
 * The level titles of the accordion are real headings, so they appear in the outline
 * of the page that screen reader users navigate by. The editor picks the heading
 * level that fits the page.
 */
import type { CurriculumHeadingLevel } from '../types';

/** The heading levels the editor can choose, in the order shown in the select. */
export const HEADING_LEVELS: readonly CurriculumHeadingLevel[] = [2, 3, 4];

/** The heading level used when a saved value is missing or not allowed. */
const DEFAULT_HEADING_LEVEL: CurriculumHeadingLevel = 3;

/**
 * Turns a value from a form control or from saved content into an allowed heading level.
 *
 * A select control gives text, and saved content can hold any value. Anything that
 * is not one of the allowed levels becomes the default, so the block never prints
 * an invalid heading tag.
 *
 * @param value The raw value.
 *
 * @return One of the allowed heading levels.
 */
export function toHeadingLevel(value: unknown): CurriculumHeadingLevel {
  const number = Number(value);
  return HEADING_LEVELS.find((level) => level === number) ?? DEFAULT_HEADING_LEVEL;
}
