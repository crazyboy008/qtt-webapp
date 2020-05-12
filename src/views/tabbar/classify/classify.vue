<template>
  <div class="classify-page">
    <div class="classify-box">
      <div class="row-left">
        <div :class="currentId === item.id ? 'cell active' : 'cell'" v-for="(item, index) in classifyData"
             :key="index" @click="onClick(item, index)">
          <span>{{item.name}}</span>
        </div>
      </div>
      <div class="row-right">
        <div class="grid-box">
          <div class="grid" v-for="(item, index) in gridData" :key="index" @click="onSearch(item)">
            <img class="grid-img" :src="placeholderImg" />
            <p>{{item.name}}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {getClassifyData} from '@/assets/js/api'
  import placeholderImg from '@/assets/images/placeholder.jpg'

  export default {
    name: "classify",
    components: {
    },
    data() {
      return {
        placeholderImg: placeholderImg,
        currentId: '',
        classifyData: [],
        gridData: []
      }
    },
    async mounted() {
      await this._getClassifyData()
      this.currentId = Number(this.$route.query.currentId) || this.classifyData[0].id
    },
    methods: {
      onClick(item, index) {
        this.currentId = item.id
        this.getTwoLevelClassifyData(item.id)
      },
      onSearch(item) {
        this.$router.push('/goods/search?keyword=' + encodeURIComponent(item.name))
      },
      async getTwoLevelClassifyData(id) {
        let res = await getClassifyData({parent_opt_id: id, level: 'two'})
        this.gridData = res.data
      },
      async _getClassifyData() {
        let res = await getClassifyData({parent_opt_id: 0, level: 'one'})
        this.classifyData = res.data.splice(0, 12)
        this.getTwoLevelClassifyData(this.currentId || this.classifyData[0].id)
      }
    },
    watch: {
      $route(to) {
//        console.log(to.query.currentId);
        if (to.query.currentId) {
          this.currentId = Number(to.query.currentId)
          this._getClassifyData()
        }
      }
    }
  }
</script>

<style scoped lang="less">
.classify-page {
  .classify-box {
    display: flex;
    justify-content: center;
    max-height: 100vh;
    overflow: hidden;
    background: #eee;
    .row-left {
      width: 160px;
      padding-bottom: 100px;
      overflow-x: hidden;
      overflow-y: scroll;
      -webkit-overflow-scrolling: touch;
      .cell {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 160px;
        height: 100px;
        background: #fff;
        span {
          font-size: 28px;
          color: #333;
        }
        &.active {
          border-left: 4px solid #fc6a42;
          background: #eee;
          span {
            color: #fc6a42;
          }
        }
      }
    }
    .row-right {
      flex: 1;
      padding: 30px 30px 130px;
      overflow-y: scroll;
      -webkit-overflow-scrolling: touch;
      .grid-box {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        flex-wrap: wrap;
        border-radius: 20px;
        padding: 20px 0;
        background: #fff;
        .grid {
          width: 33.3333%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          padding: 20px 0;
          .grid-img {
            width: 80px;
            height: 80px;
            & + p {
              padding-top: 10px;
              font-size: 26px;
            }
          }
        }
      }
    }
  }
}
</style>