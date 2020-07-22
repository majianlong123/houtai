module.exports = {
  // 站点路径
  publicPath: process.env.NODE_ENV === 'development' ? '' : '/manage/',
 
  // 资源路径
  assetsDir: 'static',

  // 代理跨域
  devServer: {
    // 目标服务器
    // proxy: 'http://t_yahansi.demo2.dx623.com'
    // proxy: 'https://yahansi.com/'
    // proxy: 'https://guanlinyouxuan.com'
    // proxy: 'https://shequ.fxcloud.net'
  },

  // js source-map
  productionSourceMap: false
}
