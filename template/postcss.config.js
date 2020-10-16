// https://github.com/michael-ciniawsky/postcss-load-config
const autoprefixer = require('autoprefixer');
const px2viewport = require('postcss-px-to-viewport');

const config = require('./build/config');

const plugins = [autoprefixer({})];

if (config.enableViewport) {
    plugins.push(px2viewport({
        viewportWidth: 1920
    }));
}

module.exports = {
    plugins,
};
