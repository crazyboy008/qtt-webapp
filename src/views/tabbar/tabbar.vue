<template>
  <div class="tabbar-page">
    <transition name="tabbar">
      <keep-alive>
        <router-view @showSearch="showSearch"></router-view>
      </keep-alive>
    </transition>
    <van-tabbar v-model="active" route>
      <van-tabbar-item icon="wap-home-o" to="/home">首页</van-tabbar-item>
      <van-tabbar-item icon="apps-o" to="/classify">分类</van-tabbar-item>
      <van-tabbar-item icon="friends-o" to="/me">我的</van-tabbar-item>
    </van-tabbar>

    <search ref="search"></search>

  </div>
</template>

<script>
  import { Tabbar, TabbarItem } from 'vant';
  import Search from './search'

  export default {
    name: "tabbar",
    data() {
      return {
        active: 0
      }
    },
    components: {
      Search,
      [Tabbar.name]: Tabbar,
      [TabbarItem.name]: TabbarItem
    },
    methods: {
      showSearch() {
        this.$refs.search.show()
      }
    }
  }
</script>

<style scoped>
  .tabbar-enter-active, .tabbar-leave-active {
    transition: all 0.2s ease-in-out;
  }
  .tabbar-enter, .tabbar-leave-to {
    /*transform: translate3d(100%, 0, 0);*/
    opacity: 0;
  }

</style>