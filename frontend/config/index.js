const path = require('path');
const { merge } = require('webpack-merge');
const dev = require('./dev');
const prod = require('./prod');

// 通用配置
const common = {
    projectName: 'ecommerce-mini-app',
    date: '2023-12-01',
    designWidth: 750,
    deviceRatio: {
        640: 2.34 / 2,
        750: 1,
        828: 1.81 / 2,
        375: 2 / 1
    },
    sourceRoot: 'src',
    outputRoot: 'dist',
    plugins: ['@tarojs/plugin-html'],
    defineConstants: {},
    copy: {
        patterns: [],
        options: {}
    },
    framework: 'react',
    compiler: {
        type: 'webpack4',
        prebundle: {
            enable: false
        }
    },
    cache: {
        enable: true
    },
    mini: {
        postcss: {
            pxtransform: {
                enable: true,
                config: {
                    selectorBlackList: [/^.van-/]
                }
            },
            url: {
                enable: true,
                config: {
                    limit: 1024
                }
            },
            cssModules: {
                enable: false,
                config: {
                    namingPattern: 'module',
                    generateScopedName: '[name]__[local]___[hash:base64:5]'
                }
            }
        },
        webpackChain(chain) {
            chain.merge({
                module: {
                    rule: {
                        lessLoader: {
                            test: /\.less$/,
                            use: [
                                {
                                    loader: 'less-loader',
                                    options: {
                                        lessOptions: {
                                            modifyVars: {
                                                '@primary-color': '#1890ff',
                                                '@border-radius-base': '4px'
                                            },
                                            javascriptEnabled: true
                                        }
                                    }
                                }
                            ]
                        }
                    }
                }
            });
        }
    },
    h5: {
        publicPath: '/',
        staticDirectory: 'static',
        router:{
            mode: 'browser'
        },
        webpackChain(chain) {
            chain.resolve.alias
                .set('@', path.resolve(__dirname, '..', 'src'))
        },
        postcss: {
            autoprefixer: {
                enable: true,
                config: {}
            },
            cssModules: {
                enable: false,
                config: {
                    namingPattern: 'module',
                    generateScopedName: '[name]__[local]___[hash:base64:5]'
                }
            }
        }
    }
};

// 环境配置合并
module.exports = function(merge) {
    if (process.env.NODE_ENV === 'development') {
        return merge({}, common, dev);
    }
    return merge({}, common, prod);
};