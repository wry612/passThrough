module.exports = {
  proxy: {
    '/api/usrCloud': {
      target: 'https://cloudapi.usr.cn/',  // 接口域名
      secure: true,  // 如果是https接口，需要配置这个参数
      changeOrigin: true,  //是否跨域
      pathRewrite: {
        '^/api/usrCloud': '/usrCloud'
      }
    },
    '/api': {
      target: 'http://106.14.172.38:9901/',  // 接口域名
      secure: false,  // 如果是https接口，需要配置这个参数
      changeOrigin: true,  //是否跨域
    }
  }
}
