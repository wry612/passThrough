<template>
  <div class="detail">
    <div style="padding: 10px;" v-if="!isEdit">
      <group title="数据点详情">
        <flexbox>
          <flexbox-item :span="5">
            数据点ID：
          </flexbox-item>
          <flexbox-item>
            <div>{{dataInfo.id}}</div>
          </flexbox-item>
        </flexbox>
        <flexbox>
          <flexbox-item :span="5">
            数据点名称：
          </flexbox-item>
          <flexbox-item>
            <div>{{dataInfo.name}}</div>
          </flexbox-item>
        </flexbox>
        <flexbox>
          <flexbox-item :span="5">
            关联模板：
          </flexbox-item>
          <flexbox-item>
            <div>{{dataInfo.iotDatapointTemplateSubList.map(item=>{return item.templateName}).join(',')}}</div>
          </flexbox-item>
        </flexbox>
        <flexbox>
          <flexbox-item :span="5">
            寄存器：
          </flexbox-item>
          <flexbox-item>
            <div>{{dataInfo.iotModbusDataCmd.register}}</div>
          </flexbox-item>
        </flexbox>
        <flexbox>
          <flexbox-item :span="5">
            数据类型：
          </flexbox-item>
          <flexbox-item>
            <div v-if="dataInfo.type==0">数值型</div>
            <div v-if="dataInfo.type==1">开关型</div>
            <div v-if="dataInfo.type==3">定位性</div>
            <div v-if="dataInfo.type==4">字符型</div>
          </flexbox-item>
        </flexbox>
        <flexbox>
          <flexbox-item :span="5">
            数值类型：
          </flexbox-item>
          <flexbox-item>
            <div v-if="dataInfo.iotModbusDataCmd.valueKind==0">两字节无符号整数</div>
            <div v-if="dataInfo.iotModbusDataCmd.valueKind==1">两字节带符号等数</div>
            <div v-if="dataInfo.iotModbusDataCmd.valueKind==2">四字节无符号整数（AB CD）</div>
            <div v-if="dataInfo.iotModbusDataCmd.valueKind==3">四字节带符号整数（AB CD）</div>
            <div v-if="dataInfo.iotModbusDataCmd.valueKind==4">四字节浮点型</div>
            <div v-if="dataInfo.iotModbusDataCmd.valueKind==5">bit</div>
            <div v-if="dataInfo.iotModbusDataCmd.valueKind==6">四字节无符号整数（CD AB）</div>
            <div v-if="dataInfo.iotModbusDataCmd.valueKind==8">四字节有符号整数（CD AB）</div>
            <div v-if="dataInfo.iotModbusDataCmd.valueKind==10">四字节浮点型（CD AB）</div>
          </flexbox-item>
        </flexbox>
        <flexbox>
          <flexbox-item :span="5">
            读写：
          </flexbox-item>
          <flexbox-item>
            <div v-if="dataInfo.iotModbusDataCmd.writeRead==0">只读</div>
            <div v-if="dataInfo.iotModbusDataCmd.writeRead==1">读写</div>
            <div v-if="dataInfo.iotModbusDataCmd.writeRead==2">只写</div>
          </flexbox-item>
        </flexbox>
        <flexbox>
          <flexbox-item :span="5">
            数据存储：
          </flexbox-item>
          <flexbox-item>
            <div v-if="dataInfo.ifSaveHistory==0">不存储</div>
            <div v-if="dataInfo.ifSaveHistory==1">存储</div>
            <div v-if="dataInfo.ifSaveHistory==2">变化时存储</div>
          </flexbox-item>
        </flexbox>
        <flexbox>
          <flexbox-item :span="5">
            单位：
          </flexbox-item>
          <flexbox-item>
            <div>{{dataInfo.unit}}</div>
          </flexbox-item>
        </flexbox>
        <flexbox>
          <flexbox-item :span="5">
            变量描述：
          </flexbox-item>
          <flexbox-item>
            <div>{{dataInfo.description}}</div>
          </flexbox-item>
        </flexbox>
        <flexbox>
          <flexbox-item :span="5">
            公式：
          </flexbox-item>
          <flexbox-item>
            <div>{{dataInfo.formula}}</div>
          </flexbox-item>
        </flexbox>
        <flexbox>
          <flexbox-item :span="5">
            反向运算公式：
          </flexbox-item>
          <flexbox-item>
            <div>{{dataInfo.reverseFormula}}</div>
          </flexbox-item>
        </flexbox>
        <flexbox>
          <flexbox-item :span="5">
            反向运算浮点精度：
          </flexbox-item>
          <flexbox-item>
            <div>{{dataInfo.reverseDecimalAccuracy}}</div>
          </flexbox-item>
        </flexbox>
        <box gap="10px 10px" style="text-align: center">
          <x-button type="primary" mini @click.native="edit">编辑</x-button>
        </box>
      </group>
    </div>
    <div style="padding: 10px;" v-if="isEdit">
      <group title="数据点编辑">
        <flexbox>
          <flexbox-item :span="4">
            <em>*</em>名称：
          </flexbox-item>
          <flexbox-item>
            <input type="text" v-model="dataInfo.name" style="width:100%;">
          </flexbox-item>
        </flexbox>
        <flexbox>
          <flexbox-item :span="4">
            <em>*</em>关联模板：
          </flexbox-item>
          <flexbox-item>
            <select v-model="templateIds" multiple="multiple" style="width:100%;">
              <option :value="item.id" :label="item.templateName" v-for="(item,index) in iotDatapointTemplateList"
                      :key="index"></option>
            </select>
          </flexbox-item>
        </flexbox>
        <flexbox>
          <flexbox-item :span="4">
            数据类型：
          </flexbox-item>
          <flexbox-item>
            <label><input type="radio" v-model="dataInfo.type" value="0"/>数值型</label>
            <label><input type="radio" v-model="dataInfo.type" value="1"/>开关型</label>
          </flexbox-item>
        </flexbox>
        <flexbox>
          <flexbox-item :span="4">
            <em>*</em>寄存器：
          </flexbox-item>
          <flexbox-item>
            <input type="tel" v-model="dataInfo.iotModbusDataCmd.register" style="width:100%;">
          </flexbox-item>
        </flexbox>
        <flexbox v-if="dataInfo.type==0">
          <flexbox-item :span="4">
            数值类型：
          </flexbox-item>
          <flexbox-item>
            <select v-model="dataInfo.iotModbusDataCmd.valueKind" style="width: 100%">
              <option value="0" label="两字节无符号整数"></option>
              <option value="1" label="两字节带符号等数"></option>
              <option value="2" label="四字节无符号整数（AB CD）"></option>
              <option value="3" label="四字节带符号整数（AB CD）"></option>
              <option value="4" label="四字节浮点型"></option>
              <option value="5" label="bit"></option>
              <option value="6" label="四字节无符号整数（CD AB）"></option>
              <option value="8" label="四字节有符号整数（CD AB）"></option>
              <option value="10" label="四字节浮点型（CD AB）"></option>
            </select>
          </flexbox-item>
        </flexbox>
        <flexbox>
          <flexbox-item :span="4">
            读写：
          </flexbox-item>
          <flexbox-item>
            <label><input type="radio" v-model="dataInfo.iotModbusDataCmd.writeRead" value="0"/>只读</label>
            <label><input type="radio" v-model="dataInfo.iotModbusDataCmd.writeRead"
                          :disabled="dataInfo.iotModbusDataCmd.writeRead==0" value="1"/>读写</label>
            <label><input type="radio" v-model="dataInfo.iotModbusDataCmd.writeRead"
                          :disabled="dataInfo.iotModbusDataCmd.writeRead==0" value="2"/>只写</label>
          </flexbox-item>
        </flexbox>
        <flexbox>
          <flexbox-item :span="4">
            数据存储：
          </flexbox-item>
          <flexbox-item>
            <label><input type="radio" v-model="dataInfo.ifSaveHistory" value="0"/>不存储</label>
            <label><input type="radio" v-model="dataInfo.ifSaveHistory" value="1"/>存储</label>
            <label><input type="radio" v-model="dataInfo.ifSaveHistory" value="2"/>变化时存储</label>
          </flexbox-item>
        </flexbox>
        <flexbox v-if="dataInfo.type==0">
          <flexbox-item :span="4">
            单位：
          </flexbox-item>
          <flexbox-item>
            <input type="text" v-model="dataInfo.unit" style="width:100%;">
          </flexbox-item>
        </flexbox>
        <flexbox>
          <flexbox-item :span="4">
            变量描述：
          </flexbox-item>
          <flexbox-item>
            <input type="text" v-model="dataInfo.description" style="width:100%;">
          </flexbox-item>
        </flexbox>
        <flexbox v-if="dataInfo.type==0">
          <flexbox-item :span="4">
            公式：
          </flexbox-item>
          <flexbox-item>
            <input type="text" v-model="dataInfo.formula" style="width:100%;">
          </flexbox-item>
        </flexbox>
        <flexbox v-if="dataInfo.type==0">
          <flexbox-item :span="4">
            反向运算公式：
          </flexbox-item>
          <flexbox-item>
            <input type="text" v-model="dataInfo.reverseFormula" style="width:100%;">
          </flexbox-item>
        </flexbox>
        <box gap="10px 10px" style="text-align: center">
          <x-button type="primary" mini @click.native="save">保存</x-button>
          <x-button type="default" mini @click.native="cancel">取消</x-button>
        </box>
        <alert v-model="show" title="错误信息"> {{ msg }}</alert>
      </group>
    </div>
  </div>
</template>

<script>
  import {
    Grid,
    GridItem,
    CellBox,
    Flexbox,
    FlexboxItem,
    Icon,
    Toast,
    Group,
    Cell,
    Divider,
    XButton,
    Box,
    Alert
  } from 'vux'
  import template from '@/api/template';
  import InfiniteLoading from 'vue-infinite-loading';

  export default {
    name: 'dataDetail',
    components: {
      Grid,
      Box,
      XButton,
      Alert,
      GridItem,
      CellBox,
      Cell,
      Divider,
      Flexbox,
      FlexboxItem,
      Toast,
      Icon,
      Group,
      InfiniteLoading
    },
    data() {
      return {
        dataInfo: {
          id: '',
          name: '',
          iotDatapointTemplateSubList: [],
          iotModbusDataCmd: {}
        },
        dataId: '',
        isEdit: false,
        iotDatapointTemplateList: [],
        templateIds: [],
        show: false,
        msg: ''
      }
    },
    created() {
      this.dataId = this.$route.params.id;

      if (!this.dataId) {
        return;
      }

      this.getData();
    },
    methods: {
      edit() {
        this.isEdit = true;
        this.templateList();
      },
      save() {
        if (!this.dataInfo.name) {
          this.msg = '名称不能为空！';
          this.show = true;
          return;
        }
        if (!this.templateIds.length) {
          this.msg = '关联模板不能为空！';
          this.show = true;
          return;
        }
        if (!this.dataInfo.iotModbusDataCmd.register) {
          this.msg = '寄存器不能为空！';
          this.show = true;
          return;
        }
        this.editDatadic();
      },
      cancel() {
        this.isEdit = false;
        this.getData();
      },
      async getData() {
        const params = {
          token: this.$cookies.get('token'),
          id: this.dataId
        };
        const data = await template.getData(params);
        if (data.status == 200) {
          const res = data.data;
          const that = this;
          if (res.status === 0) {
            this.dataInfo = res.data;
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
      async templateList() {
        const params = {
          token: this.$cookies.get('token')
        };
        const data = await template.templateList(params);
        if (data.status == 200) {
          const res = data.data;
          const that = this;
          if (res.status === 0) {
            this.iotDatapointTemplateList = res.data.iotDatapointTemplateList;
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
      async editDatadic() {
        this.dataInfo['token'] = this.$cookies.get('token');
        this.dataInfo['templateIds'] = this.templateIds;
        this.dataInfo.iotDatapointTemplateSubList = this.templateIds.map(item => {
          let list = this.iotDatapointTemplateList.filter(i => {
            return i.id == item;
          })
          return {
            id: list.id,
            templateName: list.templateName
          };
        })
        const data = await template.editDatadic(this.dataInfo);
        if (data.status == 200) {
          const res = data.data;
          const that = this;
          if (res.status === 0) {
            this.$vux.toast.show({
              text: '修改成功'
            })
            this.isEdit = false;
            this.getData();
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

  .detail .vux-flex-row {
    margin: 10px 0;
    color: #666;
    font-size: 14px;
  }

  .detail .vux-flexbox .vux-flexbox-item:first-child {
    text-align: right;
  }

  em {
    margin-right: 5px;
    color: red;
  }
  .detail input[type="text"],.detail input[type="tel"],.detail select,.detail input[type="number"]{
    border: 1px solid #ccc;
    border-radius:4px;
    padding: 5px;
    box-sizing: border-box;
  }
</style>
