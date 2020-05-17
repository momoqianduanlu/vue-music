import * as types from './mutation-types'

/**
 * 这里我们为什么要用mutation-types？
 * 这是为了便于我们书写方便以及便于我们的lint工具的检测，
 *
 * 有了mutation去修改数据，那我们应该如何去映射state里面的数据呢？
 * 通常我们都会做一层getters的包装，也就是说我们通常都会从getters里面取数据到组件中
 */
const mutation = {
  [types.SET_SINGER] (state, singer) {
    state.singer = singer
  },
  [types.SET_PLAYING_STATE] (state, flag) {
    state.playing = flag
  },
  [types.SET_FULL_SCREEN] (state, flag) {
    state.fullScreen = flag
  },
  [types.SET_PLAYLIST] (state, list) {
    // console.log('SET_PLAYLIST', list)
    state.playlist = list
  },
  [types.SET_SEQUENCE_LIST] (state, list) {
    state.sequenceList = list
  },
  [types.SET_PLAY_MODE] (state, mode) {
    state.mode = mode
  },
  [types.SET_CURRENT_INDEX] (state, index) {
    state.currentIndex = index
  },
  [types.SET_DISC] (state, disc) {
    state.disc = disc
  },
  [types.SET_TOP_LIST] (state, topList) {
    state.topList = topList
  }
}

export default mutation
