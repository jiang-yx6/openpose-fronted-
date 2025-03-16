const { createProxyMiddleware} = require('http-proxy-middleware')

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
        target: 'https://yfvideo.hf.free4inno.com',
        changeOrigin: true,
        pathRewrite:{
            '^/api':''
        }
    })
  )
}