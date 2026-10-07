/**
 * Shared types for the whole plugin.
 *
 * The editor components, the frontend store and the unit tests all import from this
 * file. Defining the shapes once means the editor cannot save data that the frontend
 * does not understand. The lesson type keys and labels live in `lesson-types.ts`.
 */
import type { LessonTypeKey } from './lesson-types';

/**
 * One lesson row inside a level.
 *
 * This shape is stored in the `lessons` attribute of the level block, so changing it
 * changes saved content. Add new fields as optional, or write a block deprecation.
 */
export interface Lesson {
  /** A stable id for React list keys and for the editor row controls. */
  id: string;
  /** The lesson title that the visitor reads. */
  title: string;
  /** One of the lesson type keys from `lesson-types.ts`. */
  type: LessonTypeKey;
  /** How long the lesson takes, in whole minutes. Zero means the time is not shown. */
  minutes: number;
  /** The XP reward the course offers for this lesson. Zero hides the XP chip. */
  xp: number;
  /** Whether the lesson can be tried before buying the course. */
  isFreePreview: boolean;
  /** The address of the free preview. Only used when isFreePreview is true. */
  previewUrl: string;
}

/**
 * The heading levels the editor can choose for level titles.
 *
 * H1 is reserved for the page title, and levels below H4 are rarely useful on a
 * course page, so the choice is limited to keep the page outline sensible.
 */
export type CurriculumHeadingLevel = 2 | 3 | 4;

/**
 * Attributes of the parent block (math-blazer/math-blazer).
 *
 * This type must match the `attributes` field in
 * `src/math-blazer/block.json`. The block editor stores these values in the
 * post content.
 *
 * This is a type alias and not an interface, because the block editor types require
 * an object type that can be read by key, and TypeScript only gives that to aliases.
 */
export type MathBlazerAttributes = {
  /** The heading level used for every level title. */
  headingLevel: CurriculumHeadingLevel;
  /** When false, opening one level closes the others. */
  allowMultipleOpen: boolean;
  /** Whether the summary bar (levels, lessons, time, XP, badges) is shown. */
  showSummary: boolean;
  /** Whether the expand all and collapse all button is shown. */
  showExpandAll: boolean;
  /** Whether XP chips are shown on lessons and in the summary. */
  showXp: boolean;
  /** Whether badge rewards are shown on levels and in the summary. */
  showBadges: boolean;
};

/**
 * Attributes of the child block (math-blazer/curriculum-level).
 *
 * This type must match the `attributes` field in
 * `src/curriculum-level/block.json`. It is a type alias for the same reason as
 * `MathBlazerAttributes`.
 */
export type CurriculumLevelAttributes = {
  /** The level title, shown in the accordion header. */
  title: string;
  /** A short description under the title inside the open panel. */
  description: string;
  /** The badge the learner earns by finishing the level. Empty hides the badge. */
  badge: string;
  /** Whether this level starts open on the public page. */
  openByDefault: boolean;
  /** The lesson rows of this level. */
  lessons: Lesson[];
};

/**
 * The block context values the parent provides and each level consumes.
 *
 * The keys must match `providesContext` in the parent `block.json` and
 * `usesContext` in the level `block.json`.
 */
export interface CurriculumContextValues {
  'math-blazer/curriculumHeadingLevel': CurriculumHeadingLevel;
  'math-blazer/curriculumShowXp': boolean;
  'math-blazer/curriculumShowBadges': boolean;
}

/**
 * The Interactivity API context of one accordion (one parent block).
 *
 * PHP writes this object into `data-wp-context` on the wrapper, and the store in
 * `view.ts` reads and changes it. Each accordion on the page gets its own copy, so
 * two accordions never share state.
 */
export interface CurriculumContext {
  /** When false, opening one level closes the others. */
  allowMultipleOpen: boolean;
  /** Whether every level is open. The expand all button uses this to pick its text. */
  allOpen: boolean;
}

/**
 * The Interactivity API context of one level inside the accordion.
 *
 * Each level keeps its own open state, so PHP can render the correct first state
 * without knowing the position of the level. The store changes this value when a
 * visitor opens or closes the level.
 */
export interface LevelContext {
  /** Whether the level is open. */
  isOpen: boolean;
}
