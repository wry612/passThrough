import { get, post } from '@/utils/request';
let base = '/apis';
export default {

  /**
   * 模板列表
   */
  templateList(params) {
    return post(base+'/template/getDataPointTemplateList', params);
  },

  /**
   * 数据点列表
   */
  dataList(params) {
    return post(base+'/datadic/getDatas', params);
  },

  /**
   * 获取数据点信息
   */
  getData(params) {
    return post(base+'/datadic/getData', params);
  },

  /**
   * 修改数据点
   */
  editDatadic(params) {
    return post(base+'/datadic/editDatadic', params);
  }
};
