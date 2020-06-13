import { mapGetters, mapMutations, mapActions } from 'vuex'
import { playMode } from 'common/js/config'
import { shuffle } from 'common/js/util'

export const playlistMixin = {
  computed: {
    ...mapGetters([
      'playlist' // 播放列表
    ])
  },
  mounted () {
    this.handlePlaylist(this.playlist)
  },
  activated () {
    this.handlePlaylist(this.playlist)
  },
  watch: {
    playlist (newVal) {
      this.handlePlaylist(newVal)
    }
  },
  methods: {
    /**
     * 我们在所有的钩子函数中都去调用 handlePlaylist
     * 我们的handlePlaylist要实现什么？
     * 我们并不会在我们的 mixin 中的 handlePlaylist 的函数中去实现具体的逻辑，
     * 我们这个 handlePlaylist 函数就需要具体的组件去实现了，也就是说当我们去调用 this.handlePlaylist(this.playlist)
     * 我们会把 this.playlist 传入，这时我们就会将 mini-player 的高度与我们的 scroll 组件的高度相加。
     * 所以我们在 mixin 里面的 handlePlaylist 里面去抛出一个异常，也就是我们的组件必须要实现这个函数，
     * 一旦我们的组件定义了这个函数他就会覆盖我们 mixin 里面的函数。
     */
    handlePlaylist () {
      throw new Error('component must implement handlePlaylist method')
    }
  }
}

export const playerMixin = {
  computed: {
    iconMode () {
      return this.mode === playMode.sequence ? 'icon-sequence' :
        this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
    },
    ...mapGetters([
      'sequenceList',
      'playlist',
      'currentSong',
      'mode',
      'favoriteList'
    ])
  },
  methods: {
    // 播放模式切换
    changeMode () {
      const mode = (this.mode + 1) % 3
      this.setPlayMode(mode)

      let list = null
      // 如果是随机播放
      if (mode === playMode.random) {
        // 洗牌
        list = shuffle(this.sequenceList)
      } else {
        // 如果是顺序播放或是循环播放
        list = this.sequenceList
      }
      this.resetCurrentIndex(list)
      this.setPlayList(list)
    },
    // 设置currentIndex
    resetCurrentIndex (list) {
      let index = list.findIndex((item) => {
        return item.id === this.currentSong.id
      })
      this.setCurrentIndex(index)
    },
    getFavoriteIcon (song) {
      if (this.isFavorite(song)) {
        return 'icon-favorite'
      }
      return 'icon-not-favorite'
    },
    toggleFavorite (song) {
      if (this.isFavorite(song)) {
        this.deleteFavoriteList(song)
      } else {
        this.saveFavoriteList(song)
      }
    },
    isFavorite (song) {
      const index = this.favoriteList.findIndex((item) => {
        return item.id === song.id
      })
      return index > -1
    },
    ...mapActions([
      'saveFavoriteList',
      'deleteFavoriteList'
    ]),
    ...mapMutations({
      setPlayingState: 'SET_PLAYING_STATE',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayMode: 'SET_PLAY_MODE',
      setPlayList: 'SET_PLAYLIST'
    })
  }
}

export const searchMixin = {
  data () {
    return {
      query: '',
      refreshDelay: 100
    }
  },
  computed: {
    ...mapGetters([
      'searchHistory'
    ])
  },
  methods: {
    addQuery (query) {
      this.$refs.searchBox.setQuery(query)
    },
    onQueryChange (query) {
      // 处理带空格的情况
      this.query = query.trim()
    },
    blurInput () {
      this.$refs.searchBox.blur()
    },
    saveSearch () {
      this.saveSearchHistory(this.query)
    },
    ...mapActions([
      'saveSearchHistory',
      'deleteSearchHistory'
    ])
  }
}
