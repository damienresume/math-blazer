/**
 * Registers the Course Curriculum block in the block editor.
 *
 * PHP has already registered the block from `block.json`, which supplies the title,
 * the attributes and the supports. This call adds the parts that only exist in
 * JavaScript: the edit and save functions. The styles are imported here so that the
 * build tool compiles them into the files that `block.json` lists.
 */
import { registerBlockType } from '@wordpress/blocks';
import type { BlockConfiguration } from '@wordpress/blocks';

import type { MathBlazerAttributes } from '../types';
import metadata from './block.json';
import Edit from './edit';
import save from './save';
import './editor.scss';
import './style.scss';

// The imported block.json is passed as the metadata. The cast is needed because a
// JSON import types every field as a plain string, while the block types expect
// exact words for fields such as `category`.
registerBlockType<MathBlazerAttributes>(metadata as unknown as BlockConfiguration<MathBlazerAttributes>, {
  edit: Edit,
  save,
});
