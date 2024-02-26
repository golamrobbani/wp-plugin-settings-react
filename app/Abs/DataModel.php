<?php

namespace BPR\boilerplate\Abs;

// Do not allow directly accessing this file.
if ( ! defined( 'ABSPATH' ) ) {
	exit( 'This script cannot be accessed directly.' );
}

/**
* Data Model
*/

class DataModel {
	private $db_key;
	private static $instances = [];

	private function __construct( $source ) {
		$this->set_db_key( $source );
	}

	public static function source( $source = 'settings' ) {
		if ( ! isset( self::$instances[ $source ] ) ) {
			self::$instances[ $source ] = new self( $source );
		}

		return self::$instances[ $source ];
	}

	private function set_db_key( $source ) {
		$this->db_key = 'boilerplate_' . $source;
	}

	public function get_option( $key, $default = null, $cache = true ) {
		if ( $cache && isset( $GLOBALS[ $this->db_key ] ) ) {
			$db = $GLOBALS[ $this->db_key ];
		} else {
			$db                       = get_option( $this->db_key, [] );
			$GLOBALS[ $this->db_key ] = $db;
		}
		return $db[ $key ] ?? $default;
	}

	public function set_option( $key, $value ) {
		$db = get_option( $this->db_key, [] );

		if ( is_object( $db ) ) {
			$db = (array) $db;
		}

		if ( ! is_array( $db ) ) {
			$db = [];
		}

		$db[ $key ] = $value;

		return update_option( $this->db_key, $db );
	}

	public function delete_option( $key ) {
		$db = get_option( $this->db_key, [] );
		if ( isset( $db[ $key ] ) ) {
			unset( $db[ $key ] );
		}
		return update_option( $this->db_key, $db );
	}
}
