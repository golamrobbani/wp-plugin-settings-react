const defaults = require('@wordpress/scripts/config/webpack.config');

module.exports = {
    ...defaults,
    entry: {
        admin:'./src/admin-settings.jsx',
    },
    externals: {
        react: 'React',
        'react-dom': 'ReactDOM',
    },

};