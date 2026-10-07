/**
 * Helpers for text values that come from rich text fields.
 *
 * A rich text field in the block editor saves HTML, even for a single line. A title
 * that looks empty can therefore still contain tags, for example `<br>`. The helpers
 * here look at the visible text only.
 */

/**
 * Removes HTML tags from a string and trims the result.
 *
 * This is for checking and counting only. It is not a security filter. PHP cleans
 * every value again with `wp_kses()` before it prints it on the public page.
 *
 * @param html A value that can contain HTML tags.
 *
 * @return The visible text, without tags and without spaces at both ends.
 */
export function toPlainText(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim();
}

/**
 * Tells whether a rich text value contains any visible text.
 *
 * @param html A value that can contain HTML tags.
 *
 * @return True when the value has visible text.
 */
export function hasText(html: string): boolean {
  return toPlainText(html) !== '';
}
