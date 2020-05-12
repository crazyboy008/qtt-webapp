<template>
  <div class="scroll-wrapper"
       @scroll.passive="handleScroll"
       :style="isPullDownRefresh ? fixedStyle : null"
       ref="scrollWrapper">
    <div class="scroll-content" ref="scrollContent">
      <div class="pulldown" v-if="isPullDownRefresh">
        <div class="icon-wrapper" v-show="beforePullDown">
          <i class="icon-xiajiantou" ref="icon" v-show="!isRefreshEnd"></i>
          <span class="icon-text">{{pullDownText}}</span>
        </div>
        <loading v-show="!beforePullDown"></loading>
      </div>
      <slot></slot>
      <div class="pullup" v-if="isPullUpLoad && data.length">
        <div v-show="!pullUpLoad">没有更多了</div>
        <loading v-show="pullUpLoad"></loading>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import Loading from './loading'
  import { addClass, removeClass } from '@/assets/js/dom'
  const pulldownHeight = 60 // 下拉刷新临界点
  const pulldownTop = 30  // 下拉正在刷新位移top
  const moveCount = 200  // 下拉位移系数

  export default {
    components: {
      Loading
    },
    props: {
      data: {
        type: Array,
        default() {
          return []
        }
      },
      isPullUpLoad: {
        type: Boolean,
        default: false
      },
      isPullDownRefresh: {
        type: Boolean,
        default: false
      },
      top: {
        type: Number,
        default: 0
      },
      bottom: {
        type: Number,
        default: 0
      },
      triggerHeight: {
        type: Number,
        default: 300
      },
      initPosition: {
        type: Object,
        default: () => {
          return {
            x: 0,
            y: 0
          }
        }
      }
    },
    data() {
      return {
        pullUpLoad: true,
        beforePullDown: true,
        isRefreshEnd: null,
        joinRefresh: null, // 进入下拉刷新状态
        refreshFlag: 0,
        pullDownText: '下拉刷新'
      }
    },
    computed: {
      fixedStyle() {
        return {
          position: 'fixed',
          left: 0,
          right: 0
        }
      }
    },
    methods: {
      touchStart(e) {
        if (this.isPullDownRefresh && this.refreshFlag) {
          e.preventDefault()
          return
        }
        let target = e.changedTouches[0]
        this.firstOffsetY = target.clientY
      },
      touchMove(e) {
        if (!this.firstOffsetY) {
          return
        }
        if (this.refreshFlag) {
          e.preventDefault()
          e.stopPropagation()
          return
        }
        let { scrollWrapper, scrollContent, icon } = this.$refs
        let target = e.changedTouches[0]
        if (scrollWrapper.scrollTop === 0) {
          // 拖动量的百分比
          let percentage = (target.clientY - this.firstOffsetY) / window.innerHeight
//          console.log(percentage)
          if (percentage > 0) {
            e.preventDefault()
            this.joinRefresh = true
            this.translateY = percentage * moveCount
            scrollContent.style.transform = `translate3d(0, ${this.translateY}px, 0)`
            scrollContent.style.webkitTransform = `translate3d(0, ${this.translateY}px, 0)`
            if (this.translateY > pulldownHeight) {
              this.pullDownText = '松开刷新'
              removeClass(icon, 'down')
              addClass(icon, 'up')
            } else {
              this.pullDownText = '下拉刷新'
              removeClass(icon, 'up')
              addClass(icon, 'down')
            }
          } else {
            if (this.joinRefresh === null) this.joinRefresh = false
          }
        } else {
          if (this.joinRefresh === null) this.joinRefresh = false
        }
      },
      touchEnd(e) {
        if (this.translateY === 0) {
          return
        }
        if (this.refreshFlag) {
          e.preventDefault()
          e.stopPropagation()
          return
        }
        let { scrollContent, icon } = this.$refs
        if (this.translateY > pulldownHeight && this.joinRefresh) {
          this.beforePullDown = false
          this.refreshFlag = 1
          scrollContent.style.transform = `translate3d(0, ${pulldownTop}px, 0)`
          scrollContent.style.webkitTransform = `translate3d(0, ${pulldownTop}px, 0)`
          scrollContent.style.transition = 'all 0.3s linear'
          this.$emit('pullingDown')
        } else {
          if (this.joinRefresh) {
            this.refreshFlag = 1
            this.reset()
          }
        }
        this.translateY = 0
        this.joinRefresh = null
        this.firstOffsetY = null
        removeClass(icon, 'up')
      },
      // 下拉刷新完成
      refreshEnd() {
        this.beforePullDown = true
        this.isRefreshEnd = true
        this.pullDownText = '刷新成功'
        this.reset()
      },
      // 下拉重置
      reset() {
        let { scrollContent } = this.$refs
        scrollContent.style.transform = `translate3d(0, 0, 0)`
        scrollContent.style.webkitTransform = `translate3d(0, 0, 0)`
        if (!scrollContent.style.transition) {
          scrollContent.style.transition = 'all 0.3s linear'
        }
        setTimeout(() => {
          this.refreshFlag = 0
          this.isRefreshEnd = null
          this.pullDownText = '下拉刷新'
          scrollContent.style.transition = null
        }, 300)
      },
      handleScroll(e) {
        const scrollOffsetY = e.target.scrollTop || window.pageYOffset || document.body.scrollTop
        let { scrollContent } = this.$refs
        this.$emit('onScroll', scrollOffsetY, e)
        const offsetHeight = scrollContent.offsetHeight
        if (offsetHeight <= e.target.offsetHeight) return
//        console.log(scrollOffsetY + e.target.offsetHeight, offsetHeight)
        if (this.next) return // 截流 防止多次触发pullingUp
        if (scrollOffsetY + e.target.offsetHeight >= offsetHeight - this.triggerHeight) {
          this.$emit('pullingUp', scrollOffsetY, e)
          this.next = true
        }
      },
      // 上拉加载完成
      forceUpdate() {
        if (this.pullUpLoad) {
          this.pullUpLoad = false
        }
      },
      scrollTo(x, y, behavior) {
        let { scrollWrapper } = this.$refs
        scrollWrapper.scrollTo({
          left: x,
          top: y,
          behavior: behavior !== undefined ? behavior : 'auto'
        })
      },
      // 初始化滚动元素高度
      refresh() {
        let { scrollWrapper } = this.$refs
        if (scrollWrapper) {
//          const vw = (100 / (window.innerWidth * 2)).toFixed(4)
//          scrollWrapper.style.height = (window.innerHeight * 2 - this.top - this.bottom) * vw + 'vw'
          const vh = (100 / (window.innerHeight * 2)).toFixed(4)
          scrollWrapper.style.height = 100 - (this.top + this.bottom) * vh + 'vh'
          scrollWrapper.style.top = this.realVw(this.top)
          scrollWrapper.style.bottom = this.realVw(this.bottom)
//          scrollWrapper.addEventListener('scroll', this.handleScroll, {passive:true})
        }
      },
      realVw(val) {
        return val / 7.5 + 'vw'
      }
    },
    mounted() {
      let { scrollContent } = this.$refs
      if (this.isPullDownRefresh) {
        scrollContent.addEventListener('touchstart', this.touchStart)
        scrollContent.addEventListener('touchmove', this.touchMove)
        scrollContent.addEventListener('touchend', this.touchEnd)
      }
      this.refresh()
//      this.$nextTick(() => {
//        setTimeout(() => {
//          this.scrollTo(this.initPosition.x, this.initPosition.y)
//        }, 1)
//      })
    },
    activated () {
    },
    beforeDestroy () {
      let { scrollContent } = this.$refs
      if (this.isPullDownRefresh) {
        scrollContent.removeEventListener('touchmove', this.touchStart)
        scrollContent.removeEventListener('touchmove', this.touchMove)
        scrollContent.removeEventListener('touchend', this.touchEnd)
      }
    },
    watch: {
      data(newVal, oldVal) {
        if (newVal.length && !this.pullUpLoad) {
          this.pullUpLoad = true
        }
        this.next = false
        if (newVal.length && this.refreshFlag === 1) {
          this.refreshEnd()
        }
      }
    }
  }
</script>

<style scoped lang="less" rel="stylesheet/less">
  .scroll-wrapper {
    position: relative;
    width: 100%;
    overflow-x: hidden;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
    &::-webkit-scrollbar {
      display: none;
    }
    .scroll-content {
      position: relative;
      .pulldown {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 60px;
        position: absolute;
        top: -60px;
        left: 0;
        right: 0;
        background-color: rgba(238, 238, 238, 0.8);
        .icon-wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
          color: #666;
          font-size: 30px;
          .icon-xiajiantou {
            font-size: 46px;
            felx: 0 0 10px;
            &.up {
              transform: rotate(180deg);
              transition: transform .4s;
              transform-origin: center center;
            }
            &.down {
              transform: rotate(0deg);
              transition: transform .4s;
              transform-origin: center center;
            }
          }
          .icon-text {
            padding-left: 10px;
          }
        }
      }
      .pullup {
        width: 100%;
        height: 80px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: rgba(238, 238, 238, 0.8);
        color: #666;
        font-size: 24px;
      }
    }
  }
</style>
