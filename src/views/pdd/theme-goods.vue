<template>
  <div class="pdd-page">
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
  import { List } from 'vant'
  import GoodsList from '@/components/goods-list'
  import {getPDDThemeGoods} from '@/assets/js/api'

  export default {
    name: "collect",
    components: {
      [List.name]: List,
      GoodsList
    },
    data() {
      return {
        goodsListData: [],
        finished: false,
        loading: true,
        page: 1
      }
    },
    mounted() {
      this.init()
    },
    methods: {
      onClickTabs(index, val) {
        // console.log(this.active);
        this.getGoodsData()
      },
      init() {
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
          theme_id: this.$route.query.theme_id
        }
        let res = await getPDDThemeGoods(params)
        this.goodsListData = this.goodsListData.concat(res.data)
        this.loading = false
        if (this.page >= res.all_page) {
          this.finished = true
        }
      }
    },
    watch: {
      $route(to, from) {
        if (to.path=== '/pdd/theme-goods' && !/^\/goods\/detail\/\d/.test(from.path)) this.init()
      }
    }
  }
</script>

<style scoped lang="less">
  .theme-page {
  }
</style>