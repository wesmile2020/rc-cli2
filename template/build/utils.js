const path = require('path');
const os = require('os');
const CSSExtractPlugin = require('mini-css-extract-plugin');
const config = require('./config');

/**
 * 将相对路径处理成绝对路径
 * @param {string} dir 路径
 */
function resolve(dir) {
    return path.resolve(__dirname, '..', dir);
}

/**
 * 生成对应的css-loader
 * @param {{
 *  sourceMap: string;
 *  extract: boolean;
 *  cssModules: boolean;
 *  nodeModules: boolean;
 * }} options 选项
 */
function cssLoaders(options = {}) {
    function generateLoaders(loaderName, loaderOptions) {
        const cssLoader = {
            loader: 'css-loader',
            options: {
                sourceMap: options.sourceMap,
                modules: options.cssModules ? {
                    localIdentName: '[local]_[hash:base64:10]',
                } : false,
            },
        };
        const postcssLoader = {
            loader: 'postcss-loader',
            options: {
                sourceMap: options.sourceMap,
            },
        };
        const loaders = options.nodeModules ? ['css-loader'] : [cssLoader, postcssLoader];
        if (loaderName) {
            loaders.push({
                loader: `${loaderName}-loader`,
                options: loaderOptions,
            });
        }
        const prefixLoader = options.extract ? CSSExtractPlugin.loader : 'style-loader'
        return [prefixLoader, ...loaders];
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

/**
 * 生成css-loader
 * @param {*} options
 */
function styleLoader(options) {
    const output = [];
    const loaders = cssLoaders({ ...options, nodeModules: false });
    for (const key in loaders) {
        const loader = loaders[key];
        output.push({
            test: new RegExp(`\\.${key}$`),
            use: loader,
            exclude: /node_modules/,
        });
    }
    const loadersForModules = cssLoaders({
        ...options,
        nodeModules: true,
        cssModules: false,
    });
    for (const key in loadersForModules) {
        const loader = loadersForModules[key];
        output.push({
            test: new RegExp(`\\.${key}$`),
            use: loader,
            include: /node_modules/,
        });
    }
    return output;
}

/**
 * 获取ip地址
 */
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
