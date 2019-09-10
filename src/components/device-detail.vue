<template>
  <div class="detail">
    <card>
      <div slot="content">
        <flexbox>
          <flexbox-item :span="1/4">
            <img src="../assets/nopic.jpg" alt="" style="width: 80%">
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
        <flexbox style="color:#999;font-size: 14px" v-if="isShowPassword">
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
    <div class="btn-refresh">
        <x-button mini type="primary" @click.native="getLastData">刷新数据</x-button>
    </div>
      <group v-for="(item,index) in pointInfo">
        <cell-box class="datas">
          <flexbox justify="space-between">
            <flexbox-item :span="1/12">
              <img src="../assets/icon-c.png" alt="" style="width:100%">
            </flexbox-item>
            <flexbox-item :span="6/12">
              <div>{{item.name}}</div>
              <div style="font-size: 12px">从机名称:{{item.slaveName}}</div>
              <div style="font-size: 10px">更新时间:{{new Date() | dateFormat('yyyy-MM-dd hh:mm')}}</div>
            </flexbox-item>
            <flexbox-item style="font-size: 12px">
              <span v-if="item.type==0">
              {{lastData[index]?lastData[index]['value']:'--'}}{{item.unit}}
                <img v-if="item['iotModbusDataCmd']['writeRead']!=0" @click="blurPromot(lastData[index],item)" src="../assets/edit.png" style="width: 20px;height:20px;margin-left: 4px;" alt="">
              </span>
              <span v-if="item.type==1&&item['iotModbusDataCmd']['writeRead']==0">{{lastData[index]['value'] == 0?'关':'开'}}</span>
              <span v-if="item.type==1&&lastData[index]&&item['iotModbusDataCmd']['writeRead']!=0"><inline-x-switch
                v-model="lastData[index]['value']" :value-map="[0,1]"
                @on-change="changeSwitch(lastData[index],item)"></inline-x-switch></span>
            </flexbox-item>
            <flexbox-item v-if="lastData.length" :span="1/12">
              <router-link :to="{ path: '/historyData', query: { devId: item.deviceId,slaveIndex: item.slaveIndex,dataId: item.id }}">
                <img src="../assets/echart.png" alt="" style="width: 100%">
              </router-link>
            </flexbox-item>
          </flexbox>
        </cell-box>
      </group>

      <confirm v-model="inputShow"
               show-input
               title="编辑数值"
               :input-attrs="{type: 'number'}"
               @on-confirm="onConfirm">
      </confirm>
    <confirm v-model="show"
             title="编辑开关"
             @on-cancel="onCancel"
             @on-confirm="onConfirmSwitch">
      <p style="text-align:center;">确认修改当前开关的设置？</p>
    </confirm>
  </div>

</template>

<script>
  import {Grid, GridItem, CellBox, Flexbox, FlexboxItem, Icon, Toast, Card, Group, InlineXSwitch,XButton,Confirm,TransferDomDirective as TransferDom} from 'vux'
  import device from '@/api/device';
  import InfiniteLoading from 'vue-infinite-loading';

  export default {
    name: 'deviceDetail',
    directives: {
      TransferDom
    },
    components: {
      Grid,
      GridItem,
      CellBox,
      XButton,
      Group,
      Flexbox,
      FlexboxItem,
      Toast,
      Icon,
      InlineXSwitch,
      Card,
      InfiniteLoading,
      Confirm
    },
    data() {
      return {
        deviceDetail: {},
        pointInfo: [],
        lastData: [],
        inputShow: false,
        currItem: {},
        isShowPassword: false,
        show: false,
        flag: true
      }
    },
    created() {
      this.deviceId = this.$route.params.id;

      if (!this.deviceId) {
        return;
      }
      this.isShowPassword = this.$cookies.get('account') == 'hlfchina' ? true : false;
      this.getDevice();
    },
    methods: {
      minute(second) {
        return Math.ceil(second / 60);
      },
      onCancel () {
        this.flag = false;
        this.currItem.value = this.currItem.value == 0 ? 1 : 0;
      },
      onHide () {
        console.log('on hide')
      },
      onShow () {
        console.log('on show')
      },
      blurPromot(item,itemBk) {
        this.currItem = item ? item : itemBk;
        this.inputShow = true;
      },
      changeSwitch(item,itemBk) {
        this.currItem = item ? item : itemBk;
        if(this.flag) {
          this.show = true;
        } else {
          this.flag = true;
        }
      },
      onConfirm (msg) {
        if (msg) {
          this.currItem['value'] = msg;
          this.editDataPoints(this.currItem);
        } else {
          this.$vux.toast.show({
            type: 'warn',
            text: '设置值不能为空'
          })
        }
      },
      onConfirmSwitch() {
        this.editDataPoints(this.currItem);
      },
      async editDataPoints(item) {
        const params = {
          token: this.$cookies.get('token'),
          devId: item.deviceId,
          pointId: item.dataPointId ? item.dataPointId : item.id,
          slaveIndex: item.slaveIndex,
          value: item.value
        };
        const data = await device.setDataPoint(params,{
          headers:{
            loginuser:this.$cookies.get('account'),
            token: this.$cookies.get('token')
          }
        });
        if (data.status == 200) {
          const res = data.data;
          const that = this;
          if (res.status === 0) {
            this.$vux.toast.show({
              text: '数据点修改成功',
            })
            this.getDataPointInfoByDevice();
          } else {
            if (res.status >= 4010 && res.status <= 4022) {
              this.$vux.toast.show({
                type: 'warn',
                text: res.info + ',需要重新登录',
                onHide() {
                  that.$router.push('/');
                }
              })
            } else if(res.status == 5126) {
              console.log('请求太频繁');
            } else {
              this.$vux.toast.show({
                type: 'warn',
                text: res.info
              })
            }
          }
        }
      },
      async getDevice() {
        const params = {
          token: this.$cookies.get('token'),
          deviceId: this.deviceId
        };
        const data = await device.deviceDetail(params);
        if (data.status == 200) {
          const res = data.data;
          const that = this;
          if (res.status === 0) {
            this.deviceDetail = res.data.device;
            this.getDataPointInfoByDevice();
          } else {
            if (res.status >= 4010 && res.status <= 4022) {
              this.$vux.toast.show({
                text: res.info + ',需要重新登录',
                onHide() {
                  that.$router.push('/');
                }
              })
            } else if(res.status == 5126) {
              console.log('请求太频繁');
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
        if (data.status == 200) {
          const res = data.data;
          const that = this;
          if (res.status === 0) {
            let list = [];
            for(let i = 0; i < res.data[0].slaves.length; i++) {
              for(let j = 0; j < res.data[0].slaves[i].iotDataDescription.length; j++) {
                res.data[0].slaves[i].iotDataDescription[j].deviceId = res.data[0].slaves[i].deviceId;
                res.data[0].slaves[i].iotDataDescription[j].slaveIndex = res.data[0].slaves[i].slaveIndex;
                res.data[0].slaves[i].iotDataDescription[j].slaveName = res.data[0].slaves[i].slaveName;
                list.push(res.data[0].slaves[i].iotDataDescription[j]);
              }
            }
            this.pointInfo = list;
            this.getLastData();
          } else {
            if (res.status >= 4010 && res.status <= 4022) {
              this.$vux.toast.show({
                text: res.info + ',需要重新登录',
                onHide() {
                  that.$router.push('/');
                }
              })
            } else if(res.status == 5126) {
              console.log('请求太频繁');
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
        let list = [];
        for(let i = 0; i < this.pointInfo.length; i++) {
          list.push({
            devId: this.pointInfo[i].deviceId,
            slaveIndex: this.pointInfo[i].slaveIndex,
            dataId: this.pointInfo[i].id
          })
        }
        const params = {
          token: this.$cookies.get('token'),
          devDataIds: list
        };
        const data = await device.getLastData(params);
        if (data.status == 200) {
          const res = data.data;
          const that = this;
          if (res.status === 0) {
            this.lastData = res.data;
          } else {
            if (res.status >= 4010 && res.status <= 4022) {
              this.$vux.toast.show({
                text: res.info + ',需要重新登录',
                onHide() {
                  that.$router.push('/');
                }
              })
            } else if(res.status == 5126) {
              console.log('请求太频繁');
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
  .datas.weui-cell{
    padding: 10px;
  }
  .weui-panel {
    padding: 15px;
    border: 1px solid #eee;
    border-radius: 4px;
    box-shadow: 0 0 10px #ccc;
  }
  .detail input[type="number"]{
    border: 1px solid #ccc;
    border-radius:4px;
    padding: 5px;
    line-height: 24px;
    box-sizing: border-box;
  }
  .btn-refresh {
    text-align: right;
    margin: 15px 0 0;
    padding: 0 10px;
  }
</style>
