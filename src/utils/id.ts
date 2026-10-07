/**
 * Id generator for lessons.
 *
 * Each lesson row needs an id that stays the same while the editor reorders, copies
 * and removes rows. React uses it as the list key, and the row controls use it to
 * find the row they must change.
 */

/**
 * Creates a new id.
 *
 * `crypto.randomUUID()` is the best source, but browsers only provide it on secure
 * pages (https or localhost). A WordPress site in development can run on plain http
 * with another host name, so the function falls back to a time and random based id.
 * Both kinds only need to be unique inside one post, which they are.
 *
 * @return A new id string.
 */
export function createId(): string {
  if (typeof globalThis.crypto !== 'undefined' && typeof globalThis.crypto.randomUUID === 'function') {
    return globalThis.crypto.randomUUID();
  }

  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
