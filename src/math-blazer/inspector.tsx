/**
 * The sidebar settings of the Course Curriculum block.
 *
 * Settings that apply to the whole accordion live here. Content (titles, lessons) is
 * edited on the canvas, where the editor sees how it will look.
 */
import { InspectorControls } from '@wordpress/block-editor';
import type { BlockEditProps } from '@wordpress/blocks';
import { PanelBody, SelectControl, ToggleControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import type { MathBlazerAttributes } from '../types';
import { HEADING_LEVELS, toHeadingLevel } from '../utils/headings';

/** The options of the heading level select, built once from the allowed levels. */
const HEADING_OPTIONS = HEADING_LEVELS.map((level) => ({
  value: String(level),
  label: `H${level}`,
}));

interface CurriculumInspectorProps {
  /** The current settings. */
  attributes: MathBlazerAttributes;
  /** Saves changed settings. */
  setAttributes: BlockEditProps<MathBlazerAttributes>['setAttributes'];
}

/**
 * The inspector component.
 *
 * @param props               The component props.
 * @param props.attributes    The current settings.
 * @param props.setAttributes Saves changed settings.
 *
 * @return The sidebar panels.
 */
export default function CurriculumInspector({ attributes, setAttributes }: CurriculumInspectorProps) {
  return (
    <InspectorControls>
      <PanelBody title={__('Accordion behavior', 'math-blazer')}>
        <SelectControl
          label={__('Level title heading', 'math-blazer')}
          help={__(
            'Choose the heading level that comes one step below the heading of the section that holds this block.',
            'math-blazer',
          )}
          value={String(attributes.headingLevel)}
          options={HEADING_OPTIONS}
          onChange={(value) =>
            setAttributes({
              headingLevel: toHeadingLevel(value),
            })
          }
        />
        <ToggleControl
          label={__('Allow several levels open at once', 'math-blazer')}
          help={
            attributes.allowMultipleOpen
              ? __('Visitors can keep many levels open.', 'math-blazer')
              : __('Opening a level closes the others.', 'math-blazer')
          }
          checked={attributes.allowMultipleOpen}
          onChange={(allowMultipleOpen) => setAttributes({ allowMultipleOpen })}
        />
      </PanelBody>

      <PanelBody title={__('What to show', 'math-blazer')}>
        <ToggleControl
          label={__('Show summary bar', 'math-blazer')}
          help={__('Levels, lessons, total time, XP and badges for the whole course.', 'math-blazer')}
          checked={attributes.showSummary}
          onChange={(showSummary) => setAttributes({ showSummary })}
        />
        <ToggleControl
          label={__('Show expand all button', 'math-blazer')}
          help={
            attributes.allowMultipleOpen
              ? undefined
              : __('Turn on "Allow several levels open at once" to use this button.', 'math-blazer')
          }
          checked={attributes.showExpandAll}
          disabled={!attributes.allowMultipleOpen}
          onChange={(showExpandAll) => setAttributes({ showExpandAll })}
        />
        <ToggleControl
          label={__('Show XP rewards', 'math-blazer')}
          checked={attributes.showXp}
          onChange={(showXp) => setAttributes({ showXp })}
        />
        <ToggleControl
          label={__('Show badge rewards', 'math-blazer')}
          checked={attributes.showBadges}
          onChange={(showBadges) => setAttributes({ showBadges })}
        />
      </PanelBody>
    </InspectorControls>
  );
}
