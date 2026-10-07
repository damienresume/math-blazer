/**
 * Tests for the summary totals.
 */
import { describe, expect, it } from 'vitest';

import { createLesson } from './lessons';
import { summarizeLevels, toSummaryLevel } from './summary';

describe('toSummaryLevel', () => {
  it('reads the fields of a level and repairs the lessons', () => {
    const level = toSummaryLevel({
      title: 'Level 1',
      badge: 'Knight',
      lessons: [{ id: 'a', title: 'Lesson', minutes: 5 }],
    });

    expect(level.title).toBe('Level 1');
    expect(level.badge).toBe('Knight');
    expect(level.lessons).toHaveLength(1);
    expect(level.lessons[0]?.minutes).toBe(5);
    expect(level.lessons[0]?.type).toBe('video');
  });

  it('uses empty values for missing or wrong fields', () => {
    expect(toSummaryLevel({ title: 7, lessons: 'no' })).toEqual({
      title: '',
      badge: '',
      lessons: [],
    });
  });
});

describe('summarizeLevels', () => {
  it('adds up levels, lessons, minutes, XP and badges', () => {
    const summary = summarizeLevels([
      {
        title: 'Level 1',
        badge: 'Number Knight',
        lessons: [
          createLesson({ title: 'A', minutes: 15, xp: 50 }),
          createLesson({ title: 'B', minutes: 10, xp: 100 }),
        ],
      },
      {
        title: 'Level 2',
        badge: '',
        lessons: [createLesson({ title: 'C', minutes: 20, xp: 30 })],
      },
    ]);

    expect(summary).toEqual({
      levelCount: 2,
      lessonCount: 3,
      minutes: 45,
      xp: 180,
      badgeCount: 1,
    });
  });

  it('does not count a level without a title', () => {
    const summary = summarizeLevels([
      {
        title: '<br>',
        badge: 'Hidden',
        lessons: [createLesson({ title: 'Lesson' })],
      },
      { title: 'Visible', badge: '', lessons: [] },
    ]);

    expect(summary.levelCount).toBe(1);
    expect(summary.lessonCount).toBe(0);
    expect(summary.badgeCount).toBe(0);
  });

  it('does not count a lesson without a title', () => {
    const summary = summarizeLevels([
      {
        title: 'Level',
        badge: '',
        lessons: [
          createLesson({ title: 'Shown', minutes: 5, xp: 10 }),
          createLesson({ title: '  ', minutes: 99, xp: 99 }),
        ],
      },
    ]);

    expect(summary.lessonCount).toBe(1);
    expect(summary.minutes).toBe(5);
    expect(summary.xp).toBe(10);
  });

  it('returns zeros for a course without levels', () => {
    expect(summarizeLevels([])).toEqual({
      levelCount: 0,
      lessonCount: 0,
      minutes: 0,
      xp: 0,
      badgeCount: 0,
    });
  });
});
