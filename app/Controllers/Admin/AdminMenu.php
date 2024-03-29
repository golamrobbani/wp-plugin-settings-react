<?php

namespace BPR\boilerplate\Controllers\Admin;

// Do not allow directly accessing this file.
if ( ! defined( 'ABSPATH' ) ) {
	exit( 'This script cannot be accessed directly.' );
}

use BPR\boilerplate\Traits\SingletonTrait;

/**
 * Sub menu class
 *
 * @author Mostafa <mostafa.soufi@hotmail.com>
 */
class AdminMenu {

	/**
	 * Singleton
	 */
	use SingletonTrait;

	/**
	 * Autoload method
	 *
	 * @return void
	 */
	private function __construct() {
		add_action( 'admin_menu', [ $this, 'register_sub_menu' ] );
	}

	/**
	 * Register submenu
	 *
	 * @return void
	 */
	public function register_sub_menu() {
		add_menu_page(
			'Boilerplate',
			'Boilerplate',
			'manage_options',
			'boilerplate-admin',
			[ $this, 'wp_media_page_callback' ],
			'dashicons-tickets',
			6
		);
	}

	/**
	 * Render submenu
	 *
	 * @return void
	 */
	public function wp_media_page_callback() {
		?>
		<div class="wrap">
			<div id="boilerplate_root">
				<p>Js error Occurred</p>
				<code> yarn install </code> OR <code> npm run install </code> To install package <br/>
				<code> yarn watch </code> OR <code> npm run watch </code> to compile js file <br/>
                <code> yarn zip</code> OR <code> npm run zip</code> to create a package with production zip file ready
			</div>
		</div>
		<?php
	}
}
