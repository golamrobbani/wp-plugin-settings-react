const path = require('path');
const defaults = require('@wordpress/scripts/config/webpack.config');

module.exports = {
    ...defaults,

    entry: {
        'admin/admin':'./src/js/backend/admin-settings.jsx',
        'frontend/frontend':'./src/js/frontend/index.jsx',
    },

    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'assets')
    },

    externals: {
        react: 'React',
        'react-dom': 'ReactDOM',
    },

};