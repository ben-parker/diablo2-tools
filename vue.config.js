const JSONMinifyPlugin = require('node-json-minify');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    publicPath: '/diablo2-tools/',
    configureWebpack: {
        plugins: [
            new CopyWebpackPlugin({
                patterns: [
                    {
                        context: './public/data',
                        from: '*.json',
                        transform: function(content) {
                            // minify json
                            return JSONMinifyPlugin(content.toString());
                        },
                        to: 'data'
                    }
                ]
            })
        ]
    }
}