<template>
  <div class="login">
    <div>
      <img src="../assets/login.png" alt="" class="ximg-demo">
    </div>
    <div class="login-title">有人透传云</div>
    <div style="padding: 10px 20px">
      <div class="border-top:1px solid #ccc;border-bottom:1px solid #ccc;">
        <x-input style="color:#fff;" type="text"placeholder="请输入账号" title="用户账号" v-model="account"></x-input>
        <x-input style="color:#fff;" type="password" placeholder="请输入密码" title="用户密码" v-model="password"></x-input>
      </div>
      <div style="padding: 15px 0;">
        <x-button @click.native="login" type="primary">登录</x-button>
      </div>
    </div>
  </div>
</template>
<script>
  import { Card, XInput,Toast,XButton,Divider } from 'vux'
  import login from '@/api/login'
  import md5 from 'js-md5';
  export default {
    components: {
      Card,
      XInput,
      Toast,
      XButton,
      Divider
    },
    name: 'login',
    data() {
      return {
        account: '',
        password: ''
      }
    },
    created() {
    },
    mounted: function () {

    },
    methods: {
      async login(){
        const params = {
          account: this.account,
          password: md5(this.password),
        };
        const data = await login.login(params);
        if(data.status == 200) {
          const res = data.data;
          const that = this;
          if (res.status === 0) {
            this.$vux.toast.show({
              text: '登陆成功',
              onShow() {
                that.$cookies.set('token',res.data.token);
              },
              onHide() {
                that.$router.push('/device');
              }
            })
          } else {
            this.$vux.toast.show({
              type: 'warn',
              text: '登陆失败'
            })
          }
        }
      }
    }
  }
</script>

<style lang="scss">
  .login {
    position: absolute;
    left: 0;
    top:0;
    width: 100%;
    height: 100%;
    background: url(../assets/login-bg.png) center no-repeat;
  }
  .ximg-demo {
    width: 100%;
    height: auto;
  }
  input::-webkit-input-placeholder {
    color: #ccc;
  }
  .login-title {
    color:#fff;
    font-size: 24px;
    text-align: center;
    letter-spacing: 4px;
  }
</style>
