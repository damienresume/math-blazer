/**
 * The frontend script of the Course Curriculum block.
 *
 * `render.php` prints the whole accordion, with the right open and closed state, and
 * WordPress processes the `data-wp-*` attributes on the server. This script only adds
 * behavior to that markup: opening and closing levels, the expand all button, and the
 * arrow keys. It runs through the WordPress Interactivity API, which means it loads as
 * a module and only on pages that contain the block.
 *
 * The strings that visitors read (such as "Expand all") are printed by PHP and shown
 * or hidden by directives, so this file contains no text that needs translation.
 */
import { getContext, getElement, store, withSyncEvent } from '@wordpress/interactivity';

import type { CurriculumContext, LevelContext } from '../types';
import { isAccordionKey, nextHeaderIndex } from '../utils/keyboard';

/**
 * The class names of the markup that `render.php` prints. The script finds elements
 * with them, so they must stay in step with `render.php`. The manual check at the end
 * of the project compares both.
 */
const ROOT_SELECTOR = '.math-blazer';
const LEVEL_SELECTOR = '.math-blazer__level';
const TRIGGER_SELECTOR = '.math-blazer__trigger';

/**
 * A level that has been announced to the script.
 *
 * Each level keeps its own open state in its own context. When one level opens, the
 * script may need to close the others, and the Interactivity API gives an action
 * access only to the context of the element that received the event. Each level
 * therefore hands its context to this list when it starts, and the actions use the
 * list to reach the other levels.
 */
interface RegisteredLevel {
  /** The element of the level, used to find which accordion the level belongs to. */
  element: Element;
  /** The reactive context of the level. Changing `isOpen` here updates the page. */
  context: LevelContext;
}

/**
 * Every level on the page, for all accordions. A level is removed when its element is
 * removed from the page.
 */
const registeredLevels = new Set<RegisteredLevel>();

/**
 * Returns the registered levels that belong to one accordion.
 *
 * A page can contain more than one accordion, and the list holds the levels of all of
 * them, so the levels are filtered by the accordion that contains them.
 *
 * @param root The wrapper element of the accordion.
 *
 * @return The levels inside that accordion.
 */
function getLevelsInRoot(root: Element): RegisteredLevel[] {
  return [...registeredLevels].filter((level) => root.contains(level.element));
}

store('math-blazer/math-blazer', {
  actions: {
    /**
     * Opens or closes the level whose header button was clicked.
     *
     * When the accordion allows only one open level, opening a level closes the
     * others. The expand all button then has nothing to do, so the button is not
     * printed in that mode.
     */
    toggle() {
      const context = getContext<LevelContext & CurriculumContext>();
      const { ref } = getElement();
      const levelElement = ref instanceof Element ? ref.closest(LEVEL_SELECTOR) : null;
      const root = levelElement?.closest(ROOT_SELECTOR) ?? null;

      context.isOpen = !context.isOpen;

      if (!root) {
        return;
      }

      const levels = getLevelsInRoot(root);

      if (context.isOpen && !context.allowMultipleOpen) {
        for (const level of levels) {
          if (level.element !== levelElement) {
            level.context.isOpen = false;
          }
        }
      }

      // `allOpen` lives in the context of the wrapper. A level can change it,
      // because the context of a level also exposes the values of its parent.
      context.allOpen = levels.length > 0 && levels.every((level) => level.context.isOpen);
    },

    /**
     * Opens every level, or closes every level when all of them are already open.
     */
    toggleAll() {
      const { ref } = getElement();
      const root = ref instanceof Element ? ref.closest(ROOT_SELECTOR) : null;

      if (!root) {
        return;
      }

      // The context is read after the early return, because it is only needed
      // when the accordion was found.
      const context = getContext<CurriculumContext>();
      const open = !context.allOpen;

      for (const level of getLevelsInRoot(root)) {
        level.context.isOpen = open;
      }

      context.allOpen = open;
    },

    /**
     * Moves the focus between the header buttons with Arrow Up, Arrow Down, Home and End.
     *
     * The function is wrapped in `withSyncEvent()` because it calls
     * `event.preventDefault()`, which must run before the browser acts on the key.
     * Without it the page would scroll when a visitor presses an arrow key. Keys that
     * the accordion does not use are ignored, so typing and tabbing keep working.
     */
    handleKeydown: withSyncEvent((event: KeyboardEvent) => {
      if (!isAccordionKey(event.key)) {
        return;
      }

      const { ref } = getElement();
      const root = ref instanceof Element ? ref.closest(ROOT_SELECTOR) : null;

      if (!root) {
        return;
      }

      const triggers = Array.from(root.querySelectorAll<HTMLElement>(TRIGGER_SELECTOR));
      const current = triggers.findIndex((trigger) => trigger === ref);

      if (current === -1) {
        return;
      }

      event.preventDefault();
      triggers[nextHeaderIndex(current, triggers.length, event.key)]?.focus();
    }),
  },

  callbacks: {
    /**
     * Announces a level to the script when the level starts.
     *
     * The function returns a cleanup function. The Interactivity API calls it when
     * the level is removed from the page, so the list never holds levels that no
     * longer exist.
     *
     * @return A function that removes the level from the list.
     */
    registerLevel() {
      const { ref } = getElement();

      if (!(ref instanceof Element)) {
        return undefined;
      }

      const entry: RegisteredLevel = {
        element: ref,
        context: getContext<LevelContext>(),
      };
      registeredLevels.add(entry);

      return () => {
        registeredLevels.delete(entry);
      };
    },
  },
});
