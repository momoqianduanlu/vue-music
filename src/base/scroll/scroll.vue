<template>
  <div ref="wrapper">
    <slot></slot>
  </div>
</template>

<script type="text/ecmascript-6">
import BScroll from 'better-scroll'
const DIRECTION_H = 'horizontal'
const DIRECTION_V = 'vertical'

export default {
  props: {
    probeType: { // 实时派发scroll事件
      type: Number,
      default: 1
    },
    click: { // better-scroll 默认会阻止浏览器的原生 click 事件。当设置为 true，better-scroll 会派发一个 click 事件
      type: Boolean,
      default: false
    },
    listenScroll: { // 是否派发滚动事件
      type: Boolean,
      default: false
    },
    data: { // 关心数据变化，重新刷新scroll
      type: Array,
      default: null
    },
    pullup: { // 在一次上拉加载的动作后
      type: Boolean,
      default: false
    },
    beforeScroll: {
      type: Boolean,
      default: false
    },
    refreshDelay: { // 当数据更新后，刷新scroll的延时
      type: Number,
      default: 20
    },
    direction: { // 滚动方向
      type: String,
      default: DIRECTION_V
    },
    /**
     * 当我们需要锁定只滚动一个方向的时候，我们在初始滚动的时候根据横轴和纵轴滚动的绝对值做差，
     * 当差值大于 directionLockThreshold 的时候来决定滚动锁定的方向
     */
    directionLockThreshold: {
      type: Number,
      default: 0
    }
  },
  mounted () {
    // 设置定时器我们来确保dom已经渲染了
    setTimeout(() => {
      this._initScroll()
    }, 20)
  },
  methods: {
    _initScroll () {
      if (!this.$refs.wrapper) {
        return
      }
      this.scroll = new BScroll(this.$refs.wrapper, {
        probeType: this.probeType,
        click: this.click
      })
      if (this.listenScroll) {
        let me = this
        this.scroll.on('scroll', (pos) => {
          me.$emit('scroll', pos)
        })
      }
    },
    // _initScroll () {
    //   if (!this.$refs.wrapper) {
    //     return
    //   }
    //   this.scroll = new BScroll(this.$refs.wrapper, {
    //     probeType: this.probeType,
    //     click: this.click,
    //     eventPassthrough: this.direction === DIRECTION_V ? DIRECTION_H : DIRECTION_V,
    //     directionLockThreshold: this.directionLockThreshold
    //   })
    //   if (this.listenScroll) {
    //     this.scroll.on('scroll', (pos) => {
    //       this.$emit('scroll', pos)
    //     })
    //   }
    //   if (this.pullup) {
    //     this.scroll.on('scrollEnd', () => {
    //       if (this.scroll.y <= (this.scroll.maxScrollY + 50)) {
    //         this.$emit('scrollToEnd')
    //       }
    //     })
    //   }
    //   if (this.beforeScroll) {
    //     this.scroll.on('beforeScrollStart', () => {
    //       this.$emit('beforeScroll')
    //     })
    //   }
    // },
    // 禁用 better-scroll
    disable () {
      this.scroll && this.scroll.disable()
    },
    // 启用 better-scroll, 默认 开启
    enable () {
      this.scroll && this.scroll.enable()
    },
    // scroll组件重新刷新
    refresh () {
      this.scroll && this.scroll.refresh()
    },
    /**
     * 这里扩展的方法全都是调用better-scroll方法的封装，
     * this.scroll指向better-scroll的实例，
     * 为什么要调用apply，因为scrollTo()方法也要接收一些参数，
     * 我们要把参数传到better-scroll的scrollTo()里面，
     */
    // 滚动到指定的位置
    scrollTo () {
      this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
    },
    // 滚动到指定的目标元素
    scrollToElement () {
      this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
    }
  },
  watch: {
    // 监控外部数据变化，重新刷新scroll，以便scroll组件滚动不正确
    data () {
      setTimeout(() => {
        this.refresh()
      }, this.refreshDelay)
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
</style>
