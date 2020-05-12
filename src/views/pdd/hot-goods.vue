<template>
  <div class="pdd-page">
    <div class="tab-box">
      <van-tabs v-model="active" @click="onClickTabs" title-active-color="#fc6a42" color="#fc6a42" line-width="60">
        <van-tab v-for="(item, index) in tabData" :title="item.name" :key="index"></van-tab>
      </van-tabs>
    </div>
    <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        :immediate-check="false"
        @load="onLoad">
      <goods-list :data="goodsListData" @onClick="goGoodsDetail"></goods-list>
    </van-list>
  </div>
</template>

<script>
  import { Tab, Tabs, List } from 'vant'
  import GoodsList from '@/components/goods-list'
  import {getPDDHotGoods} from '@/assets/js/api'

  export default {
    name: "collect",
    components: {
      [Tab.name]: Tab,
      [Tabs.name]: Tabs,
      [List.name]: List,
      GoodsList
    },
    data() {
      return {
        active: 0,
        tabData: [
          {name: '9.9包邮', id: 0},
          {name: '今日爆款', id: 1},
          {name: '品牌优惠', id: 2},
        ],
        goodsListData: [],
        finished: false,
        loading: true,
        page: 1
      }
    },
    mounted() {
      let {path} = this.$route.params
      this.init(path)
    },
    methods: {
      onClickTabs(index, val) {
        // console.log(this.active);
        this.init()
      },
      init(path) {
        if (path) {
          if (path === 'pinkage') {
            document.title = '9.9包邮'
            this.active = 0
          } else if (path === 'hot') {
            document.title = '今日爆款'
            this.active = 1
          } else if (path === 'concessions') {
            document.title = '品牌优惠'
            this.active = 2
          }
        }
        this.page = 1
        this.loading = true
        this.finished = false
        this.goodsListData = []
        this.getGoodsData()
      },
      goGoodsDetail(item) {
        this.$router.push('/goods/detail/' + item.source_id)
      },
      async onLoad() {
        this.page++
        this.getGoodsData()
      },
      async getGoodsData() {
        let params = {
          offset: this.page * 20,
          limit: 20,
          channel_type: this.active
        }
        let res = await getPDDHotGoods(params)
        this.goodsListData = this.goodsListData.concat(res.data)
        this.loading = false
        if (this.page >= res.all_page) {
          this.finished = true
        }
      }
    },
    watch: {
      $route(to, from) {
        let {path} = to.params
        if (path && !/^\/goods\/detail\/\d/.test(from.path)) this.init(path)
      }
    }
  }
</script>

<style scoped lang="less">
  .pdd-page {
    .tab-box {
      position: sticky;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1;
    }
  }
</style>