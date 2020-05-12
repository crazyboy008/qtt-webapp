<template>
  <div class="coupon-page">
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
  import {getGoodsSearch} from '@/assets/js/api'

  export default {
    name: "coupon",
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
      this.getGoodsData()
    },
    methods: {
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
          keyword: '热销',
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

</style>