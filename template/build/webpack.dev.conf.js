const webpack = require('webpack');
const merge = require('webpack-merge');
const HtmlPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const utils = require('./utils');
const config = require('./config');
const baseConfig = require('./webpack.base.conf');

module.exports = merge.merge(baseConfig, {
    mode: 'development',
    module: {
        rules: utils.styleLoader({
            sourceMap: config.dev.cssSourceMap,
            extract: false,
            cssModules: config.cssModules,
        }),
    },
    output: {
        publicPath: config.dev.publicPath,
    },
    devtool: config.dev.devtool,
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"development"'
            },
        }),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin(),
        new HtmlPlugin({
            template: utils.resolve('public/index.html'),
            inject: true,
            filename: 'index.html',
        }),
        new CopyPlugin({
            patterns: [{
                from: utils.resolve('public/**/*'),
                globOptions: {
                    ignore: ['**/*/index.html']
                },
                transformPath(targetPath) {
                    return targetPath.slice(7);
                },
            }]
        }),
    ]
});
