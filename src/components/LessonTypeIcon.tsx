/**
 * Shows a lesson type as an icon together with its text label.
 *
 * The icon alone would not be enough. People who cannot see the icon, or who do not
 * know what it means, still read the label, so the type never depends on the icon.
 */
import { getLessonTypeIconName, LESSON_TYPE_LABELS } from '../lesson-types';
import type { LessonTypeKey } from '../lesson-types';
import Icon from './Icon';

interface LessonTypeIconProps {
  /** The lesson type to show. */
  type: LessonTypeKey;
}

/**
 * The lesson type component.
 *
 * @param props      The component props.
 * @param props.type The lesson type to show.
 *
 * @return The icon and the label of the lesson type.
 */
export default function LessonTypeIcon({ type }: LessonTypeIconProps) {
  const iconName = getLessonTypeIconName(type);

  return (
    <span className={`math-blazer__lesson-type math-blazer__lesson-type--${type}`}>
      {iconName && <Icon name={iconName} className="math-blazer__icon" />}
      <span className="math-blazer__lesson-type-label">{LESSON_TYPE_LABELS[type]}</span>
    </span>
  );
}
