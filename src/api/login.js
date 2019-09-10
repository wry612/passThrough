import { get, post } from '@/utils/request';
let base = '/apis';
let service = '/service'
export default {

  /**
   * 登录
   * @param {*} data
   */
  login(params) {
    // return post(base+'/user/login', params);
    return post(service+'/sysUser/login', params);
  },

  /**
   * 用户信息
   * @param {*} data
   */
  getUser(params) {
    return post(base+'/user/getUser', params);
  },

  /**
   * 用户信息L2
   * @param {*} data
   */
  getUserL2(params,config) {
    return get(service+'/sysUser/getByAccount', params, config);
  }

};
