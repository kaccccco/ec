const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  
  // 开发服务器配置
  devServer: {
    port: 8080,
    open: true,
    host: '0.0.0.0',
    // 如果需要代理后端API
    proxy: {
      '/api': {
        target: 'http://localhost:8081', // 后端服务地址
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  },

  // 生产环境配置
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
  
  // 性能优化
  configureWebpack: {
    optimization: {
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            name: 'chunk-vendors',
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: 'initial'
          },
          elementUI: {
            name: 'chunk-elementUI',
            priority: 20,
            test: /[\\/]node_modules[\\/]element-ui[\\/]/
          }
        }
      }
    }
  },

  // 链式操作
  chainWebpack: config => {
    // 设置别名
    config.resolve.alias
      .set('@', require('path').resolve(__dirname, 'src'))
    
    // 生产环境移除console
    if (process.env.NODE_ENV === 'production') {
      config.optimization.minimizer('terser').tap((args) => {
        args[0].terserOptions.compress.drop_console = true
        return args
      })
    }
  }
})