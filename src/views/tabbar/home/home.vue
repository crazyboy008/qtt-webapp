<template>
  <div class="home-page">
    <div class="sticky-box">
      <div @click="showSearch" class="search-box">
        <div class="search">
          <van-icon name="search" color="#fff" />
          <span>输入商品关键字</span>
        </div>
      </div>
      <md-tab-bar
          v-model="current"
          :items="classifyData"
          :has-ink="true"
          :ink-length="60"
          :maxLength="5"
          @change="onTabChange" />
      <!--<van-tabs @change="onTabChange" :swipe-threshold="6" title-active-color="#fc6a42" color="#fc6a42" line-width="30">-->
        <!--<van-tab v-for="(item, index) in classifyData" :title="item.name" :key="index"></van-tab>-->
      <!--</van-tabs>-->
    </div>
    <div class="content-wrapper">
      <all v-show="isHome"></all>
      <sort v-show="!isHome" ref="child"></sort>
    </div>

  </div>
</template>

<script>
  import { Icon } from 'vant'
  import { TabBar } from 'mand-mobile'
  import {getClassifyData} from '@/assets/js/api'
  import All from './all'
  import Sort from './sort'

  export default {
    name: "home",
    data() {
      return {
        isHome: true,
        goRoutePath: '',
        current: 0,
        classifyData: []
      }
    },
    components: {
//      [Tab.name]: Tab,
//      [Tabs.name]: Tabs,
      [Icon.name]: Icon,
       [TabBar.name]: TabBar,
      All,
      Sort
    },
    created() {
    },
    mounted() {
      this._getClassifyData()
    },
    activated() {
    },
    methods: {
      showSearch() {
        this.$emit('showSearch')
      },
      async onTabChange(item, index) {
        window.scrollTo(0, 0)
        if (index === 0) {
          this.isHome = true
        } else {
          this.isHome = false
          this.$refs.child.onRefresh(item.name)
        }
      },
      async _getClassifyData() {
        let res = await getClassifyData({level: 'one', parent_opt_id: 0})
        this.classifyData = res.data.splice(0, 12).map(item => {
          return {
            label: item.name,
            name: item.id,
            level: item.level
          }
        })
        this.classifyData.unshift({name: 0, label: '精选'})
      }
    }
  }
</script>

<style lang="less">
.home-page {
  padding-bottom: 100px;
  .sticky-box {
    height: 170.5px;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1;
    background: #fc6a42;
    /*background: linear-gradient(to right, #fc6a42, #ff2d41);*/
    .search-box {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100px;
      background: #fc6a42;
      .search {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 80%;
        height: 60px;
        border-radius: 30px;
        background: rgba(0, 0, 0, 0.2);
        span {
          font-size: 26px;
          color: #fff;
          padding-left: 15px;
        }
      }
    }
  }
  .md-tab-bar {
    padding: 0 30px;
    background: #fc6a42;
    .md-tab-bar-start {
      height: 70px;
    }
    .md-tab-bar-end {
      height: 70px;
    }
    .md-tab-bar-item {
      min-height: 70px;
      font-size: 28px;
      font-weight: 400;
      color: #e7e7e7;
      padding: 0 20px;
    }
    .is-active {
      color: #fff;
      font-size: 32px;
      font-weight: 700;
    }
    .md-tab-bar-ink {
      border-radius: 5px;
      bottom: 6px;
      background: #fff;
    }
  }
  .swiper-img {
    width: 100%;
    height: 300px;
  }
  .content-wrapper {
    padding-top: 170px;
  }
}
</style>