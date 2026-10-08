/**
 * The editable list of lessons inside a level.
 *
 * The list owns no data. It receives the lessons and a callback, and every button
 * calls a pure function from `utils/lessons.ts` and passes the new list to the
 * callback. The level block then saves the list in its attributes.
 */
import { Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import type { Lesson } from '../types';
import { createLesson, duplicateLesson, moveLesson, removeLesson, updateLesson } from '../utils/lessons';
import LessonRow from './LessonRow';

interface LessonListProps {
  /** The lessons to edit. */
  lessons: readonly Lesson[];
  /** Called with the new list after every change. */
  onChange: (lessons: Lesson[]) => void;
}

/**
 * The lesson list component.
 *
 * @param props          The component props.
 * @param props.lessons  The lessons to edit.
 * @param props.onChange Called with the new list after every change.
 *
 * @return The list of lesson rows with an add button.
 */
export default function LessonList({ lessons, onChange }: LessonListProps) {
  return (
    <div className="math-blazer__lessons-editor">
      {lessons.length > 0 && (
        <ul className="math-blazer__lessons">
          {lessons.map((lesson, index) => (
            <LessonRow
              key={lesson.id}
              lesson={lesson}
              position={index + 1}
              count={lessons.length}
              onChange={(changes) => onChange(updateLesson(lessons, lesson.id, changes))}
              onMove={(direction) => onChange(moveLesson(lessons, lesson.id, direction))}
              onDuplicate={() => onChange(duplicateLesson(lessons, lesson.id))}
              onRemove={() => onChange(removeLesson(lessons, lesson.id))}
            />
          ))}
        </ul>
      )}
      <Button variant="secondary" icon="plus-alt2" onClick={() => onChange([...lessons, createLesson()])}>
        {__('Add lesson', 'math-blazer')}
      </Button>
    </div>
  );
}
