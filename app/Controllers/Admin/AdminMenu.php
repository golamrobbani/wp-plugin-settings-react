<?php

namespace TinySolutions\boilerplate\Controllers\Admin;

// Do not allow directly accessing this file.
if (!defined('ABSPATH')) {
    exit('This script cannot be accessed directly.');
}

use TinySolutions\boilerplate\Traits\SingletonTrait;

/**
 * Sub menu class
 *
 * @author Mostafa <mostafa.soufi@hotmail.com>
 */
class AdminMenu
{
    /**
     * Singleton
     */
    use SingletonTrait;

    /**
     * Autoload method
     * @return void
     */
    private function __construct()
    {
        add_action('admin_menu', array($this, 'register_sub_menu'));
    }

    /**
     * Register submenu
     * @return void
     */
    public function register_sub_menu()
    {
        add_menu_page(
            'CPT Init',
            'CPT Init',
            'manage_options',
            'boilerplate-admin',
            [$this, 'wp_media_page_callback'],
            'dashicons-tickets',
            6
        );
    }

    /**
     * Render submenu
     * @return void
     */
    public function wp_media_page_callback()
    {
        echo '<div class="wrap"><div id="boilerplate_root">Hello</div></div>';
    }
}
