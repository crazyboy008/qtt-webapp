<template>
  <div class="tab">
    <div class="tab-item" v-for="(item, index) in data" :key="index" @click="clickTab(index, item)">
      <span :class="{active: index === tabIndex}" :style="{color: index === tabIndex ? color : ''}">{{item}}</span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    components: {},
    props: {
      data: Array,
      currentIndex: {
        type: [Number, String],
        default: 0
      },
      color: {
        type: String,
        default: '#FD1D1D'
      }
    },
    data () {
      return {
        tabIndex: 0
      }
    },
    created () {
    },
    methods: {
      clickTab(index, item) {
        if (this.tabIndex === index) return
        this.tabIndex = index
        this.$emit('click', index, item)
      }
    },
    mounted () {
    },
    activated () {
    },
    beforeDestroy () {
    },
    watch: {
      currentIndex: {
        handler (val) {
          this.tabIndex = Number(val)
        }
      },
      immediate: true
    }
  }
</script>

<style scoped lang="less" rel="stylesheet/less">
  .tab {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    background: #fff;
    .tab-item {
      flex: 1;
      /*&:active {*/
      /*  background: #eee;*/
      /*}*/
      span {
        display: inline-block;
        /*width: 160px;*/
        height: 120px;
        line-height: 120px;
        color: #666;
        font-size: 30px;
        &.active {
          font-weight: 700;
          color: #FD1D1D;
          border-bottom: 4px solid #FD1D1D;
        }
      }
    }
  }
</style>
