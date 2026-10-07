/**
 * Keyboard movement between accordion headers.
 *
 * The WAI-ARIA accordion pattern lets keyboard users move between the level header
 * buttons with Arrow Up, Arrow Down, Home and End. This file only decides which
 * header index comes next. It never touches the page, so the unit tests can check
 * every rule without a browser. The store in `view.ts` moves the real focus.
 */

/**
 * The keys the accordion reacts to, written exactly as KeyboardEvent.key reports them.
 */
const ACCORDION_KEYS = ['ArrowUp', 'ArrowDown', 'Home', 'End'] as const;

/**
 * One of the keys the accordion reacts to.
 */
export type AccordionKey = (typeof ACCORDION_KEYS)[number];

/**
 * Tells TypeScript that a key name from a keyboard event is one the accordion handles.
 *
 * The keydown handler receives every key, including letters and Tab. It uses this
 * check to ignore all keys that are not part of the accordion pattern, so normal
 * typing and tabbing keep working.
 *
 * @param key The value of KeyboardEvent.key.
 *
 * @return Whether the accordion handles this key.
 */
export function isAccordionKey(key: string): key is AccordionKey {
  return (ACCORDION_KEYS as readonly string[]).includes(key);
}

/**
 * Returns the index of the header that should receive focus next.
 *
 * The arrows wrap around: Arrow Down on the last header moves to the first one, and
 * Arrow Up on the first header moves to the last one. Wrapping saves key presses on
 * long courses and is allowed by the WAI-ARIA accordion pattern.
 *
 * @param currentIndex The index of the header that has focus now, starting at zero.
 * @param headerCount  How many headers the accordion has.
 * @param key          The key that was pressed.
 *
 * @return The index of the header to focus.
 */
export function nextHeaderIndex(currentIndex: number, headerCount: number, key: AccordionKey): number {
  // With no headers there is nothing to focus. Zero is a harmless answer, because
  // the store looks the header up by index and finds nothing.
  if (headerCount <= 0) {
    return 0;
  }

  // Saved content and the page can disagree for a moment while the editor changes
  // the block, so clamp the current index into the valid range first.
  const current = Math.min(Math.max(currentIndex, 0), headerCount - 1);

  switch (key) {
    case 'ArrowUp':
      return (current - 1 + headerCount) % headerCount;
    case 'ArrowDown':
      return (current + 1) % headerCount;
    case 'Home':
      return 0;
    case 'End':
      return headerCount - 1;
  }
}
