import * as types from './mutation-types'

/**
 * 这里我们为什么要用mutation-types？
 * 这是为了便于我们书写方便以及便于我们的lint工具的检测，
 *
 * 有了mutation去修改数据，那我们应该如何去映射state里面的数据呢？
 * 通常我们都会做一层getters的包装，也就是说我们通常都会从getters里面取数据到组件中
 */
const mustation = {
  [types.SET_SINGER] (state, singer) {
    state.singer = singer
  }
}

export default mustation
