<template>
  <transition name="popup">
    <div class="c-popup" v-show="show" :style="style">
      <div class="mask" @click="hide" v-show="mask" @touchmove.prevent></div>
      <div class="main">
        <div class="content">
          <slot></slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">

  export default {
  	name: 'c-popup',
    components: {
    },
    props: {
      show: Boolean,
      mask: {
        type: Boolean,
        default: true
      },
      bottom: {
        type: [String, Number],
        default: '0'
      }
    },
    data () {
      return {
      }
    },
    created () {
    },
    computed: {
      style() {
        return {bottom: `${this.bottom}px`}
      }
    },
    methods: {
      hide () {
        this.$emit('on-hide', this.show)
      }
    },
    mounted () {
    },
    activated () {
    },
    beforeDestroy () {
    },
    watch: {
      show (val) {
        if (val) {
          this.$emit('on-show', val)
        }
      }
    }
  }
</script>

<style scoped lang="less" rel="stylesheet/less">
  .popup-enter-active {
    animation: popup-fadein .4s;
    .content {
      animation: popup-zoom .4s;
    }
  }
  .popup-leave-active {
    animation: popup-leave-fadein .3s;
    .content {
      animation: popup-leave-zoom .3s;
    }
  }
  @keyframes popup-fadein {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
  @keyframes popup-zoom {
    0% {
      transform: scale(0);
    }
    50% {
      transform: scale(1.1);
    }
    100% {
      transform: scale(1);
    }
  }
  @keyframes popup-leave-fadein {
    0% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }
  @keyframes popup-leave-zoom {
    0% {
      transform: scale(1);
    }
    100% {
      transform: scale(0);
    }
  }

  .c-popup {
    position: fixed;
    left: 0;
    right: 0;
    height: 100%;
    width: 100%;
    /*transition-property: transform;*/
    /*transition-duration: 300ms;*/
    max-height: 100%;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
    z-index: 900;
    pointer-events: none;
    transition: all 0.3s;
    .mask {
      display: block;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.8);
      tap-highlight-color: rgba(0, 0, 0, 0);
      transition: opacity 300ms;
      z-index: 1;
      pointer-events: auto;
      // fix some android webview opacity render bug
      &::before {
        content: ".";
        display: block;
        width: 1px;
        height: 1px;
        background-color: rgba(0, 0, 0, .1);
        margin-left: -10px;
      }
    }
    .main {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translateX(-50%) translateY(-50%);
      z-index: 2;
      pointer-events: auto;
    }
  }
</style>
