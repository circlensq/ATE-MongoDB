module.exports = {
    devServer: {
      proxy: {
        '^/api': {
            target: 'http://localhost:8088',
            // target: 'http://192.168.100.150:8080',
            changeOrigin: true,
            secure: false,
            pathRewrite: {
                '^/api': '/api'
            },
            logLevel: 'debug'
        },
      }
    }
  }