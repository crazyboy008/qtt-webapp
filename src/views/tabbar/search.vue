<template>
  <div class="search-component" v-show="isShow">
    <form action="/" class="search-box" @touchmove.prevent>
      <van-search
          v-model.trim="value"
          placeholder="请输入搜索关键词"
          show-action
          @input="onInput"
          @search="onSearch"
          @cancel="onCancel" />
    </form>
    <div class="history-box" v-show="!relativeWord.length">
      <div class="title">
        <p>热门搜索</p>
      </div>
      <div class="history-text">
        <p class="omit" v-for="(item, i) in hotSearchData" :key="i" @click="onSearch(item.name)">{{item.name}}</p>
      </div>
      <div class="title">
        <p>搜索历史</p>
        <van-icon @click="deleteData" name="delete" size="24px"/>
      </div>
      <div class="history-text">
        <p class="omit" v-for="(val, i) in historyData" :key="i" @click="goSearch(val)">{{val}}</p>
      </div>
    </div>
    <div class="relative-box" v-show="relativeWord.length">
      <div class="cell border-bottom-1px" v-for="(item, index) in relativeWord" :key="index">
        <p @click="onSearch(item.suggest)">{{item.suggest}}</p>
        <p @click="getMoreRelativeData(item.suggest)"><van-icon name="down" size="18px" color="#999" /></p>
      </div>
    </div>
  </div>
</template>

<script>
  import { Search, Icon } from 'vant'
  import {getRelativeWord, getHotSearch} from '@/assets/js/api'

  export default {
    name: "search-component",
    components: {
      [Search.name]: Search,
      [Icon.name]: Icon
    },
    data() {
      return {
        value: '',
        isShow: false,
        historyData: [],
        hotSearchData: [],
        relativeWord: [],
        flag: false
      }
    },
    created() {

    },
    methods: {
      onInput(val) {
        if (!val.trim()) return
        if (this.timer) clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          this.getRelativeData(val)
        }, 50)
      },
      deleteData() {
        localStorage.removeItem('search_history')
        this.historyData = []
      },
      goSearch(val) {
        this.$router.push('/goods/search?keyword=' + encodeURIComponent(val))
      },
      onSearch(val) {
        if (!val.trim()) return
        this.setStorage(val)
        this.$router.push('/goods/search?keyword=' + encodeURIComponent(val))
      },
      setStorage(val) {
        let hasVal = false
        let historyData = this.historyData
        if (historyData.length) {
          for (let i = 0; i < historyData.length; ++i) {
            if (historyData[i] === val) return hasVal = true
          }
        }
         if (!hasVal) {
          if (historyData.length >= 50) historyData.splice(historyData.length - 1, 1)
          historyData.unshift(val)
          localStorage.setItem('search_history', historyData.toString())
          this.historyData = historyData
        }
      },
      getMoreRelativeData(val) {
        this.value = val
        this.getRelativeData(val)
      },
      onCancel(e, val) {
        this.isShow = false
        this.relativeWord = []
      },
      show() {
        this.isShow = true
        this.getHotSearchData()
        let historyData = localStorage.getItem('search_history')
        this.historyData = historyData ? historyData.split(',') : []
      },
      async getHotSearchData() {
        let res = await getHotSearch()
        this.hotSearchData = res.data
      },
      async getRelativeData(val) {
        let res = await getRelativeWord({keyword: val})
        this.relativeWord = res.data
      }
    }
  }
</script>

<style scoped lang="less">
  .search-component {
    width: 100%;
    height: 100%;
    max-height: 100%;
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
    background: #fff;
    z-index: 100;
    .search-box {
      position: sticky;
      top: 0;
      left: 0;
      right: 0;
    }
    .history-box {
      padding: 0 30px;
      .title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        p {
          font-size: 36px;
          font-weight: 700;
          color: #333;
        }
      }
      .history-text {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        padding: 30px 0;
        p {
          height: 40px;
          line-height: 40px;
          padding: 10px 20px;
          border-radius: 25px;
          font-size: 28px;
          color: #666;
          margin-bottom: 20px;
          margin-right: 20px;
          background: #eee;
        }
      }
    }
    .relative-box {
      padding: 0 30px;
      .cell {
        display: flex;
        align-items: center;
        justify-content: space-around;
        p:nth-child(1) {
          display: flex;
          align-items: center;
          flex: 1;
          height: 80px;
          font-size: 28px;
          color: #333;
        }
        p:nth-child(2) {
          display: flex;
          align-items: center;
          justify-content: center;
          flex: 0 0 100px;
          height: 80px;
          transform: rotateZ(120deg);
        }
      }
    }
  }
</style>