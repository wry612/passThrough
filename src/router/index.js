import Vue from 'vue'
import Router from 'vue-router'
import Device from '@/components/device'
import DeviceDetail from '@/components/device-detail'
import Login from '@/components/login'
import Template from '@/components/template'
import Data from '@/components/data'
import DataDetail from '@/components/data-detail'
import HistoryData from '@/components/history-data'
import WechatLogin from '@/components/wechat-login'
import WechatRegister from '@/components/wechat-register'
import BindUser from '@/components/bind-user'
import Store from '../store'

Vue.use(Router)
const routes =
  [
    {
      path: '/',
      name: 'login',
      component: Login,
      meta: {
        title: '登录'
      }
    },
    {
      path: '/device',
      name: 'Device',
      component: Device,
      meta: {
        title: '设备列表'
      }
    },
    {
      path: '/deviceDetail/:id',
      name: 'deviceDetail',
      component: DeviceDetail,
      meta: {
        title: '设备详情'
      }
    },
    {
      path: '/template',
      name: 'Template',
      component: Template,
      meta: {
        title: '模板列表'
      }
    },
    {
      path: '/data/:id',
      name: 'Data',
      component: Data,
      meta: {
        title: '数据点列表'
      }
    },
    {
      path: '/dataDetail/:id',
      name: 'DataDetail',
      component: DataDetail,
      meta: {
        title: '数据点详情'
      }
    },
    {
      path: '/historyData',
      name: 'HistoryData',
      component: HistoryData,
      meta: {
        title: '历史查询'
      }
    },
    {
      path: '/wechatLogin',
      name: 'WechatLogin',
      component: WechatLogin,
      meta: {
        title: '微信登陆'
      }
    },
    {
      path: '/register',
      name: 'WechatRegister',
      component: WechatRegister,
      meta: {
        title: '微信注册'
      }
    },
    {
      path: '/bindUser',
      name: 'BindUser',
      component: BindUser,
      meta: {
        title: '微信绑定'
      }
    }
  ]
// 路由配置
const router = new Router({
  mode: 'history',
  routes
})
router.afterEach((to) => {
  Store.dispatch('changeTitle', to.meta.title)
})
export default router
