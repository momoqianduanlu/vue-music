// 所有接口请求参数的公共参数
export const commonParams = {
  g_tk: 5381,
  inCharset: 'utf-8',
  outCharset: 'utf-8',
  notice: 0,
  format: 'jsonp'
}

// jonp库的option参数，定义params = jsonpCallback，与qq音乐接口保持一致
export const options = {
  param: 'jsonpCallback'
}

export const ERR_OK = 0
