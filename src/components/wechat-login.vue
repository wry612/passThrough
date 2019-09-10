<template>
  <div>
    <loading :show="show" text="登录中"></loading>
  </div>
</template>

<script>
  import { Loading } from 'vux'
  import wechat from '@/api/wechat';

  export default {
    name: "wechat-login",
    components: {
      Loading
    },
    mounted () {
      console.log('login------')
      this.wechatLoginL2();
    },
    data () {
      return {
        show: false
      }
    },
    methods: {
      async wechatLoginL2 () {
        let APP_ID = 'wx93f296f3c6078a2c';
        const AUTHORIZE_URL = '2f0x179685.imwork.net:53492/register';
        let authorizeUrl = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + APP_ID + '&redirect_uri=http%3a%2f%2f' + AUTHORIZE_URL + '%2f&response_type=code&scope=snsapi_userinfo&state=STATE&connect_redirect=1#wechat_redirect';

        // 获取缓存的uid
        const uid = localStorage.getItem('wechatuid')
        console.log('用户uid' + uid)
        // 如果有uid
        if (uid && uid !== 'undefined') {
          // 初始化例子插件
          this.show = true
          let data = await wechat.wechatLoginL2(uid);
          if(data.status == 200) {
            const res = data.data;
            if (res.status === 0) {
              this.$router.push({path: '/bindUser'})
            } else {
              this.show = false
              window.location.href = authorizeUrl
            }
          }
          // 没有uid，就去授权登录
        } else {
          window.location.href = authorizeUrl
        }
      }
    }
  }
</script>

<style scoped>

</style>
