<template>
  <div>
    <card class="search-box">
      <div slot="content">
      <h3 class="padding10">请选择时间范围:</h3>
      <div class="padding10">
        起始时间：<a-date-picker style="width: 120px;" v-model="startDate" placeholder="请选择日期" :defaultValue="moment(moment(), 'YYYY-MM-DD')" />
        <a-time-picker style="width: 120px;" placeholder="请选择时间" v-model="startTime" :defaultValue="moment(moment().add(-2,'hours'), 'HH:mm:ss')" />
      </div>
      <div class="padding10">
        终止时间：<a-date-picker style="width: 120px;" v-model="endDate" placeholder="请选择日期" :defaultValue="moment(moment(), 'YYYY-MM-DD')" />
        <a-time-picker style="width: 120px;" placeholder="请选择时间" v-model="endTime" :defaultValue="moment(moment(), 'HH:mm:ss')" />
      </div>
      <div class="padding10" style="text-align: center">
        <x-button type="primary" mini @click.native="getDataHisByTimePeriod">查询</x-button>
      </div>
      </div>
    </card>
    <div id="myChart" :style="{width: '100%', height: '300px'}"></div>
  </div>

</template>

<script>
  import {XButton,Card} from 'vux';
  import moment from 'moment';
  import device from '@/api/device';
  import { DatePicker } from 'ant-design-vue'
  export default {
    name: 'historyData',
    components: {
      DatePicker,
      Card,
      XButton
    },
    data() {
      return {
        devId: '',
        slaveIndex: 0,
        dataId: '',
        startTime: moment(moment().add(-2,'hours'), 'HH:mm:ss'),
        endDate: moment(moment(), 'YYYY-MM-DD'),
        startDate: moment(moment(), 'YYYY-MM-DD'),
        endTime: moment(moment(), 'HH:mm:ss')
      }
    },
    mounted() {
      this.devId = this.$route.query.devId;
      this.slaveIndex = this.$route.query.slaveIndex;
      this.dataId = this.$route.query.dataId;
      this.getDataHisByTimePeriod();
    },
    methods: {
      moment,
      seconds(date){
        let now = new Date(date);
        let ss = now.getTime() / 1000;
        ss = Math.floor(ss);
        return ss;
      },
      async getDataHisByTimePeriod() {
        let start = this.startDate.format('YYYY-MM-DD')+' '+this.startTime.format('HH:mm:ss')
        let end = this.endDate.format('YYYY-MM-DD')+' '+this.endTime.format('HH:mm:ss')
        const params = {
          token: this.$cookies.get('token'),
          devDataPointArray:
            [
              {
                devId: this.devId,
                slaveIndex: this.slaveIndex,
                dataId: this.dataId
              }
            ],
          startTime: this.seconds(start),
          stopTime:this.seconds(end),
        };
        const data = await device.getDataHisByTimePeriod(params);
        if(data.status == 200) {
          const res = data.data;
          const that = this;
          if (res.status === 0) {
            this.drawLine(res.data[0]);
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
      drawLine(list){
        let date = [];
        let data = [];
        let name = list[0].slaveName;
        for (let i = 0; i < list.length; i++) {
          date.push(this.moment(list[i].generateTime*1000).format('mm:ss MM-DD'));
          data.push(list[i].value);
        }
        // 基于准备好的dom，初始化echarts实例
        let myChart = this.$echarts.init(document.getElementById('myChart'))
        // 绘制图表
        myChart.setOption({
          tooltip: {
            trigger: 'axis',
            position: function (pt) {
              return [pt[0], '10%'];
            }
          },
          title: {
            left: 'center',
            text: '历史数据',
          },
          toolbox: {
            feature: {
              // dataZoom: {
              //   yAxisIndex: 'none'
              // },
              dataView:{},
              restore: {},
              saveAsImage: {}
            }
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: date,
            axisLabel: {
              formatter:function(value){
                return value.split(' ')[0]+'\n'+value.split(' ')[1]
              },

            }
          },
          yAxis: {
            type: 'value',
            boundaryGap: [0, '100%']
          },
          dataZoom: [{
            type: 'inside',
            start: 0,
            end: 10
          }, {
            start: 0,
            end: 10,
            handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
            handleSize: '80%',
            handleStyle: {
              color: '#fff',
              shadowBlur: 3,
              shadowColor: 'rgba(0, 0, 0, 0.6)',
              shadowOffsetX: 2,
              shadowOffsetY: 2
            }
          }],
          series: [
            {
              name:name,
              type:'line',
              smooth:true,
              symbol: 'none',
              sampling: 'average',
              itemStyle: {
                color: 'rgb(255, 70, 131)'
              },
              data: data
            }
          ]
        });
      }
    }
  }
</script>

<style lang="scss" type="text/css">
  @import "../assets/common.scss";
  .search-box.weui-panel:first-child {
    margin: 10px;
    padding: 10px 0;
    border: 1px solid #eee;
    border-radius: 4px;
    box-shadow: 0 0 10px #ccc;
  }

  .padding10{
     padding:5px 10px;
   }
</style>
