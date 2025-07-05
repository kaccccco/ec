module.exports = {
    env: {
        NODE_ENV: '"development"',
        API_BASE: '"http://localhost:8080"'
    },
    defineConstants: {},
    mini: {
        debugReact: true,
        hot: true,
        compile: {
            exclude: ['src/utils/request.ts']
        },
        webpackChain(chain) {
            chain.plugin('analyzer')
                .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin, [{
                    analyzerMode: 'static',
                    reportFilename: 'bundle-report.html',
                    openAnalyzer: false
                }]);
        }
    },
    h5: {
        devServer: {
            host: 'localhost',
            port: 10086,
            proxy: {
                '/api': {
                    target: 'http://localhost:8080',
                    changeOrigin: true,
                    pathRewrite: { '^/api': '' }
                }
            }
        }
    }
};