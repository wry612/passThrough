import { get, post } from '@/utils/request';
let base = '/apis';
export default {

  /**
   * 登录
   * @param {*} data
   */
  login(params) {
    return post(base+'/user/login', params);
  },

  /**
   * 用户信息
   * @param {*} data
   */
  getUser(params) {
    return post(base+'/user/getUser', params);
  },

};
