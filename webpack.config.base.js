/**
 * Base webpack config used across other specific configs
 */

import path from 'path';
import webpack from 'webpack';
import { dependencies as externals } from './app/package.json';

export default {
    externals: Object.keys(externals || {}),

    module: {
        rules: [{
            test: /\.jsx?$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                options: {
                    cacheDirectory: true
                }
            }
        }],
        loaders: [
            {
                test: /select2\.js$/,
                loader: 'imports-loader?define=>false'
            }
        ]
    },

    output: {
        path: path.join(__dirname, 'app'),
        filename: 'bundle.js',
        // https://github.com/webpack/webpack/issues/1114
        libraryTarget: 'commonjs2'
    },

    /**
     * Determine the array of extensions that should be used to resolve modules.
     */
    resolve: {
        extensions: ['.js', '.jsx', '.json'],
        modules: [
            path.join(__dirname, 'app'),
            'node_modules'
        ],
        alias: {
            jquery: 'jquery/src/jquery'
        }
    },

    plugins: [
        new webpack.NamedModulesPlugin(),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery'
        })
    ]
};
