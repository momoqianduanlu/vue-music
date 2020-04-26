import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import mutations from './mutations'
import state from './state'
import createLogger from 'vuex/dist/logger' // vuex的插件，我们每次去修改state的时候都会在控制台打印一个log

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  actions,
  getters,
  mutations,
  state,
  strict: debug, // 检测state的修改是不是来自于commit mutation
  plugins: debug ? [createLogger()] : []
})
