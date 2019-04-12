import { get, post } from '@/utils/request';

export default {

  /**
   * 模板列表
   */
  templateList(params) {
    return post('/usrCloud/template/getDataPointTemplateList', params);
  },

  /**
   * 数据点列表
   */
  dataList(params) {
    return post('/usrCloud/datadic/getDatas', params);
  },

  /**
   * 获取数据点信息
   */
  getData(params) {
    return post('/usrCloud/datadic/getData', params);
  },

  /**
   * 修改数据点
   */
  editDatadic(params) {
    return post('/usrCloud/datadic/editDatadic', params);
  }
};
