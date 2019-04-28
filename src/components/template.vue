<template>
  <div style="margin-bottom: 100px">
    <cell-box is-link :link="'/data/'+item.id" v-for="(item,index) in templateList" :key="item.index">
      <flexbox align="center">
        <flexbox-item>
          <div>{{item.templateName}}</div>
          <div class="small-id">关联数据点数：{{item.dataPointTotal}}</div>
        </flexbox-item>
      </flexbox>
      </flexbox>
    </cell-box>
    <infinite-loading :on-infinite="onInfinite" ref="infiniteLoading">
    <span slot="no-more">
    已加载全部
  </span></infinite-loading>
    <div class="tab-bottom">
      <grid>
        <grid-item label="设备列表" link="/device">
          <img slot="icon" src="../assets/icon-device.png">
        </grid-item>
        <grid-item label="模板列表" link="/template" class="active">
          <img slot="icon" src="../assets/icon-data-active.png">
        </grid-item>
      </grid>
    </div>
  </div>

</template>

<script>
  import {Grid, GridItem, CellBox, Flexbox, FlexboxItem, Icon, Toast} from 'vux'
  import template from '@/api/template';
  import InfiniteLoading from 'vue-infinite-loading';

  export default {
    name: 'template',
    components: {
      Grid,
      GridItem,
      CellBox,
      Flexbox,
      FlexboxItem,
      Toast,
      Icon,
      InfiniteLoading
    },
    data() {
      return {
        templateList: [],
        pageSize: 10,
        pageIndex: -1
      }
    },
    methods: {
      async onInfinite() {
        const params = {
          token: this.$cookies.get('token'),
          page_param: {
            offset: (++this.pageIndex)*this.pageSize,
            limit: this.pageSize
          }
        };
        const data = await template.templateList(params);
        if(data.status == 200) {
          const res = data.data;
          const that = this;
          if (res.status === 0) {
            if (res.data.iotDatapointTemplateList.length) {
              this.templateList = this.templateList.concat(res.data.iotDatapointTemplateList);
              this.$refs.infiniteLoading.$emit('$InfiniteLoading:loaded');
              if (this.templateList.length % this.pageSize > 0) {
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
</style>
