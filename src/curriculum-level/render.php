<?php
/**
 * Public markup of one curriculum level.
 *
 * Each level is an accordion item: a heading that contains a button, and a panel that
 * the button opens. The markup follows the WAI-ARIA accordion pattern. The button has
 * `aria-expanded` and `aria-controls`, and the panel is a labelled region.
 *
 * The `data-wp-*` attributes belong to the Interactivity API. WordPress processes them
 * on the server through the parent block, so the first paint already has the right
 * open state. The store in `src/math-blazer/view.ts` handles the clicks.
 *
 * The editor shows the same markup in `src/curriculum-level/edit.tsx`. Keep the class
 * names and the order of the elements in step with that file.
 *
 * @var array    $attributes The saved settings and content of the level.
 * @var string   $content    Not used. The level has no inner blocks.
 * @var WP_Block $block      The block instance.
 *
 * @package MathBlazer\SampleCourse
 */

declare( strict_types=1 );

namespace MathBlazer\SampleCourse;

defined( 'ABSPATH' ) || exit;

$level_title = get_level_title( $attributes );

// A level without a title would show an empty button, so it is not printed. The
// editor warns about it, and the summary bar does not count it.
if ( '' === $level_title ) {
	return;
}

$lessons       = sanitize_lessons( $attributes['lessons'] ?? array() );
$heading_level = get_heading_level( $block->context['math-blazer/curriculumHeadingLevel'] ?? null );
$show_xp       = false !== ( $block->context['math-blazer/curriculumShowXp'] ?? true );
$show_badges   = false !== ( $block->context['math-blazer/curriculumShowBadges'] ?? true );
$description   = clean_description( (string) ( $attributes['description'] ?? '' ) );
$badge         = $show_badges ? clean_inline_text( (string) ( $attributes['badge'] ?? '' ) ) : '';
$meta_items    = get_level_meta_items( $lessons, $show_xp );

// Each level needs ids that are unique on the page, because `aria-controls` and
// `aria-labelledby` refer to them. `wp_unique_id()` counts up across the whole request,
// so two accordions on one page never share an id.
$level_id   = wp_unique_id( 'math-blazer-level-' );
$trigger_id = $level_id . '-trigger';
$panel_id   = $level_id . '-panel';

// The level keeps its own open state. The parent block cannot tell a level its
// position, so a per level value is the simplest way to render the right first state.
$context_attribute = wp_interactivity_data_wp_context( array( 'isOpen' => ! empty( $attributes['openByDefault'] ) ) );

$wrapper_attributes = get_block_wrapper_attributes(
	array(
		'class'        => 'math-blazer__level',
		'data-wp-init' => 'callbacks.registerLevel',
	)
);
?>

<div <?php echo $wrapper_attributes; ?> <?php echo $context_attribute; ?>>
	<h<?php echo (int) $heading_level; ?> class="math-blazer__heading">
		<button
			type="button"
			id="<?php echo esc_attr( $trigger_id ); ?>"
			class="math-blazer__trigger"
			aria-controls="<?php echo esc_attr( $panel_id ); ?>"
			data-wp-bind--aria-expanded="context.isOpen"
			data-wp-on--click="actions.toggle"
			data-wp-on--keydown="actions.handleKeydown"
		>
			<span class="math-blazer__level-number" aria-hidden="true"></span>
			<span class="math-blazer__trigger-text">
				<span class="math-blazer__title"><?php echo $level_title; ?></span>
				<?php if ( array() !== $meta_items ) : ?>
					<span class="math-blazer__meta">
						<?php foreach ( $meta_items as $meta_item ) : ?>
							<span class="math-blazer__meta-item"><?php echo esc_html( $meta_item ); ?></span>
						<?php endforeach; ?>
					</span>
				<?php endif; ?>
			</span>
			<?php echo render_icon( 'chevron-down', 'math-blazer__chevron' ); ?>
		</button>
	</h<?php echo (int) $heading_level; ?>>

	<div
		id="<?php echo esc_attr( $panel_id ); ?>"
		class="math-blazer__panel"
		role="region"
		aria-labelledby="<?php echo esc_attr( $trigger_id ); ?>"
		data-wp-bind--hidden="!context.isOpen"
	>
		<?php if ( '' !== $description ) : ?>
			<p class="math-blazer__description"><?php echo $description; ?></p>
		<?php endif; ?>

		<?php if ( '' !== $badge ) : ?>
			<p class="math-blazer__badge">
				<?php echo render_icon( 'star', 'math-blazer__icon' ); ?>
				<span class="math-blazer__badge-label"><?php esc_html_e( 'Badge reward:', 'math-blazer' ); ?></span>
				<span class="math-blazer__badge-name"><?php echo $badge; ?></span>
			</p>
		<?php endif; ?>

		<?php if ( array() !== $lessons ) : ?>
			<ul class="math-blazer__lessons">
				<?php foreach ( $lessons as $lesson ) : ?>
					<li class="math-blazer__lesson">
						<span class="math-blazer__lesson-type math-blazer__lesson-type--<?php echo esc_attr( sanitize_html_class( $lesson['type'] ) ); ?>">
							<?php echo render_icon( get_lesson_type_icon_name( $lesson['type'] ), 'math-blazer__icon' ); ?>
							<span class="math-blazer__lesson-type-label"><?php echo esc_html( get_lesson_type_label( $lesson['type'] ) ); ?></span>
						</span>
						<span class="math-blazer__lesson-title"><?php echo esc_html( $lesson['title'] ); ?></span>
						<span class="math-blazer__chips">
							<?php if ( $lesson['minutes'] > 0 ) : ?>
								<span class="math-blazer__chip"><?php echo esc_html( format_minutes( $lesson['minutes'] ) ); ?></span>
							<?php endif; ?>
							<?php if ( $show_xp && $lesson['xp'] > 0 ) : ?>
								<span class="math-blazer__chip math-blazer__chip--xp">
									<?php
									/* translators: %d: the XP reward of one lesson. */
									echo esc_html( sprintf( __( '+%d XP', 'math-blazer' ), $lesson['xp'] ) );
									?>
								</span>
							<?php endif; ?>
							<?php if ( $lesson['is_free_preview'] && '' !== $lesson['preview_url'] ) : ?>
								<?php // The visible text "Free preview" is part of the accessible name, as WCAG requires, and the lesson title tells screen reader users which lesson the link belongs to. ?>
								<a
									class="math-blazer__chip math-blazer__chip--preview"
									href="<?php echo esc_url( $lesson['preview_url'] ); ?>"
									aria-label="<?php
									/* translators: %s: the title of the lesson that can be previewed. */
									echo esc_attr( sprintf( __( 'Free preview: %s', 'math-blazer' ), $lesson['title'] ) );
									?>"
								><?php esc_html_e( 'Free preview', 'math-blazer' ); ?></a>
							<?php elseif ( $lesson['is_free_preview'] ) : ?>
								<span class="math-blazer__chip math-blazer__chip--preview"><?php esc_html_e( 'Free preview', 'math-blazer' ); ?></span>
							<?php endif; ?>
						</span>
					</li>
				<?php endforeach; ?>
			</ul>
		<?php endif; ?>
	</div>
</div>
