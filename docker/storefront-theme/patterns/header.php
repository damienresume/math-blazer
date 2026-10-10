<?php
/**
 * Title: Header
 * Slug: math-blazer-storefront/header
 * Categories: header
 * Block Types: core/template-part/header
 * Description: Site header with the site title and a main menu with a dynamic Courses dropdown.
 *
 * WordPress reads the header above to register this file as a block pattern. The
 * file replaces the header of Twenty Twenty-Five. The layout is the same: the site
 * title on the left and the main menu on the right.
 *
 * The parent header leaves the menu empty, and WordPress then fills it with a link to
 * every published page. A single link cannot be removed from that list, so this header
 * builds its menu itself. The menu has two dropdowns:
 *
 * - Free previews holds the two preview pages. Its links are fixed.
 * - Courses is built on every request. A course is a published page that contains the
 *   Course Curriculum block. A new page with the block appears in the dropdown by
 *   itself, and nothing in this file changes. Today only the Sample Course page has the
 *   block, so it is the only course in the dropdown.
 *
 * The Courses dropdown is shown on every page, including a course page. When no page has
 * the block, the dropdown is not shown.
 *
 * The addresses come from home_url() and get_permalink(), so they stay correct when the
 * site runs in a sub folder or on another host name.
 *
 * @package MathBlazer\SampleCourse
 */

// The block that makes a page a course. The name is the one in src/math-blazer/block.json.
$course_block = 'math-blazer/math-blazer';

// Find the course pages. The search in the page content narrows the query to pages whose text
// mentions the block. has_block() then confirms that the block is really there, because a page
// could mention the name in plain text.
$course_pages = array_filter(
	get_posts(
		array(
			'post_type'      => 'page',
			'post_status'    => 'publish',
			's'              => 'wp:' . $course_block,
			'orderby'        => 'title',
			'order'          => 'ASC',
			'posts_per_page' => 20,
			'no_found_rows'  => true,
		)
	),
	static fn ( WP_Post $page ): bool => has_block( $course_block, $page )
);

?>
<!-- wp:group {"align":"full","layout":{"type":"default"}} -->
<div class="wp-block-group alignfull">
	<!-- wp:group {"layout":{"type":"constrained"}} -->
	<div class="wp-block-group">
		<!-- wp:group {"align":"wide","style":{"spacing":{"padding":{"top":"var:preset|spacing|30","bottom":"var:preset|spacing|30"}}},"layout":{"type":"flex","flexWrap":"nowrap","justifyContent":"space-between"}} -->
		<div class="wp-block-group alignwide" style="padding-top:var(--wp--preset--spacing--30);padding-bottom:var(--wp--preset--spacing--30)">
			<!-- wp:site-title {"level":0} /-->
			<!-- wp:group {"style":{"spacing":{"blockGap":"var:preset|spacing|10"}},"layout":{"type":"flex","flexWrap":"nowrap","justifyContent":"right"}} -->
			<div class="wp-block-group">
				<!-- wp:navigation {"overlayBackgroundColor":"base","overlayTextColor":"contrast","layout":{"type":"flex","justifyContent":"right","flexWrap":"wrap"}} -->
					<!-- wp:navigation-submenu {"label":"<?php echo esc_attr__( 'Free previews', 'math-blazer-storefront' ); ?>","url":"<?php echo esc_url( home_url( '/preview/' ) ); ?>","kind":"custom","isTopLevelItem":true} -->
						<!-- wp:navigation-link {"label":"<?php echo esc_attr__( 'Place value adventure', 'math-blazer-storefront' ); ?>","url":"<?php echo esc_url( home_url( '/preview/place-value/' ) ); ?>","kind":"custom","isTopLevelLink":false} /-->
						<!-- wp:navigation-link {"label":"<?php echo esc_attr__( 'Slice the pizza', 'math-blazer-storefront' ); ?>","url":"<?php echo esc_url( home_url( '/preview/slice-the-pizza/' ) ); ?>","kind":"custom","isTopLevelLink":false} /-->
					<!-- /wp:navigation-submenu -->
					<?php if ( array() !== $course_pages ) : ?>
					<!-- wp:navigation-submenu {"label":"<?php echo esc_attr__( 'Courses', 'math-blazer-storefront' ); ?>","kind":"custom","isTopLevelItem":true} -->
						<?php foreach ( $course_pages as $course_page ) : ?>
						<?php // serialize_block_attributes() escapes the values, so a title with quotes or dashes cannot break the block comment. ?>
						<!-- wp:navigation-link <?php echo serialize_block_attributes( array( 'label' => get_the_title( $course_page ), 'url' => get_permalink( $course_page ), 'kind' => 'custom', 'isTopLevelLink' => false ) ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?> /-->
						<?php endforeach; ?>
					<!-- /wp:navigation-submenu -->
					<?php endif; ?>
				<!-- /wp:navigation -->
			</div>
			<!-- /wp:group -->
		</div>
		<!-- /wp:group -->
	</div>
	<!-- /wp:group -->
</div>
<!-- /wp:group -->
