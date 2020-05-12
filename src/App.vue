<template>
  <div id="app">
    <div class="go-top" @click="goTop" v-show="showTop">
      <van-icon class="icon" name="down" size="18px" color="#FFF"/>
      <!--<img src="@/assets/images/ico-top.png" alt="">-->
    </div>
    <transition :name="transitionName">
      <keep-alive v-if="$route.meta.keepAlive">
        <router-view></router-view>
      </keep-alive>
      <router-view v-if="!$route.meta.keepAlive"></router-view>
    </transition>
  </div>
</template>

<script>
  import { Icon } from 'vant'
  import Util from '@/assets/js/util'

  export default {
    data() {
      return {
        showTop: false,
        transitionName: ''
      }
    },
    components: {
      [Icon.name]: Icon
    },
  	created () {
      // 拦截请求
			this.$axios.interceptors.request.use((config) => {
        if (config.method === 'post') {
          this.$toast.loading({
            mask: true,
            message: '加载中...'
          })
				}
				return config
			}, err => {
				return Promise.reject(err)
			})

			// 拦截响应
			this.$axios.interceptors.response.use((response) => {
				if (response.config.method === 'post') {
          this.$toast.clear()
				}
				return response
			}, err => {
				return Promise.reject(err)
			})

    },
    mounted() {
      window.addEventListener('scroll', () => {
//        console.log(Util.getScrollTop())
        this.showTop = Util.getScrollTop() > 600
      })
    },
    methods: {
      goTop() {
        window.scrollTo({
          left: 0,
          top: 0,
          behavior: 'auto' || 'smooth'
        })
      }
    },
    watch: {
      $route(to, from) {
        if (to.meta.key > from.meta.key) {
          this.transitionName = 'slide-left'
        } else {
          this.transitionName = 'slide-right'
        }
      }
    }
  }
</script>

<style lang="less">
  html, body { scroll-behavior:smooth; }
  .slide-left-enter, .slide-right-leave-to {
    transform: translate3d(100%, 0, 0);
    opacity: 0;
  }
  .slide-left-leave-to, .slide-right-enter {
    transform: translate3d(-100%, 0, 0);
    opacity: 0;
  }
  .slide-left-enter-active, .slide-left-leave-active,
  .slide-right-enter-active, .slide-right-leave-active {
    transition: all .2s linear;
  }
  [aspectratio] {
    position: relative;
  }
  [aspectratio]::before {
    display: block;
    width: 1px;
    margin-left: -1px;
    height: 0;
  }

  [aspectratio-content] {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
  }
  /*vm兼容处理使用Viewport Units Buggyfill造成的副作用，需要如下设置img*/
  img {
    content: normal !important;
  }
  .go-top {
    position: fixed;
    right: 40px;
    bottom: 150px;
    z-index: 100;
    img {
      width: 78px;
      height: 78px;
      border-radius: 50%;
    }
    .icon {
      display: block;
      padding: 15px;
      border-radius: 50%;
      background: rgba(0, 0, 0, 0.4);
      transform: rotate(180deg);
    }
  }
</style>
