/**
 * Checks that tell the editor what is missing in a level.
 *
 * The editor shows a notice for each problem, so a gap is found while editing and
 * not after the page is published. This file only finds the problems. The notice
 * texts are in the editor component, where they can be translated.
 */
import type { CurriculumLevelAttributes } from '../types';
import { hasText } from './text';

/**
 * The problems the editor can report for a level.
 */
export type LevelProblem = 'missing-title' | 'no-lessons' | 'untitled-lesson' | 'preview-without-url';

/**
 * The fields of a level that the checks need.
 */
export type ValidatedLevel = Pick<CurriculumLevelAttributes, 'title' | 'lessons'>;

/**
 * Finds the problems of one level.
 *
 * @param level The level to check.
 *
 * @return The problems, without duplicates, in a fixed order. Empty when the level is complete.
 */
export function getLevelProblems(level: ValidatedLevel): LevelProblem[] {
  const problems: LevelProblem[] = [];

  if (!hasText(level.title)) {
    problems.push('missing-title');
  }

  if (level.lessons.length === 0) {
    problems.push('no-lessons');
  }

  if (level.lessons.some((lesson) => lesson.title.trim() === '')) {
    problems.push('untitled-lesson');
  }

  if (level.lessons.some((lesson) => lesson.isFreePreview && lesson.previewUrl.trim() === '')) {
    problems.push('preview-without-url');
  }

  return problems;
}
