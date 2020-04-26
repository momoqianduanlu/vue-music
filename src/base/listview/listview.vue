<template>
  <scroll
    class="listview"
    ref="listview"
    :data="data"
    :listenScroll="listenScroll"
    :probeType="probeType"
    @scroll="scroll"
  >
    <ul>
      <li v-for="(group,index) in data" :key="index" class="list-group" ref="listGroup">
        <h2 class="list-group-title">{{group.title}}</h2>
        <uL>
          <li @click="selectItem(item)" v-for="(item,index) in group.items" :key="index" class="list-group-item">
            <img class="avatar" v-lazy="item.avatar">
            <span class="name">{{item.name}}</span>
          </li>
        </uL>
      </li>
    </ul>
    <!-- 右侧字母列表 -->
    <div class="list-shortcut"
      @touchstart="onShortcutTouchstart"
      @touchmove.stop.prevent="onShortcutTouchmove"
      @touchend.stop
    >
      <ul>
        <li
          class="item"
          v-for="(item, index) in shortcutList"
          :data-index="index"
          :key="index"
          :class="{'current':currentIndex===index}"
        >
          {{item}}
        </li>
      </ul>
    </div>
    <!-- fixed-title -->
    <div class="list-fixed" ref="fixed" v-show="fixedTitle">
      <div class="fixed-title">{{fixedTitle}}</div>
    </div>
    <div v-show="!data.length" class="loading-container">
      <loading></loading>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import { getData } from 'common/js/dom'

const TITLE_HEIGHT = 30
const ANCHOR_HEIGHT = 18

export default {
  props: {
    data: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      scrollY: -1,
      currentIndex: 0,
      diff: -1
    }
  },
  computed: {
    shortcutList () {
      // map() 方法返回一个新数组，数组中的元素为原数组元素调用函数处理后的值
      return this.data.map((group) => {
        return group.title.substr(0, 1) // 只获取title的第一个字符
      })
    },
    fixedTitle () {
      // 边界情况，当我们向下拉歌手列表时，fixed-title会与第一个标题'热'重复出现
      if (this.scrollY > 0) {
        return ''
      }
      return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
    }
  },
  watch: {
    // 当数据发生变化的时候我们重新计算区块高度
    data () {
      setTimeout(() => {
        this._calculateHeight()
      }, 20)
    },
    scrollY (newY) {
      const listHeight = this.listHeight
      // 当滚动到顶部，newY>0，往上滚动newY是一个负值
      if (newY > 0) {
        this.currentIndex = 0
        return
      }
      // 在中间部分滚动
      for (let i = 0; i < listHeight.length - 1; i++) {
        // 上限是最高的，下限是最低的
        let height1 = listHeight[i] // 下限
        let height2 = listHeight[i + 1] // 上限
        // console.log(height1, height2);
        if (-newY >= height1 && -newY < height2) { // !height2滚动到最底部
          this.currentIndex = i // 当前点亮的字母就在(-newY>height1 && -newY<height2)这个区间
          this.diff = height2 + newY
          return
        }
      }
      // 当滚动到最底部且-newY大于最后一个元素的上限
      this.currentIndex = listHeight.length - 2
    },
    diff (newVal) {
      // 因为是向上偏移，所以应该是一个负值，所以我们用newVal - TITLE_HEIGHT
      let fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0
      /**
       * 这句话什么意思？
       * 因为diff是一个实时变化的过程，当B与A顶到一块的时候，我们没有必要做偏移
       * 同时也是为了减少transform的频度，减少dom操作
       */
      if (this.fixedTop === fixedTop) {
        return
      }
      this.fixedTop = fixedTop
      this.$refs.fixed.style.transform = `translate3d(0, ${fixedTop}px, 0)`
    }
  },
  created () {
    /**
     * 为什么我们不讲touch定义到data里面？
     * 因为我们将data定义到data里面以后，
     * vue会对data中的属性添加get和set来监控他们的变化
     * 以便对dom做映射，而touch属性与dom无关，
     * 我们并不需要监控touch的变化，所以我们在create的时候去创建
     */
    this.touch = {}
    this.probeType = 3 // prototype:3派发滚动事件
    this.listenScroll = true
    this.listHeight = []
  },
  methods: {
    selectItem (item) {
      this.$emit('select', item)
    },
    onShortcutTouchstart (e) {
      // 字母的index
      let anchorIndex = getData(e.target, 'index')
      let firstTouch = e.touches[0]
      this.touch.y1 = firstTouch.pageY
      // 记录点击的时候的index
      this.touch.anchorIndex = anchorIndex
      this._scrollTo(anchorIndex)
    },
    onShortcutTouchmove (e) {
      /**
       * 每个触摸事件都包括了三个触摸列表，每个列表里包含了对应的一系列触摸点（用来实现多点触控）
       * touches：当前位于屏幕上的所有手指的列表
       * targetTouches：位于当前DOM元素上手指的列表
       * changedTouches：涉及当前事件手指的列表
       *
       * 计算出从touchstart-touchmove滚动的位置，
       * 然后计算当前位置与最开始位置的差来算出一个data，
       * 根据这个data来计算出我滚动到哪
       */
      let firstTouch = e.touches[0]
      this.touch.y2 = firstTouch.pageY
      // (y2-y1) / 每个字母的高度 = 划过了几个字母 | 0 = delta向下取整
      let delta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0
      // 点击的时候的index + 划过了几个字母 = move的时候的index
      let anchorIndex = parseInt(this.touch.anchorIndex) + delta
      this._scrollTo(anchorIndex)
    },
    scroll (pos) {
      this.scrollY = pos.y
    },
    // 计算每个group的高度(左侧每个字母区块的高度)
    _calculateHeight () {
      this.listHeight = []
      const list = this.$refs.listGroup // 左侧每个字母区块集合
      let height = 0
      this.listHeight.push(height)
      for (let i = 0; i < list.length; i++) {
        let item = list[i]
        height += item.clientHeight
        this.listHeight.push(height)
      }
      // console.log(this.listHeight);
    },
    _scrollTo (index) {
      // 这个判断是为了防止我们touchstart时点击“热”的上半部分和点击“z”的下半部分时，index返回null
      if (!index && index !== 0) {
        return
      }
      // touchmove时滑动到“热”的上半部分index是小于0的，滑动到“z”的下半部分时index是无穷大的
      if (index < 0) {
        index = 0
      } else if (index > this.listHeight.length - 2) {
        index = this.listHeight.length - 2
      }
      // 左侧滚动到指定元素
      this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0)
    }
  },
  components: {
    Scroll,
    Loading
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
