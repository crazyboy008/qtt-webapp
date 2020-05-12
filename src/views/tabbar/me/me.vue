<template>
  <div class="me-page">
    <div class="blur">
      <div class="blur-content">
        <div class="center">
          <img v-show="userInfo.headimgurl" :src="userInfo.headimgurl" style="border: 3px solid #eeeeee;">
          <img @click="$router.push('/login')" v-show="!userInfo.headimgurl" src="@/assets/images/userhead.png" alt="">
        </div>
        <div class="text">
          <div class="name-box">
            <span class="name" @click="$router.push('/login')">{{userInfo.nickname}}</span>
            <span class="level" v-if="userInfo.level==='1'">VIP会员</span>
          </div>
          <div class="number" v-show="userInfo.id">ID:{{userInfo.id}}</div>
        </div>
      </div>
    </div>
    <div class="celll-box">
      <van-cell title="优惠券" icon="coupon-o" is-link to="/goods/coupon" />
      <van-cell title="收藏" icon="like-o" is-link to="/goods/list/collect" />
      <van-cell title="浏览历史" icon="browsing-history-o" is-link to="/goods/list/history" />
    </div>
  </div>
</template>

<script>
  import { Cell } from 'vant'
  import {getUserInfo} from '@/assets/js/api'

  export default {
    name: "me",
    components: {
      [Cell.name]: Cell
    },
    data() {
      return {
        userInfo: {
          nickname: '点击登录'
        }
      }
    },
    mounted() {
      let userInfo = this.$cookie.get('wx_user_info')
      if (userInfo) {
        this.userInfo = JSON.parse(userInfo)
        this.getHotSearchData()
      }
    },
    methods: {
      async getHotSearchData() {
        let res = await getUserInfo({id: this.userInfo.id})
        console.log(res)
        // this.userInfo = res.data
      },
    }
  }
</script>

<style scoped lang="less">
.me-page {
  height: 100vh;
  background: #eee;
  .blur {
    position: relative;
    width: 100%;
    height: 250px;
    background: url('../../../assets/images/user-bg.png') no-repeat;
    background-size: 100% 250px;
    .blur-content {
      height: 250px;
      display: flex;
      align-items: center;
      justify-content: center;
      .center {
        flex: 0 0 115px;
        padding-left: 30px;
        img {
          width: 110px;
          height: 110px;
          border-radius: 50%;
          border: 6px solid #eee;
        }
      }
      .text {
        flex: 1;
        color: #fff;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        letter-spacing: 2px;
        padding-left: 30px;
        line-height: 45px;
        .name-box {
          .name {
            font-size: 36px;
            font-weight: 700;
            vertical-align: middle;
          }
          .level {
            width: 70px;
            height: 24px;
            color: #ff9f59;
            background: #231610;
            border-radius: 18px;
            font-size: 16px;
            padding: 4px 12px;
            vertical-align: middle;
          }
        }
        .number {
          font-size: 28px;
          /*padding-top: 5px;*/
        }
      }
    }
  }
  .celll-box {
    margin: 20px 0;
  }
}
</style>