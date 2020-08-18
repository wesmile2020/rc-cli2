const path = require('path');
const os = require('os');
const CssExtractPlugin = require('mini-css-extract-plugin');
const config = require('./config');

function resolve(dir) {
    return path.resolve(__dirname, '..', dir);
}

function cssLoaders(options = {}) {
    const cssLoader = {
        loader: 'css-loader',
        options: {
            sourceMap: options.sourceMap,
            modules: {
                localIdentName: '[local]_[hash:base64:10]',
            },
        },
    };
    const postcssLoader = {
        loader: 'postcss-loader',
        options: {
            sourceMap: options.sourceMap,
        },
    };

    function generateLoaders(loaderName, loaderOptions) {
        const loaders = options.nodeModules ? ['css-loader'] : [cssLoader, postcssLoader];
        if (loaderName) {
            loaders.push({
                loader: `${loaderName}-loader`,
                options: { ...loaderOptions }
            });
        }
        if (options.extract) {
            return loaders;
        }

        return ['style-loader'].concat(loaders);
    }

    return {
        css: generateLoaders(),
        less: generateLoaders('less', {
            modifyVars: options.nodeModules ? {} : config.lessModifyVars,
        }),
        sass: generateLoaders('sass', { indentedSyntax: true }),
        scss: generateLoaders('scss'),
        stylus: generateLoaders('stylus'),
    };
}

function styleLoader(options) {
    const output = [];
    const loaders = cssLoaders({ ...options, nodeModules: false });
    for (const key in loaders) {
        const loader = loaders[key];
        if (options.extract) {
            loader.unshift(CssExtractPlugin.loader);
        }
        output.push({
            test: new RegExp(`\\.${key}$`),
            use: loader,
            exclude: /node_modules/,
        });
    }
    const loadersForModules = cssLoaders({
        nodeModules: true,
        ...options,
    });
    for (const key in loadersForModules) {
        const loader = loadersForModules[key];
        if (options.extract) {
            loader.unshift(CssExtractPlugin.loader);
        }
        output.push({
            test: new RegExp(`\\.${key}$`),
            use: loader,
            include: /node_modules/,
        });
    }
    return output;
}

function getIp() {
    const faces = os.networkInterfaces();
    for (const key in faces) {
        const arr = faces[key];
        for (let i = 0; i < arr.length; i += 1) {
            if (arr[i].family === 'IPv4' && arr[i].address !== '127.0.0.1') {
                return arr[i].address;
            }
        }
    }

    return '127.0.0.1';
}

module.exports = {
    resolve,
    styleLoader,
    getIp,
};
