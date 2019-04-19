module.exports = {
  proxy: {
    '/apis': {
      target: 'https://cloudapi.usr.cn/usrCloud/',  // 接口域名
      secure: true,  // 如果是https接口，需要配置这个参数
      changeOrigin: true,  //是否跨域
      pathRewrite: {
        '^/apis': ''   //需要rewrite的,
      }
    },
    '/service': {
      target: "http://106.14.172.38:9901/api",
      changeOrigin: true,
      pathRewrite: {
        '^/service': ''
      }
    }
  }
}
