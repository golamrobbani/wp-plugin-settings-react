<?php

namespace TinySolutions\boilerplate\Controllers\Admin;

use TinySolutions\boilerplate\Helpers\Fns;
use TinySolutions\boilerplate\Traits\SingletonTrait;
use WP_Error;

class Api {

	/**
	 * Singleton
	 */
	use SingletonTrait;

	/**
	 * @var string
	 */
	private $namespacev1     = 'TinySolutions/boilerplate/v1';
	/**
	 * @var string
	 */
	private $resource_name = '/boilerplate';
	/**
	 * Construct
	 */
	private function __construct() {
		add_action( 'rest_api_init', [ $this, 'register_routes' ] );
	}

	/**
	 * Register our routes.
	 * @return void
	 */
	public function register_routes() {
		register_rest_route( $this->namespacev1, $this->resource_name . '/getoptions', array(
			'methods'             => 'GET',
			'callback'            => [ $this, 'get_options' ],
			'permission_callback' => [ $this, 'login_permission_callback' ],
		) );
		register_rest_route( $this->namespacev1, $this->resource_name . '/updateoptins', array(
			'methods'             => 'POST',
			'callback'            => [ $this, 'update_option' ],
			'permission_callback' => [ $this, 'login_permission_callback' ],
		) );
	}

	/**
	 * @return true
	 */
	public function login_permission_callback() {
		return current_user_can( 'manage_options' );
	}

	/**
	 * @return false|string
	 */
	public function update_option( $request_data ) {
		$result = [
			'updated' => false,
			'message' => esc_html__( 'Update failed. Maybe change not found. ', 'boilerplate-media-tools' )
		];

		$parameters = $request_data->get_params();

		$the_settings = get_option( 'boilerplate_settings', [] );

		$the_settings['default_demo_text'] = ! empty( $parameters['default_demo_text'] ) ? $parameters['default_demo_text'] : '';

		$options = update_option( 'boilerplate_settings', $the_settings );

		$result['updated'] =  boolval( $options );

		if( $result['updated'] ){
			$result['message'] =  esc_html__( 'Updated.', 'boilerplate-media-tools' );
		}
		return $result;
	}

	/**
	 * @return false|string
	 */
	public function get_options() {
		return wp_json_encode( Fns::get_options() );
	}

}




