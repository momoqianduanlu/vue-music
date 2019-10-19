import originJsonp from 'jsonp'

export default function jsonp (url, data, options) {
  // 将请求参数拼接到url上
  url += (url.indexOf('?') < 0 ? '?' : '&') + param(data)
  return new Promise((resolve, reject) => {
    originJsonp(url, options, (err, data) => {
      if (!err) {
        resolve(data)
      } else {
        reject(err)
      }
    })
  })
}

function param (data) {
  let url = ''
  for (var k in data) {
    let value = data[k] !== undefined ? data[k] : ''
    url += `&${k}=${encodeURIComponent(value)}`
    // console.log(url)
  }
  // 如果url存在的话我们要把第一个 & 符号去掉，如果url不存在我们直接返回一个''
  return url ? url.substring(1) : ''
}
