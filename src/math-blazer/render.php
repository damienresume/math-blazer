<?php
/**
 * Public markup of the Course Curriculum block.
 *
 * WordPress runs this file on every request that shows the block. The file prints the
 * wrapper, the summary bar and the expand all button. The levels are inner blocks,
 * and WordPress has already rendered them into `$content`.
 *
 * The Interactivity API reads the `data-wp-*` attributes. WordPress also processes
 * them on the server, so the first paint already has the right open and closed state
 * and the page does not shift when the script starts.
 *
 * The editor shows the same markup in `src/math-blazer/edit.tsx`. Keep the
 * class names and the order of the elements in step with that file.
 *
 * @var array    $attributes The saved settings of the block.
 * @var string   $content    The rendered markup of the level blocks.
 * @var WP_Block $block      The block instance.
 *
 * @package MathBlazer\SampleCourse
 */

declare( strict_types=1 );

namespace MathBlazer\SampleCourse;

defined( 'ABSPATH' ) || exit;

$summary = summarize_levels( $block );

// An accordion without any shown level has nothing to print. Printing the wrapper
// anyway would leave an empty box on the page.
if ( 0 === $summary['levels'] ) {
	return;
}

$allow_multiple  = ! empty( $attributes['allowMultipleOpen'] );
$show_summary    = ! empty( $attributes['showSummary'] );
$show_expand_all = ! empty( $attributes['showExpandAll'] ) && $allow_multiple && $summary['levels'] > 1;

// The wrapper gets the classes and styles from the block supports (colors, spacing,
// border). The interactive region is the whole accordion, so the store namespace is set here.
$wrapper_attributes = get_block_wrapper_attributes(
	array(
		'class'               => 'math-blazer',
		'data-wp-interactive' => 'math-blazer/math-blazer',
	)
);

// The state of the whole accordion. `allOpen` decides which text the expand all
// button shows. Each level keeps its own `isOpen` value in its own context.
$context_attribute = wp_interactivity_data_wp_context(
	array(
		'allowMultipleOpen' => $allow_multiple,
		'allOpen'           => $summary['all_open'],
	)
);

$summary_items = get_summary_items( $summary, ! empty( $attributes['showXp'] ), ! empty( $attributes['showBadges'] ) );
?>
<div <?php echo $wrapper_attributes; ?> <?php echo $context_attribute; ?>>
	<?php // Visitors without JavaScript cannot open the levels, so every level is shown open and the button that needs scripts is hidden. ?>
	<noscript>
		<style>
			.math-blazer__panel[hidden] { display: block; }
			.math-blazer__expand-all { display: none; }
		</style>
	</noscript>

	<?php if ( $show_summary || $show_expand_all ) : ?>
		<div class="math-blazer__toolbar">
			<?php if ( $show_summary ) : ?>
				<ul class="math-blazer__summary" aria-label="<?php esc_attr_e( 'Course summary', 'math-blazer' ); ?>">
					<?php foreach ( $summary_items as $summary_item ) : ?>
						<li class="math-blazer__summary-item"><?php echo esc_html( $summary_item ); ?></li>
					<?php endforeach; ?>
				</ul>
			<?php endif; ?>

			<?php if ( $show_expand_all ) : ?>
				<?php // Both texts are printed and the directives show one of them. This keeps the texts translatable in PHP and keeps the script free of strings. ?>
				<button type="button" class="math-blazer__expand-all" data-wp-on--click="actions.toggleAll">
					<span data-wp-bind--hidden="context.allOpen"><?php esc_html_e( 'Expand all', 'math-blazer' ); ?></span>
					<span data-wp-bind--hidden="!context.allOpen"><?php esc_html_e( 'Collapse all', 'math-blazer' ); ?></span>
				</button>
			<?php endif; ?>
		</div>
	<?php endif; ?>

	<div class="math-blazer__levels">
		<?php echo $content; ?>
	</div>
</div>
