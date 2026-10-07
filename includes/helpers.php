<?php
/**
 * Helper functions for the block render templates.
 *
 * The render templates (`src/math-blazer/render.php` and
 * `src/curriculum-level/render.php`) print the public markup. This file holds the
 * logic that both templates share: reading the data files that TypeScript also reads,
 * cleaning saved values, adding up totals and drawing icons. Keeping the logic here
 * keeps the templates short and keeps one copy of each rule.
 *
 * Several rules exist in TypeScript too, because the block editor shows a preview of
 * the same page. The TypeScript copy is named next to each function, so a change in
 * one place can be repeated in the other.
 *
 * @package MathBlazer\SampleCourse
 */

declare( strict_types=1 );

namespace MathBlazer\SampleCourse;

use WP_Block;

defined( 'ABSPATH' ) || exit;

/**
 * The name of the level block. The parent block counts the blocks with this name.
 */
const LEVEL_BLOCK_NAME = 'math-blazer/curriculum-level';

/**
 * Reads one of the JSON files in the `data` folder.
 *
 * The files are shared with the TypeScript code, so the editor and the public page
 * use the same lesson types and the same icon shapes. Each file is read once per
 * request and kept in memory, because a page can contain many levels.
 *
 * @param string $name The file name without the `.json` ending, for example `icons`.
 *
 * @return array The decoded file, or an empty array when the file is missing or broken.
 */
function read_data_file( string $name ): array {
	static $cache = array();

	if ( ! isset( $cache[ $name ] ) ) {
		$decoded         = wp_json_file_decode( DATA_DIR . '/' . $name . '.json', array( 'associative' => true ) );
		$cache[ $name ] = is_array( $decoded ) ? $decoded : array();
	}

	return $cache[ $name ];
}

/**
 * Returns the lesson types from `data/lesson-types.json`, with the key as array key.
 *
 * TypeScript list: `LESSON_TYPE_KEYS` in `src/lesson-types.ts`.
 *
 * @return array<string, array{key: string, label: string, icon: string}> The lesson types.
 */
function get_lesson_types(): array {
	$types = array();
	$data  = read_data_file( 'lesson-types' );

	foreach ( $data['types'] ?? array() as $entry ) {
		if ( isset( $entry['key'], $entry['label'], $entry['icon'] ) ) {
			$types[ $entry['key'] ] = $entry;
		}
	}

	return $types;
}

/**
 * Returns the key of the lesson type that replaces an unknown type.
 *
 * It is the first type in the list. TypeScript uses the same rule: `DEFAULT_LESSON_TYPE`
 * in `src/lesson-types.ts`.
 *
 * @return string The key of the default lesson type.
 */
function get_default_lesson_type(): string {
	$key = array_key_first( get_lesson_types() );

	return null === $key ? '' : (string) $key;
}

/**
 * Returns the translated label of a lesson type.
 *
 * @param string $key The lesson type key.
 *
 * @return string The label, or a general label when the key is unknown.
 */
function get_lesson_type_label( string $key ): string {
	$types = get_lesson_types();

	if ( ! isset( $types[ $key ] ) ) {
		return __( 'Lesson', 'math-blazer' );
	}

	// The label is the English text from the JSON file. The same text is written as a
	// literal in `src/lesson-types.ts`, which is where the translation tools find it,
	// so the translation exists even though this call has no literal.
	// phpcs:ignore WordPress.WP.I18n.NonSingularStringLiteralText
	return __( $types[ $key ]['label'], 'math-blazer' );
}

/**
 * Returns the icon name of a lesson type.
 *
 * @param string $key The lesson type key.
 *
 * @return string The icon name from `icons.json`, or an empty string when the key is unknown.
 */
function get_lesson_type_icon_name( string $key ): string {
	$types = get_lesson_types();

	return $types[ $key ]['icon'] ?? '';
}

/**
 * Draws an icon from `data/icons.json` as inline SVG.
 *
 * Inline SVG needs no extra request and takes the text color of its surroundings.
 * TypeScript draws the same icons with `src/components/Icon.tsx`, using the same
 * data and the same settings. Every value is escaped here, so the template can print
 * the result as it is.
 *
 * @param string $name       The icon name, for example `shield`.
 * @param string $class_name A class name for styling.
 *
 * @return string The SVG markup, or an empty string when the icon name is unknown.
 */
function render_icon( string $name, string $class_name = '' ): string {
	$data = read_data_file( 'icons' );
	$icon = $data['icons'][ $name ] ?? null;

	if ( ! is_array( $icon ) || empty( $icon['paths'] ) ) {
		return '';
	}

	$settings = $data['svg'] ?? array();
	$paths    = '';

	foreach ( $icon['paths'] as $path ) {
		$paths .= '<path d="' . esc_attr( (string) $path ) . '"></path>';
	}

	return sprintf(
		'<svg class="%1$s" viewBox="%2$s" fill="%3$s" stroke="currentColor" stroke-width="%4$s" stroke-linejoin="%5$s" aria-hidden="true" focusable="false">%6$s</svg>',
		esc_attr( $class_name ),
		esc_attr( (string) ( $settings['viewBox'] ?? '0 0 24 24' ) ),
		empty( $icon['filled'] ) ? 'none' : 'currentColor',
		esc_attr( (string) ( $settings['strokeWidth'] ?? '1.5' ) ),
		esc_attr( (string) ( $settings['strokeLinejoin'] ?? 'round' ) ),
		$paths
	);
}

/**
 * Turns a saved value into a whole number of zero or more.
 *
 * TypeScript copy: `toCount()` in `src/utils/lessons.ts`.
 *
 * @param mixed $value The saved value.
 *
 * @return int A whole number of zero or more. A value that is not a number gives zero.
 */
function to_count( mixed $value ): int {
	return is_numeric( $value ) ? max( 0, (int) round( (float) $value ) ) : 0;
}

/**
 * Formats a number of minutes, for example "45 min", "2 h" or "1 h 30 min".
 *
 * TypeScript copy: `formatMinutes()` in `src/utils/duration.ts`.
 *
 * @param int $total_minutes The number of minutes.
 *
 * @return string The text to display.
 */
function format_minutes( int $total_minutes ): string {
	$total_minutes = max( 0, $total_minutes );
	$hours         = intdiv( $total_minutes, 60 );
	$minutes       = $total_minutes % 60;

	if ( 0 === $hours ) {
		/* translators: %d: a number of minutes. */
		return sprintf( __( '%d min', 'math-blazer' ), $minutes );
	}

	if ( 0 === $minutes ) {
		/* translators: %d: a number of hours. */
		return sprintf( __( '%d h', 'math-blazer' ), $hours );
	}

	/* translators: 1: a number of hours. 2: a number of minutes. */
	return sprintf( __( '%1$d h %2$d min', 'math-blazer' ), $hours, $minutes );
}

/**
 * Tells whether a rich text value contains any visible text.
 *
 * TypeScript copy: `hasText()` in `src/utils/text.ts`.
 *
 * @param string $value A value that can contain HTML tags.
 *
 * @return bool True when the value has visible text.
 */
function has_visible_text( string $value ): bool {
	return '' !== trim( wp_strip_all_tags( $value ) );
}

/**
 * Cleans a single line rich text value, such as a level title or a badge name.
 *
 * The editor saves HTML for rich text fields. These fields allow no formatting, so
 * every tag is removed. Entities such as `&amp;` stay, because they are correct HTML.
 *
 * @param string $value The saved value.
 *
 * @return string The value without tags, safe to print.
 */
function clean_inline_text( string $value ): string {
	return trim( wp_kses( $value, array() ) );
}

/**
 * Cleans the description of a level.
 *
 * The editor allows bold and italic text in the description, so those tags stay and
 * every other tag is removed.
 *
 * @param string $value The saved description.
 *
 * @return string The description with only bold and italic tags, safe to print.
 */
function clean_description( string $value ): string {
	return trim(
		wp_kses(
			$value,
			array(
				'strong' => array(),
				'em'     => array(),
				'b'      => array(),
				'i'      => array(),
			)
		)
	);
}

/**
 * Returns the cleaned title of a level.
 *
 * @param array $attributes The attributes of the level block.
 *
 * @return string The title, or an empty string when the level has no visible title.
 */
function get_level_title( array $attributes ): string {
	$title = (string) ( $attributes['title'] ?? '' );

	return has_visible_text( $title ) ? clean_inline_text( $title ) : '';
}

/**
 * Returns an allowed heading level for the level titles.
 *
 * TypeScript copy: `toHeadingLevel()` in `src/utils/headings.ts`.
 *
 * @param mixed $value The saved value.
 *
 * @return int 2, 3 or 4. Any other value gives 3.
 */
function get_heading_level( mixed $value ): int {
	$level = is_numeric( $value ) ? (int) $value : 0;

	return in_array( $level, array( 2, 3, 4 ), true ) ? $level : 3;
}

/**
 * Cleans the lessons of a level and drops the lessons that have no title.
 *
 * The `lessons` attribute is stored as plain JSON, so any value can be in it. Every
 * field gets a valid value here. A lesson without a title is dropped, because it
 * would show an empty row. The editor warns about such a lesson and does not count it.
 *
 * TypeScript copy: `normalizeLessons()` and `getVisibleLessons()` in `src/utils/lessons.ts`.
 *
 * @param mixed $raw The saved value of the `lessons` attribute.
 *
 * @return array<int, array{title: string, type: string, minutes: int, xp: int, is_free_preview: bool, preview_url: string}> The lessons.
 */
function sanitize_lessons( mixed $raw ): array {
	if ( ! is_array( $raw ) ) {
		return array();
	}

	$types   = get_lesson_types();
	$lessons = array();

	foreach ( $raw as $item ) {
		if ( ! is_array( $item ) ) {
			continue;
		}

		$title = isset( $item['title'] ) && is_string( $item['title'] ) ? sanitize_text_field( $item['title'] ) : '';

		if ( '' === $title ) {
			continue;
		}

		$type = isset( $item['type'] ) && is_string( $item['type'] ) ? $item['type'] : '';
		$url  = isset( $item['previewUrl'] ) && is_string( $item['previewUrl'] ) ? $item['previewUrl'] : '';

		$lessons[] = array(
			'title'           => $title,
			'type'            => isset( $types[ $type ] ) ? $type : get_default_lesson_type(),
			'minutes'         => to_count( $item['minutes'] ?? 0 ),
			'xp'              => to_count( $item['xp'] ?? 0 ),
			'is_free_preview' => true === ( $item['isFreePreview'] ?? false ),
			// Only web addresses are allowed, so a saved `javascript:` address is removed.
			'preview_url'     => esc_url_raw( trim( $url ), array( 'http', 'https' ) ),
		);
	}

	return $lessons;
}

/**
 * Adds up the levels of the accordion.
 *
 * A level without a title is not shown, so it is not counted either.
 *
 * TypeScript copy: `summarizeLevels()` in `src/utils/summary.ts`.
 *
 * @param WP_Block $block The parent block. Its inner blocks are the levels.
 *
 * @return array{levels: int, lessons: int, minutes: int, xp: int, badges: int, all_open: bool} The totals.
 *               `all_open` is true when every shown level starts open.
 */
function summarize_levels( WP_Block $block ): array {
	$summary = array(
		'levels'   => 0,
		'lessons'  => 0,
		'minutes'  => 0,
		'xp'       => 0,
		'badges'   => 0,
		'all_open' => true,
	);

	foreach ( $block->inner_blocks as $level ) {
		if ( LEVEL_BLOCK_NAME !== $level->name || '' === get_level_title( $level->attributes ) ) {
			continue;
		}

		$lessons = sanitize_lessons( $level->attributes['lessons'] ?? array() );

		++$summary['levels'];
		$summary['lessons'] += count( $lessons );
		$summary['minutes'] += array_sum( array_column( $lessons, 'minutes' ) );
		$summary['xp']      += array_sum( array_column( $lessons, 'xp' ) );

		if ( has_visible_text( (string) ( $level->attributes['badge'] ?? '' ) ) ) {
			++$summary['badges'];
		}

		if ( empty( $level->attributes['openByDefault'] ) ) {
			$summary['all_open'] = false;
		}
	}

	if ( 0 === $summary['levels'] ) {
		$summary['all_open'] = false;
	}

	return $summary;
}

/**
 * Builds the texts of the summary bar.
 *
 * TypeScript copy: `SummaryBar` in `src/components/SummaryBar.tsx`. The texts are the
 * same, so a translation works in the editor and on the public page.
 *
 * @param array $summary     The totals from summarize_levels().
 * @param bool  $show_xp     Whether the XP total is shown.
 * @param bool  $show_badges Whether the badge count is shown.
 *
 * @return string[] The texts, in display order. They are not escaped.
 */
function get_summary_items( array $summary, bool $show_xp, bool $show_badges ): array {
	$items = array(
		/* translators: %d: the number of levels in the course. */
		sprintf( _n( '%d level', '%d levels', $summary['levels'], 'math-blazer' ), $summary['levels'] ),
		/* translators: %d: the number of lessons in the course. */
		sprintf( _n( '%d lesson', '%d lessons', $summary['lessons'], 'math-blazer' ), $summary['lessons'] ),
		/* translators: %s: a duration such as "2 h 30 min". */
		sprintf( __( '%s in total', 'math-blazer' ), format_minutes( $summary['minutes'] ) ),
	);

	if ( $show_xp ) {
		/* translators: %d: the XP that the whole course offers. */
		$items[] = sprintf( __( '%d XP to earn', 'math-blazer' ), $summary['xp'] );
	}

	if ( $show_badges && $summary['badges'] > 0 ) {
		/* translators: %d: the number of badges the course offers. */
		$items[] = sprintf( _n( '%d badge', '%d badges', $summary['badges'], 'math-blazer' ), $summary['badges'] );
	}

	return $items;
}

/**
 * Builds the short facts under a level title: lessons, time and XP.
 *
 * TypeScript copy: `LevelMeta` in `src/components/LevelMeta.tsx`.
 *
 * @param array $lessons The cleaned lessons of the level.
 * @param bool  $show_xp Whether the XP total is shown.
 *
 * @return string[] The texts, in display order. They are not escaped.
 */
function get_level_meta_items( array $lessons, bool $show_xp ): array {
	if ( array() === $lessons ) {
		return array();
	}

	$minutes = array_sum( array_column( $lessons, 'minutes' ) );
	$xp      = array_sum( array_column( $lessons, 'xp' ) );
	$items   = array(
		/* translators: %d: the number of lessons in the level. */
		sprintf( _n( '%d lesson', '%d lessons', count( $lessons ), 'math-blazer' ), count( $lessons ) ),
	);

	if ( $minutes > 0 ) {
		$items[] = format_minutes( $minutes );
	}

	if ( $show_xp && $xp > 0 ) {
		/* translators: %d: the XP that the level offers. */
		$items[] = sprintf( __( '%d XP', 'math-blazer' ), $xp );
	}

	return $items;
}
