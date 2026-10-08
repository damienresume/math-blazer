/**
 * The short facts under a level title: how many lessons, how long, and how much XP.
 *
 * Shoppers scan the closed levels to compare them, so these facts are visible
 * without opening the level. `render.php` builds the same markup for the public page.
 */
import { __, _n, sprintf } from '@wordpress/i18n';

import type { Lesson } from '../types';
import { formatMinutes, sumMinutes, sumXp } from '../utils/duration';
import { getVisibleLessons } from '../utils/lessons';

interface LevelMetaProps {
  /** The lessons of the level. */
  lessons: readonly Lesson[];
  /** Whether the XP total is shown. */
  showXp: boolean;
}

/**
 * The level meta component.
 *
 * @param props         The component props.
 * @param props.lessons The lessons of the level.
 * @param props.showXp  Whether the XP total is shown.
 *
 * @return The facts, or nothing when the level has no lessons.
 */
export default function LevelMeta({ lessons: allLessons, showXp }: LevelMetaProps) {
  // Lessons without a title are not shown on the public page, so they are not counted.
  const lessons = getVisibleLessons(allLessons);

  if (lessons.length === 0) {
    return null;
  }

  const minutes = sumMinutes(lessons);
  const xp = sumXp(lessons);

  return (
    <span className="math-blazer__meta">
      <span className="math-blazer__meta-item">
        {sprintf(
          /* translators: %d: the number of lessons in the level. */
          _n('%d lesson', '%d lessons', lessons.length, 'math-blazer'),
          lessons.length,
        )}
      </span>
      {minutes > 0 && <span className="math-blazer__meta-item">{formatMinutes(minutes)}</span>}
      {showXp && xp > 0 && (
        <span className="math-blazer__meta-item">
          {sprintf(
            /* translators: %d: the XP that the level offers. */
            __('%d XP', 'math-blazer'),
            xp,
          )}
        </span>
      )}
    </span>
  );
}
