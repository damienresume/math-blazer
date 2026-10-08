/**
 * Shows a notice in the editor for each problem of a level.
 *
 * The notices appear only in the editor. They help the editor finish the level
 * before publishing. The public page does not show them.
 */
import { Notice } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import type { LevelProblem } from '../utils/validation';

/**
 * The text of each problem. The texts are literal strings so that the WordPress
 * translation tools can find them. Typing the object as a Record over LevelProblem
 * makes TypeScript report a missing text when a new problem is added.
 */
const PROBLEM_MESSAGES: Record<LevelProblem, string> = {
  'missing-title': __('This level has no title, so it is hidden on the public page.', 'math-blazer'),
  'no-lessons': __('This level has no lessons yet. Add at least one lesson.', 'math-blazer'),
  'untitled-lesson': __('One or more lessons have no title.', 'math-blazer'),
  'preview-without-url': __(
    'A free preview needs an address. Add the address or turn the free preview off.',
    'math-blazer',
  ),
};

interface ProblemNoticesProps {
  /** The problems to show. */
  problems: readonly LevelProblem[];
}

/**
 * The problem notices component.
 *
 * @param props          The component props.
 * @param props.problems The problems to show.
 *
 * @return One notice for each problem, or nothing when there are none.
 */
export default function ProblemNotices({ problems }: ProblemNoticesProps) {
  if (problems.length === 0) {
    return null;
  }

  return (
    <div className="math-blazer__notices">
      {problems.map((problem) => (
        <Notice key={problem} status="warning" isDismissible={false}>
          {PROBLEM_MESSAGES[problem]}
        </Notice>
      ))}
    </div>
  );
}
