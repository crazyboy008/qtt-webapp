<template>
  <div class="goods-list">
    <div class="goods-list-item border-bottom-1px" @click="onClick(item)" v-for="(item, index) in data" :key="index">
      <div class="content">
        <div class="img"><img :src="item.img" alt=""></div>
        <div class="text">
          <div class="title">
            <div class="omit">
              <span>{{item.is_tmall===1?'天猫':item.is_tmall===2?'淘宝':'拼多多'}}</span>
              <span>{{item.title}}</span>
            </div>
          </div>
          <div class="number">
            <span>券后价：¥<span>{{item.price}}</span></span>
            <del>¥{{item.original_price}}</del>
          </div>
          <div class="coupon-box">
            <div class="coupon" v-if="item.coupon.coupon_price !== 0">
              {{`${item.coupon.coupon_price}元券`}}
            </div>
            <div class="coupon" v-if="item.coupon.coupon_info">
              {{item.coupon.coupon_info}}
            </div>
            <div class="label" v-if="item.free_shipment">包邮</div>
          </div>
          <div class="button">{{convertUnits(item.buy_num)}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import Util from '@/assets/js/util'

  export default {
    components: {},
    props: {
      data: {
        type: [Array, Object]
      },
      showType: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {}
    },
    created () {
    },
    computed: {
    },
    methods: {
      onClick(item) {
        if (item.is_tmall !== 3) {
          this.$store.commit('setTBGoodsDetail', item)
        }
        this.$emit('onClick', item)
        this.setStorage(item)
      },
      setStorage(item) {
        let hasVal = false
        let historyData = localStorage.getItem('browsing_history')
        historyData = historyData ? JSON.parse(historyData) : []
        if (historyData.length) {
          for (let i = 0; i < historyData.length; ++i) {
            if (historyData[i].source_id === item.source_id) return hasVal = true
          }
        }
        if (!hasVal) {
          if (historyData.length >= 50) historyData.splice(historyData.length - 1, 1)
          historyData.unshift(item)
          localStorage.setItem('browsing_history', JSON.stringify(historyData))
        }
      },
      convertUnits(num) {
        return Util.convertUnits(num)
      }
    },
    mounted () {
    },
    activated () {
    },
    watch: {}
  }
</script>

<style scoped lang="less">

  .goods-list {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    padding: 0 4vw 20px;
    background: #eee;
    .goods-list-item {
      width: 44.5vw;
      position: relative;
      margin-top: 20px;
      border-radius: 15px;
      background: #fff;
      &:active {
        background: #eee;
      }
      .content {
        box-sizing: border-box;
        .img {
          text-align: center;
          img {
            width: 100%;
            height: 45vw;
            box-shadow: 3px 3px 6px rgba(0,0,0,0.2);
            border-radius: 15px 15px 0 0;
          }
        }
        .text {
          display: flex;
          align-content: space-between;
          flex-direction: column;
          min-width: 0;
          padding: 10px 15px;
          .title {
            display: flex;
            align-items: center;
            color:#333;
            span:nth-child(1) {
              display: inline-block;
              padding: 5px;
              font-size: 20px;
              color: #fff;
              border-radius: 5px;
              vertical-align: middle;
              background: linear-gradient(to right, #fcd311, #ff6a19);
            }
            span:nth-child(2) {
              padding-left: 10px;
              vertical-align: middle;
              font-size: 28px;
            }
          }
          .number {
            color:#999;
            padding-top: 10px;
            font-size: 20px;
            span:nth-child(1) {
              color: #FF7538;
              padding-right: 10px;
              span {
                font-size: 30px;
              }
            }
          }
          .coupon-box {
            display: flex;
            padding-top: 10px;
            .coupon {
              font-size: 24px;
              color: #fff;
              padding: 4px 10px;
              border-radius: 14px;
              margin-right: 20px;
              background: linear-gradient(to right, #fc6712, #ff3317);
            }
            .label {
              font-size: 24px;
              color: #ff3317;
              padding: 2px 5px;
              border-radius: 8px;
              border: 1px solid #ff3317;
              background: #fbfcf7;
            }
          }
          .button {
            color: #666;
            font-size: 24px;
            padding-top: 10px;
          }
        }
      }
    }
  }

</style>