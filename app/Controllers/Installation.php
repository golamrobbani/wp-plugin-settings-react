<?php

namespace TinySolutions\boilerplate\Controllers;

// Do not allow directly accessing this file.
if ( ! defined( 'ABSPATH' ) ) {
    exit( 'This script cannot be accessed directly.' );
}

class Installation {
    /**
     * @return void
     */
    public static function activate() {
        if ( ! get_option( 'boilerplate_plugin_version' ) ) {
            $options = get_option( 'boilerplate_settings' , [] );
            $get_activation_time = strtotime( 'now' );

            update_option( 'boilerplate_settings', $options );
            update_option('boilerplate_plugin_version', CPTINIT_VERSION);
            update_option('boilerplate_plugin_activation_time', $get_activation_time);
        }
    }

    /**
     * @return void
     */
    public static function deactivation() { }

}