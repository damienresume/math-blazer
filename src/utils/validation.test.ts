/**
 * Tests for the level checks.
 */
import { describe, expect, it } from 'vitest';

import { createLesson } from './lessons';
import { getLevelProblems } from './validation';

describe('getLevelProblems', () => {
  it('finds no problems in a complete level', () => {
    expect(
      getLevelProblems({
        title: 'Level 1',
        lessons: [createLesson({ title: 'Lesson' })],
      }),
    ).toEqual([]);
  });

  it('reports a missing title and missing lessons', () => {
    expect(getLevelProblems({ title: '', lessons: [] })).toEqual(['missing-title', 'no-lessons']);
  });

  it('treats a title that contains only tags as missing', () => {
    expect(
      getLevelProblems({
        title: '<br>',
        lessons: [createLesson({ title: 'Lesson' })],
      }),
    ).toEqual(['missing-title']);
  });

  it('reports a lesson without a title', () => {
    expect(
      getLevelProblems({
        title: 'Level',
        lessons: [createLesson({ title: '  ' })],
      }),
    ).toEqual(['untitled-lesson']);
  });

  it('reports a free preview without an address', () => {
    expect(
      getLevelProblems({
        title: 'Level',
        lessons: [
          createLesson({
            title: 'Lesson',
            isFreePreview: true,
            previewUrl: '',
          }),
        ],
      }),
    ).toEqual(['preview-without-url']);
  });
});
