/**
 * The editor view of one curriculum level.
 *
 * The markup and the class names follow `render.php`, so the editor shows what the
 * visitor will see. Titles and descriptions are edited in place on the canvas. The
 * lessons are a list of form rows, because each lesson has several fields.
 *
 * Every level is open in the editor so that no content is hidden from the person who
 * edits it. A toolbar button previews the closed state when needed.
 */
import { BlockControls, InspectorControls, RichText, useBlockProps } from '@wordpress/block-editor';
import type { BlockEditProps } from '@wordpress/blocks';
import { PanelBody, ToggleControl, ToolbarButton, ToolbarGroup } from '@wordpress/components';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import Icon from '../components/Icon';
import LessonList from '../components/LessonList';
import LevelMeta from '../components/LevelMeta';
import ProblemNotices from '../components/ProblemNotices';
import type { CurriculumContextValues, CurriculumLevelAttributes } from '../types';
import { normalizeLessons } from '../utils/lessons';
import { getLevelProblems } from '../utils/validation';

/**
 * The props of the edit component. The `context` holds the values that the parent
 * block provides, and the type narrows it to the one value this file reads.
 */
type LevelEditProps = BlockEditProps<CurriculumLevelAttributes> & {
  context: Partial<CurriculumContextValues>;
};

/**
 * The edit component.
 *
 * @param props               The block editor props.
 * @param props.attributes    The settings and content of the level.
 * @param props.setAttributes Saves changed settings and content.
 * @param props.context       Values from the parent block.
 *
 * @return The level as it appears on the editor canvas.
 */
export default function Edit({ attributes, setAttributes, context }: LevelEditProps) {
  // Whether the editor has chosen to preview the closed state of this level.
  const [isPreviewCollapsed, setIsPreviewCollapsed] = useState(false);

  // The saved lessons can contain damaged data, so repair them once for all fields.
  const lessons = normalizeLessons(attributes.lessons);
  const problems = getLevelProblems({ title: attributes.title, lessons });
  const showXp = context['math-blazer/curriculumShowXp'] !== false;

  const blockProps = useBlockProps({
    className: isPreviewCollapsed ? 'math-blazer__level is-preview-collapsed' : 'math-blazer__level',
  });

  return (
    <div {...blockProps}>
      <BlockControls>
        <ToolbarGroup>
          <ToolbarButton
            icon="arrow-down-alt2"
            label={__('Preview this level closed', 'math-blazer')}
            isPressed={isPreviewCollapsed}
            onClick={() => setIsPreviewCollapsed(!isPreviewCollapsed)}
          />
        </ToolbarGroup>
      </BlockControls>

      <InspectorControls>
        <PanelBody title={__('Level settings', 'math-blazer')}>
          <ToggleControl
            label={__('Open by default', 'math-blazer')}
            help={__('The level is open when the page loads.', 'math-blazer')}
            checked={attributes.openByDefault}
            onChange={(openByDefault) => setAttributes({ openByDefault })}
          />
        </PanelBody>
      </InspectorControls>

      <ProblemNotices problems={problems} />

      <div className="math-blazer__heading">
        <div className="math-blazer__trigger">
          <span className="math-blazer__level-number" aria-hidden="true" />
          <span className="math-blazer__trigger-text">
            <RichText
              tagName="span"
              className="math-blazer__title"
              value={attributes.title}
              onChange={(title) => setAttributes({ title })}
              placeholder={__('Level title', 'math-blazer')}
              allowedFormats={[]}
            />
            <LevelMeta lessons={lessons} showXp={showXp} />
          </span>
          {/* The chevron is the last element, so it sits at the right edge. */}
          <Icon name="chevron-down" className="math-blazer__chevron" />
        </div>
      </div>

      <div className="math-blazer__panel" hidden={isPreviewCollapsed}>
        <RichText
          tagName="p"
          className="math-blazer__description"
          value={attributes.description}
          onChange={(description) => setAttributes({ description })}
          placeholder={__('Describe this level (optional)', 'math-blazer')}
          allowedFormats={['core/bold', 'core/italic']}
        />

        <p className="math-blazer__badge">
          <Icon name="star" className="math-blazer__icon" />
          <span className="math-blazer__badge-label">{__('Badge reward:', 'math-blazer')}</span>
          <RichText
            tagName="span"
            className="math-blazer__badge-name"
            value={attributes.badge}
            onChange={(badge) => setAttributes({ badge })}
            placeholder={__('Badge name (optional)', 'math-blazer')}
            allowedFormats={[]}
          />
        </p>

        <LessonList lessons={lessons} onChange={(nextLessons) => setAttributes({ lessons: nextLessons })} />
      </div>
    </div>
  );
}
