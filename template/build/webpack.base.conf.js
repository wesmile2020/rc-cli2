const utils = require('./utils');
const config = require('./config');

module.exports = {
    entry: [utils.resolve(config.entry)],
    output: {
        filename: '[name].js',
        globalObject: 'this',
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js'],
    },
    externals: config.externals,
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                enforce: 'pre',
                loader: [{
                    loader: 'eslint-loader',
                }],
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 10000,
                        name: 'img/[name].[hash:7].[ext]',
                    },
                }],
            },
            {
                test: /\.(ts|tsx)$/,
                use: ['babel-loader', {
                    loader: 'ts-loader',
                    options: {
                        transpileOnly: process.env.NODE_ENV === 'development',
                    }
                }],
            },
        ],
    },
};
