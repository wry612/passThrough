import { get, post } from '@/utils/request';
export default {

  /**
   * 设备列表
   * @param {*} data
   */
  deviceList(params) {
    return post('/usrCloud/dev/getDevs', params);
  },

  /**
   * 设备详情
   *
   */
  deviceDetail(params) {
    return post('/usrCloud/dev/getDevice', params);
  },

  /**
   * 根据设备获取数据点列表
   *
   */
  getDataPointInfoByDevice(params) {
    return post('/usrCloud/datadic/getDataPointInfoByDevice', params);
  },

  /**
   * 获取最后一条数据
   *
   */
  getLastData(params) {
    return post('/usrCloud/datadic/getLastData', params);
  },

  /**
   * 根据时间段获取数据点历史记录
   *
   */
  getDataHisByTimePeriod(params) {
    return post('/usrCloud/datadic/getDataHisByTimePeriod', params);
  },

  /**
   * 获取最后一条数据
   *
   */
  setDataPoint(params) {
    return post('/devData/setDataPoint', params);
  }
};
