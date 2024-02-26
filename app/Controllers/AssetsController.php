<?php

namespace BPR\boilerplate\Controllers;

use BPR\boilerplate\Models\Settings;
use BPR\boilerplate\Traits\SingletonTrait;

// Do not allow directly accessing this file.
if ( ! defined( 'ABSPATH' ) ) {
	exit( 'This script cannot be accessed directly.' );
}

/**
 * AssetsController
 */
class AssetsController {

	/**
	 * Singleton
	 */
	use SingletonTrait;

	/**
	 * Plugin version
	 *
	 * @var string
	 */
	private $version;

	/**
	 * Ajax URL
	 *
	 * @var string
	 */
	private $ajaxurl;

	/**
	 * Class Constructor
	 */
	public function __construct() {
		$this->version = ( defined( 'WP_DEBUG' ) && WP_DEBUG ) ? time() : BPR_VERSION;
		/**
		 * Admin scripts.
		 */
		add_action( 'admin_enqueue_scripts', [ $this, 'backend_assets' ], 1 );
	}


	/**
	 * Registers Admin scripts.
	 *
	 * @return void
	 */
	public function backend_assets( $hook ) {
		$script_block_asset_path = BPR_ABSPATH . '/admin/main.asset.php';
		if ( file_exists( $script_block_asset_path ) ) {
			$script_block_dependencies = require $script_block_asset_path;
		} else {
			$script_block_dependencies = [
				'dependencies' => [],
			];
		}

		$scripts = [
			[
				'handle' => 'boilerplate-settings',
				'src'    => boilerplate()->get_assets_uri( 'admin/admin.js' ),
				'deps'   => $script_block_dependencies['dependencies'],
				'footer' => true,
			],
		];

		// Register public scripts.
		foreach ( $scripts as $script ) {
			wp_register_script( $script['handle'], $script['src'], $script['deps'], $this->version, $script['footer'] );
		}

		$current_screen = get_current_screen();

		if ( isset( $current_screen->id ) && 'toplevel_page_boilerplate-admin' === $current_screen->id ) {
			wp_enqueue_style( 'boilerplate-settings' );
			wp_enqueue_script( 'boilerplate-settings' );

			wp_localize_script(
				'boilerplate-settings',
				'boilerplateParams',
				[
					'ajaxUrl'              => esc_url( admin_url( 'admin-ajax.php' ) ),
					'adminUrl'             => esc_url( admin_url() ),
					'restApiUrl'           => esc_url_raw( rest_url() ),
					'rest_nonce'           => wp_create_nonce( 'wp_rest' ),
					'sections'             => Settings::instance()->get_sections(),
					boilerplate()->nonceId => wp_create_nonce( boilerplate()->nonceId ),
				]
			);
		}
	}
}

