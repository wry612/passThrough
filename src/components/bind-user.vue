<template>
  <div class="login">
    <div style="text-align:left;">
      <img src="../assets/login.png" alt="" class="ximg-demo">
    </div>
    <div class="login-title"><span>汇励丰</span>微信绑定用户</div>
    <div style="padding: 35px 20px 0;text-align: center">
      <input type="text" class="input-box" placeholder="请输入账号" title="用户账号" v-model="account">
      <input type="password" class="input-box" placeholder="请输入密码" title="用户密码" v-model="password">
      <div style="padding: 15px 0;">
        <button @click="bindUser" class="btn-login">确定</button>
      </div>
    </div>
  </div>
</template>
<script>
  import { Card, XInput,Toast,XButton,Divider } from 'vux'
  import wechat from '@/api/wechat'
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
        password: '',
        flag: false
      }
    },
    mounted: function () {

    },
    methods: {
      async bindUser(){
        // 获取缓存的uid
        const wechatuid = localStorage.getItem('wechatuid')
        const params = {
          account: this.account,
          password: md5(this.password),
          wechatuid: wechatuid
        };
        const data = await wechat.bindL2(params);
        if(data.status == 200) {
          const res = data.data;
          const that = this;
          if (res.status === 0) {
            this.$vux.toast.show({
              text: '绑定成功',
              time: 3000,
              onShow() {
              },
              onHide() {
              }
            })
          } else {
            this.$vux.toast.show({
              type: 'warn',
              text: '绑定失败'
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
    min-height: 100%;
    padding-bottom:20px;
    background: #062f50;
  }
  .input-box{
    width: 240px;
    height: 40px;
    padding: 15px 10px;
    margin-bottom: 23px;
    text-align: center;
    background: #fff;
    border-radius: 20px;
    outline: none;
    border: none;
  }
  .btn-login {
    width: 240px;
    height: 40px;
    color: #fff;
    text-align: center;
    background: #2779ff;
    border-radius: 20px;
    letter-spacing: 10px;
    outline: none;
    border: none;
  }
  .ximg-demo {
    width: 82.5%;
    height: auto;
  }
  .login-title {
    margin-top: 20px;
    color: #fff;
    font-size: 20px;
    text-align: center;
    letter-spacing: 4px;
  }
  .login-title span{
    color:#2779ff;
  }
</style>
