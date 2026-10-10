#!/bin/sh
# Prepares the local WordPress site for development. The "wpcli" service in
# docker-compose.yml runs this script once after the build has finished.
#
# The script is safe to run again. Each step checks whether it has already been done.
#
# Settings such as WP_URL and WP_ADMIN_USER come from the environment of the "wpcli"
# service. Docker Compose sets them from docker-compose.yml and the optional .env file.

# Stop on the first error (-e) and on use of an unset variable (-u), so a failed step
# does not hide behind later steps that look successful.
set -eu

WP_PATH="/var/www/html"
PLUGIN_SLUG="math-blazer"
PLUGIN_PATH="${WP_PATH}/wp-content/plugins/${PLUGIN_SLUG}"

# Runs WP-CLI against the WordPress folder, so every command below is shorter.
wp_cli() {
	wp --path="${WP_PATH}" "$@"
}

# The WordPress container copies the WordPress files into the shared volume and creates
# wp-config.php when it starts. WP-CLI can start earlier than that, so wait for both.
echo "Waiting for the WordPress files..."
until [ -f "${WP_PATH}/wp-config.php" ] && [ -f "${WP_PATH}/wp-includes/version.php" ]; do
	sleep 2
done

# Install WordPress only when the database does not hold a site yet.
if ! wp_cli core is-installed; then
	echo "Installing WordPress..."
	wp_cli core install \
		--url="${WP_URL}" \
		--title="${WP_TITLE}" \
		--admin_user="${WP_ADMIN_USER}" \
		--admin_password="${WP_ADMIN_PASSWORD}" \
		--admin_email="${WP_ADMIN_EMAIL}" \
		--skip-email
else
	echo "WordPress is already installed."
fi

# Remove the page that WordPress creates during the install.
DEFAULT_PAGE_ID="$(wp_cli post list --post_type=page --name=sample-page --field=ID)"
if [ -n "${DEFAULT_PAGE_ID}" ]; then
	echo "Removing the default Sample Page..."
	wp_cli post delete ${DEFAULT_PAGE_ID} --force
fi

# Use readable page addresses such as /sample-course/. The --hard option writes the
# .htaccess file that Apache needs for these addresses.
wp_cli rewrite structure '/%postname%/' --hard

# Activate the plugin. Activation works even when the build is missing, because the
# plugin shows a notice to administrators in that case.
wp_cli plugin activate "${PLUGIN_SLUG}"

# Use the storefront child theme. It gives the site a clean footer with a copyright
# line. Activating a theme that is already active changes nothing, so this is safe to repeat.
wp_cli theme activate math-blazer-storefront

# Create a sample course page if the sample content file exists. The file is added in a
# later part of the project, after the blocks exist. Without it, this step is skipped.
SAMPLE_FILE="${PLUGIN_PATH}/docker/sample-course.html"
if [ -f "${SAMPLE_FILE}" ]; then
	if [ -z "$(wp_cli post list --post_type=page --name=sample-course --field=ID)" ]; then
		echo "Creating the sample course page..."
		wp_cli post create "${SAMPLE_FILE}" \
			--post_type=page \
			--post_status=publish \
			--post_title="Sample Course" \
			--post_name="sample-course"
	else
		echo "The sample course page already exists."
	fi
else
	echo "No sample course file found, so the sample page was not created."
fi

# Create the free preview pages that the free preview links of the sample course open.
# The parent page "Free previews" has the address /preview/. Each lesson page is a child
# page, so its address is /preview/<slug>/. A page is created only when no page with the
# same address exists, so running the script again never makes duplicates or overwrites
# changes that you made in the editor.
PREVIEW_DIR="${PLUGIN_PATH}/docker/free-previews"
if [ -d "${PREVIEW_DIR}" ]; then
	# Finds the ID of a published page by its slug and parent ID. Prints nothing when the
	# page does not exist. Parent ID 0 means a top level page.
	find_page() {
		wp_cli post list --post_type=page --name="$1" --post_parent="$2" --field=ID
	}

	# Creates a page from a content file and prints its ID. Arguments: file, title, slug,
	# parent ID.
	create_page() {
		wp_cli post create "$1" \
			--post_type=page \
			--post_status=publish \
			--post_title="$2" \
			--post_name="$3" \
			--post_parent="$4" \
			--porcelain
	}

	PREVIEW_PARENT_ID="$(find_page preview 0)"
	if [ -z "${PREVIEW_PARENT_ID}" ]; then
		echo "Creating the free previews page..."
		PREVIEW_PARENT_ID="$(create_page "${PREVIEW_DIR}/index.html" "Free previews" preview 0)"
	fi

	for PREVIEW in "place-value|Place value adventure" "slice-the-pizza|Slice the pizza"; do
		PREVIEW_SLUG="${PREVIEW%%|*}"
		PREVIEW_TITLE="${PREVIEW#*|}"
		if [ -z "$(find_page "${PREVIEW_SLUG}" "${PREVIEW_PARENT_ID}")" ]; then
			echo "Creating the free preview page: ${PREVIEW_TITLE}..."
			create_page "${PREVIEW_DIR}/${PREVIEW_SLUG}.html" "${PREVIEW_TITLE}" "${PREVIEW_SLUG}" "${PREVIEW_PARENT_ID}" > /dev/null
		fi
	done
else
	echo "No free preview files found, so the free preview pages were not created."
fi

echo ""
echo "The site is ready."
echo "  Site:   ${WP_URL}"
echo "  Admin:  ${WP_URL}/wp-admin"
echo "  User:   ${WP_ADMIN_USER}"
# The password is not printed, because log output can be copied into tickets and chats.
echo "  Password: the value of WP_ADMIN_PASSWORD in your .env file"
