<?php

namespace BPR\boilerplate\Models;

// Do not allow directly accessing this file.
if ( ! defined( 'ABSPATH' ) ) {
	exit( 'This script cannot be accessed directly.' );
}

use BPR\boilerplate\Traits\SingletonTrait;
/***
 * Settings
 */
class Settings {

	use SingletonTrait;

	/**
	 * Public function store.
	 * store data for post
	 *
	 * @since 1.0.0
	 */
	public function get_sections() {

		$sections = [
			'general' => GeneralList::instance()->get_section(),
		];

		return apply_filters( 'rtsb/core/settings/sections', $sections );
	}
}
