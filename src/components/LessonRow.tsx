/**
 * One editable lesson row in the editor.
 *
 * Every field is a labelled form control. The four main fields (title, type, minutes
 * and XP) show a short label above the field, so the four fields line up in one row.
 * Each label also contains the row number as visually hidden text, so that a person
 * who hears "Title" knows which lesson it belongs to.
 */
import { Button, SelectControl, TextControl, ToggleControl, VisuallyHidden } from '@wordpress/components';
import { __, sprintf } from '@wordpress/i18n';

import { isLessonTypeKey, LESSON_TYPE_KEYS, LESSON_TYPE_LABELS } from '../lesson-types';
import type { Lesson } from '../types';
import type { MoveDirection } from '../utils/lessons';
import { parseWholeNumber } from '../utils/lessons';
import LessonTypeIcon from './LessonTypeIcon';

interface LessonRowProps {
  /** The lesson to edit. */
  lesson: Lesson;
  /** The position of the lesson in the list, starting at 1, used in the labels. */
  position: number;
  /** How many lessons the list has. The move buttons need it to turn off at the ends. */
  count: number;
  /** Called with the fields that changed. */
  onChange: (changes: Partial<Lesson>) => void;
  /** Called when the editor moves the lesson. */
  onMove: (direction: MoveDirection) => void;
  /** Called when the editor copies the lesson. */
  onDuplicate: () => void;
  /** Called when the editor removes the lesson. */
  onRemove: () => void;
}

/** The options of the lesson type select, built once from the shared type list. */
const TYPE_OPTIONS = LESSON_TYPE_KEYS.map((key) => ({
  value: key,
  label: LESSON_TYPE_LABELS[key],
}));

/**
 * The lesson row component.
 *
 * @param props             The component props.
 * @param props.lesson      The lesson to edit.
 * @param props.position    The position of the lesson, starting at 1.
 * @param props.count       How many lessons the list has.
 * @param props.onChange    Called with the fields that changed.
 * @param props.onMove      Called when the editor moves the lesson.
 * @param props.onDuplicate Called when the editor copies the lesson.
 * @param props.onRemove    Called when the editor removes the lesson.
 *
 * @return The list item with the controls.
 */
export default function LessonRow({
  lesson,
  position,
  count,
  onChange,
  onMove,
  onDuplicate,
  onRemove,
}: LessonRowProps) {
  /**
   * Builds a label that names the row, for example "Lesson 2 title".
   *
   * @param field The name of the field, for example "title".
   *
   * @return The label text.
   */
  const label = (field: string) =>
    sprintf(
      /* translators: 1: the position of the lesson, for example 2. 2: a field name such as "title" or "minutes". */
      __('Lesson %1$d %2$s', 'math-blazer'),
      position,
      field,
    );

  /**
   * Builds the label of a main field. The field name is visible. The row number
   * before it is visible to screen readers only.
   *
   * @param field The visible name of the field, for example "Minutes".
   *
   * @return The label content.
   */
  const fieldLabel = (field: string) => (
    <>
      <VisuallyHidden as="span">
        {sprintf(
          /* translators: %d: the position of the lesson, for example 2. The text is read by screen readers before the field name. */
          __('Lesson %d', 'math-blazer'),
          position,
        )}{' '}
      </VisuallyHidden>
      {field}
    </>
  );

  return (
    <li className="math-blazer__lesson math-blazer__lesson--editor">
      <div className="math-blazer__lesson-header">
        <LessonTypeIcon type={lesson.type} />
        <div className="math-blazer__lesson-actions">
          <Button
            icon="arrow-up-alt2"
            size="small"
            label={label(__('move up', 'math-blazer'))}
            disabled={position === 1}
            onClick={() => onMove('up')}
          />
          <Button
            icon="arrow-down-alt2"
            size="small"
            label={label(__('move down', 'math-blazer'))}
            disabled={position === count}
            onClick={() => onMove('down')}
          />
          <Button icon="admin-page" size="small" label={label(__('duplicate', 'math-blazer'))} onClick={onDuplicate} />
          <Button
            icon="trash"
            size="small"
            isDestructive
            label={label(__('remove', 'math-blazer'))}
            onClick={onRemove}
          />
        </div>
      </div>

      <div className="math-blazer__lesson-fields">
        <TextControl
          className="math-blazer__field math-blazer__field--title"
          label={fieldLabel(__('Title', 'math-blazer'))}
          placeholder={__('Lesson title', 'math-blazer')}
          value={lesson.title}
          onChange={(title) => onChange({ title })}
        />
        <SelectControl
          className="math-blazer__field"
          label={fieldLabel(__('Type', 'math-blazer'))}
          value={lesson.type}
          options={TYPE_OPTIONS}
          onChange={(type) => {
            if (isLessonTypeKey(type)) {
              onChange({ type });
            }
          }}
        />
        <TextControl
          className="math-blazer__field"
          label={fieldLabel(__('Minutes', 'math-blazer'))}
          type="number"
          min={0}
          value={String(lesson.minutes)}
          onChange={(value) => onChange({ minutes: parseWholeNumber(value) })}
        />
        <TextControl
          className="math-blazer__field"
          label={fieldLabel(__('XP', 'math-blazer'))}
          type="number"
          min={0}
          value={String(lesson.xp)}
          onChange={(value) => onChange({ xp: parseWholeNumber(value) })}
        />
      </div>

      <div className="math-blazer__lesson-preview">
        <ToggleControl
          label={label(__('free preview', 'math-blazer'))}
          checked={lesson.isFreePreview}
          onChange={(isFreePreview) => onChange({ isFreePreview })}
        />
        {lesson.isFreePreview && (
          <TextControl
            className="math-blazer__field math-blazer__field--url"
            label={label(__('preview address', 'math-blazer'))}
            hideLabelFromVision
            type="url"
            placeholder="https://"
            value={lesson.previewUrl}
            onChange={(previewUrl) => onChange({ previewUrl })}
          />
        )}
      </div>
    </li>
  );
}
