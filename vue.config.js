const path = require('path')
const axios = require('axios')

function resolve (dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  devServer: {
    // 因为qq音乐个单列表接口验证了host与referer，所以我们通过后端代理的方式去获取个单列表数据
    /**
     * 通过webpackDevServer开启服务，我们在这通过axios向qq音乐的歌单接口发送请求，在这里我们
     * 伪造了referer与host，发送请求后我们在前端自己请求自己，也就是/api/getDiscList，
     * 在recommend.js中我们通过axios向/api/getDiscList发送请求，app.get()会在req.query中拿到
     * 客户端传递的params，请求成功后服务端讲拿到的数据吐给浏览器
     */
    before (app) {
      app.get('/api/getDiscList', function (req, res) {
        const url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'
        axios.get(url, {
          headers: {
            referer: 'https://c.y.qq.com/',
            host: 'c.y.qq.com'
          },
          params: req.query
        }).then((response) => {
          res.json(response.data)
        }).catch((e) => {
          console.log(e)
        })
      })
    }
  },
  chainWebpack (config) {
    config.resolve.alias
      .set('components', resolve('src/components'))
      .set('common', resolve('src/common'))
      .set('api', resolve('src/api'))
      .set('base', resolve('src/base'))
  },
  publicPath: ''
}
