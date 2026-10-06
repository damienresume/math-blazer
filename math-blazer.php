<?php
/**
 * Plugin Name:       Math Blazer
 * Plugin URI:        https://github.com/damienresume/math-blazer
 * Description:       A course curriculum accordion for the storefront of a math gamification Learning Management System. Editors list levels, lessons, XP rewards and badges in the block editor, and visitors see an accessible accordion.
 * Version:           0.1.0
 * Requires at least: 6.9
 * Tested up to:      7.1
 * Requires PHP:      8.2
 * Author:            Damien Lawson
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       math-blazer
 *
 * This is the main plugin file. WordPress reads the header above to list the plugin
 * and to check the minimum WordPress and PHP versions before the plugin can be activated.
 *
 * The file has one job: register the blocks. The blocks themselves are defined in
 * `src/` and compiled into `build/` by `npm run build`.
 *
 * @package MathBlazer\SampleCourse
 */

// Turn on strict type checking for this file, so that a wrong argument type causes an
// error during development instead of being converted silently.
declare( strict_types=1 );

namespace MathBlazer\SampleCourse;

// Stop the file from running if it is requested directly by URL. WordPress defines
// ABSPATH when it loads plugins, so a direct request will not have it.
defined( 'ABSPATH' ) || exit;

/**
 * Absolute path to the folder that holds the compiled blocks.
 *
 * The build tool writes every block here, together with `blocks-manifest.php`.
 * The folder is not stored in Git, so it exists only after the build has run.
 */
const BUILD_DIR = __DIR__ . '/build';

/**
 * Absolute path to the folder that holds the data files shared with the editor code.
 *
 * `lesson-types.json` and `icons.json` are read by the TypeScript code, which
 * compiles them into the editor script, and by PHP, which reads them at run time.
 * The folder is part of the plugin package, unlike `src/`.
 */
const DATA_DIR = __DIR__ . '/data';

// The helper functions that the render templates use. They are loaded here, once,
// instead of in each template, because both templates need them.
require_once __DIR__ . '/includes/helpers.php';

/**
 * Registers every block of this plugin.
 *
 * The build tool creates `blocks-manifest.php`. It holds the `block.json` data of
 * all blocks in one PHP file. Registering from this file means WordPress reads one
 * file on each request instead of opening a separate `block.json` file for every block.
 * The function needs WordPress 6.8 or newer, and this plugin requires 6.9 or newer.
 *
 * @return void
 */
function register_blocks(): void {
	$manifest = BUILD_DIR . '/blocks-manifest.php';

	// If the build has not run yet, the manifest does not exist. Registering would fail,
	// so the plugin shows a notice to administrators and stops here. The rest of the
	// site keeps working.
	if ( ! is_readable( $manifest ) ) {
		add_action( 'admin_notices', show_missing_build_notice( ... ) );
		return;
	}

	wp_register_block_types_from_metadata_collection( BUILD_DIR, $manifest );
}
add_action( 'init', register_blocks( ... ) );

/**
 * Tells administrators that the block files have not been built.
 *
 * Only users who can manage plugins see the notice, because editors cannot fix
 * the problem themselves.
 *
 * @return void
 */
function show_missing_build_notice(): void {
	if ( ! current_user_can( 'activate_plugins' ) ) {
		return;
	}

	wp_admin_notice(
		esc_html__( 'Math Blazer: the block files are missing. Run "npm install" and "npm run build" in the plugin folder, or use the Docker setup described in README.md.', 'math-blazer' ),
		array( 'type' => 'error' )
	);
}
