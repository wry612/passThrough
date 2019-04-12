<template>
  <div>
    <card>
      <div slot="content">
        <flexbox>
          <flexbox-item :span="1/4">
            <img src="../assets/nopic.png" alt="" style="width: 100%">
          </flexbox-item>
          <flexbox-item>
            <div>{{deviceDetail.name}}</div>
            <div style="color:#999;font-size: 12px">{{deviceDetail.deviceId}}</div>
          </flexbox-item>
        </flexbox>
        <flexbox style="color:#999;font-size: 14px">
          <flexbox-item :span="1/4">
            通讯协议：
          </flexbox-item>
          <flexbox-item>
            <span v-if="deviceDetail.protocol==0">ModbusRTU</span>
            <span v-if="deviceDetail.protocol==1">ModbusTCP</span>
            <span v-if="deviceDetail.protocol==2">TCP透传</span>
            <span v-if="deviceDetail.protocol==3">DL/T645-97</span>
            <span v-if="deviceDetail.protocol==4">DL/T645-07</span>
            <span v-if="deviceDetail.protocol==5">烟感协议</span>
          </flexbox-item>
        </flexbox>
        <flexbox style="color:#999;font-size: 14px">
          <flexbox-item :span="1/4">
            通讯密码：
          </flexbox-item>
          <flexbox-item>
            {{deviceDetail.pass}}
          </flexbox-item>
        </flexbox>
        <flexbox style="color:#999;font-size: 14px">
          <flexbox-item :span="1/4">
            轮询间隔：
          </flexbox-item>
          <flexbox-item>
            {{minute(deviceDetail.pollingInterval)}}分钟
          </flexbox-item>
        </flexbox>
        <flexbox style="color:#999;font-size: 14px">
          <flexbox-item :span="1/4">
            在线状态：
          </flexbox-item>
          <flexbox-item>
            {{deviceDetail.onlineStatus==0?'离线':'在线'}}
          </flexbox-item>
        </flexbox>
        <flexbox style="color:#666;font-size: 14px">
          <flexbox-item :span="1/4">
            设备地址：
          </flexbox-item>
          <flexbox-item>
            {{deviceDetail.address}}
          </flexbox-item>
        </flexbox>
      </div>
    </card>
    <group v-for="(item,index) in pointInfo.iotDataDescription" :key="index">
      <cell-box>
        <flexbox>
          <flexbox-item :span="1/12">
            <img src="../assets/icon-c.png" alt="" style="width: 100%">
          </flexbox-item>
          <flexbox-item :span="7/12">
            <div>{{item.name}}</div>
            <div style="font-size: 12px">从机序号：{{pointInfo.slaveName}}</div>
            <div style="font-size: 12px">更新时间：{{new Date() | dateFormat('yyyy-MM-dd hh:mm')}}</div>
          </flexbox-item>
          <flexbox-item>
            <span v-if="lastData.length&&item.type==0">{{lastData[index]['value']}}{{item.unit}}</span>
            <span v-if="lastData.length&&item.type==1">{{lastData[index]['value'] == 0?'关':'开'}}</span>
          </flexbox-item>
        </flexbox>
      </cell-box>
    </group>
  </div>

</template>

<script>
  import {Grid, GridItem, CellBox, Flexbox, FlexboxItem, Icon, Toast, Card,Group} from 'vux'
  import device from '@/api/device';
  import InfiniteLoading from 'vue-infinite-loading';

  export default {
    name: 'deviceDetail',
    components: {
      Grid,
      GridItem,
      CellBox,
      Group,
      Flexbox,
      FlexboxItem,
      Toast,
      Icon,
      Card,
      InfiniteLoading
    },
    data() {
      return {
        deviceDetail: {},
        pointInfo: {},
        deviceSlaves: {},
        lastData: []
      }
    },
    created() {
      this.deviceId = this.$route.params.id;

      if (!this.deviceId) {
        return;
      }

      this.getDevice();
    },
    methods: {
      minute(second) {
        return Math.ceil(second/60);
      },
      async getDevice() {
        const params = {
          token: this.$cookies.get('token'),
          deviceId: this.deviceId
        };
        const data = await device.deviceDetail(params);
        if(data.status == 200) {
          const res = data.data;
          const that = this;
          if (res.status === 0) {
            this.deviceDetail = res.data.device;
            this.deviceSlaves = res.data.deviceSlaves[0];
            this.getDataPointInfoByDevice();
          } else {
            if (res.status > 4010 && res.status < 4022) {
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
      async getDataPointInfoByDevice() {
        const params = {
          token: this.$cookies.get('token'),
          deviceIds: [this.deviceId]
        };
        const data = await device.getDataPointInfoByDevice(params);
        if(data.status == 200) {
          const res = data.data;
          const that = this;
          if (res.status === 0) {
            this.pointInfo = res.data[0].slaves[0];
            this.getLastData();
          } else {
            if (res.status > 4010 && res.status < 4022) {
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
      async getLastData() {
        let list = this.pointInfo.iotDataDescription.map(item => {
          return {
            devId: this.deviceSlaves.deviceId,
            slaveIndex: this.deviceSlaves.slaveIndex,
            dataId: item.id
          }
        });
        const params = {
          token: this.$cookies.get('token'),
          devDataIds: list
        };
        const data = await device.getLastData(params);
        if(data.status == 200) {
          const res = data.data;
          const that = this;
          if (res.status === 0) {
            this.lastData = res.data;
          } else {
            if (res.status > 4010 && res.status < 4022) {
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
