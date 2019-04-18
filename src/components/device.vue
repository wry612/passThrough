<template>
  <div style="margin-bottom: 100px">
    <card style="margin-bottom: 10px;">
      <div slot="content">
        <flexbox>
          <flexbox-item :span="1/4">
            <img src="../assets/nopic.jpg" alt="" style="width: 80%">
          </flexbox-item>
          <flexbox-item>
            用户账号信息
          </flexbox-item>
        </flexbox>
    <flexbox style="color:#999;font-size: 14px">
      <flexbox-item :span="1/4">
        用户账号：
      </flexbox-item>
      <flexbox-item>
        {{userInfo.account}}
      </flexbox-item>
    </flexbox>
        <flexbox style="color:#999;font-size: 14px">
          <flexbox-item :span="1/4">
            用户类型：
          </flexbox-item>
          <flexbox-item>
            {{userInfo.typeid=='1'?'一级用户':'二级用户'}}
          </flexbox-item>
        </flexbox>
        <flexbox style="color:#999;font-size: 14px">
          <flexbox-item :span="1/4">
            公司：
          </flexbox-item>
          <flexbox-item>
            {{userInfo.company}}
          </flexbox-item>
        </flexbox>
        <flexbox style="color:#999;font-size: 14px">
          <flexbox-item :span="1/4">
            邮箱：
          </flexbox-item>
          <flexbox-item>
            {{userInfo.email}}
          </flexbox-item>
        </flexbox>
        <flexbox style="color:#999;font-size: 14px">
          <flexbox-item :span="1/4">
            地址：
          </flexbox-item>
          <flexbox-item>
            {{userInfo.address}}
          </flexbox-item>
        </flexbox>
        <flexbox style="color:#999;font-size: 14px">
          <flexbox-item :span="1/4">
            电话号码：
          </flexbox-item>
          <flexbox-item>
            {{userInfo.tel}}
          </flexbox-item>
        </flexbox>
      </div>
    </card>
    <cell-box is-link :link="'/deviceDetail/'+item.devid" v-for="(item,index) in deviceList" :key="item.index">
      <flexbox align="center">
        <flexbox-item :span="1/8">
          <icon type="success" v-if="item.onlineStatus == 1"></icon>
          <icon type="waiting-circle" v-if="item.onlineStatus == 0"></icon>
          <!--<icon type="cancel"></icon>-->
        </flexbox-item>
        <flexbox-item :span="5/8">
          <div>{{item.name}}</div>
          <div class="small-id">{{item.devid}}</div>
        </flexbox-item>
      </flexbox>
    </cell-box>
    <infinite-loading :on-infinite="onInfinite" ref="infiniteLoading">
    <span slot="no-more">
    已加载全部
  </span></infinite-loading>
    <div class="tab-bottom">
      <grid>
        <grid-item label="设备列表" link="/device" class="active">
          <img slot="icon" src="../assets/icon-device-active.png">
        </grid-item>
        <grid-item label="模板列表" link="/template">
          <img slot="icon" src="../assets/icon-data.png">
        </grid-item>
      </grid>
    </div>
  </div>

</template>

<script>
  import {Grid, GridItem, CellBox, Flexbox, FlexboxItem, Icon, Toast,Card} from 'vux'
  import device from '@/api/device';
  import login from '@/api/login';
  import InfiniteLoading from 'vue-infinite-loading';

  export default {
    name: 'device',
    components: {
      Grid,
      GridItem,
      CellBox,
      Flexbox,
      Card,
      FlexboxItem,
      Toast,
      Icon,
      InfiniteLoading
    },
    data() {
      return {
        deviceList: [],
        pageSize: 10,
        pageIndex: -1,
        userInfo: {}
      }
    },
    created() {
      this.getUser();
    },
    methods: {
      async getUser() {
        const params = {
          token: this.$cookies.get('token'),
          account: this.$cookies.get('account')
        };
        const data = await login.getUser(params);
        if(data.status == 200) {
          const res = data.data;
          const that = this;
          if (res.status === 0) {
            this.userInfo = res.data;
            this.userInfo.account = this.$cookies.get('account');
          } else {
            if (res.status >= 4010 && res.status <= 4022) {
              this.$vux.toast.show({
                text: res.info + ',需要重新登录',
                onHide() {
                  that.$router.push('/');
                }
              })
            } else {
              this.$vux.toast.show({
                type: 'warn',
                text: res.info
              })
            }
          }
        }
      },
      async onInfinite() {
        const params = {
          token: this.$cookies.get('token'),
          page_param: {
            offset: ++this.pageIndex,
            limit: this.pageSize
          }
        };
        const data = await device.deviceList(params);
        if(data.status == 200) {
          const res = data.data;
          const that = this;
          if (res.status === 0) {
            if (res.data.dev.length) {
              this.deviceList = this.deviceList.concat(res.data.dev);
              this.$refs.infiniteLoading.$emit('$InfiniteLoading:loaded');
              if (this.deviceList.length % this.pageSize > 0) {
                this.$refs.infiniteLoading.$emit('$InfiniteLoading:complete');
              }
            } else {
              this.$refs.infiniteLoading.$emit('$InfiniteLoading:complete');
            }
          } else {
            if (res.status >= 4010 && res.status <= 4022) {
              this.$vux.toast.show({
                text: res.info + ',需要重新登录',
                onHide() {
                  that.$router.push('/');
                }
              })
            } else {
              this.$vux.toast.show({
                type: 'warn',
                text: res.info
              })
            }
          }
        }
      }
    }
  }
</script>

<style lang="scss" type="text/css">
  @import "../assets/common.scss";
  .weui-panel {
    padding: 15px;
    border: 1px solid #eee;
    border-radius: 4px;
    box-shadow: 0 0 10px #ccc;
  }
</style>
