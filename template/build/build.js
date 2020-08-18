process.env.NODE_ENV = 'production';
const webpack = require('webpack');
const ora = require('ora');
const webpackConfig = require('./webpack.pro.conf');

if (process.env.npm_config_report) {
    const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
    webpackConfig.plugins.push(new BundleAnalyzerPlugin());
}

const spinner = ora('> Building for production \n');
spinner.start();

webpack(webpackConfig, (err, stats) => {
    if (err) throw err;
    spinner.succeed('> Build success');
    process.stdout.write(stats.toString({
        colors: true,
        modules: false,
        chunks: false,
        chunkModules: false,
        children: false,
    }) + '\n');

    if (stats.hasErrors()) {
        console.log('> Build failed with errors');
        process.exit(1);
    }

    console.log('> Build complete');
});
