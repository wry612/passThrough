import axios from 'axios';
//设置请求头
axios.defaults.headers.post["Content-type"] = "application/json"
// 创建 axios 实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api 的 base_url
  timeout: 10000 // 请求超时时间
});

/**
 * get 请求方法
 * @param {*} url
 * @param {*} params
 */
export function get(url, params, config) {
  const configParams = config ? config : {};

  return service.get(url, { params, ...configParams });
}

/**
 * post 请求方法
 * @param {*} url
 * @param {*} params
 */
export function post(url, params, config) {
  return service.post(url, params, config || {});
}

/**
 * post 请求方法
 * @param {*} url
 * @param {*} formData
 */
export function upload(url, formData) {
  return service({
    method: 'POST',
    url,
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: formData
  });
}
