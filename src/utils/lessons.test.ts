/**
 * Tests for the lesson list functions.
 *
 * These are the rules behind the add, copy, move and remove buttons in the editor,
 * and the repair of bad saved data.
 */
import { describe, expect, it } from 'vitest';

import {
  createLesson,
  duplicateLesson,
  getVisibleLessons,
  moveLesson,
  normalizeLesson,
  normalizeLessons,
  parseWholeNumber,
  removeLesson,
  updateLesson,
} from './lessons';

/**
 * Three lessons with fixed ids, so the tests can name them.
 *
 * @return A new list of three lessons.
 */
function sampleLessons() {
  return [
    createLesson({ id: 'a', title: 'First' }),
    createLesson({ id: 'b', title: 'Second' }),
    createLesson({ id: 'c', title: 'Third' }),
  ];
}

/**
 * The ids of a lesson list, in order.
 *
 * @param lessons The lessons to read the ids from.
 *
 * @return The ids in the same order as the lessons.
 */
function ids(lessons: readonly { id: string }[]) {
  return lessons.map((lesson) => lesson.id);
}

describe('createLesson', () => {
  it('creates a lesson with defaults and its own id', () => {
    const first = createLesson();
    const second = createLesson();

    expect(first.type).toBe('video');
    expect(first.minutes).toBe(10);
    expect(first.xp).toBe(10);
    expect(first.isFreePreview).toBe(false);
    expect(first.id).not.toBe(second.id);
  });

  it('applies overrides', () => {
    expect(createLesson({ title: 'Boss', type: 'boss-challenge' })).toMatchObject({
      title: 'Boss',
      type: 'boss-challenge',
    });
  });
});

describe('normalizeLesson', () => {
  it('keeps a valid lesson unchanged', () => {
    const lesson = createLesson({ id: 'x', title: 'Fractions', xp: 40 });
    expect(normalizeLesson(lesson, 0)).toEqual(lesson);
  });

  it('repairs missing and wrong fields', () => {
    expect(normalizeLesson({ title: 5, type: 'podcast', minutes: '25', xp: -3 }, 4)).toEqual({
      id: 'lesson-4',
      title: '',
      type: 'video',
      minutes: 25,
      xp: 0,
      isFreePreview: false,
      previewUrl: '',
    });
  });

  it('treats a value that is not an object as an empty lesson', () => {
    expect(normalizeLesson(null, 0).id).toBe('lesson-0');
    expect(normalizeLesson('text', 1).id).toBe('lesson-1');
  });
});

describe('normalizeLessons', () => {
  it('returns an empty list when the value is not a list', () => {
    expect(normalizeLessons(undefined)).toEqual([]);
    expect(normalizeLessons({ a: 1 })).toEqual([]);
  });

  it('repairs every lesson in a list', () => {
    expect(normalizeLessons([{}, { id: 'k' }]).map((l) => l.id)).toEqual(['lesson-0', 'k']);
  });
});

describe('parseWholeNumber', () => {
  it('parses numbers from input text', () => {
    expect(parseWholeNumber('45')).toBe(45);
    expect(parseWholeNumber('12.6')).toBe(13);
  });

  it('turns empty, negative and invalid input into zero', () => {
    expect(parseWholeNumber('')).toBe(0);
    expect(parseWholeNumber('-4')).toBe(0);
    expect(parseWholeNumber('abc')).toBe(0);
  });
});

describe('updateLesson', () => {
  it('changes only the lesson with the given id', () => {
    const updated = updateLesson(sampleLessons(), 'b', {
      title: 'Changed',
    });
    expect(updated.map((lesson) => lesson.title)).toEqual(['First', 'Changed', 'Third']);
  });

  it('does not change the list it receives', () => {
    const lessons = sampleLessons();
    updateLesson(lessons, 'a', { title: 'Changed' });
    expect(lessons[0]?.title).toBe('First');
  });
});

describe('moveLesson', () => {
  it('moves a lesson up and down', () => {
    expect(ids(moveLesson(sampleLessons(), 'b', 'up'))).toEqual(['b', 'a', 'c']);
    expect(ids(moveLesson(sampleLessons(), 'b', 'down'))).toEqual(['a', 'c', 'b']);
  });

  it('keeps the order at the ends of the list', () => {
    expect(ids(moveLesson(sampleLessons(), 'a', 'up'))).toEqual(['a', 'b', 'c']);
    expect(ids(moveLesson(sampleLessons(), 'c', 'down'))).toEqual(['a', 'b', 'c']);
  });

  it('keeps the order when the id is unknown', () => {
    expect(ids(moveLesson(sampleLessons(), 'zzz', 'up'))).toEqual(['a', 'b', 'c']);
  });
});

describe('duplicateLesson', () => {
  it('places a copy with a new id after the original', () => {
    const result = duplicateLesson(sampleLessons(), 'b');

    expect(result).toHaveLength(4);
    expect(result[1]?.id).toBe('b');
    expect(result[2]?.title).toBe('Second');
    expect(result[2]?.id).not.toBe('b');
  });

  it('returns the same lessons when the id is unknown', () => {
    expect(ids(duplicateLesson(sampleLessons(), 'zzz'))).toEqual(['a', 'b', 'c']);
  });
});

describe('removeLesson', () => {
  it('removes the lesson with the given id', () => {
    expect(ids(removeLesson(sampleLessons(), 'b'))).toEqual(['a', 'c']);
  });
});

describe('getVisibleLessons', () => {
  it('keeps lessons with a title and drops lessons without one', () => {
    const lessons = [
      createLesson({ id: 'a', title: 'Shown' }),
      createLesson({ id: 'b', title: '' }),
      createLesson({ id: 'c', title: '   ' }),
    ];

    expect(ids(getVisibleLessons(lessons))).toEqual(['a']);
  });
});
