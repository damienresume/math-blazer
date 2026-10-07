/**
 * Totals for the summary bar of the curriculum.
 *
 * The editor preview of the summary bar uses this function. The public page adds up
 * the same numbers in `includes/helpers.php`, and both follow the same rules.
 */
import type { CurriculumLevelAttributes } from '../types';
import { sumMinutes, sumXp } from './duration';
import { getVisibleLessons, normalizeLessons } from './lessons';
import { hasText } from './text';

/**
 * The fields of a level that the totals need.
 */
export type SummaryLevel = Pick<CurriculumLevelAttributes, 'title' | 'badge' | 'lessons'>;

/**
 * The numbers shown in the summary bar.
 */
export interface CurriculumSummary {
  /** How many levels the course has. */
  levelCount: number;
  /** How many lessons all levels have together. */
  lessonCount: number;
  /** The total time of all lessons, in minutes. */
  minutes: number;
  /** The total XP of all lessons. */
  xp: number;
  /** How many levels offer a badge. */
  badgeCount: number;
}

/**
 * Turns the raw attributes of a level block into the fields the totals need.
 *
 * The parent block reads its levels from the block editor store, where every
 * attribute is untyped. This function gives each field a valid value, so a level
 * with damaged data cannot break the totals of the whole course.
 *
 * @param attributes The raw attributes of a level block.
 *
 * @return The title, the badge and the repaired lessons of the level.
 */
export function toSummaryLevel(attributes: Record<string, unknown>): SummaryLevel {
  return {
    title: typeof attributes.title === 'string' ? attributes.title : '',
    badge: typeof attributes.badge === 'string' ? attributes.badge : '',
    lessons: normalizeLessons(attributes.lessons),
  };
}

/**
 * Adds up the levels of a course.
 *
 * A level without a title is not counted. The public page does not show such a level
 * at all, so the totals must not include it either.
 *
 * @param levels The levels to add up.
 *
 * @return The totals.
 */
export function summarizeLevels(levels: readonly SummaryLevel[]): CurriculumSummary {
  const visibleLevels = levels.filter((level) => hasText(level.title));
  const allLessons = visibleLevels.flatMap((level) => getVisibleLessons(level.lessons));

  return {
    levelCount: visibleLevels.length,
    lessonCount: allLessons.length,
    minutes: sumMinutes(allLessons),
    xp: sumXp(allLessons),
    badgeCount: visibleLevels.filter((level) => hasText(level.badge)).length,
  };
}
