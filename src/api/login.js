import { get, post } from '@/utils/request';
export default {

  /**
   * 登录
   * @param {*} data
   */
  login(params) {
    return post('/usrCloud/user/login', params);
  },

};
