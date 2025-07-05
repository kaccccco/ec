module.exports = {
    env: {
        NODE_ENV: '"production"',
        API_BASE: '"https://api.yourdomain.com"'
    },
    defineConstants: {},
    mini: {
        debugReact: false,
        hot: false,
        imageUrlLoaderOption: {
            limit: 8192
        },
        optimizeMainPackage: {
            enable: true
        },
        webpackChain(chain) {
            chain.optimization.minimize(true);
            chain.plugin('terser').use(require('terser-webpack-plugin'), [{
                terserOptions: {
                    compress: {
                        drop_console: true,
                        drop_debugger: true
                    },
                    output: {
                        comments: false
                    }
                },
                extractComments: false
            }]);
        }
    },
    h5: {
        publicPath: 'https://cdn.yourdomain.com/miniapp/',
        router: {
            mode: 'hash'
        },
        output: {
            filename: 'js/[name].[hash:8].js',
            chunkFilename: 'js/[name].[chunkhash:8].js'
        }
    }
};