/**
 * Editor preview of the summary bar.
 *
 * The public page shows the same bar, built in `includes/helpers.php` and
 * `src/math-blazer/render.php`. The class names, the element order and the
 * texts are the same, so the editor shows what visitors will see.
 */
import { __, _n, sprintf } from '@wordpress/i18n';

import { formatMinutes } from '../utils/duration';
import type { CurriculumSummary } from '../utils/summary';

interface SummaryBarProps {
  /** The totals to show. */
  summary: CurriculumSummary;
  /** Whether the XP total is shown. */
  showXp: boolean;
  /** Whether the badge count is shown. */
  showBadges: boolean;
}

/**
 * The summary bar component.
 *
 * @param props            The component props.
 * @param props.summary    The totals to show.
 * @param props.showXp     Whether the XP total is shown.
 * @param props.showBadges Whether the badge count is shown.
 *
 * @return A list with one item for each total.
 */
export default function SummaryBar({ summary, showXp, showBadges }: SummaryBarProps) {
  const items: { key: string; text: string }[] = [
    {
      key: 'levels',
      text: sprintf(
        /* translators: %d: the number of levels in the course. */
        _n('%d level', '%d levels', summary.levelCount, 'math-blazer'),
        summary.levelCount,
      ),
    },
    {
      key: 'lessons',
      text: sprintf(
        /* translators: %d: the number of lessons in the course. */
        _n('%d lesson', '%d lessons', summary.lessonCount, 'math-blazer'),
        summary.lessonCount,
      ),
    },
    {
      key: 'time',
      text: sprintf(
        /* translators: %s: a duration such as "2 h 30 min". */
        __('%s in total', 'math-blazer'),
        formatMinutes(summary.minutes),
      ),
    },
  ];

  if (showXp) {
    items.push({
      key: 'xp',
      text: sprintf(
        /* translators: %d: the XP that the whole course offers. */
        __('%d XP to earn', 'math-blazer'),
        summary.xp,
      ),
    });
  }

  if (showBadges && summary.badgeCount > 0) {
    items.push({
      key: 'badges',
      text: sprintf(
        /* translators: %d: the number of badges the course offers. */
        _n('%d badge', '%d badges', summary.badgeCount, 'math-blazer'),
        summary.badgeCount,
      ),
    });
  }

  return (
    <ul className="math-blazer__summary" aria-label={__('Course summary', 'math-blazer')}>
      {items.map((item) => (
        <li key={item.key} className="math-blazer__summary-item">
          {item.text}
        </li>
      ))}
    </ul>
  );
}
