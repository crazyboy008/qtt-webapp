<template>
  <div class="collect-page">
    <div class="tab-box">
      <van-tabs v-model="active" @click="onClickTabs" title-active-color="#fc6a42" color="#fc6a42" line-width="60">
        <van-tab v-for="(item, index) in tabData" :title="item" :key="index"></van-tab>
      </van-tabs>
    </div>
    <van-list
        v-show="active === 0"
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        :immediate-check="false"
        @load="onLoad">
      <goods-list :data="goodsListData" @onClick="goGoodsDetail"></goods-list>
    </van-list>
    <goods-list v-show="active === 1" :data="historyData" @onClick="goGoodsDetail"></goods-list>
  </div>
</template>

<script>
  import { Tab, Tabs, List } from 'vant'
  import GoodsList from '@/components/goods-list'
  import {getGoodsSearch} from '@/assets/js/api'

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
        tabData: ['我的收藏', '浏览历史'],
        historyData: [],
        goodsListData: [],
        finished: false,
        loading: true,
        page: 1
      }
    },
    mounted() {
      if (this.$route.params.path === 'collect') {
        document.title = '我的收藏'
        this.active = 0
        this.getGoodsData()
      } else {
        document.title = '浏览历史'
        this.active = 1
        let historyData = localStorage.getItem('browsing_history')
        this.historyData = historyData ? JSON.parse(historyData) : []
      }
    },
    methods: {
      onClickTabs(index, val) {
        this.active = index
        if (index == 0) {
          this.getGoodsData()
        } else {
          let historyData = localStorage.getItem('browsing_history')
          this.historyData = historyData ? JSON.parse(historyData) : []
        }
      },
      goGoodsDetail(item) {
        if (item.is_tmall === 3) this.$router.push('/goods/detail/' + item.source_id)
        else this.$router.push('/goods/tb-detail/' + item.source_id)
      },
      async onLoad() {
        this.page++
        this.getGoodsData()
      },
      async getGoodsData() {
        let params = {
          keyword: 'er',
          page: this.page
        }
        let res = await getGoodsSearch(params)
        this.goodsListData = res.data.splice(0, 10)
        this.loading = false
        if (this.page >= res.all_page) {
          this.finished = true
        }
      }
    },
    watch: {
    }
  }
</script>

<style scoped lang="less">
  .collect-page {
    .tab-box {
      position: sticky;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1;
    }
  }
</style>