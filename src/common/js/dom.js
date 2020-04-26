// 1.添加类的方法
export function addClass (el, className) {
  if (hasClass(el, className)) {
    return
  }

  let newClass = el.className.split(' ')
  newClass.push(className)
  el.className = newClass.join(' ')
}

// 2.拥有当前类的方法，返回布尔值
export function hasClass (el, className) {
  let reg = new RegExp('(^|\\s)' + className + '(\\s|$)')
  return reg.test(el.className)
}

// 获取data-属性的值
export function getData (el, name, val) {
  const prefix = 'data-'
  name = prefix + name
  if (val) {
    return el.setAttribute(name, val)
  }
  return el.getAttribute(name)
}



let elementStyle = document.createElement('div').style
/**
 * elementStyle要支持那些特性，
 * 我们这里的vendor也就是通过创建的div来判断当前浏览器需要那一个前缀，
 * 我们在不同的浏览器里面去执行 elementStyle[transformNames[key]]得到的结果也是不同的
 */
let vendor = (() => {
  let transformNames = {
    webkit: 'webkitTransform',
    Moz: 'MozTransform',
    O: 'OTransform',
    ms: 'msTransform',
    standard: 'transform' // 不用添加前缀
  }

  for (let key in transformNames) {
    // 这个key在不在这个elementStyle里面，我们就能知道他是那种供应商了
    // 比如说这个elementStyle有webkitTransform属性，那我们就知道他的供应商是webkit
    if (elementStyle[transformNames[key]] !== undefined) {
      return key
    }
  }

  // 如果都不支持
  return false
})()

export function prefixStyle (style) {
  if (vendor === false) {
    return false
  }
  if (vendor === 'standard') {
    return style
  }
  // 'webkitTransform'
  return vendor + style.charAt(0).toUpperCase() + style.substr(1)
}
