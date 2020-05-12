<template>
  <div class="home-all">

    <van-list
        v-model="listLoading"
        :finished="finished"
        finished-text="没有更多了"
        :immediate-check="false"
        @load="onLoad">
      <van-pull-refresh v-model="refreshLoading" @refresh="onRefresh">
        <!--<van-swipe :autoplay="2000" indicator-color="white" :touchable="true" :stop-propagation="true">-->
          <!--<van-swipe-item v-for="(image, index) in images" :key="index" @click.stop="goThemeGoods(image)">-->
            <!--<img class="swiper-img" style="width: 100%" :src="image.image_url"/>-->
          <!--</van-swipe-item>-->
        <!--</van-swipe>-->
        <md-swiper
          ref="swiper"
          :is-prevent="false"
          :useNative-driver="false">
          <md-swiper-item :key="$index" v-for="(item, $index) in images">
            <img class="swiper-img" style="width: 100%" :src="item.image_url" @click.stop="goThemeGoods(item)"/>
          </md-swiper-item>
        </md-swiper>
        <div class="grid-box">
          <van-grid :border="false" :column-num="3">
            <van-grid-item @click="$router.push('/pdd/recommend/pinkage')">
              <img class="grid-img" src="@/assets/images/icon9.9.png" />
              <p>9.9包邮</p>
            </van-grid-item>
            <van-grid-item @click="$router.push('/pdd/recommend/hot')">
              <img class="grid-img" src="@/assets/images/icon-hot.png" />
              <p>今日爆款</p>
            </van-grid-item>
            <van-grid-item @click="$router.push('/pdd/recommend/concessions')">
              <img class="grid-img" src="@/assets/images/ico78.png" />
              <p>品牌优惠</p>
            </van-grid-item>
          </van-grid>
        </div>
        <tab :data="tabData" @click="onClickTab"></tab>
        <goods-list :data="goodsListData" @onClick="goGoodsDetail"></goods-list>
      </van-pull-refresh>
    </van-list>
  </div>
</template>

<script>
  import { Swipe, SwipeItem, Grid, GridItem, PullRefresh, List } from 'vant'
  import { Swiper, SwiperItem } from 'mand-mobile'
  import GoodsList from '@/components/goods-list-row'
  import Tab from './top-tab'
  import {getGoodsList, getBannerData, getFavorites, getFavoritesGoods} from '@/assets/js/api'

  export default {
    name: "all-component",
    data() {
      return {
        tabData: ['拼多多', '淘宝'],
        currentIndex: 0,
        images: [],
        goodsListData: [],
        refreshLoading: false,
        listLoading: false,
        finished: false,
        page: 1,
        flag: false
      }
    },
    components: {
      [Swiper.name]: Swiper,
      [SwiperItem.name]: SwiperItem,
//      [Swipe.name]: Swipe,
//      [SwipeItem.name]: SwipeItem,
      [Grid.name]: Grid,
      [GridItem.name]: GridItem,
      [PullRefresh.name]: PullRefresh,
      [List.name]: List,
      GoodsList,
      Tab
    },
    created() {
      this._getBannerData()
      this._getGoodsList()
      // this._getFavorites()
//      this._getFavoritesGoods()
    },
    mounted() {
    },
    activated() {
    },
    methods: {
      onClickTab(index) {
        this.currentIndex = index
        this.onRefresh()
      },
      goThemeGoods(item) {
        console.log(item);
        this.$router.push(`/pdd/theme-goods?theme_id=${item.id}`)
      },
      goGoodsDetail(item) {
        if (this.currentIndex === 0) this.$router.push('/goods/detail/' + item.source_id)
        else this.$router.push('/goods/tb-detail/' + item.source_id)
      },
      async onRefresh() {
        this.page = 1
        this.goodsListData = []
        if (this.currentIndex === 0) await this._getGoodsList()
        else await this._getFavoritesGoods()
        this.refreshLoading = false
      },
      async onLoad() {
        this.page++
        if (this.currentIndex === 0) await this._getGoodsList()
        else await this._getFavoritesGoods()
        this.listLoading = false
      },
      async _getGoodsList() {
        let res = await getGoodsList({offset: this.page * 20, limit: 20})
        this.goodsListData = this.goodsListData.concat(res.data)
        if (this.page >= res.all_page) {
          this.finished = true
        }
      },
      async _getBannerData() {
        let res = await getBannerData({page: 1, page_size: 6})
        this.images = res
      },
      async _getFavorites() {
        let res = await getFavorites()
        console.log(res);
      },
      async _getFavoritesGoods() {
        let res = await getFavoritesGoods({favorites_id: 19953587, page: this.page})
        this.goodsListData = this.goodsListData.concat(res.data)
        if (this.page >= res.all_page) {
          this.finished = true
        }
      }
    }
  }
</script>

<style scoped lang="less">
.home-all {
  .grid-img {
    width: 80px;
    height: 80px;
    & + p {
      padding-top: 15px;
      font-size: 30px;
    }
  }
}
</style>