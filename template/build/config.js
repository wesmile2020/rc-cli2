module.exports = {
    build: {
        publicPath: './',
        isSplit: true,
        cssSourceMap: false,
        filename: '',
        isUglify: true,
    },
    dev: {
        publicPath: '/',
        port: 8080,
        host: '127.0.0.1',
        devtool: 'inline-source-map',
        cssSourceMap: true,
    },
    cssModules: true,
    entry: 'src/index.ts',
    externals: {}, // for global import
    lessModifyVars: {
    },
};
