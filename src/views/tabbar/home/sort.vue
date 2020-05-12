<template>
  <div class="home-sort">
    <van-list
        v-model="listLoading"
        :finished="finished"
        finished-text="没有更多了"
        :immediate-check="false"
        @load="onLoad">
      <van-pull-refresh v-model="refreshLoading" @refresh="onRefresh">
        <div class="grid-box">
          <van-grid :border="false" :column-num="5">
            <van-grid-item v-for="(item, index) in gridData" :key="index" @click="goClassifyGoods(item, index)">
              <img class="grid-img" :src="(gridData.length-1===index&&gridData.length>=10)?allImg:placeholderImg" />
              <p>{{item.name.slice(0, 4)}}</p>
            </van-grid-item>
          </van-grid>
        </div>
        <van-sticky :offset-top="getStickyTop" v-if="gridData.length">
          <van-tabs v-model="active" @click="onClickTabs" title-active-color="#fc6a42" color="#fff">
            <van-tab v-for="(item, index) in tabData" :title="item.name" :name="item.id" :key="index"></van-tab>
          </van-tabs>
        </van-sticky>

        <van-skeleton :loading="loading" :row="4" avatar avatar-size="100px" avatar-shape="square">
          <goods-list :data="goodsListData" @onClick="goGoodsDetail"></goods-list>
        </van-skeleton>
        <van-skeleton :loading="loading" :row="4" avatar avatar-size="100px"  avatar-shape="square"/>
        <van-skeleton :loading="loading" :row="4" avatar avatar-size="100px"  avatar-shape="square"/>
      </van-pull-refresh>
    </van-list>
  </div>
</template>

<script>
  import { Skeleton, Sticky, Tab, Tabs, Grid, GridItem, PullRefresh, List } from 'vant'
  import GoodsList from '@/components/goods-list-row'
  import {getClassifyData, getClassifyGoodsList} from '@/assets/js/api'
  import placeholderImg from '@/assets/images/placeholder.jpg'
  import allImg from '@/assets/images/more.png'

  export default {
    name: "sort-component",
    data() {
      return {
        placeholderImg: placeholderImg,
        allImg: allImg,
        active: 0,
        tabData: [
          {name: '综合', id: 0},
          {name: '销量', id: 6},
          {name: '价格', id: 3},
          {name: '优惠券', id: 8},
          {name: '券后价', id: 9},
        ],
        goodsListData: [],
        gridData: [],
        listLoading: false,
        refreshLoading: false,
        loading: true,
        finished: false,
        page: 1
      }
    },
    components: {
      [Skeleton.name]: Skeleton ,
      [Sticky.name]: Sticky ,
      [Tab.name]: Tab,
      [Tabs.name]: Tabs,
      [Grid.name]: Grid,
      [GridItem.name]: GridItem,
      [PullRefresh.name]: PullRefresh,
      [List.name]: List,
      GoodsList
    },
    async created() {
      // this._getGoodsList()
      // await this._getClassifyData()
      // this.loading = false
    },
    computed: {
      getStickyTop() {
        let clientWidth = document.body.clientWidth
        return clientWidth <= 320 ? 73 : clientWidth <= 375 ? 85 : clientWidth <= 430 ? 94 : clientWidth <= 600 ? 114 : 175
      }
    },
    mounted() {
    },
    activated() {
    },
    methods: {
      async onClickTabs(index, val) {
        // console.log(this.active);
        this.page = 1
        this.loading = true
        this.goodsListData = []
        this._getClassifyData()
        await this._getGoodsList()
        this.refreshLoading = false
      },
      goGoodsDetail(item) {
        this.$router.push('/goods/detail/' + item.source_id)
      },
      goClassifyGoods(item, index) {
        if (item.name === '查看全部') return this.$router.push('/classify?currentId=' + this.id)
        this.$router.push('/goods/search?keyword=' + item.name)
      },
      async onRefresh(id) {
        if (id) this.id = id
        this.page = 1
        this.loading = true
        this.goodsListData = []
        this._getClassifyData()
        await this._getGoodsList()
        this.refreshLoading = false
      },
      async onLoad() {
        this.page++
        await this._getGoodsList()
        this.listLoading = false
      },
      async _getClassifyData() {
        let res = await getClassifyData({parent_opt_id: this.id, level: 'two'})
        let arr
        if (res.data.length >= 10) {
          arr = res.data.splice(0, 9)
          arr.push({id: 'all', name: '查看全部', img: ''})
        } else {
          arr = res.data
        }
        this.gridData = arr
      },
      async _getGoodsList() {
        let res = await getClassifyGoodsList({
          page: this.page,
          page_size: 20,
          opt_id: this.id,
          sort_type: this.active,
          with_coupon: true
        })
        this.goodsListData = this.goodsListData.concat(res.data)
        this.loading = false
        if (this.page >= res.all_page) {
          this.finished = true
        }
      }
    },
    watch: {
      // '$route'(to, from) {
      //   if (to.path === '/home/all' || /^\/goods\/detail\/\d/.test(to.path)
      //     || /^\/goods\/detail\/\d/.test(from.path)) return
      //   // this.onRefresh()
      // }
    }
  }
</script>

<style scoped lang="less">
  .home-sort {
    .grid-box {
      width: 100%;
      height: 340px;
      .grid-img {
        width: 70px;
        height: 70px;
        & + p {
          padding-top: 10px;
          font-size: 26px;
        }
      }
    }

  }
</style>