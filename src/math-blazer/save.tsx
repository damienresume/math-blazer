/**
 * The saved output of the Course Curriculum block.
 *
 * The block is dynamic: `render.php` builds the public markup on every request. The
 * only thing WordPress has to store is the list of inner blocks, which
 * `InnerBlocks.Content` saves. Because the public markup is not stored, the design
 * can change later without making existing pages show an "Invalid block" warning.
 */
import { InnerBlocks } from '@wordpress/block-editor';

/**
 * The save function.
 *
 * @return The inner blocks content.
 */
export default function save() {
  return <InnerBlocks.Content />;
}
