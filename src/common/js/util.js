/**
 * 这个函数接收一个参数arr，然后他去遍历这个array，
 * 他是去从 0 - i 之间去取一个数，拿到这个数的 index，
 * 拿到这个 index 以后，把这个 index 对应的值与我们 arr[i]所对应的值
 * 作交换，这样就可以把这个数组洗的很乱。
 *
 * 我们再去定义一个辅助函数，这个函数接收两个参数 min max，
 * 这个函数做的事情就是返回 min 和 max 之间的随机数并且包括max，
 * Math.random() 返回 0-1 之间的小数但不包括1，所以我们用
 * Math.random() * (max - min + 1)，+1是为了能够取到 max，
 * Math.random() * (max - min + 1) => 这个数最后返回的是 max减min 中间的一个数，然后
 * 我们再加上 min 得到的就是 min 到 max 之间的数了，既包含min又包含max。
 * Math.random() * (max - min + 1) + min => 因为我们知道 Math.random() 返回的是一个小数，
 * 所以我们做一个向下取整。
 * 这样我们就获取了一个从 min - max 之间的数，并且这个数包括 max 也包括 min。
 */
function getRandomInt (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

// 洗牌函数
export function shuffle (arr) {
  // 得到一个arr的副本，不会改变原来的arr
  let _arr = arr.slice()
  for (let i = 0; i < _arr.length; i++) {
    let j = getRandomInt(0, i)
    // 作交换
    let t = _arr[i]
    _arr[i] = _arr[j]
    _arr[j] = t
  }
  return _arr
}
