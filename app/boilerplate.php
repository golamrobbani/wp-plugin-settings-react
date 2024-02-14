<?php
/**
 * Main initialization class.
 *
 * @package TinySolutions\boilerplate
 */

// Do not allow directly accessing this file.
if ( ! defined( 'ABSPATH' ) ) {
	exit( 'This script cannot be accessed directly.' );
}
require_once BPR_PATH . 'vendor/autoload.php';

use BPR\boilerplate\Traits\SingletonTrait;
use BPR\boilerplate\Controllers\Installation;
use BPR\boilerplate\Controllers\Dependencies;
use BPR\boilerplate\Controllers\AssetsController;
use BPR\boilerplate\Controllers\Hooks\FilterHooks;
use BPR\boilerplate\Controllers\Hooks\ActionHooks;
use BPR\boilerplate\Controllers\Admin\AdminMenu;
use BPR\boilerplate\Controllers\Admin\Api;
use BPR\boilerplate\Controllers\Admin\RegisterPostAndTax;
use BPR\boilerplate\Controllers\Admin\Review;

if ( ! class_exists( Cptint::class ) ) {
	/**
	 * Main initialization class.
	 */
	final class Cptint {

		/**
		 * Nonce id
		 *
		 * @var string
		 */
		public $nonceId = 'boilerplate_wpnonce';

		/**
		 * Post Type.
		 *
		 * @var string
		 */
//		public $current_theme;
        /**
         * Post Type.
         *
         * @var string
         */
        public $category = 'boilerplate_category';
		/**
		 * Singleton
		 */
		use SingletonTrait;

		/**
		 * Class Constructor
		 */
		private function __construct() {

			// $this->current_theme = wp_get_theme()->get( 'TextDomain' );

			add_action( 'init', [ $this, 'language' ] );
			add_action( 'plugins_loaded', [ $this, 'init' ], 100 );
			// Register Plugin Active Hook.
			register_activation_hook( BPR_FILE, [ Installation::class, 'activate' ] );
			// Register Plugin Deactivate Hook.
			register_deactivation_hook( BPR_FILE, [ Installation::class, 'deactivation' ] );

        }

		/**
		 * Assets url generate with given assets file
		 *
		 * @param string $file File.
		 *
		 * @return string
		 */
		public function get_assets_uri( $file ) {
			$file = ltrim( $file, '/' );
			return trailingslashit( BPR_URL . '/assets' ) . $file;
		}

		/**
		 * Get the template path.
		 *
		 * @return string
		 */
		public function get_template_path() {
			return apply_filters( 'boilerplate_template_path', 'templates/' );
		}

		/**
		 * Get the plugin path.
		 *
		 * @return string
		 */
		public function plugin_path() {
			return untrailingslashit( plugin_dir_path( BPR_FILE ) );
		}

		/**
		 * Load Text Domain
		 */
		public function language() {
			load_plugin_textdomain( 'boilerplate', false, BPR_ABSPATH . '/languages/' );
		}

		/**
		 * Init
		 *
		 * @return void
		 */
		public function init() {
			if ( ! Dependencies::instance()->check() ) {
				return;
			}

			do_action( 'boilerplate/before_loaded' );

            Review::instance();
			// Include File.
            AssetsController::instance();
            AdminMenu::instance();
            FilterHooks::init_hooks();
			ActionHooks::init_hooks();
            Api::instance();

			do_action( 'boilerplate/after_loaded' );
		}

		/**
		 * Checks if Pro version installed
		 *
		 * @return boolean
		 */
		public function has_pro() {
			return function_exists( 'boilerplatep' );
		}

		/**
		 * PRO Version URL.
		 *
		 * @return string
		 */
		public function pro_version_link() {
			return '#';
		}
	}

	/**
	 * @return Cptint
	 */
	function boilerplate() {
		return Cptint::instance();
	}

	boilerplate();
}
