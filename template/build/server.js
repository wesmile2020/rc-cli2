process.env.NODE_ENV = 'development';
const webpack = require('webpack');
const WebpackServer = require('webpack-dev-server');
const portFinder = require('portfinder');
const ora = require('ora');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const config = require('./config');
const utils = require('./utils');
const webpackConfig = require('./webpack.dev.conf');

const spinner = ora('> Build for develope');
spinner.start();
portFinder.basePort = config.dev.port;
portFinder.getPort((err, port) => {
    if (err) throw err;
    const uri = `http://${utils.getIp()}:${port}`;
    // webpackConfig.entry.push(`webpack-dev-server/client?${uri}`);
    webpackConfig.plugins.push(new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
            messages: [`Your application running on: ${uri}`],
        },
        onErrors: console.log,
    }), new webpack.ProgressPlugin((percentage, msg, moduleProgress, ) => {
        spinner.text = moduleProgress;
        if (percentage === 1) {
            spinner.stop();
        }
    }));
    const compiler = webpack(webpackConfig);

    const server = new WebpackServer(compiler, {
        inline: true,
        quiet: true,
    });
    server.listen(port, (err) => {
        if (err) console.err(err);
    });
});
