import { get, post } from '@/utils/request';
let base = '/apis';
let service = '/service'
export default {
  
  /**
   * 微信用户登陆L2
   * @param {*} data
   */
  wechatLoginL2(uid) {
    return get(service+'/wechat/user/login/'+uid);
  },
  
  /**
   * 微信用户注册L2
   * @param {*} data
   */
  wechatRegisterL2(code) {
    return get(service+'/wechat/user/register/'+code);
  },
  
  /**
   * 绑定
   * @param {*} data
   */
  bindL2(params) {
    return post(service+'/wechat/user/bind', params);
  },
  
};
