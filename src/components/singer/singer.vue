<template>
  <div class="singer" ref="singer">
    <list-view :data="singers" @select="selectSinger" ref="list"></list-view>
    <router-view></router-view>
  </div>
</template>

<script>
import { getSingerList } from 'api/singer'
import { ERR_OK } from 'api/config'
import Singer from 'common/js/singer'
import ListView from 'base/listview/listview'
import { mapMutations } from 'vuex'
import { playlistMixin } from 'common/js/mixin'

const HOT_NAME = '热门'
const HOT_SINGER_LEN = 10

export default {
  name: 'singer',
  mixins: [playlistMixin],
  data () {
    return {
      singers: []
    }
  },
  created () {
    this._getSingerList()
  },
  methods: {
    handlePlaylist (playlist) {
      const bottom = playlist.length > 0 ? '60px' : ''
      this.$refs.singer.style.bottom = bottom
      this.$refs.list.refresh()
    },
    selectSinger (singer) {
      this.$router.push({
        path: `/singer/${singer.id}`
      })
      // mutation的提交
      this.setSinger(singer)
    },
    _getSingerList () {
      getSingerList().then((res) => {
        if (res.code === ERR_OK) {
          this.singers = this._normalizeSinger(res.data.list)
        }
      })
    },
    _normalizeSinger (list) {
      let map = {
        hot: {
          title: HOT_NAME,
          items: []
        }
      }
      list.forEach((item, index) => {
        // 1.热门数据
        if (index < HOT_SINGER_LEN) {
          map.hot.items.push(new Singer({
            id: item.Fsinger_mid,
            name: item.Fsinger_name
          }))
        }
        // 2.按字母归类
        const key = item.Findex // 首字母
        if (!map[key]) {
          map[key] = {
            title: key,
            items: []
          }
        }
        map[key].items.push(new Singer({
          id: item.Fsinger_mid,
          name: item.Fsinger_name
        }))
      })
      console.log(map)
      // 3.将map对象变成有序数组
      let hot = []
      let ret = []
      for (let key in map) {
        let val = map[key]
        if (val.title.match(/[a-zA-Z]/)) {
          ret.push(val)
        } else if (val.title === HOT_NAME) {
          hot.push(val)
        }
      }
      // 4.ret数组字母排序
      ret.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0)
      })
      // console.log(hot.concat(ret))
      return hot.concat(ret)
    },
    ...mapMutations({
      setSinger: 'SET_SINGER' // setSinger是对mutations.js中的SET_SINGER做映射
    })
  },
  components: {
    ListView
  }
}
</script>

<style lang="stylus" scoped>
  // 这段样式的意思是：better-scroll滚动的条件是父容器的高度是固定的，子元素的高度要撑开他。
  .singer
    position: fixed
    top: 88px
    bottom: 0
    width: 100%
</style>
