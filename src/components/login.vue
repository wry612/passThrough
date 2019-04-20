<template>
  <div class="login">
    <div style="text-align:center;">
      <img src="../assets/login.png" alt="" class="ximg-demo">
    </div>
    <div class="login-title">汇利丰节能增效智联平台</div>
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
                that.$cookies.set('account',res.data.account);
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
  .weui-input{
    height: 21px !important;
    line-height: 21px !important;
  }
  .login {
    position: absolute;
    left: 0;
    top:0;
    width: 100%;
    height: 100%;
    background: #1769cd;
  }
  .ximg-demo {
    width: 80%;
    height: auto;
  }
  input::-webkit-input-placeholder {
    color: #ccc;
  }
  .login-title {
    color:#333;
    font-size: 20px;
    text-align: center;
    letter-spacing: 4px;
  }
</style>
