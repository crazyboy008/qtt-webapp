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
            <span>券后价：¥<span>{{item.coupon.coupon_amount ? (item.price - item.coupon.coupon_amount) : item.price}}</span></span>
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
    background: #fff;
    .goods-list-item {
      position: relative;
      padding: 30px 0;
      margin: 0 30px;
      &:active {
        background: #eee;
      }
      .content {
        display: flex;
        box-sizing: border-box;
        align-items: center;
        justify-content: center;
        .img {
          flex: 0 0 168px;
          padding-right: 30px;
          img {
            width: 200px;
            height: 200px;
            box-shadow: 3px 3px 6px rgba(0,0,0,0.2);
            border-radius: 10px;
          }
        }
        .text {
          flex: 1;
          height: 200px;
          display: flex;
          align-content: space-between;
          flex-direction: column;
          min-width: 0;
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
            padding-top: 20px;
            font-size: 24px;
            span:nth-child(1) {
              color: #FF7538;
              padding-right: 20px;
              span {
                font-size: 36px;
              }
            }
          }
          .coupon-box {
            display: flex;
            padding-top: 20px;
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
            font-size: 28px;
            padding-top: 20px;
          }
        }
      }
    }
  }

</style>
