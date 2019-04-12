'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')
const url = 'https://cloudapi.usr.cn/';
module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  URL: `'${url}'`,
  BASE_API: `'${url}'`,
  autoOpenBrowser: false
})
