<?php
/**
 * Fns Helpers class
 *
 * @package  TinySolutions\boilerplate
 */

namespace BPR\boilerplate\Helpers;

// Do not allow directly accessing this file.
if ( ! defined( 'ABSPATH' ) ) {
	exit( 'This script cannot be accessed directly.' );
}

/**
 * Fns class
 */
class Fns {

	/**
	 *  Verify nonce.
	 *
	 * @return bool
	 */
	public static function verify_nonce() {
		$nonce     = isset( $_REQUEST[ boilerplate()->nonceId ] ) ? $_REQUEST[ boilerplate()->nonceId ] : null;
		if ( wp_verify_nonce( $nonce, boilerplate()->nonceId ) ) {
			return true;
		}

		return false;
	}

	/**
	 * @param $plugin_file_path
	 *
	 * @return bool
	 */
	public static function is_plugins_installed( $plugin_file_path = null ) {
		$installed_plugins_list = get_plugins();

		return isset( $installed_plugins_list[ $plugin_file_path ] );
	}


	/**
	 * @return false|string
	 */
	public static function get_options() {
		$defaults = array(

		);
		$options  = get_option( 'boilerplate_settings' );
		return wp_parse_args( $options, $defaults );
	}
	
	/**
	 * @param $data
	 *
	 * @return mixed|string
	 */
	public static function stripslashes_value( $data ) {
		if ( is_string( $data ) && strpos( $data, '\\' ) !== false ) {
			return stripslashes( $data );
		} elseif ( is_array( $data ) ) {
			foreach ( $data as $key => $value ) {
				$data[ $key ] = self::stripslashes_value( $value );
			}
		}
		
		return $data;
	}

}
