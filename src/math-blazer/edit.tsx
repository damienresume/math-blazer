/**
 * The editor view of the Course Curriculum block.
 *
 * The markup and the class names follow `render.php`, so the editor shows what the
 * visitor will see. The levels are inner blocks, which gives editors the standard
 * block toolbar, drag and drop, List View and undo for every level.
 */
import { InnerBlocks, store as blockEditorStore, useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';
import type { BlockEditProps } from '@wordpress/blocks';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

import SummaryBar from '../components/SummaryBar';
import levelMetadata from '../curriculum-level/block.json';
import type { MathBlazerAttributes } from '../types';
import { summarizeLevels, toSummaryLevel } from '../utils/summary';
import CurriculumInspector from './inspector';

/**
 * The part of a level block that this file reads. The block editor store returns
 * more fields, but only the attributes are needed to add up the totals.
 */
type LevelBlock = { attributes: Record<string, unknown> };

/**
 * The inner blocks that a new accordion starts with: one level, open by default.
 *
 * The block name comes from the level's own `block.json`, so it is written only once.
 * The first level is open by default because a visitor then sees what a level
 * contains without having to click.
 */
const TEMPLATE: [string, Record<string, unknown>][] = [[levelMetadata.name, { openByDefault: true }]];

/**
 * The edit component.
 *
 * @param props               The block editor props.
 * @param props.attributes    The settings of the block.
 * @param props.setAttributes Saves changed settings.
 * @param props.clientId      The editor id of this block instance.
 *
 * @return The block as it appears on the editor canvas.
 */
export default function Edit({ attributes, setAttributes, clientId }: BlockEditProps<MathBlazerAttributes>) {
  // The level blocks that are inside this block. The summary bar adds them up, so it
  // updates while the editor types. The cast is needed because the type definitions
  // of the block editor store do not describe the selectors precisely.
  const levels = useSelect((select) => select(blockEditorStore).getBlocks(clientId), [clientId]) as LevelBlock[];

  const summary = summarizeLevels(levels.map((level) => toSummaryLevel(level.attributes)));

  // The expand all button only makes sense when several levels can be open, and
  // only when there is more than one level to open.
  const showExpandAll = attributes.showExpandAll && attributes.allowMultipleOpen && summary.levelCount > 1;
  const showSummary = attributes.showSummary && summary.levelCount > 0;

  const blockProps = useBlockProps({ className: 'math-blazer' });
  const innerBlocksProps = useInnerBlocksProps(
    { className: 'math-blazer__levels' },
    {
      template: TEMPLATE,
      renderAppender: InnerBlocks.ButtonBlockAppender,
    },
  );

  return (
    <div {...blockProps}>
      <CurriculumInspector attributes={attributes} setAttributes={setAttributes} />

      {(showSummary || showExpandAll) && (
        <div className="math-blazer__toolbar">
          {showSummary && (
            <SummaryBar summary={summary} showXp={attributes.showXp} showBadges={attributes.showBadges} />
          )}
          {showExpandAll && (
            // A preview of the public button. It does nothing in the editor,
            // because every level is always open while editing.
            <button type="button" className="math-blazer__expand-all" disabled>
              {__('Expand all', 'math-blazer')}
            </button>
          )}
        </div>
      )}

      <div {...innerBlocksProps} />
    </div>
  );
}
