<template>
  <div class="top-tab-box">
    <div class="top-tab">
      <div class="top-tab-item" v-for="(item, index) in data" :key="index"
      :class="index===currentIndex?'active':''" @click.stop.prevent="clickTab(item, index)">
        <span class="text">{{item}}</span>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    components: {},
    props: {
      data: {
        type: Array,
        default() {
          return []
        }
      }
    },
    data () {
      return {
        currentIndex: 0
      }
    },
    created () {
    },
    methods: {
      clickTab(item, index) {
        if (this.currentIndex === index) return
        this.currentIndex = index
        this.$emit('click', index, item)
      }
    },
    mounted () {
    },
    activated () {
    },
    beforeDestroy () {
    },
    watch: {}
  }
</script>

<style scoped lang="less">

  .top-tab-box {
    .top-tab {
      width: 400px;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      line-height: 60px;
      margin: 20px auto;
      .top-tab-item {
        flex: 1;
        border: 2px solid #f56a39;
        color: #f56a39;
        box-sizing: border-box;
        &.active {
          background: #f56a39;
          color: #fff;
          border: 2px solid #f56a39;
        }
        &:last-child {
          border-radius: 0 35px 35px 0;
          border-left: none;
        }
        &:first-child {
          border-radius: 35px 0 0 35px;
          border-right: none;
        }
        .text {
          font-size: 30px;
        }
      }
    }
  }
</style>
