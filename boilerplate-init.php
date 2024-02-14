<?php

/**
 * @wordpress-plugin
 * Plugin Name:       Boilerplate - Settings Page With React ( Using wp-scripts )
 * Plugin URI:        https://wordpress.org/support/plugin/wp-plugin-boilerplate-react-with-mix
 * Description:       Boilerplate
 * Version:           0.0.1
 * Author:            Boilerplate
 * Author URI:        https://boilerplate.com/
 * Text Domain:       boilerplate
 * Domain Path:       /languages
 */

// Do not allow directly accessing this file.
if (!defined('ABSPATH')) {
	exit('This script cannot be accessed directly.');
}

/**
 * Define media edit Constant.
 */
define('BPR_VERSION', '0.0.1');

define('BPR_FILE', __FILE__);

define('BPR_BASENAME', plugin_basename(BPR_FILE));

define('BPR_URL', plugins_url('', BPR_FILE));

define('BPR_ABSPATH', dirname(BPR_FILE));

define( 'BPR_PATH', plugin_dir_path(BPR_FILE ) );

/**
 * App Init.
 */

require_once 'app/boilerplate.php';
