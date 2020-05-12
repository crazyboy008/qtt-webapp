<template>
  <div class="page">
  </div>
</template>

<script type="text/ecmascript-6">
  import Http from '@/assets/js/http'
  import Common from '@/assets/js/common'

  export default {
    components: {},
    props: {},
    data () {
      return {
      }
    },
    created () {
      if (!this.$route.query.code) {
        this.redirect()
        // const redirect_uri = encodeURIComponent(window.location.href.split('#')[0])
        // const oauth = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${Common.config.appid}&redirect_uri=${redirect_uri}&response_type=code&scope=snsapi_userinfo#wechat_redirect`
        // window.location.href = oauth
     }
     if (this.$route.query.code) {
       this.wechatOauth()
     }
    },
    mounted() {
    },
    methods: {
      async redirect() {
        const res = await Http.get('/wechat/redirect', this.$route.query)
        console.log(res);
        window.location.href = res
      },
      wechatOauth () {
        let params = {
          url: window.location.href.split('#')[0]
        }
        Http.get('/wechat/oauth', params).then(res => {
          const userInfo = JSON.stringify(res)
          this.$cookie.set('wx_user_info', userInfo)
          if (this.$route.query.state) {
            this.$router.replace(decodeURIComponent(this.$route.query.state))
          } else {
            this.$router.replace('/home')
          }
        }).catch(err => {
          console.log(err);
          // alert(err.message)
        })
      }
    },
    activated () {
    },
    watch: {}
  }
</script>

<style scoped lang="less">
  .page {
    width: 100%;
    height: 100%;
  }
</style>
