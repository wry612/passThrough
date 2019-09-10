<template>
  <div>
    <loading :show="show" text="登录中"></loading>
    <toast v-model="show1" type="text">登录失败</toast>
    <alert v-model="showError" title="微信授权错误">请联系管理员后重试！</alert>
  </div>
</template>

<script>
  import { Loading, Toast, Alert } from 'vux'
  import wechat from '@/api/wechat';

  export default {
    components: {
      Loading, Toast, Alert
    },
    name: "wechat-register",
    mounted () {
      this.wechatRegisterL2()
    },
    data () {
      return {
        show: false,
        show1: false,
        showError: false
      }
    },
    methods: {
      async wechatRegisterL2() {
        var code = this.$route.query.code
        console.log('register-----')
        console.log(this.$route.query.code)
        if (code && code !== 'undefined') {
          this.show = true
          let showError = true
          let data = await wechat.wechatRegisterL2(code);
         console.log(data)
          if(data.status == 200) {
            const res = data.data;
            const that = this;
            if (res.status === 0) {
              let uid = res.data;
              localStorage.setItem('wechatuid', uid);
              console.log('setItem----');
              this.show = false;
              this.$router.push({path: '/bindUser'});
            } else {
              this.show = false
              this.show1 = true
            }
          }
        }
      }
    }
  }
</script>

<style scoped>

</style>
