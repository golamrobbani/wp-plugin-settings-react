<?php

namespace BPR\boilerplate\Models\Base;

use BPR\boilerplate\Abs\DataModel;
use BPR\boilerplate\Helpers\Fns;

defined( 'ABSPATH' ) || exit;

/**
 * List Modal
 */
abstract class ListModel {
	/**
	 * @var $list_id
	 */
	protected $list_id;
	/**
	 * @var $title
	 */
	protected $title;
	/**
	 * @var $short_title
	 */
	protected $short_title;
	/**
	 * @var $description
	 */
	protected $description;
	/**
	 * @var array $full_list
	 */
	private $full_list = [];
	/**
	 * @var array $active_list
	 */
	private $active_list = [];
	/**
	 * @var array $inactive_list
	 */
	private $inactive_list = [];
	/**
	 * @var mixed|null $db_options
	 */
	private $db_options = [];
	/**
	 * @var array $categories
	 */
	protected $categories = [];
	/**
	 * Construct
	 */
	public function __construct() {
		$this->db_options = DataModel::source()->get_option( $this->list_id, [] );
		$raw_list         = apply_filters( 'boilerplate/' . $this->list_id . '/list', $this->raw_list() );
		if ( ! empty( $raw_list ) ) {
			foreach ( $raw_list as $name => $item ) {

				if ( ! empty( $item['package'] ) && $item['package'] === 'pro-disabled' ) {
					$item['fields']               = [];
					$item['active']               = false;
					$this->full_list[ $name ]     = $item;
					$this->inactive_list[ $name ] = $item;
					continue;
				}

				if ( ! isset( $this->db_options[ $name ]['active'] ) && ! empty( $item['active'] ) ) {
					$item['active'] = 'on';
				} else {
					$item['active'] = isset( $this->db_options[ $name ]['active'] ) && $this->db_options[ $name ]['active'] === 'on' ? 'on' : '';
				}

				if ( ! empty( $item['fields'] ) ) {
					foreach ( $item['fields'] as $field_key => $field ) {
						$the_value                             = $this->db_options[ $name ][ $field_key ] ?? ( $item['fields'][ $field_key ]['value'] ?? '' );
						$sanitized_value                       = Fns::stripslashes_value( $the_value );
						$item['fields'][ $field_key ]['value'] = $sanitized_value;
					}
				}
				$this->full_list[ $name ] = $item;

				if ( 'on' === $item['active'] ) {
					$this->active_list[ $name ] = $item;
				} else {
					$this->inactive_list[ $name ] = $item;
				}
			}
		}
	}

	/**
	 * @return string Pro Package
	 */
	protected function pro_package() {
		return boilerplate()->has_pro() ? 'pro' : 'pro-disabled';
	}
	/**
	 * @param $key
	 *
	 * @return bool
	 */
	public function is_widget_active( $key ) {
		return isset( $this->active_list[ $key ] );
	}

	/**
	 * @param mixed  $list true | anything
	 * @param string $filter_type full|active|inactive
	 *
	 * @return mixed
	 */
	public function get_list( $list = true, $filter_type = 'full' ) {
		if ( $list !== true && isset( $this->full_list[ $list ] ) ) {
			return $this->full_list[ $list ];
		}

		return $this->{$filter_type . '_list'};
	}
	/**
	 * @return array
	 */
	public function get_section() {
		return [
			'title'       => $this->title,
			'short_title' => ! empty( $this->short_title ) ? $this->short_title : $this->title,
			'description' => $this->description,
			'list'        => $this->get_list(),
			'id'          => $this->list_id,
			'categories'  => $this->categories,
		];
	}

	/**
	 * @param $key
	 *
	 * @return array|mixed
	 */
	public function get_fields( $key ) {
		return isset( $this->full_list[ $key ]['fields'] ) ? $this->full_list[ $key ]['fields'] : [];
	}
	/**
	 * @return mixed|null
	 */
	public function get_data() {
		return $this->db_options;
	}
	/**
	 * @return mixed
	 */
	abstract protected function raw_list();
}
