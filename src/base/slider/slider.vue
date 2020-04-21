<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot>
      </slot>
    </div>
    <div class="dots">
      <span
        class="dot"
        :class="{active: currentPageIndex === index }"
        v-for="(item, index) in dots"
        :key="index"
      >
      </span>
    </div>
  </div>
</template>

<script>
import BScroll from 'better-scroll'
import { addClass } from 'common/js/dom'

export default {
  name: 'slider',
  props: {
    // 是否可以无缝轮播
    loop: {
      type: Boolean,
      default: true
    },
    // 是否可以自动轮播
    autoPlay: {
      type: Boolean,
      default: true
    },
    // 轮播时间间隔
    interval: {
      type: Number,
      default: 4000
    }
  },
  data () {
    return {
      dots: [],
      currentPageIndex: 0
    }
  },
  mounted () {
    // 保证dom成功渲染可以用定时器也可以用this.$nextick()
    setTimeout(() => {
      this._setSliderWidth()
      this._initDots()
      this._initSlider()

      if (this.autoPlay) {
        this._play()
      }
    }, 20)

    // 当窗口大小发生改变的时候，重新设置slider的宽度
    window.addEventListener('resize', () => {
      if (!this.slider || !this.slider.enabled) { // 当前 scroll 是否处于启用状态
        return
      }

      clearTimeout(this.resizeTimer)
      this.resizeTimer = setTimeout(() => {
        // isInTransition 判断当前 scroll 是否处于滚动动画过程中
        if (this.slider.isInTransition) {
          this._onScrollEnd()
        } else {
          if (this.autoPlay) {
            this._play()
          }
        }
        this.refresh()
      }, 60)
    })
  },
  methods: {
    // 设置轮播图的宽度
    _setSliderWidth (isResize) {
      // 获取sliderGroup中的子元素，他是一个数组(每一个包含图片的div)
      this.children = this.$refs.sliderGroup.children

      let width = 0
      // slider 展示区的宽度
      let sliderWidth = this.$refs.slider.clientWidth

      for (let i = 0; i < this.children.length; i++) {
        let child = this.children[i]
        addClass(child, 'slider-item')
        // 设置每个子元素的宽度
        child.style.width = sliderWidth + 'px'
        // 滑动列表的总宽度
        width += sliderWidth
      }
      /**
       * loop为true时，slider会在左右克隆两个dom，
       * 当窗口大小发生改变时不需要 2 * sliderWidth？
       * 因为只有第一次计算的时候 bs 内部会多添加 2 个 clone 的 Node，resize 的时候是不会多添加的，clone 的 Node 也是已经存在的了。
       */
      if (this.loop && !isResize) {
        width += 2 * sliderWidth
      }
      this.$refs.sliderGroup.style.width = width + 'px'
    },
    // 为了保证dots能跟children一致，我们必须将_initDots放在_initSlider之前
    _initDots () {
      this.dots = new Array(this.children.length)
    },
    _initSlider () {
      this.slider = new BScroll(this.$refs.slider, {
        scrollX: true,
        scrollY: false,
        momentum: false,
        snap: {
          loop: this.loop,
          threshold: 0.3,
          speed: 400
        }
      })

      // scrollEnd当前页滚动结束后
      this.slider.on('scrollEnd', this._onScrollEnd)
      // touchEnd鼠标/手指离开
      this.slider.on('touchEnd', () => {
        if (this.autoPlay) {
          this._play()
        }
      })
      // 滚动开始之前
      this.slider.on('beforeScrollStart', () => {
        if (this.autoPlay) {
          clearTimeout(this.timer)
        }
      })
    },
    _onScrollEnd () {
      let pageIndex = this.slider.getCurrentPage().pageX
      this.currentPageIndex = pageIndex
      if (this.autoPlay) {
        this._play()
      }
    },
    _play () {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.slider.next() // 滚动到下一个页面
      }, this.interval)
    },
    refresh () {
      if (this.slider) {
        this._setSliderWidth(true)
        this.slider.refresh()
      }
    }
  },
  beforeDestroy () {
    this.slider.disable() // 禁用 better-scroll
    clearTimeout(this.timer)
  }
}
</script>

<style scoped lang="stylus">
  @import "~common/stylus/variable"

  .slider
    min-height: 1px
    .slider-group
      position: relative
      overflow: hidden
      white-space: nowrap
      .slider-item
        float: left
        box-sizing: border-box
        overflow: hidden
        text-align: center
        a
          display: block
          width: 100%
          overflow: hidden
          text-decoration: none
        img
          display: block
          width: 100%
    .dots
      position: absolute
      right: 0
      left: 0
      bottom: 12px
      transform: translateZ(1px)
      text-align: center
      font-size: 0
      .dot
        display: inline-block
        margin: 0 4px
        width: 8px
        height: 8px
        border-radius: 50%
        background: $color-text-l
        &.active
          width: 20px
          border-radius: 5px
          background: $color-text-ll
</style>
