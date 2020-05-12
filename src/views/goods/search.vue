<template>
  <div class="search-page">
    <div class="search-box">
      <form action="/">
        <van-search
            v-model="value"
            placeholder="请输入搜索关键词"
            show-action
            @search="onSearch"
            @cancel="onCancel">
          <div slot="action" @click="onSearch">搜索</div>
        </van-search>
      </form>
      <van-tabs v-model="currentIndex" @click="_onClickTabs" type="card" color="#fc6a42">
        <van-tab :name="0" title="拼多多"></van-tab>
        <van-tab :name="1" title="淘宝"></van-tab>
        <van-tab :name="2" title="天猫"></van-tab>
      </van-tabs>
      <van-tabs v-model="active" @click="onClickTabs" title-active-color="#fc6a42" color="#fc6a42" line-width="30">
        <van-tab v-for="(item, index) in tabData" :name="item.id" :title="currentIndex===1&&index===2?'热销':item.name" :key="item.id"></van-tab>
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
  import { Search, Tab, Tabs, List } from 'vant'
  import GoodsList from '@/components/goods-list'
  import {getGoodsSearch, getTbGoodsSearch} from '@/assets/js/api'

  export default {
    name: "search",
    components: {
      // [Sticky.name]: Sticky ,
      [Search.name]: Search,
      [Tab.name]: Tab,
      [Tabs.name]: Tabs,
      [List.name]: List,
      GoodsList
    },
    data() {
      return {
        value: '',
        currentIndex: 0,
        active: 0,
        tabData: [
          {name: '综合', id: 0},
          {name: '销量', id: 6},
          {name: '优惠券', id: 8},
          {name: '券后价', id: 9},
        ],
        goodsListData: [],
        finished: false,
        loading: true,
        page: 1
      }
    },
    mounted() {
      if (this.$route.query.keyword) {
        this.value = decodeURIComponent(this.$route.query.keyword)
        this.getGoodsData()
//        this.getTBGoodsData()
      }
    },
    methods: {
      async onSearch(val) {
        this.page = 1
        this.active = 0
        this.loading = true
        this.finished = false
        this.goodsListData = []
        if (this.currentIndex === 0) this.getGoodsData(val)
        else this.getTBGoodsData(val)
      },
      onCancel(e, val) {
        if (this.currentIndex === 0) this.getGoodsData(val)
        else this.getTBGoodsData(val)
      },
      _onClickTabs(index, val) {
        this.currentIndex = index
        this.onSearch()
      },
      onClickTabs(index, val) {
        this.onSearch()
      },
      goGoodsDetail(item) {
        if (this.currentIndex === 0) this.$router.push('/goods/detail/' + item.source_id)
        else this.$router.push('/goods/tb-detail/' + item.source_id)
      },
      async onLoad() {
        this.page++
        if (this.currentIndex === 0) this.getGoodsData()
        else this.getTBGoodsData()
      },
      async getGoodsData(val) {
        let params = {
          keyword: val || this.value,
          page: this.page,
          page_size: 20,
          sort_type: this.active,
          with_coupon: true
        }
        let res = await getGoodsSearch(params)
        this.goodsListData = this.goodsListData.concat(res.data)
        this.loading = false
        if (this.page >= res.all_page) {
          this.finished = true
        }
      },
      async getTBGoodsData(val) {
        let params = {
          keyword: val || this.value,
          page: this.page,
          page_size: 20,
          has_coupon: true,
          is_tmall: this.currentIndex === 2,
          sort: this.active === 0 ? 'tk_rate_des' : this.active === 6 ? 'total_sales_des' : this.active === 8
            ? 'tk_total_sales_des' : 'price_asc'
        }
        let res = await getTbGoodsSearch(params)
        this.goodsListData = this.goodsListData.concat(res.data)
        this.loading = false
        if (this.page >= res.all_page) {
          this.finished = true
        }
      }
    },
    watch: {
      $route(to, from) {
        if (to.query.keyword && !/^\/goods\/detail\/\d/.test(from.path) && !/^\/goods\/tb-detail\/\d/.test(from.path)) {
          // console.log(to.query.keyword);
          this.value = decodeURIComponent(this.$route.query.keyword)
          this.onSearch()
        }
      }
    }
  }
</script>

<style scoped lang="less">
  .search-page {
    .search-box {
      position: sticky;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1;
    }
  }
</style>