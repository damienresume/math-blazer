/**
 * Registers the Curriculum Level block in the block editor.
 *
 * PHP has already registered the block from `block.json`. This call adds the edit
 * and save functions that only exist in JavaScript.
 */
import { registerBlockType } from '@wordpress/blocks';
import type { BlockConfiguration } from '@wordpress/blocks';

import type { CurriculumLevelAttributes } from '../types';
import metadata from './block.json';
import Edit from './edit';
import './editor.scss';
import './style.scss';

// The imported block.json is passed as the metadata. The cast is needed because a
// JSON import types every field as a plain string, while the block types expect
// exact words for fields such as `category`.
registerBlockType<CurriculumLevelAttributes>(metadata as unknown as BlockConfiguration<CurriculumLevelAttributes>, {
  edit: Edit,
  // The level has no inner blocks, and `render.php` builds the public markup on
  // every request. There is nothing for WordPress to store besides the attributes,
  // so the save function returns nothing.
  save: () => null,
});
