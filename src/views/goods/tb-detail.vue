<template>
  <div class="detail-page">
    <van-skeleton :loading="loading" :row="2" avatar avatar-size="60px" />
    <van-skeleton :loading="loading" :row="8" />

    <div class="content-box" v-show="!loading">

      <div class="swipe-box">
        <van-swipe :loop="false" indicator-color="white" @change="onChange">
<!--          <van-swipe-item>
            <div class="video-box" ref="videobox">
              <video preload="auto"
                     playsInline
                     webkit-playsinline='true'
                     x-webkit-airplay='shop_typetrue'
                     x5-playsinline='true'
                     x5-video-orientation="landscape|portrait"
                     :poster="videos.img"
                     class="video" ref="video" @click="pause" >
                <source :src="videos.url" type="video/mp4" />
              </video>
              <div class="icon" @click="play" v-show="isPlay">
                <van-icon name="play-circle-o" size="60" color="#fff" />
              </div>
            </div>
          </van-swipe-item>-->
          <van-swipe-item v-for="(image, index) in data.header_imgs" :key="index">
            <img class="swiper-img" :src="image" />
          </van-swipe-item>
          <div class="custom-indicator" slot="indicator">
            {{ current + 1 }}/{{data.header_imgs ? data.header_imgs.length : 0}}
          </div>
        </van-swipe>
      </div>

      <div class="detail">
        <div class="number">
          <span>优惠价 ¥</span>
          <span>{{data.price}}</span>
        </div>
        <div class="price">
          <p>
            <span>{{data.is_tmall===1?'天猫价':data.is_tmall===2?'淘宝价':'拼多多价'}}</span>
            <del>¥ {{data.original_price}}</del>
          </p>
          <p>已售出{{data.buy_num}}件</p>
        </div>
      </div>
      <div class="name">
        <img v-show="data.is_tmall===1" src="@/assets/images/icostore-tamll.png" alt=""/>
        <img v-show="data.is_tmall===2" src='@/assets/images/icostore-tao.png' alt=""/>
        <span>{{decodeURIComponent(data.title)}}</span>
      </div>

      <div class="coupon-wrap" v-if="data.coupon.coupon_price !== 0">

        <!--      <div class="coupon">
                <div class="icon">
                  <img src='@/assets/images/product-red.png' alt=""/>
                </div>
                <div class="main">
                  <p>淘礼金红包</p>
                  <p>使用期限：{{tlj.tlj_start_date}} - {{tlj.tlj_end_date}}</p>
                </div>
                <div class="amount">
                  ¥<span>{{tlj.tlj_amount}}</span>
                </div>
              </div>-->
        <div class="coupon code" @click="goBuy" :data-clipboard-text="copy_url">
          <div class="icon">
            <img src='@/assets/images/product-quan.png' alt=""/>
          </div>
          <div class="main">
            <p>优惠券</p>
            <p v-if="data.coupon.coupon_start_date">有效期：{{data.coupon.coupon_start_date}} - {{data.coupon.coupon_end_date}}</p>
          </div>
          <div class="amount">
            ¥<span>{{data.coupon.coupon_price}}</span>
          </div>
        </div>

        <!--      <div class="hsy-coupon">
                <div class="title">
                  <p>{{discount_info.title}}</p>
                  <p>{{discount_info.desc}}</p>
                </div>
                <div class="coupon-1">
                  <div class="head">
                    <span>{{info1.title}}</span>
                    <p class="circle-head"></p>
                  </div>
                  <div class="content">
                    <p>{{info1.desc}}</p>
                    <p>剩余：<span></span></p>
                  </div>
                  <div class="foot">
                    <span>¥&nbsp;</span>
                    <span>{{info1.coupon_price}}</span>
                    <p class="circle-top"></p>
                    <p class="circle-bottom"></p>
                  </div>
                </div>
              </div>-->

      </div>


      <div class="shop">
        <div class="shop-detail">
          <div class="logo">
            <img src={shop.shop_logo} alt=""/>
          </div>
          <div class="title">
            <p>{{data.shop.shop_title}}</p>
            <img v-show="data.is_tmall===1" class="tmall-img" src='@/assets/images/ico-shop2.png' alt=""/>
            <img v-show="data.is_tmall===2" class="taobao-img" src='@/assets/images/ico-shop1.png' alt=""/>
          </div>
        </div>
        <a :href="data.shop.shop_url" class="button">
          <span>进入店铺</span>
        </a>
      </div>
      <div class="describe" v-if="data.shop.item_score">
        <p>
          <span>宝贝描述：&nbsp;</span>
          <span>{{data.shop.item_score}}</span>
        </p>
        <p>
          <span>卖家服务：&nbsp;</span>
          <span>{{data.shop.service_score}}</span>
        </p>
        <p>
          <span>物流服务：&nbsp;</span>
          <span>{{data.shop.delivery_score}}</span>
        </p>
      </div>
      <div class="img-box">
        <img v-for="(item, index) in data.header_imgs" :key="index" :src="item" alt="">
      </div>

      <van-goods-action>
        <van-goods-action-icon icon="wap-home-o" text="首页" @click="goBack" />
        <van-goods-action-icon icon="shop-o" text="店铺" />
        <van-goods-action-icon icon="like-o" text="收藏" v-show="!isCollect"/>
        <div class="collect-icon" v-show="isCollect">
          <van-icon name="like" color="#FE1A34"/>
          <p>已收藏</p>
        </div>
        <van-goods-action-button type="warning" :text="`优惠价 ¥${data.price}`" />
        <van-goods-action-button type="danger" text="立即领券购买" class="code" :data-clipboard-text="copy_url" @click="goBuy" />
      </van-goods-action>
    </div>
    <van-dialog v-model="show" title="淘口令">
      <div class="code-box">
        <p>{{copy_url}}</p>
        <p>领券流程：成功复制淘口令 -> 打开手机淘宝APP -> 点击打开 -> 立即领券 -> 下单购买</p>
        <p>如不支持复制，请手动长按以上淘口令复制。</p>
      </div>
    </van-dialog>
    <van-dialog v-model="showURL" title="复制链接">
      <div class="code-box">
        <p class="url">{{data.goods_url}}</p>
        <p>复制以上链接在浏览器打开，去领券。</p>
        <p>如不支持复制，请手动长按以上链接复制。</p>
      </div>
    </van-dialog>
  </div>
</template>

<script>
  import { Icon, Skeleton, Swipe, SwipeItem, GoodsAction, GoodsActionIcon, GoodsActionButton, Dialog } from 'vant'
  import {getTbGoodsDetail, createTPWD} from '@/assets/js/api'
  import Util from '@/assets/js/util'
  import ClipboardJS from "clipboard"

  export default {
    name: "detail",
    components: {
      [Icon.name]: Icon,
      [Skeleton.name]: Skeleton,
      [Dialog.Component.name]: Dialog.Component,
      [Swipe.name]: Swipe,
      [SwipeItem.name]: SwipeItem,
      [GoodsAction.name]: GoodsAction,
      [GoodsActionIcon.name]: GoodsActionIcon,
      [GoodsActionButton.name]: GoodsActionButton,
    },
    data() {
      return {
        copy_url: '',
        current: 0,
        isPlay: true,
        loading: false,
        show: false,
        showURL: false,
        isCollect: false,
        data: {
          header_imgs: [],
          coupon: {},
          shop: {}
        },
        coupon: {}
      }
    },
    mounted() {
    },
    async activated() {
      window.scrollTo(0, 0)
      this.current = 0
      this.isPlay = true
      this.data = {
          header_imgs: [],
          coupon: {},
          shop: {}
        }
//      this.videos = {}
      if (this.$store.getters.tbGoodsDetail) {
        this.data = this.$store.getters.tbGoodsDetail
        console.log("activated -> this.$store.getters.tbGoodsDetail", this.$store.getters.tbGoodsDetail)
        if (this.data.coupon_url) {
          this._createTPWD()
        } else {
          this.copy_url = this.data.goods_url
        }
      } else {
        this.loading = true
        await this._getTBGoodsDetail()
      }
      this.initCopy()
    },
    methods: {
      goBack() {
        if (window.history.length <= 1) this.$router.push('/home')
        else this.$router.back()
      },
      goBuy() {
        if (this.copy_url) this.show = true
        else if (Util.isWX) this.showURL = true
        else window.location.href = this.data.goods_url
      },
      onChange(index) {
        this.current = index;
        if (index === 1 && this.$refs.video) this.pause()
      },
      play() {
        this.$refs.video.play()
        this.isPlay = false
      },
      pause() {
        this.$refs.video.pause()
        this.isPlay = true
      },
      async _getTBGoodsDetail() {
        let res = await getTbGoodsDetail({num_iids: this.$route.params.id})
        this.data = res
        // this.videos = res.videos
        this.loading = false
        if (this.data.coupon_url) {
          this._createTPWD()
        } else {
          this.copy_url = this.data.goods_url
        }
      },
      async _createTPWD() {
        let res = await createTPWD({
          text: this.data.title,
          url: 'https:' + this.data.coupon_url,
          logo: this.data.img
        })
        this.copy_url = res.model
      },
      initCopy() {
        this.clipboard = new ClipboardJS('.code')
        this.clipboard.on('success', (e) => {
          e.clearSelection()
           this.$toast({
             position: 'middle',
             message: '淘口令复制成功，立即打开手淘APP领券'
           })
          console.log('success', e)
        })

        this.clipboard.on('error', (e) => {
           this.$toast('淘口令复制失败，请手动复制淘口令')
          console.error('error:', e)
        })
      }
    }
  }
</script>

<style scoped lang="less">
.detail-page {
  .swipe-box {
    position: relative;
    .video-box {
      width: 100vw;
      height: 100vw;
      .video {
        width: 100vw;
        height: 100vw;
      }
      .icon {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translateX(-50%) translateY(-50%);
        z-index: 1;
      }
    }
    .swiper-img {
      width: 100vw;
      height: 100vw;
    }
    .custom-indicator {
      display: flex;
      align-items: center;
      justify-content: center;
      position: absolute;
      left: 50%;
      bottom: 30px;
      transform: translateX(-50%) translateY(-50%);
      width: 60px;
      height: 34px;
      font-size: 24px;
      color: #fff;
      border-radius: 30px;
      background: #fc6a42;
      z-index: 10;
    }
  }
  .detail {
    display: flex;
    align-items: flex-end;
    justify-content: center;
    padding: 30px;
    background: #fff;
    .number {
      color:#999;
      padding-right: 10px;
      span {
        color: #FD1C1D;
        font-size: 24px;
      }
      span:nth-child(2)  {
        font-weight: 700;
        font-size: 46px;
      }
    }
    .price {
      display: flex;
      justify-content: space-between;
      flex: 1;
      color: #999;
      font-size: 24px;
      padding-bottom: 7px;
      p:nth-child(1) {
        display: inline-block;
        text-align: center;
        span {
          border-radius: 5px;
          padding-right: 10px;
        }
      }
    }
  }
  .name {
    color: #333;
    padding: 0 30px 30px;
    background: #fff;
    img {
      display: inline-block;
      width: 36px;
      height: 28px;
      padding-right: 10px;
      vertical-align: middle;
    }
    span {
      font-size: 30px;
      font-weight: 700;
      line-height: 40px;
      vertical-align: middle;
    }
  }
  .coupon-wrap {
    padding: 40px;
    background: #fff;
    .coupon {
      display: flex;
      align-items: center;
      height: 140px;
      color: #fff;
      border-radius: 20px;
      margin-bottom: 30px;
      box-shadow: 6px 6px 18px rgba(255,46,65,0.5);
      background: linear-gradient(to right, #fc6a42,  #ff2d41);
      .icon {
        width: 82px;
        height: 82px;
        padding: 0 30px;
        img {
          width: 100%;
          height: 100%;
          line-height: 140px;
          border-radius: 50%;
          box-shadow: 3px 3px 6px rgba(255,46,65,0.5);
        }
      }
      .main {
        flex: 1;
        p:nth-child(1) {
          font-size: 36px;
        }
        p:nth-child(2) {
          font-size: 22px;
        }
      }
      .amount {
        width: 160px;
        text-align: center;
        line-height: 60px;
        border-left: 1px dashed #eee;
        span {
          font-size: 50px;
        }
      }
    }

    .hsy-coupon {
      .title {
        text-align: center;
        p:nth-child(1) {
          font-size: 30px;
          font-weight: 700;
          color: #FE1A34;
        }
        p:nth-child(2) {
          font-size: 26px;
          color: #666;
        }
      }
      .coupon-1 {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 20px;
        margin-top: 40px;
        .head {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 140px;
          height: 110px;
          text-align: center;
          border-radius: 20px 0 0 20px;
          font-size: 28px;
          color: #fff;
          background-color: #FF0035;
          .circle-head {
            position: absolute;
            left: 125px;
            top: 40px;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            background-color: #FFE9EF;
          }
        }
        .content {
          flex: 1;
          height: 110px;
          padding-left: 30px;
          background-color: #FFE9EF;
          p:nth-child(1) {
            font-size: 28px;
            color: #333;
            text-align: left;
            padding-top: 15px;
          }
          p:nth-child(2) {
            font-size: 22px;
            color: #999;
            span {
              color: #FE1A34;
            }
          }
        }
        .foot {
          width: 180px;
          height: 110px;
          line-height: 110px;
          text-align: center;
          font-size: 30px;
          font-weight: 700;
          color: #FE1A34;
          border-left: 1px dashed #fff;
          border-radius: 0 20px 20px 0;
          background-color: #FFE9EF;
          span:nth-child(2) {
            font-size: 40px;
          }
          .circle-top {
            position: absolute;
            right: 165px;
            top: -22px;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            background-color: #fff;
          }
          .circle-bottom {
            position: absolute;
            right: 165px;
            bottom: -22px;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            background-color: #fff;
          }
        }
      }
      .coupon-2 {
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 20px;
        margin-top: 30px;
        background-color: #FFF5F5;
        .head {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 140px;
          height: 100px;
          text-align: center;
          border-radius: 20px 0 0 20px;
          font-size: 28px;
          color: #fff;
          background-color: #FFA54B;
        }
        .content {
          flex: 1;
          height: 100px;
          line-height: 100px;
          padding-left: 40px;
          font-size: 28px;
          color: #333;
          letter-spacing: 2px;
          span:nth-child(2) {
            color: #FE1A34;
            font-size: 30px;
          }
        }
        .foot {
          width: 180px;
          height: 100px;
          line-height: 100px;
          text-align: center;
          border-radius: 0 20px 20px 0;
          span {
            font-size: 22px;
            color: #999;
            vertical-align: middle;
          }
          i {
            display: inline-block;
            width: 10px;
            height: 10px;
            border-top: 1px solid #999;
            border-right: 1px solid #999;
            transform: rotate(45deg);
            vertical-align: middle;
          }
        }
      }
    }
  }
  .shop {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 40px;
    background: #fff;
    .shop-detail {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      .logo {
        img {
          width: 100px;
          height: 100px;
        }
      }
      .title {
        flex: 1;
        color: #666;
        font-size: 28px;
        padding-left: 20px;
        .taobao-img {
          width: 162px;
          height: 22px;
        }
        .tmall-img {
          width: 124px;
          height: 22px;
        }
      }
    }
    .button {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 160px;
      height: 60px;
      text-align: center;
      border-radius: 30px;
      border: 1px solid #FE1A34;
      span {
        color: #FE1A34;
        font-size: 26px;
      }
    }
  }
  .describe {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px 20px;
    p {
      flex: 1;
      color: #666;
      font-size: 28px;
      text-align: center;
    }
  }
  .img-box {
    font-size: 0;
    padding-bottom: 100px;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .collect-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    height: 100px;
    box-sizing: content-box;
    padding: 0 12px;
    p {
      font-size: 18px;
      color: #FE1A34;
      padding-top: 10px;
    }
  }
  .code-box {
    padding: 20px;
    p:nth-child(1) {
      font-size: 40px;
      color: #FE1A34;
      user-select: all;
    }
    p:nth-child(2) {
      font-size: 28px;
      color: #333;
      padding: 20px 0;
      line-height: 38px;
      text-align: center;
    }
    p:nth-child(3) {
      font-size: 26px;
      color: #999;
      text-align: center;
    }
    .url {
      font-size: 36px !important;
      padding: 0 20px;
    }
  }
}
</style>