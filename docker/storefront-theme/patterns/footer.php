<?php
/**
 * Title: Footer
 * Slug: math-blazer-storefront/footer
 * Categories: footer
 * Block Types: core/template-part/footer
 * Description: A footer with a divider and a centered copyright line with the current year.
 *
 * WordPress reads the header above to register this file as a block pattern. The
 * file replaces the footer of Twenty Twenty-Five, which shows the site title, the
 * theme name and a "Designed with WordPress" line. This footer shows only a divider,
 * the copyright, centered.
 *
 * The file is a PHP pattern, not plain markup, because the copyright needs the current
 * year. PHP prints the year each time the page is built, so the year is never out of date.
 *
 * @package MathBlazer\SampleCourse
 */

?>
<!-- wp:group {"style":{"spacing":{"padding":{"top":"var:preset|spacing|60","bottom":"var:preset|spacing|50"}}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group" style="padding-top:var(--wp--preset--spacing--60);padding-bottom:var(--wp--preset--spacing--50)">
	<!-- wp:group {"align":"wide","style":{"spacing":{"blockGap":"var:preset|spacing|40"}},"layout":{"type":"default"}} -->
	<div class="wp-block-group alignwide">
		<!-- wp:separator {"className":"is-style-wide"} -->
		<hr class="wp-block-separator has-alpha-channel-opacity is-style-wide"/>
		<!-- /wp:separator -->

		<!-- wp:paragraph {"style":{"typography":{"textAlign":"center"}},"fontSize":"small"} -->
		<p class="has-text-align-center has-small-font-size">
			<?php
			printf(
				/* translators: 1: the current year. 2: the name of the copyright holder. */
				esc_html__( '© %1$s %2$s. All rights reserved.', 'math-blazer-storefront' ),
				esc_html( wp_date( 'Y' ) ),
				'Math Blazer'
			);
			?>
		</p>
		<!-- /wp:paragraph -->
	</div>
	<!-- /wp:group -->
</div>
<!-- /wp:group -->
