const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');
const webpack = require('webpack');
const HtmlPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssPlugin = require('optimize-css-assets-webpack-plugin');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.base.conf');
const utils = require('./utils');
const config = require('./config');

module.exports = merge.merge(baseConfig, {
    module: {
        rules: utils.styleLoader({
            sourceMap: config.build.cssSourceMap,
            cssModules: config.cssModules,
            extract: true,
        }),
    },
    output: {
        path: utils.resolve('dist'),
        publicPath: config.build.publicPath,
        filename: config.build.isSplit ? '[name].[chunkhash].js' : `${config.build.filename}.js`,
    },
    mode: 'production',
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            },
        }),
        new CleanWebpackPlugin(),
        new HtmlPlugin({
            filename: 'index.html',
            template: utils.resolve('public/index.html'),
            inject: true,
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeAttributeQuotes: true,
            },
            chunksSortMode: 'manual',
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
            }],
        }),
        new CssExtractPlugin({
            filename: config.build.isSplit ? '[name].[chunkhash].css' : `${config.build.filename}.css`,
        }),
        new OptimizeCssPlugin({
            cssProcessorOptions: {
                safe: true,
            },
        }),
    ],
    optimization: {
        ...(config.build.isSplit ? {
            runtimeChunk: {
                name: 'manifest',
            },
            splitChunks: {
                chunks: 'all',
            },
        } : {}),
        minimize: config.build.isUglify,
    }
});
