<?php
/**
 * Main FilterHooks class.
 *
 * @package TinySolutions\WM
 */

namespace TinySolutions\boilerplate\Controllers\Hooks;

use TinySolutions\boilerplate\Helpers\Fns;

defined( 'ABSPATH' ) || exit();

/**
 * Main FilterHooks class.
 */
class FilterHooks {
	/**
	 * Init Hooks.
	 *
	 * @return void
	 */
	public static function init_hooks() {
        // Plugins Setting Page.
        add_filter( 'plugin_action_links_' . CPTINIT_BASENAME,  [ __CLASS__, 'plugins_setting_links' ] );
		add_filter('plugin_row_meta', [ __CLASS__, 'plugin_row_meta' ], 10, 2);
	}

    /**
     * @param array $links default plugin action link
     *
     * @return array [array] plugin action link
     */
    public static function plugins_setting_links( $links ) {
        $links['mediaedit_settings'] = '<a href="' . admin_url( 'admin.php?page=boilerplate-admin' ) . '">' . esc_html__( 'Start Editing', 'boilerplate' ) . '</a>';
        /*
         * TODO:: Next Version
         *
         */
        if( ! Fns::is_plugins_installed('media-library-tools-pro/media-library-tools-pro.php') ){
            // $links['boilerplate_pro'] = sprintf( '<a href="#" target="_blank" style="color: #39b54a; font-weight: bold;">' . esc_html__( 'Go Pro', 'wp-media' ) . '</a>' );
        }
        return $links;
    }
	/**
	 * @param $links
	 * @param $file
	 *
	 * @return array
	 */
	public static function plugin_row_meta($links, $file) {
		if ( $file == CPTINIT_BASENAME ) {
			$report_url = 'https://www.wptinysolutions.com/contact' ;//home_url( '/wp-admin/upload.php?page=tsmlt-media-tools' );
			$row_meta['issues'] = sprintf('%2$s <a target="_blank" href="%1$s">%3$s</a>', esc_url($report_url), esc_html__('Facing issue?', 'tsmlt-media-tools'), '<span style="color: red">' . esc_html__('Please open a support ticket.', 'tsmlt-media-tools') . '</span>');
			return array_merge($links, $row_meta);
		}
		return (array)$links;
	}

}

