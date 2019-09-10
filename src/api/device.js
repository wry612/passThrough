import { get, post } from '@/utils/request';
let base = '/apis';
let service = '/service'
export default {

  /**
   * 设备列表
   * @param {*} data
   */
  deviceList(params) {
    return post(base+'/dev/getDevs', params);
  },

  /**
   * 设备列表L2
   * @param {*} data
   */
  deviceListL2(params,config) {
    return post(service+'/sysUser/getUserDevsByCondition', params,config);
  },

  /**
   * 设备详情
   *
   */
  deviceDetail(params) {
    return post(base+'/dev/getDevice', params);
  },

  /**
   * 根据设备获取数据点列表
   *
   */
  getDataPointInfoByDevice(params) {
    return post(base+'/datadic/getDataPointInfoByDevice', params);
  },

  /**
   * 获取最后一条数据
   *
   */
  getLastData(params) {
    return post(base+'/datadic/getLastData', params);
  },

  /**
   * 根据时间段获取数据点历史记录
   *
   */
  getDataHisByTimePeriod(params) {
    return post(base+'/datadic/getDataHisByTimePeriod', params);
  },

  /**
   * 获取最后一条数据
   *
   */
  setDataPoint(params,config) {
    return post(service+'/devData/setDataPoint', params,config);
  }
};
