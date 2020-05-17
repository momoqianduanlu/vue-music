import { mapGetters } from 'vuex'

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
